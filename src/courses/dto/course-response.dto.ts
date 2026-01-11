import { ApiProperty } from '@nestjs/swagger';

// DTO для блока контента
export class ContentBlockDto {
  @ApiProperty({
    description: 'Тип блока контента',
    enum: ['md', 'image', 'card', 'video'],
    example: 'md',
  })
  type: string;

  @ApiProperty({
    description: 'Markdown контент (для type: md)',
    required: false,
    example: '# Заголовок\n\nТекст...',
  })
  content?: string;

  @ApiProperty({
    description: 'URL изображения или видео (для type: image | video)',
    required: false,
    example: 'https://i.ibb.co/xxx/image.jpg',
  })
  url?: string;

  @ApiProperty({
    description: 'Подпись к изображению (для type: image)',
    required: false,
    example: 'Описание изображения',
  })
  caption?: string;

  @ApiProperty({
    description: 'ID карты (для type: card)',
    required: false,
    example: 'the-fool',
  })
  cardId?: string;

  @ApiProperty({
    description: 'ID колоды (для type: card)',
    required: false,
    example: 'rider',
  })
  deckId?: string;
}

// DTO для страницы
export class CoursePageDto {
  @ApiProperty({
    description: 'Название страницы',
    example: 'История Таро',
  })
  title: string;

  @ApiProperty({
    description: 'Блоки контента страницы',
    type: [ContentBlockDto],
  })
  blocks: ContentBlockDto[];
}

// DTO для главы
export class CourseChapterDto {
  @ApiProperty({
    description: 'Название главы',
    example: 'Введение',
  })
  title: string;

  @ApiProperty({
    description: 'Страницы главы',
    type: [CoursePageDto],
  })
  pages: CoursePageDto[];
}

// DTO для краткой информации о курсе (список)
export class CourseListItemDto {
  @ApiProperty({
    description: 'Уникальный идентификатор курса',
    example: 'basic-tarot',
  })
  slug: string;

  @ApiProperty({
    description: 'Название курса',
    example: 'Базовый курс Таро',
  })
  title: string;

  @ApiProperty({
    description: 'Краткое описание курса',
    example: 'Изучите основы Таро с нуля.',
  })
  description: string;

  @ApiProperty({
    description: 'URL обложки курса',
    required: false,
    example: 'https://i.ibb.co/xxx/cover.png',
  })
  coverImageUrl?: string;

  @ApiProperty({
    description: 'Уровень курса',
    enum: ['beginner', 'intermediate', 'advanced'],
    example: 'beginner',
  })
  level: string;

  @ApiProperty({
    description: 'Цена курса (0 — бесплатный)',
    example: 0,
  })
  price: number;

  @ApiProperty({
    description: 'Доступен ли курс пользователям',
    example: true,
  })
  isPublished: boolean;

  @ApiProperty({
    description: 'Количество глав в курсе',
    example: 5,
  })
  chaptersCount: number;
}

// DTO для полного курса
export class CourseDetailDto {
  @ApiProperty({
    description: 'Уникальный идентификатор курса',
    example: 'basic-tarot',
  })
  slug: string;

  @ApiProperty({
    description: 'Название курса',
    example: 'Базовый курс Таро',
  })
  title: string;

  @ApiProperty({
    description: 'Описание курса',
    example: 'Изучите основы Таро с нуля.',
  })
  description: string;

  @ApiProperty({
    description: 'URL обложки курса',
    required: false,
    example: 'https://i.ibb.co/xxx/cover.png',
  })
  coverImageUrl?: string;

  @ApiProperty({
    description: 'Уровень курса',
    enum: ['beginner', 'intermediate', 'advanced'],
    example: 'beginner',
  })
  level: string;

  @ApiProperty({
    description: 'Цена курса',
    example: 0,
  })
  price: number;

  @ApiProperty({
    description: 'Доступен ли курс',
    example: true,
  })
  isPublished: boolean;

  @ApiProperty({
    description: 'Главы курса',
    type: [CourseChapterDto],
  })
  chapters: CourseChapterDto[];

  @ApiProperty({
    description: 'Дата создания (ISO)',
    example: '2024-01-15T10:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата обновления (ISO)',
    example: '2024-01-20T15:30:00Z',
  })
  updatedAt: string;
}

// DTO для ответа с одной главой
export class ChapterResponseDto {
  @ApiProperty({
    description: 'Информация о курсе',
    type: 'object',
    properties: {
      slug: { type: 'string', example: 'basic-tarot' },
      title: { type: 'string', example: 'Базовый курс Таро' },
    },
  })
  course: {
    slug: string;
    title: string;
  };

  @ApiProperty({
    description: 'Индекс главы (0-based)',
    example: 0,
  })
  chapterIndex: number;

  @ApiProperty({
    description: 'Данные главы',
    type: CourseChapterDto,
  })
  chapter: CourseChapterDto;
}
