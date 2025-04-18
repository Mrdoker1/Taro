import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO для параметров запроса GET /decks
 */
export class GetDecksQueryDto {
  /**
   * Код языка локализации (например, ru, en)
   * @default 'ru'
   */
  @ApiProperty({
    description: 'Код языка локализации (например, ru, en)',
    required: false,
    default: 'ru',
    enum: ['ru', 'en'],
  })
  @IsOptional()
  @IsString()
  lang?: string = 'ru';

  /**
   * Включить полный список карт для каждой колоды
   * @default false
   */
  @ApiProperty({
    description: 'Включить полный список карт для каждой колоды',
    required: false,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    // Разрешаем только явно true/1 как значения для true
    return value === true || value === 'true' || value === '1';
  })
  includeAll?: boolean = false;
}
