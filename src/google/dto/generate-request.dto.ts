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
import { GEMINI_MODELS } from '../constants';

/**
 * Пример запроса в формате JSON для Google Gemini
 */
export const RequestExample = {
  templateId: 'one-card',
  temperature: 0.7,
  maxTokens: 800,
  responseLang: 'ru',
  model: GEMINI_MODELS.FLASH_2_0,

  systemPrompt: `Ты — профессиональный таролог. Отвечай ТОЛЬКО на вопросы о таро, предсказаниях и эзотерике.

ФОРМАТ ОТВЕТА (JSON):
{
  "message":  "общее толкование карты",
  "positions": [ { "index": 1, "interpretation": "…" } ]
}

Если вопрос не относится к таро — верни { "error": true, "message": "Ваш вопрос не относится к таро…" }. Без markdown, ≤ 800 токенов.`,

  prompt: `Вопрос пользователя: Как мне улучшить финансовую ситуацию?
Расклад: Одна карта
Карты и позиции:
1. Карта дня — Major_The_Magician

Сформируй ответ строго по описанному JSON-формату.`,
};

/**
 * DTO для запроса к Google Gemini API
 */
export class GoogleGenerateRequestDto {
  @ApiProperty({
    description: 'Основной запрос пользователя',
    example: RequestExample.prompt,
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    description:
      'Идентификатор шаблона для генерации (например, "one-card", "love-prediction")',
    example: RequestExample.templateId,
    required: false,
  })
  @IsString()
  @IsOptional()
  templateId?: string;

  @ApiProperty({
    description: 'Знак зодиака (для персонализированного прогноза)',
    example: 'Скорпион',
    required: false,
  })
  @IsString()
  @IsOptional()
  zodiacSign?: string;

  @ApiProperty({
    description: 'Дата гороскопа',
    required: false,
  })
  @IsOptional()
  @IsString()
  horoscopeDate?: string;

  @ApiProperty({
    description: 'Неделя гороскопа',
    required: false,
  })
  @IsOptional()
  @IsString()
  horoscopeWeek?: string;

  @ApiProperty({
    description: 'Месяц гороскопа',
    required: false,
  })
  @IsOptional()
  @IsString()
  horoscopeMonth?: string;

  @ApiProperty({
    description: 'Температура генерации (влияет на креативность ответов)',
    example: RequestExample.temperature,
    default: 0.7,
    minimum: 0.0,
    maximum: 1.5,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1.5)
  temperature?: number;

  @ApiProperty({
    description: 'Максимальное количество токенов в ответе',
    example: RequestExample.maxTokens,
    default: 1000,
    minimum: 100,
    maximum: 2000,
  })
  @IsNumber()
  @IsOptional()
  @Min(100)
  @Max(2000)
  maxTokens?: number;

  @ApiProperty({
    description: 'Язык ответа',
    example: RequestExample.responseLang,
    default: 'ru',
    required: false,
  })
  @IsString()
  @IsOptional()
  responseLang?: string;

  @ApiProperty({
    description: 'Системный промт для модели (инструкции для генерации)',
    example: RequestExample.systemPrompt,
    required: false,
  })
  @IsString()
  @IsOptional()
  systemPrompt?: string;

  @ApiProperty({
    description: 'Модель Google Gemini для использования',
    example: RequestExample.model,
    enum: Object.values(GEMINI_MODELS),
    default: GEMINI_MODELS.FLASH_2_0,
    required: false,
  })
  @IsEnum(GEMINI_MODELS)
  @IsOptional()
  model?: string;
}
