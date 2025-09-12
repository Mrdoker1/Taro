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

  @ApiProperty({
    description: 'Пользовательский промпт с плейсхолдерами (опционально)',
    example: 'Карта: {card_name}. Вопрос: {user_question}',
    required: false,
  })
  prompt?: string;

  @ApiProperty({
    description: 'Язык ответа',
    example: 'russian',
  })
  responseLang: string;
}
