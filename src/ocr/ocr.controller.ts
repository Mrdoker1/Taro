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
  @UseInterceptors(FileInterceptor('file'))
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
      this.logger.log('Получен запрос на распознавание текста');

      // Проверяем, что есть либо URL, либо файл
      if (!dto.imageUrl && !file) {
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
      const result = await this.ocrService.recognizeText(dto.imageUrl, file);

      this.logger.log('Текст успешно распознан');
      return result;
    } catch (error) {
      this.logger.error(`Ошибка при распознавании текста: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Внутренняя ошибка сервера',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
