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
import {
  AI_PROVIDER,
  GEMINI_MODELS,
  DEEPSEEK_MODELS,
  OPENAI_MODELS,
  GROK_MODELS,
} from '../constants';

/**
 * DTO для запроса генерации через AI (поддерживает DeepSeek и Google Gemini)
 */
export class GenerateRequestDto {
  @ApiProperty({
    description: 'Основной промт для генерации',
    example: 'Вопрос пользователя: Как мне улучшить финансовую ситуацию?',
  })
  @IsNotEmpty()
  @IsString()
  prompt: string;

  @ApiProperty({
    description: 'Системный промт (необязательно)',
    required: false,
    example: 'Ты — профессиональный таролог...',
  })
  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @ApiProperty({
    description: 'Температура для генерации (0.0 - 2.0)',
    required: false,
    minimum: 0,
    maximum: 2,
    example: 0.7,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiProperty({
    description: 'Максимальное количество токенов в ответе',
    required: false,
    minimum: 1,
    maximum: 4096,
    example: 800,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4096)
  maxTokens?: number;

  @ApiProperty({
    description: 'ID шаблона промта',
    required: false,
    example: 'one-card',
  })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({
    description: 'Знак зодиака пользователя',
    required: false,
    example: 'Овен',
  })
  @IsOptional()
  @IsString()
  zodiacSign?: string;

  @ApiProperty({
    description: 'Дата для гороскопа',
    required: false,
    example: '2024-01-15',
  })
  @IsOptional()
  @IsString()
  horoscopeDate?: string;

  @ApiProperty({
    description: 'Неделя для гороскопа',
    required: false,
    example: '2024-03',
  })
  @IsOptional()
  @IsString()
  horoscopeWeek?: string;

  @ApiProperty({
    description: 'Месяц для гороскопа',
    required: false,
    example: '2024-03',
  })
  @IsOptional()
  @IsString()
  horoscopeMonth?: string;

  @ApiProperty({
    description: 'Язык ответа',
    required: false,
    example: 'ru',
  })
  @IsOptional()
  @IsString()
  responseLang?: string;

  @ApiProperty({
    description: 'AI провайдер для генерации',
    required: false,
    enum: AI_PROVIDER,
    example: AI_PROVIDER.DEEPSEEK,
  })
  @IsOptional()
  @IsEnum(AI_PROVIDER)
  provider?: AI_PROVIDER;

  @ApiProperty({
    description: 'Модель для Google Gemini',
    required: false,
    enum: Object.values(GEMINI_MODELS),
    example: GEMINI_MODELS.FLASH_2_0,
  })
  @IsOptional()
  @IsString()
  geminiModel?: string;

  @ApiProperty({
    description: 'Модель для DeepSeek',
    required: false,
    enum: Object.values(DEEPSEEK_MODELS),
    example: DEEPSEEK_MODELS.CHAT,
  })
  @IsOptional()
  @IsString()
  deepseekModel?: string;

  @ApiProperty({
    description: 'Модель для OpenAI',
    required: false,
    enum: Object.values(OPENAI_MODELS),
    example: OPENAI_MODELS.GPT_4O,
  })
  @IsOptional()
  @IsString()
  openaiModel?: string;

  @ApiProperty({
    description: 'Модель для Grok (xAI)',
    required: false,
    enum: Object.values(GROK_MODELS),
    example: GROK_MODELS.GROK_3_MINI,
  })
  @IsOptional()
  @IsString()
  grokModel?: string;
}

/**
 * Пример запроса в формате JSON
 */
export const RequestExample = {
  templateId: 'one-card',
  temperature: 0.7,
  maxTokens: 800,
  responseLang: 'ru',
  provider: AI_PROVIDER.DEEPSEEK,

  systemPrompt: `Ты — профессиональный таролог. Отвечай ТОЛЬКО на вопросы о таро, предсказаниях и эзотерике.

ФОРМАТ ОТВЕТА (JSON):
{
  "message":  "общее толкование карты",
  "positions": [ { "index": 1, "interpretation": "…" } ]
}

Если вопрос не относится к таро — верни { "error": true, "message": "Ваш вопрос не относится к таро…" }. Без markdown, ≤ 800 токенов.`,

  prompt: `Вопрос пользователя: Как мне улучшить финансовую ситуацию?

Колода: Waite-Smith Tarot

Выпавшие карты:
1. Семерка Пентаклей - в позиции "Текущая ситуация"`,
};
