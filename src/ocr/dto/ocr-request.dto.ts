import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl, ValidateIf } from 'class-validator';

/**
 * DTO для запроса распознавания текста
 */
export class OcrRequestDto {
  @ApiPropertyOptional({
    description: 'URL изображения (если не загружается файл)',
    example: 'https://example.com/document.jpg',
    type: 'string',
  })
  @IsOptional()
  @ValidateIf(o => o.imageUrl && o.imageUrl.length > 0)
  @IsUrl({}, { message: 'Некорректный URL изображения' })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Файл изображения для загрузки',
    type: 'string',
    format: 'binary',
  })
  file?: any;
}

export const OcrRequestExample = {
  imageUrl: 'https://example.com/document.jpg',
};
