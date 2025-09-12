import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AI_PROVIDER } from '../constants';

/**
 * DTO для одного документа в анализе нескольких документов
 */
export class DocumentItemDto {
  @ApiProperty({
    description: 'Уникальный идентификатор документа',
    example: 'document_1',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Название или описание документа',
    example: 'Паспорт гражданина Латвии',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

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
  context: any;
}

/**
 * DTO для анализа нескольких документов с подсветкой полей
 */
export class MultiDocumentAnalysisRequestDto {
  @ApiProperty({
    description: 'Вопрос/запрос пользователя о документах',
    example:
      'Сравни даты рождения в паспорте и водительских правах. Есть ли несоответствия?',
  })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    description: 'Массив документов для анализа',
    type: [DocumentItemDto],
    example: [
      {
        id: 'passport',
        name: 'Паспорт гражданина Латвии',
        context: {
          страна: 'ЛАТВИЯ',
          фамилия: 'ВАДИМС',
          имя: 'XXX',
          дата_рождения: '09.11.1984',
          дата_выдачи: '16.07.2015',
          действителен_до: '15.07.2025',
        },
      },
      {
        id: 'drivers_license',
        name: 'Водительские права',
        context: {
          страна: 'ЛАТВИЯ',
          фамилия: 'ВАДИМС',
          имя: 'XXX',
          дата_рождения: '09.11.1984',
          дата_выдачи: '20.03.2010',
          действителен_до: '20.03.2030',
          категории: ['B', 'B1'],
        },
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentItemDto)
  documents: DocumentItemDto[];

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
    description:
      'Ключ шаблона промпта (опционально, по умолчанию "multi-document-analysis")',
    required: false,
    example: 'multi-document-analysis',
  })
  @IsOptional()
  @IsString()
  templateKey?: string;

  @ApiProperty({
    description: 'Температура для генерации (0.0-1.0)',
    example: 0.3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number;

  @ApiProperty({
    description: 'Максимальное количество токенов в ответе',
    example: 2000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4000)
  maxTokens?: number;
}

/**
 * DTO для подсветки поля в конкретном документе
 */
export class DocumentHighlightDto {
  @ApiProperty({
    description: 'ID документа',
    example: 'passport',
  })
  documentId: string;

  @ApiProperty({
    description: 'Название документа',
    example: 'Паспорт гражданина Латвии',
  })
  documentName: string;

  @ApiProperty({
    description: 'Путь к полю в JSON документе (через точку)',
    example: 'дата_рождения',
  })
  fieldPath: string;

  @ApiProperty({
    description: 'Значение поля',
    example: '09.11.1984',
  })
  fieldValue: any;
}

/**
 * DTO для ответа анализа нескольких документов
 */
export class MultiDocumentAnalysisResponseDto {
  @ApiProperty({
    description: 'Детальный текстовый ответ на вопрос пользователя',
    example:
      'Даты рождения в документах совпадают: в паспорте и водительских правах указана одинаковая дата - 09.11.1984. Несоответствий не обнаружено.',
  })
  answer: string;

  @ApiProperty({
    description: 'Массив подсвеченных полей с указанием документа и поля',
    type: [DocumentHighlightDto],
    example: [
      {
        documentId: 'passport',
        documentName: 'Паспорт гражданина Латвии',
        fieldPath: 'дата_рождения',
        fieldValue: '09.11.1984',
      },
      {
        documentId: 'drivers_license',
        documentName: 'Водительские права',
        fieldPath: 'дата_рождения',
        fieldValue: '09.11.1984',
      },
    ],
  })
  highlights: DocumentHighlightDto[];

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

  @ApiProperty({
    description: 'Количество обработанных документов',
    example: 2,
  })
  documentsCount: number;
}
