import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AiGenerationService } from './ai-generation.service';
import { GenerateRequestDto, RequestExample } from './dto/generate-request.dto';
import { GenerateResponseDto } from './dto/generate-response.dto';
import { DEFAULT_AI_PROVIDER } from './constants';

@ApiTags('AI Generation')
@Controller()
export class AiGenerationController {
  private readonly logger = new Logger(AiGenerationController.name);

  constructor(private readonly aiGenerationService: AiGenerationService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Генерация контента через AI',
    description:
      'Генерирует контент используя указанный AI провайдер (DeepSeek или Google Gemini). По умолчанию используется DeepSeek.',
  })
  @ApiBody({
    type: GenerateRequestDto,
    examples: {
      example1: {
        summary: 'Пример запроса для таро',
        value: RequestExample,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Контент успешно сгенерирован',
    type: GenerateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректный запрос или пустой промт',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  async generate(@Body() dto: GenerateRequestDto): Promise<any> {
    try {
      // Определяем фактически используемый провайдер
      const actualProvider = dto.provider || DEFAULT_AI_PROVIDER;

      this.logger.log(
        `Запрос на генерацию: провайдер=${actualProvider}, промт=${dto.prompt.substring(0, 100)}...`,
      );

      const result = await this.aiGenerationService.generate(dto);

      this.logger.log(`Генерация завершена: провайдер=${actualProvider}`);

      return result;
    } catch (error) {
      this.logger.error(`Ошибка при генерации: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Произошла ошибка при генерации контента',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
