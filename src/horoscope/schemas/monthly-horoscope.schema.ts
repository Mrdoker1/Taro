import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsOptional } from 'class-validator';

const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const;

export class MonthlyHoroscopeQueryDto {
  @ApiProperty({
    description: 'Знак зодиака',
    enum: ZODIAC_SIGNS,
    example: 'Aries',
  })
  @IsString()
  @IsIn(ZODIAC_SIGNS)
  sign: string;

  @ApiProperty({
    description: 'Язык ответа (russian/english)',
    example: 'russian',
    required: false,
  })
  @IsString()
  @IsIn(['russian', 'english'])
  @IsOptional()
  lang?: string;
}

export class MonthlyHoroscopeResponseDto {
  @ApiProperty({ example: 'Aries' })
  sign: string;

  @ApiProperty({ example: '2025-05' })
  month: string;

  @ApiProperty({
    example:
      'Май принесёт вам новые возможности для карьерного роста и укрепит личные связи.',
  })
  prediction: string;

  @ApiProperty({ example: '🙂' })
  mood: string;

  @ApiProperty({ example: 'красный#FF0000' })
  color: string;

  @ApiProperty({ example: 7 })
  number: number;
}
