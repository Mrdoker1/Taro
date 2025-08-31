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
        // Конвертируем файл в base64 для Qwen
        imageSource = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        this.logger.log(`Обрабатываем загруженный файл: ${file.originalname}`);
      } else if (imageUrl) {
        imageSource = imageUrl;
        this.logger.log(`Обрабатываем URL изображения: ${imageUrl}`);
      } else {
        throw new BadRequestException(
          'Необходимо указать URL изображения или загрузить файл',
        );
      }

      const systemPrompt = `Извлеки весь ВИДИМЫЙ текст с изображения, сформируй JSON`;

      const response = await this.qwenClient.chat.completions.create({
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
      });

      const recognizedText = response.choices[0]?.message?.content || '';
      const processingTime = Date.now() - startTime;

      this.logger.log(`Текст успешно распознан за ${processingTime}мс`);

      // Очищаем ответ от markdown блоков и пытаемся распарсить как JSON
      let cleanedText = recognizedText.trim();

      // Убираем markdown блоки ```json и ```
      cleanedText = cleanedText
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/, '');

      try {
        return JSON.parse(cleanedText);
      } catch {
        // Если не JSON, возвращаем очищенный текст
        return cleanedText;
      }
    } catch (error) {
      this.logger.error(`Ошибка при распознавании текста: ${error.message}`);
      throw new BadRequestException(`Ошибка распознавания: ${error.message}`);
    }
  }
}
