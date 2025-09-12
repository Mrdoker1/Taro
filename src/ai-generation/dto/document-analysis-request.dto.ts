import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { AI_PROVIDER } from '../constants';

/**
 * DTO для глубокого анализа документа с подсветкой полей
 */
export class DocumentAnalysisRequestDto {
  @ApiProperty({
    description: 'Вопрос/запрос пользователя о документе',
    example:
      'Когда выдан документ и когда истекает срок действия? Какой возраст владельца?',
  })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    description:
      'Контекст документа в виде JSON структуры (произвольная глубина)',
    example: {
      страница: '2-3',
      название: 'национальность - русский',
      страна: 'ЛАТВИЯ',
      паспорт: {
        тип: 'PN',
        код: 'LVA',
        номер_паспорта: 'не указано',
      },
      фамилия: 'ВАДИМС',
      имя: 'XXX',
      гражданство: 'XXX',
      рост: '183',
      пол: 'M',
      дата_рождения: '09.11.1984',
      персональный_номер: 'не указано',
      место_рождения: 'РИГА',
      орган_выдачи_документа:
        '2-й паспортный отдел Рижского отделения Управления по делам гражданства и миграции',
      дата_выдачи: '16.07.2015',
      действителен_до: '15.07.2025',
      подпись: '/подпись/',
    },
  })
  @IsNotEmpty()
  @IsObject()
  documentContext: any;

  @ApiProperty({
    description: 'AI провайдер (опционально)',
    enum: AI_PROVIDER,
    required: false,
    example: 'openai',
  })
  @IsOptional()
  @IsEnum(AI_PROVIDER)
  provider?: AI_PROVIDER;

  @ApiProperty({
    description: 'Ключ шаблона промпта (опционально, по умолчанию "document-analysis")',
    required: false,
    example: 'document-analysis',
  })
  @IsOptional()
  @IsString()
  templateKey?: string;

  @ApiProperty({
    description:
      'Температура генерации (0.0-2.0, по умолчанию из шаблона)',
    minimum: 0,
    maximum: 2,
    required: false,
    example: 0.3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiProperty({
    description: 'Максимальное количество токенов (по умолчанию 2000)',
    minimum: 1,
    maximum: 4000,
    required: false,
    example: 2000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4000)
  maxTokens?: number;
}

/**
 * DTO для ответа анализа документа
 */
export class DocumentAnalysisResponseDto {
  @ApiProperty({
    description: 'Детальный текстовый ответ на вопрос пользователя',
    example:
      'Документ выдан 16 июля 2015 года и действителен до 15 июля 2025 года. Владелец документа родился 9 ноября 1984 года, что означает, что на данный момент ему около 40 лет. Это латвийский паспорт типа PN.',
  })
  answer: string;

  @ApiProperty({
    description:
      'Массив путей к подсвеченным полям в JSON документе (через точку)',
    example: [
      'дата_выдачи',
      'действителен_до',
      'дата_рождения',
      'паспорт.тип',
      'страна',
    ],
  })
  highlights: string[];

  @ApiProperty({
    description: 'Использованный AI провайдер',
    example: 'openai',
  })
  provider: string;

  @ApiProperty({
    description: 'Время анализа',
    example: '2025-09-07T12:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Время обработки в миллисекундах',
    example: 1250,
  })
  processingTime: number;
}
