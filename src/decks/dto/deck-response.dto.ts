import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для значений карты в прямом и перевернутом положении
 */
export class CardMeaningDto {
  @ApiProperty({
    description: 'Значение карты в прямом положении',
    example: 'Новые начинания, спонтанность',
  })
  upright: string;

  @ApiProperty({
    description: 'Значение карты в перевернутом положении',
    example: 'Безрассудство, задержки',
  })
  reversed: string;
}

/**
 * DTO для информации о карте
 */
export class CardDto {
  @ApiProperty({
    description: 'Идентификатор карты',
    example: 'the-fool',
  })
  id: string;

  @ApiProperty({
    description: 'Название карты',
    example: 'Шут',
  })
  name: string;

  @ApiProperty({
    description: 'URL изображения карты',
    example: 'https://example.com/images/rider/cards/the-fool.png',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Значения карты в прямом и перевернутом положении',
    type: CardMeaningDto,
  })
  meaning: CardMeaningDto;
}

/**
 * DTO для базовой информации о колоде (без карт)
 */
export class DeckSummaryDto {
  @ApiProperty({
    description: 'Идентификатор колоды',
    example: 'rider',
  })
  id: string;

  @ApiProperty({
    description: 'Название колоды',
    example: 'Таро Райдера–Уэйта',
  })
  name: string;

  @ApiProperty({
    description: 'Описание колоды',
    example: 'Классическая колода Уэйта, выпущена в 1909 году',
  })
  description: string;

  @ApiProperty({
    description: 'URL обложки колоды',
    example: 'https://i.ibb.co/nNqPfBf0/Cover-2.png',
  })
  coverImageUrl: string;

  @ApiProperty({
    description: 'Количество карт в колоде',
    example: 78,
  })
  cardsCount: number;

  @ApiProperty({
    description: 'Доступность колоды',
    example: true,
  })
  available: boolean;
}

/**
 * DTO для полной информации о колоде (включая карты)
 */
export class DeckDetailDto extends DeckSummaryDto {
  @ApiProperty({
    description: 'Список карт колоды',
    type: [CardDto],
  })
  cards: CardDto[];
}
