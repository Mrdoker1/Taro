import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as sharp from 'sharp';

// Константы моделей Qwen VL
const QWEN_VL_MODELS = {
  OCR: 'qwen-vl-ocr', // Специализированная OCR модель
  OCR_LATEST: 'qwen-vl-ocr-2025-08-28', // Последняя версия с улучшенной локализацией текста
  FAST: 'qwen-vl-plus', // Быстрая модель (fallback)
  LARGE: 'qwen-vl-max', // Медленная но мощная модель (fallback)
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
   * Сжимает изображение для обработки AI моделью с высоким качеством
   */
  private async compressImageIfNeeded(
    buffer: Buffer,
    maxSizeBytes: number = 10 * 1024 * 1024, // 10MB лимит для лучшего качества
  ): Promise<Buffer> {
    try {
      // Менее агрессивное сжатие для лучшего качества OCR
      let quality = 90; // Начинаем с высокого качества
      let compressedBuffer = buffer;

      // Сначала уменьшаем разрешение если изображение очень большое
      const metadata = await sharp(buffer).metadata();
      if (metadata.width && metadata.width > 3840) {
        buffer = await sharp(buffer)
          .resize(3840) // Максимум 4K разрешение для лучшего качества OCR
          .toBuffer();
      }

      // Если изображение больше лимита, сжимаем его
      while (compressedBuffer.length > maxSizeBytes && quality > 30) {
        compressedBuffer = await sharp(buffer)
          .jpeg({ quality, progressive: true })
          .toBuffer();

        quality -= 15; // Более агрессивное снижение качества
      }

      // Если всё ещё слишком большое, дополнительно уменьшаем разрешение
      if (compressedBuffer.length > maxSizeBytes) {
        const newWidth = Math.floor((metadata.width || 1920) * 0.6);

        compressedBuffer = await sharp(buffer)
          .resize(newWidth)
          .jpeg({ quality: 60, progressive: true }) // Меньше качество для ускорения
          .toBuffer();
      }

      if (buffer.length !== compressedBuffer.length) {
        this.logger.log(
          `Изображение сжато: ${Math.round(buffer.length / 1024)}KB → ${Math.round(compressedBuffer.length / 1024)}KB`,
        );
      }

      return compressedBuffer;
    } catch (error) {
      this.logger.warn(`Ошибка сжатия изображения: ${error.message}`);
      return buffer; // Возвращаем оригинал при ошибке
    }
  }

  /**
   * Распознает текст на изображении (URL или файл)
   * Использует специализированную qwen-vl-ocr модель
   */
  async recognizeText(
    imageUrl?: string,
    file?: any,
    useFastMode = true,
  ): Promise<any> {
    const startTime = Date.now();

    try {
      // Используем специализированную OCR модель
      const model = useFastMode
        ? QWEN_VL_MODELS.OCR
        : QWEN_VL_MODELS.OCR_LATEST;
      const maxTokens = 8192; // Максимальный лимит для qwen-vl-ocr (требует одобрения)

      this.logger.log(
        `OCR распознавание (${useFastMode ? 'базовая' : 'улучшенная'} модель): ${model}`,
      );

      let imageSource: string;

      if (file) {
        this.logger.log(
          `Обрабатываем файл: ${file.originalname} (${file.size} байт)`,
        );

        // Проверяем размер файла (максимум 100MB для фото с телефонов)
        if (file.size > 100 * 1024 * 1024) {
          throw new BadRequestException(
            'Файл слишком большой. Максимальный размер: 100MB',
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

          // Сжимаем изображение для API
          const compressedBuffer = await this.compressImageIfNeeded(
            file.buffer,
          );
          const base64Data = compressedBuffer.toString('base64');
          imageSource = `data:${detectedMime};base64,${base64Data}`;
        } else {
          // Сжимаем изображение для API
          const compressedBuffer = await this.compressImageIfNeeded(
            file.buffer,
          );
          const base64Data = compressedBuffer.toString('base64');
          imageSource = `data:${mimeType};base64,${base64Data}`;
        }

        this.logger.log(
          `Файл обработан, финальный размер base64: ${imageSource.length} символов`,
        );
      } else if (imageUrl) {
        imageSource = imageUrl;
        this.logger.log(`Обрабатываем URL изображения: ${imageUrl}`);
      } else {
        throw new BadRequestException(
          'Необходимо указать URL изображения или загрузить файл',
        );
      }

      // Максимально строгий промпт с принуждением к английским ключам
      const ocrPrompt = `
      Ты — детерминированный извлекатель текста из изображений (OCR post-processor). 
      Твоя задача — распознать ВЕСЬ доступный текст и вернуть СТРОГО один валидный JSON-объект по схеме ниже. 

      Требования:
      - Ключи — человекочитаемые
      - Учитывай структуру документа
      - Если это сплошной текст, раздели его на абзацам с разными ключами (paragraph_1, paragraph_2, ...)

      Если на изображении НЕТ текста: - Верни: {"error": "no_text_found", "message": "На изображении не найден читаемый текст"} Если изображение нечеткое: - Верни: {"error": "image_unclear", "message": "Изображение слишком размытое для распознавания"} НИКОГДА не добавляй объяснения вне JSON. Ответ должен начинаться с { и заканчиваться на }.`;

      // Настройки изображения для qwen-vl-ocr с максимальным качеством
      const imageSettings = {
        min_pixels: 28 * 28 * 4, // Минимальный порог пикселей
        max_pixels: 28 * 28 * 20000, // Увеличенный лимит для лучшего качества (макс: 30000)
      };

      const response = await this.qwenClient.chat.completions.create(
        {
          model: model,
          messages: [
            {
              role: 'system',
              content: ocrPrompt,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: ocrPrompt,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageSource,
                    // Настройки для qwen-vl-ocr модели
                    ...imageSettings,
                  },
                },
              ],
            },
          ],
          max_tokens: maxTokens,
          temperature: 0.0, // Детерминированный результат для OCR
          // Добавляем дополнительные параметры для контроля языка
          response_format: { type: 'json_object' },
        },
        {
          timeout: 60000, // Увеличиваем тайм-аут до 2 минут для больших изображений
        },
      );

      const recognizedText = response.choices[0]?.message?.content || '';
      const processingTime = Date.now() - startTime;

      this.logger.log(`Текст распознан за ${processingTime}мс`);

      // Очищаем ответ от markdown разметки
      let cleanedText = recognizedText;

      // Удаляем ```json в начале и ``` в конце
      cleanedText = cleanedText.replace(/^```json\s*/, '');
      cleanedText = cleanedText.replace(/\s*```$/, '');
      cleanedText = cleanedText.trim();

      // Пытаемся распарсить ответ как JSON
      try {
        const jsonResult = JSON.parse(cleanedText);

        // Проверяем на ошибки
        if (jsonResult.error) {
          this.logger.warn(
            `OCR вернул ошибку: ${jsonResult.error} - ${jsonResult.message}`,
          );
          return jsonResult; // Возвращаем ошибку как валидный JSON
        }

        this.logger.log('Результат OCR успешно обработан');
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
