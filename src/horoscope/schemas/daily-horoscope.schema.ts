import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

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

export class DailyHoroscopeQueryDto {
  @ApiProperty({
    description: 'Знак зодиака',
    enum: ZODIAC_SIGNS,
    example: 'Aries',
  })
  @IsString()
  @IsIn(ZODIAC_SIGNS)
  sign: string;

  @ApiProperty({
    description: 'День гороскопа (TODAY, TOMORROW, YESTERDAY или YYYY-MM-DD)',
    example: 'TODAY',
    required: false,
  })
  @IsString()
  @IsOptional()
  day?: string;

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

export class DailyHoroscopeResponseDto {
  @ApiProperty({ example: 'Aries' })
  sign: string;

  @ApiProperty({ example: '2025-04-28', required: false })
  date?: string;

  @ApiProperty({ example: 'Сегодня вас ждут новые возможности на работе...' })
  prediction: string;

  @ApiProperty({ example: '😃' })
  mood: string;

  @ApiProperty({ example: '#FF0000' })
  color: string;

  @ApiProperty({ example: 7 })
  number: number;
}
