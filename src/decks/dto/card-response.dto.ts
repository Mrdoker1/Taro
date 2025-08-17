import { ApiProperty } from '@nestjs/swagger';
import { CardDto } from './deck-response.dto';

/**
 * DTO для краткой информации о колоде в ответе о карте
 */
export class DeckInfoDto {
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
}

/**
 * DTO для ответа запроса информации о карте
 */
export class CardResponseDto {
  @ApiProperty({
    description: 'Информация о колоде',
    type: DeckInfoDto,
  })
  deck: DeckInfoDto;

  @ApiProperty({
    description: 'Информация о карте',
    type: CardDto,
  })
  card: CardDto;
}
