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
  REQUEST_EXAMPLES,
  SYSTEM_PROMPT_DESCRIPTION,
  SYSTEM_PROMPT,
  ZODIAC_SIGNS,
} from '../constants';

// Список знаков зодиака для валидации
enum ZodiacSign {
  ARIES = 'Овен',
  TAURUS = 'Телец',
  GEMINI = 'Близнецы',
  CANCER = 'Рак',
  LEO = 'Лев',
  VIRGO = 'Дева',
  LIBRA = 'Весы',
  SCORPIO = 'Скорпион',
  SAGITTARIUS = 'Стрелец',
  CAPRICORN = 'Козерог',
  AQUARIUS = 'Водолей',
  PISCES = 'Рыбы',
}

export class DeepseekRequestDto {
  @ApiProperty({
    description: 'Вопрос по астрологии или таро для обработки',
    example: REQUEST_EXAMPLES.astrology,
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({
    description: 'Знак зодиака (для персонализированного прогноза)',
    enum: ZodiacSign,
    required: false,
    example: ZODIAC_SIGNS.SCORPIO,
  })
  @IsEnum(ZodiacSign)
  @IsOptional()
  zodiacSign?: ZodiacSign;

  @ApiProperty({
    description: 'Температура генерации (влияет на креативность ответов)',
    example: 0.7,
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
    description: SYSTEM_PROMPT_DESCRIPTION,
    example: SYSTEM_PROMPT,
    required: false,
  })
  @IsString()
  @IsOptional()
  systemPrompt?: string;
}
