import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches, IsIn } from 'class-validator';

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
    description: 'Дата гороскопа (YYYY-MM-DD или TODAY/TOMORROW/YESTERDAY)',
    example: '2025-04-28',
    required: false,
    default: 'TODAY',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(TODAY|TOMORROW|YESTERDAY|\d{4}-\d{2}-\d{2})$/, {
    message: 'Invalid day format. Use YYYY-MM-DD or TODAY/TOMORROW/YESTERDAY',
  })
  day?: string;
}

export class DailyHoroscopeResponseDto {
  @ApiProperty({ example: 'Aries' })
  sign: string;

  @ApiProperty({ example: '2025-04-28' })
  date: string;

  @ApiProperty({ example: 'Сегодня вас ждут новые возможности на работе...' })
  prediction: string;

  @ApiProperty({ example: '😃' })
  mood: string;

  @ApiProperty({ example: '#FF0000' })
  color: string;

  @ApiProperty({ example: 7 })
  luckyNumber: number;
}
