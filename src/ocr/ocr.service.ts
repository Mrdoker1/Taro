import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_QWEN_VL_MODEL } from '../ai-generation/constants';
import OpenAI from 'openai';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private readonly qwenClient: OpenAI;

  constructor(private readonly configService: ConfigService) {
    // Инициализация Qwen клиента с правильным baseURL
    this.qwenClient = new OpenAI({
      apiKey: this.configService.get<string>('QWEN_API_KEY'),
      baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
    });
  }

  /**
   * Распознает текст на изображении (URL или файл)
   */
  async recognizeText(imageUrl?: string, file?: any): Promise<any> {
    const startTime = Date.now();

    try {
      this.logger.log('Начинаем распознавание текста с помощью Qwen VL');

      let imageSource: string;

      if (file) {
        this.logger.log(
          `Обрабатываем загруженный файл: ${file.originalname}, размер: ${file.size} байт`,
        );

        // Проверяем размер файла (максимум 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new BadRequestException(
            'Файл слишком большой. Максимальный размер: 10MB',
          );
        }

        // Конвертируем файл в base64 для Qwen VL
        const base64Data = file.buffer.toString('base64');
        imageSource = `data:image/jpeg;base64,${base64Data}`;

        this.logger.log(
          `Файл конвертирован в base64, длина: ${base64Data.length} символов`,
        );
      } else if (imageUrl) {
        imageSource = imageUrl;
        this.logger.log(`Обрабатываем URL изображения: ${imageUrl}`);
      } else {
        throw new BadRequestException(
          'Необходимо указать URL изображения или загрузить файл',
        );
      }

      const systemPrompt = `Извлеки видимый текст с изображения. Верни JSON со структурой документа. Ключи полей на языке оригинала документа, Title Case, человекочитаемые (например, “Full Name”, “Date of Issue”).`;

      this.logger.log(
        `Отправляем запрос к Qwen VL API с моделью: ${DEFAULT_QWEN_VL_MODEL}`,
      );
      this.logger.log(`Тип источника изображения: ${file ? 'файл' : 'URL'}`);

      const response = await this.qwenClient.chat.completions.create(
        {
          model: DEFAULT_QWEN_VL_MODEL,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: imageSource,
                  },
                },
                {
                  type: 'text',
                  text: systemPrompt,
                },
              ],
            },
          ],
          max_tokens: 4000,
        },
        {
          timeout: 30000, // 30 секунд тайм-аут
        },
      );

      const recognizedText = response.choices[0]?.message?.content || '';
      const processingTime = Date.now() - startTime;

      this.logger.log(`Текст успешно распознан за ${processingTime}мс`);
      this.logger.log(`Полученный ответ: ${recognizedText}`);

      // Очищаем ответ от markdown разметки
      let cleanedText = recognizedText;

      // Удаляем ```json в начале и ``` в конце
      cleanedText = cleanedText.replace(/^```json\s*/, '');
      cleanedText = cleanedText.replace(/\s*```$/, '');
      cleanedText = cleanedText.trim();

      // Пытаемся распарсить ответ как JSON
      try {
        const jsonResult = JSON.parse(cleanedText);
        this.logger.log('JSON успешно распарсен');
        return jsonResult;
      } catch (parseError) {
        this.logger.warn(
          `Не удалось распарсить как JSON: ${parseError.message}`,
        );
        this.logger.warn(`Очищенный текст: ${cleanedText}`);
        // Если не JSON, возвращаем как обычный текст
        return cleanedText;
      }
    } catch (error) {
      this.logger.error(`Ошибка при распознавании текста: ${error.message}`);
      throw new BadRequestException(`Ошибка распознавания: ${error.message}`);
    }
  }
}
