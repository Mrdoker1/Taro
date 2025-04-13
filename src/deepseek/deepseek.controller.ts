import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeepseekService } from './deepseek.service';
import { DeepseekRequestDto } from './dto/deepseek-request.dto';
import {
  DeepseekResponseDto,
  ErrorResponseExample,
} from './dto/deepseek-response.dto';

@ApiTags('astrology')
@Controller('api/astrology')
export class DeepseekController {
  constructor(private readonly deepseekService: DeepseekService) {}

  @Post('predict')
  @ApiOperation({
    summary: 'Получить астрологический прогноз или толкование карт таро',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный прогноз или толкование',
    type: DeepseekResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Неверный формат запроса или тема не соответствует астрологии/таро',
    type: ErrorResponseExample,
  })
  @ApiResponse({ status: 500, description: 'Ошибка сервера или DeepSeek API' })
  async getAstrologyPrediction(@Body() requestDto: DeepseekRequestDto) {
    try {
      return await this.deepseekService.processPrompt(requestDto);
    } catch (error) {
      // Преобразуем ошибки DeepSeek API в понятные HTTP-ошибки
      if (error.status === 401) {
        throw new HttpException(
          'Ошибка аутентификации в DeepSeek API',
          HttpStatus.UNAUTHORIZED,
        );
      } else if (error.status === 402) {
        throw new HttpException(
          'Недостаточно средств на балансе DeepSeek',
          HttpStatus.PAYMENT_REQUIRED,
        );
      } else if (error.status === 429) {
        throw new HttpException(
          'Превышен лимит запросов к DeepSeek API',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      throw new HttpException(
        `Ошибка при обращении к DeepSeek API: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
