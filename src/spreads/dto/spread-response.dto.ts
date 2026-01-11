import { ApiProperty } from '@nestjs/swagger';

// Мета-информация о позиции карты в раскладе
export class SpreadMetaItemDto {
  @ApiProperty({ description: 'Название позиции карты в раскладе' })
  label: string;
}

// Базовая информация о раскладе (краткая)
export class SpreadSummaryDto {
  @ApiProperty({ description: 'Уникальный идентификатор расклада' })
  id: string;

  @ApiProperty({ description: 'Название расклада' })
  name: string;

  @ApiProperty({ description: 'Описание расклада' })
  description: string;

  @ApiProperty({ description: 'Доступен ли расклад' })
  available: boolean;

  @ApiProperty({ description: 'Является ли расклад платным' })
  paid: boolean;

  @ApiProperty({
    description: 'URL изображения расклада',
    required: false,
  })
  imageURL?: string;

  @ApiProperty({
    description: 'Ключ промпт-шаблона для этого расклада',
    required: false,
  })
  promptTemplateKey?: string;
}

// Детальная информация о раскладе (полная)
export class SpreadDetailDto extends SpreadSummaryDto {
  @ApiProperty({
    description: 'Возможные вопросы для расклада',
    isArray: true,
    type: String,
  })
  questions: string[];

  @ApiProperty({
    description: 'Количество карт в раскладе',
    type: Number,
  })
  cardsCount: number;

  @ApiProperty({
    description: 'Сетка расклада - расположение карт',
    isArray: true,
    type: 'array',
  })
  grid: number[][];

  @ApiProperty({
    description: 'Информация о каждой позиции в раскладе',
    type: Object,
  })
  meta: Record<string, SpreadMetaItemDto>;
}
