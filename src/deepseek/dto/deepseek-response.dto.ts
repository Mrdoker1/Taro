import { ApiProperty } from '@nestjs/swagger';

export class DeepseekResponseDto {
  @ApiProperty({
    description: 'Ответ от DeepSeek API',
    example: {
      message:
        'В следующем месяце Венера будет проходить через ваш дом любви, что может привести к новым романтическим знакомствам. Благоприятный период для укрепления существующих отношений наступит после 15 числа.',
      tokens: 42,
      model: 'deepseek-chat',
      zodiacSign: 'Скорпион',
    },
  })
  response: {
    message?: string;
    error?: boolean;
    tokens: number;
    model: string;
    rawResponse?: string;
    zodiacSign?: string | null;
  };
}

// Структура ответа для неастрологических запросов
export class ErrorResponseExample {
  @ApiProperty({
    example: true,
    description: 'Флаг ошибки',
  })
  error: boolean;

  @ApiProperty({
    example:
      'Ваш вопрос не относится к астрологии или таро. Пожалуйста, задайте вопрос по этим темам.',
    description: 'Сообщение об ошибке',
  })
  message: string;
}
