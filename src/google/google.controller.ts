import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleService } from './google.service';
import { GoogleGenerateRequestDto } from './dto/generate-request.dto';
import {
  GoogleGenerateResponseDto,
  GoogleGenerateErrorResponseDto,
} from './dto/generate-response.dto';

@ApiTags('Google Gemini Generation')
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post('generate')
  @ApiOperation({
    summary:
      'Генератор текста на основе Google Gemini с поддержкой различных моделей',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешная генерация',
    type: GoogleGenerateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Неверный формат запроса',
    type: GoogleGenerateErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка сервера или Google Gemini API',
  })
  async generateContent(@Body() requestDto: GoogleGenerateRequestDto) {
    try {
      return await this.googleService.generate(requestDto);
    } catch (error) {
      // Преобразуем ошибки Google Gemini API в понятные HTTP-ошибки
      if (error.status === 401) {
        throw new HttpException(
          'Ошибка аутентификации в Google Gemini API',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (error.status === 402) {
        throw new HttpException(
          'Недостаточно средств на балансе Google API',
          HttpStatus.PAYMENT_REQUIRED,
        );
      } else if (error.status === 429) {
        throw new HttpException(
          'Превышен лимит запросов к Google Gemini API',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new HttpException(
        `Ошибка при обращении к Google Gemini API: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
