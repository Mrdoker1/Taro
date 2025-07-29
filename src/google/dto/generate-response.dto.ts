import { ApiProperty } from '@nestjs/swagger';

/**
 * Пример ответа в простом формате от Google Gemini
 */
export const SimpleResponseExample = {
  message:
    'Сегодня ваши финансы могут получить импульс, если вы проявите инициативу и творчески используете ресурсы.',
  positions: [
    {
      index: 1,
      interpretation:
        'Маг: соедините навыки и связи; составьте конкретный план дохода и сразу приступайте к его реализации.',
    },
  ],
};

/**
 * DTO для ответа эндпоинта Google Gemini /generate
 */
export class GoogleGenerateResponseDto {
  @ApiProperty({
    description: 'Основное сообщение ответа',
    example: SimpleResponseExample.message,
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'Позиции карт и их интерпретации (для раскладов таро)',
    example: SimpleResponseExample.positions,
    required: false,
    type: 'array',
    isArray: true,
  })
  positions?: any[];

  // Дополнительные поля могут существовать в зависимости от запроса
  [key: string]: any;
}

/**
 * Пример ошибки генерации Google Gemini
 */
export class GoogleGenerateErrorResponseDto {
  @ApiProperty({
    example: true,
    description: 'Флаг ошибки',
  })
  error: boolean;

  @ApiProperty({
    example: 'Ваш вопрос не относится к таро или астрологии.',
    description: 'Сообщение об ошибке',
  })
  message: string;
}
