import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as sharp from 'sharp';

// Константы моделей Qwen VL
const QWEN_VL_MODELS = {
  FAST: 'qwen-vl-plus', // Быстрая модель
  LARGE: 'qwen-vl-max', // Медленная но мощная модель
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
   * Сжимает изображение для быстрой обработки AI моделью
   */
  private async compressImageIfNeeded(
    buffer: Buffer,
    maxSizeBytes: number = 4 * 1024 * 1024, // 4MB лимит для ускорения
  ): Promise<Buffer> {
    try {
      // Более агрессивное сжатие для ускорения обработки
      let quality = 75; // Начинаем с меньшего качества
      let compressedBuffer = buffer;

      // Сначала уменьшаем разрешение если изображение очень большое
      const metadata = await sharp(buffer).metadata();
      if (metadata.width && metadata.width > 1920) {
        buffer = await sharp(buffer)
          .resize(1920) // Максимум 1920px по ширине
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
   */
  async recognizeText(
    imageUrl?: string,
    file?: any,
    useFastMode = true,
  ): Promise<any> {
    const startTime = Date.now();

    try {
      // Выбираем модель в зависимости от режима
      const model = useFastMode ? QWEN_VL_MODELS.FAST : QWEN_VL_MODELS.LARGE;
      const maxTokens = 8000;

      this.logger.log(
        `Распознавание текста (${useFastMode ? 'быстрый' : 'точный'} режим)`,
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

      const systemPrompt = `
      Ты — детерминированный извлекатель текста из изображений (OCR post-processor). 
      Твоя задача — распознать ВЕСЬ доступный текст и вернуть СТРОГО один валидный JSON-объект по схеме ниже. 

      Требования:
      - Ключи — человекочитаемые
      - Учитывай структуру документа

      Если на изображении НЕТ текста: - Верни: {"error": "no_text_found", "message": "На изображении не найден читаемый текст"} Если изображение нечеткое: - Верни: {"error": "image_unclear", "message": "Изображение слишком размытое для распознавания"} НИКОГДА не добавляй объяснения вне JSON. Ответ должен начинаться с { и заканчиваться на }.`;

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
          temperature: 0.0, // Минимальная температура для быстрого и детерминированного ответа
        },
        {
          timeout: 45000, // Уменьшаем тайм-аут для ускорения
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
