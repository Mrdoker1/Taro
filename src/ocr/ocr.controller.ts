import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { OcrService } from './ocr.service';
import { OcrRequestDto, OcrRequestExample } from './dto/ocr-request.dto';
import { OcrResponseDto } from './dto/ocr-response.dto';

@ApiTags('OCR - Распознавание текста')
@Controller('ocr')
export class OcrController {
  private readonly logger = new Logger(OcrController.name);

  constructor(private readonly ocrService: OcrService) {}

  @Post('recognize')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB для очень больших фото с телефонов
      },
      fileFilter: (req, file, callback) => {
        // Поддерживаем основные форматы изображений с телефонов
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'image/heic', // iPhone формат
          'image/heif', // современный формат
        ];

        const mimeType = file.mimetype?.toLowerCase();
        const fileName = file.originalname?.toLowerCase() || '';

        // Проверяем и по MIME и по расширению файла
        const isValidMime = mimeType && allowedMimeTypes.includes(mimeType);
        const isValidExtension = fileName.match(
          /\.(jpg|jpeg|png|webp|heic|heif)$/i,
        );

        if (!isValidMime && !isValidExtension) {
          return callback(
            new Error(
              'Поддерживаются только изображения: JPEG, PNG, WebP, HEIC/HEIF',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Распознавание текста на изображении',
    description:
      'Распознает текст на изображении. Принимает URL изображения от клиента или позволяет загрузить файл для тестирования в Swagger UI.',
  })
  @ApiBody({
    type: OcrRequestDto,
    examples: {
      example1: {
        summary: 'Пример запроса с URL',
        value: OcrRequestExample,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Текст успешно распознан',
    type: OcrResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректный URL или недоступное изображение',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  async recognizeText(
    @Body() dto: OcrRequestDto,
    @UploadedFile() file?: any,
  ): Promise<OcrResponseDto> {
    try {
      this.logger.log('=== НАЧАЛО OCR ЗАПРОСА ===');
      this.logger.log(`URL: ${dto?.imageUrl || 'не указан'}`);
      this.logger.log(
        `Файл: ${file ? `${file.originalname} (${file.size} байт, ${file.mimetype})` : 'не загружен'}`,
      );

      // Проверяем, что есть либо URL, либо файл
      if (!dto.imageUrl && !file) {
        this.logger.error('Ошибка: нет ни URL, ни файла');
        throw new HttpException(
          'Необходимо указать URL изображения или загрузить файл',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Если загружен файл, проверяем его тип
      if (file) {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new HttpException(
            'Поддерживаются только изображения: JPEG, PNG, WebP, GIF',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      // Используем единый метод для обработки URL или файла
      this.logger.log('Передаем запрос в OCR сервис...');
      const result = await this.ocrService.recognizeText(dto.imageUrl, file);

      this.logger.log('=== OCR УСПЕШНО ЗАВЕРШЕН ===');
      return result;
    } catch (error) {
      this.logger.error(`=== ОШИБКА OCR ===`);
      this.logger.error(`Тип ошибки: ${error.constructor.name}`);
      this.logger.error(`Сообщение: ${error.message}`);
      this.logger.error(`Стек: ${error.stack}`);

      // Специальная обработка ошибки 413 (Payload Too Large)
      if (
        error.message?.includes('PayloadTooLargeError') ||
        error.message?.includes('request entity too large') ||
        error.message?.includes('413')
      ) {
        this.logger.error('Обнаружена ошибка размера файла (413)');
        throw new HttpException(
          'Файл слишком большой. Максимальный размер: 30MB',
          HttpStatus.PAYLOAD_TOO_LARGE,
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Внутренняя ошибка сервера: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
