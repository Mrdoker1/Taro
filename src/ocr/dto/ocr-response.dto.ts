import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для ответа распознавания текста
 */
export class OcrResponseDto {
  @ApiProperty({
    description: 'Распознанный текст',
    example:
      'Заголовок документа\n\nЭто первый параграф текста с важной информацией.\n\nЭто второй параграф с дополнительными деталями.',
  })
  text: string;

  @ApiProperty({
    description: 'Уверенность распознавания от 0 до 1',
    example: 0.95,
    required: false,
  })
  confidence?: number;

  @ApiProperty({
    description: 'Определённый язык текста',
    example: 'russian',
    required: false,
  })
  language?: string;

  @ApiProperty({
    description: 'Использованный AI провайдер',
    example: 'qwen',
    required: false,
  })
  provider?: string;
}
