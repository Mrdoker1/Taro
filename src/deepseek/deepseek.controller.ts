import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeepseekService } from './deepseek.service';
import { GenerateRequestDto } from './dto/generate-request.dto';
import {
  GenerateResponseDto,
  GenerateErrorResponseDto,
} from './dto/generate-response.dto';

@ApiTags('generation')
@Controller()
export class GenerationController {
  constructor(private readonly deepseekService: DeepseekService) {}

  @Post('generate')
  @ApiOperation({
    summary:
      'Гибкий генератор текста на основе переданного промпта и параметров',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешная генерация',
    type: GenerateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Неверный формат запроса',
    type: GenerateErrorResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Ошибка сервера или DeepSeek API' })
  async generateContent(@Body() requestDto: GenerateRequestDto) {
    try {
      return await this.deepseekService.generate(requestDto);
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
