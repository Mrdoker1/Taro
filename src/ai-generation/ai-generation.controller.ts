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
import { ChatRequestDto, ChatResponseDto } from './dto/chat-request.dto';
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

  @Post('chat')
  @ApiOperation({
    summary: 'Простой чат с AI',
    description:
      'Прямое общение с AI без шаблонов и ограничений. Можете писать любой текст.',
  })
  @ApiBody({
    type: ChatRequestDto,
    examples: {
      example1: {
        summary: 'Простое сообщение',
        value: {
          message: 'Привет! Как дела? Расскажи анекдот.',
          temperature: 0.7,
          maxTokens: 1000,
        },
      },
      example2: {
        summary: 'Вопрос с другим провайдером',
        value: {
          message: 'Объясни квантовую физику простыми словами',
          provider: 'qwen',
          temperature: 0.3,
          maxTokens: 2000,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Ответ от AI получен',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректный запрос или пустое сообщение',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    try {
      const actualProvider = dto.provider || DEFAULT_AI_PROVIDER;

      this.logger.log(
        `Запрос чата: провайдер=${actualProvider}, сообщение=${dto.message.substring(0, 100)}...`,
      );

      const result = await this.aiGenerationService.chat(dto);

      this.logger.log(`Чат завершен: провайдер=${actualProvider}`);

      return result;
    } catch (error) {
      this.logger.error(`Ошибка в чате: ${error.message}`, error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Произошла ошибка при обработке сообщения',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
