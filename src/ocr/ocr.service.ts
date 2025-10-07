import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as sharp from 'sharp';

// Константы моделей Qwen VL
const QWEN_VL_MODELS = {
  OCR: 'qwen-vl-ocr', // Специализированная OCR модель
  OCR_LATEST: 'qwen-vl-ocr-latest', // Последняя версия с улучшенной локализацией текста
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
   * Сжимает изображение только если оно больше лимита
   */
  private async compress(buffer: Buffer): Promise<Buffer> {
    try {
      const maxSizeBytes = 7 * 1024 * 1024; // 7MB для учета base64 увеличения

      // Если файл уже маленький, не трогаем его
      if (buffer.length <= maxSizeBytes) {
        this.logger.log(
          `Файл ${Math.round(buffer.length / 1024)}KB уже достаточно мал, сжатие не требуется`,
        );
        return buffer;
      }

      let compressedBuffer = buffer;
      let quality = 85;

      // Получаем метаданные изображения
      const metadata = await sharp(buffer).metadata();
      let width = metadata.width || 1920;

      // Сжимаем пока не достигнем нужного размера
      while (
        compressedBuffer.length > maxSizeBytes &&
        (quality > 20 || width > 800)
      ) {
        if (quality > 20) {
          // Сначала снижаем качество
          compressedBuffer = await sharp(buffer)
            .resize(width)
            .jpeg({ quality, progressive: true })
            .toBuffer();
          quality -= 15;
        } else {
          // Если качество минимальное, уменьшаем разрешение
          width = Math.floor(width * 0.8);
          compressedBuffer = await sharp(buffer)
            .resize(width)
            .jpeg({ quality: 20, progressive: true })
            .toBuffer();
        }
      }

      this.logger.log(
        `Изображение сжато: ${Math.round(buffer.length / 1024)}KB → ${Math.round(compressedBuffer.length / 1024)}KB`,
      );

      return compressedBuffer;
    } catch (error) {
      this.logger.warn(`Ошибка сжатия изображения: ${error.message}`);
      return buffer;
    }
  }

  /**
   * Создает data-uri с автоматическим сжатием
   */
  private async createDataUri(
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const compressedBuffer = await this.compress(buffer);
    const base64Data = compressedBuffer.toString('base64');
    const base64Size = base64Data.length;

    // Показываем размер в KB или MB в зависимости от размера
    if (base64Size > 1024 * 1024) {
      this.logger.log(
        `Base64 размер: ${Math.round(base64Size / 1024 / 1024)}MB`,
      );
    } else {
      this.logger.log(`Base64 размер: ${Math.round(base64Size / 1024)}KB`);
    }

    return `data:${mimeType};base64,${base64Data}`;
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
        ? QWEN_VL_MODELS.LARGE
        : QWEN_VL_MODELS.OCR_LATEST;
      const maxTokens = 8192;

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

          // Создаем data-uri с автоматическим сжатием
          imageSource = await this.createDataUri(file.buffer, detectedMime);
        } else {
          // Создаем data-uri с автоматическим сжатием
          imageSource = await this.createDataUri(file.buffer, mimeType);
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

      // Промпт настроенный на максимальное извлечение текста
      const ocrPrompt = `
      Ты - эксперт по распознаванию текста. Внимательно изучи изображение и найди ЛЮБОЙ текст, даже если он:
      - Мелкий или размытый
      - Написан от руки
      - На иностранном языке  
      - Частично скрыт
      - Водяной знак или логотип
      
      Верни JSON с найденным текстом. Ключи должны быть на английском языке.
      
      Если действительно НЕТ НИКАКОГО текста:
      {"error": "no_text_found", "message": "На изображении не найден читаемый текст"}
      
      Ответ должен быть валидным JSON, начинающимся с { и заканчивающимся на }.`;

      // Настройки изображения для максимального качества OCR
      const imageSettings = {
        min_pixels: 28 * 28 * 8, // Увеличили минимальный порог
        max_pixels: 28 * 28 * 30000, // Максимальный лимит для лучшего качества
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
