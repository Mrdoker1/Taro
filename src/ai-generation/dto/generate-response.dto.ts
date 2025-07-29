import { ApiProperty } from '@nestjs/swagger';

export class GenerateResponseDto {
  @ApiProperty({
    description: 'Сгенерированный текст',
    example:
      '{"message": "Семерка Пентаклей указывает на период ожидания результатов...", "positions": [{"index": 1, "interpretation": "Текущая ситуация требует терпения"}]}',
  })
  content: string;

  @ApiProperty({
    description: 'Использованное количество токенов',
    example: 542,
  })
  tokensUsed: number;

  @ApiProperty({
    description: 'Модель, которая была использована для генерации',
    example: 'deepseek-chat',
  })
  model: string;

  @ApiProperty({
    description: 'Провайдер, который был использован для генерации',
    example: 'deepseek',
  })
  provider: string;

  @ApiProperty({
    description: 'Время генерации в миллисекундах',
    example: 1250,
  })
  generationTime: number;
}
