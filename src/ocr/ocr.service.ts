import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

// Константы моделей Qwen VL
const QWEN_VL_MODELS = {
  LARGE: 'qwen-vl-max', // Доступная модель с большим контекстом
};

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
      // Используем большую модель по умолчанию для всех документов
      const model = QWEN_VL_MODELS.LARGE;
      const maxTokens = 8000; // Максимум для qwen-vl-max

      this.logger.log(`Используем модель: ${model} с max_tokens: ${maxTokens}`);
      this.logger.log('Начинаем распознавание текста с помощью Qwen VL');

      let imageSource: string;

      if (file) {
        this.logger.log(
          `Обрабатываем загруженный файл: ${file.originalname}, размер: ${file.size} байт`,
        );

        // Проверяем размер файла (максимум 30MB для фото с телефонов)
        if (file.size > 30 * 1024 * 1024) {
          throw new BadRequestException(
            'Файл слишком большой. Максимальный размер: 30MB',
          );
        }

        // Поддерживаем основные форматы изображений с телефонов
        const supportedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'image/heic', // iPhone формат
          'image/heif', // современный формат
        ];

        const mimeType = file.mimetype?.toLowerCase();
        if (!mimeType || !supportedMimeTypes.includes(mimeType)) {
          // Определяем по расширению если MIME неточный
          const fileName = file.originalname?.toLowerCase() || '';
          let detectedMime = 'image/jpeg'; // по умолчанию

          if (fileName.includes('.png')) detectedMime = 'image/png';
          else if (fileName.includes('.webp')) detectedMime = 'image/webp';
          else if (fileName.includes('.heic')) detectedMime = 'image/heic';
          else if (fileName.includes('.heif')) detectedMime = 'image/heif';

          this.logger.warn(
            `MIME тип неопределен (${mimeType}), используем: ${detectedMime}`,
          );

          // Конвертируем файл в base64 для Qwen VL
          const base64Data = file.buffer.toString('base64');
          imageSource = `data:${detectedMime};base64,${base64Data}`;
        } else {
          // Конвертируем файл в base64 для Qwen VL
          const base64Data = file.buffer.toString('base64');
          imageSource = `data:${mimeType};base64,${base64Data}`;
        }

        this.logger.log(
          `Файл конвертирован в base64, MIME: ${mimeType}, длина base64: ${imageSource.length} символов`,
        );
      } else if (imageUrl) {
        imageSource = imageUrl;
        this.logger.log(`Обрабатываем URL изображения: ${imageUrl}`);
      } else {
        throw new BadRequestException(
          'Необходимо указать URL изображения или загрузить файл',
        );
      }

      const systemPrompt = `
      Ты — детерминированный извлекатель текста из изображений (OCR post-processor). 
      Твоя задача — распознать ВЕСЬ доступный текст и вернуть СТРОГО один валидный JSON-объект по схеме ниже. 

      Требования:
      - Ключи — человекочитаемые
      - Учитывай структуру документа

      Если на изображении НЕТ текста: - Верни: {"error": "no_text_found", "message": "На изображении не найден читаемый текст"} Если изображение нечеткое: - Верни: {"error": "image_unclear", "message": "Изображение слишком размытое для распознавания"} НИКОГДА не добавляй объяснения вне JSON. Ответ должен начинаться с { и заканчиваться на }.`;
      this.logger.log(`Отправляем запрос к Qwen VL API с моделью: ${model}`);
      this.logger.log(`Тип источника изображения: ${file ? 'файл' : 'URL'}`);

      const response = await this.qwenClient.chat.completions.create(
        {
          model: model,
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
          max_tokens: maxTokens,
          temperature: 0.1,
        },
        {
          timeout: 60000, // Увеличиваем тайм-аут для больших документов
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

        // Проверяем на ошибки
        if (jsonResult.error) {
          this.logger.warn(
            `OCR вернул ошибку: ${jsonResult.error} - ${jsonResult.message}`,
          );
          return jsonResult; // Возвращаем ошибку как валидный JSON
        }
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
