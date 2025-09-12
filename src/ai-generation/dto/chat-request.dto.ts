import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  IsEnum,
} from 'class-validator';
import { AI_PROVIDER } from '../constants';

/**
 * DTO для простого чата с AI без шаблонов
 */
export class ChatRequestDto {
  @ApiProperty({
    description: 'Сообщение для AI',
    example: 'Привет! Как дела? Расскажи анекдот.',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description:
      'AI провайдер (необязательно, по умолчанию используется DEFAULT_AI_PROVIDER)',
    enum: AI_PROVIDER,
    required: false,
    example: 'openai',
  })
  @IsOptional()
  @IsEnum(AI_PROVIDER)
  provider?: AI_PROVIDER;

  @ApiProperty({
    description: 'Температура генерации (0.0-2.0, по умолчанию 0.7)',
    minimum: 0,
    maximum: 2,
    required: false,
    example: 0.7,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiProperty({
    description: 'Максимальное количество токенов в ответе (по умолчанию 1000)',
    minimum: 1,
    maximum: 4000,
    required: false,
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4000)
  maxTokens?: number;
}

/**
 * DTO для ответа чата
 */
export class ChatResponseDto {
  @ApiProperty({
    description: 'Ответ от AI',
    example:
      'Привет! Дела отлично! Вот анекдот: Почему программисты не любят природу? Потому что там слишком много багов!',
  })
  response: string;

  @ApiProperty({
    description: 'Использованный AI провайдер',
    example: 'openai',
  })
  provider: string;

  @ApiProperty({
    description: 'Время создания ответа',
    example: '2025-09-07T12:00:00.000Z',
  })
  timestamp: string;
}
