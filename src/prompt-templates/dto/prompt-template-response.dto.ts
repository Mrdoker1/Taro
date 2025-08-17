import { ApiProperty } from '@nestjs/swagger';

export class PromptTemplateResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор шаблона запроса',
    example: 'one-card',
  })
  key: string;

  @ApiProperty({
    description: 'Температура генерации для модели',
    example: 0.7,
  })
  temperature: number;

  @ApiProperty({
    description: 'Максимальное количество токенов в ответе',
    example: 800,
  })
  maxTokens: number;

  @ApiProperty({
    description: 'Системный промпт для модели',
    example:
      'Ты — профессиональный таролог. Отвечай ТОЛЬКО на вопросы о таро...',
  })
  systemPrompt: string;
}
