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

export class WeeklyHoroscopeQueryDto {
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

export class WeeklyHoroscopeResponseDto {
  @ApiProperty({ example: 'Aries' })
  sign: string;

  @ApiProperty({ example: '2025-W18', required: false })
  week?: string;

  @ApiProperty({ example: 'Неделя откроет новые карьерные перспективы...' })
  prediction: string;

  @ApiProperty({ example: '😃' })
  mood: string;

  @ApiProperty({ example: '#FF0000' })
  color: string;

  @ApiProperty({ example: 7 })
  luckyNumber: number;
}
