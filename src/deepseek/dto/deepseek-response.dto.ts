import { ApiProperty } from '@nestjs/swagger';

export class DeepseekResponseDto {
  @ApiProperty({
    description: 'Сообщение-ответ от DeepSeek API',
    example:
      'В следующем месяце Венера будет проходить через ваш дом любви, что может привести к новым романтическим знакомствам. Благоприятный период для укрепления существующих отношений наступит после 15 числа.',
  })
  message?: string;

  @ApiProperty({
    description: 'Флаг ошибки, присутствует только в случае ошибки',
    example: false,
    required: false,
  })
  error?: boolean;

  @ApiProperty({
    description: 'Количество использованных токенов',
    example: 42,
  })
  tokens: number;

  @ApiProperty({
    description: 'Используемая модель',
    example: 'deepseek-chat',
  })
  model: string;

  @ApiProperty({
    description: 'Необработанный ответ в случае ошибки',
    required: false,
  })
  rawResponse?: string;

  @ApiProperty({
    description: 'Знак зодиака',
    example: 'Скорпион',
    required: false,
  })
  zodiacSign?: string | null;
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
