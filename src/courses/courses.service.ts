import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import {
  CourseListItemDto,
  CourseDetailDto,
  ChapterResponseDto,
} from './dto/course-response.dto';

/**
 * Сервис для работы с курсами Таро
 */
@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  // Поддерживаемые языки
  private readonly supportedLanguages = ['ru', 'en'];

  // Язык по умолчанию
  private readonly defaultLanguage = 'ru';

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  /**
   * Получить список всех курсов (краткая информация)
   * @param lang Код языка локализации
   * @returns Список курсов
   */
  async getAllCourses(
    lang: string = this.defaultLanguage,
  ): Promise<CourseListItemDto[]> {
    try {
      // Валидируем параметр языка
      this.validateLang(lang);

      // Получаем все опубликованные курсы из базы данных
      const courses = await this.courseModel
        .find({ isPublished: true })
        .exec();

      // Форматируем ответ для списка
      return this.mapToListResponse(courses, lang);
    } catch (error) {
      this.logger.error(`Ошибка при получении курсов: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получить полный курс по slug
   * @param slug Идентификатор курса
   * @param lang Код языка локализации
   * @returns Полная информация о курсе
   */
  async getCourseBySlug(
    slug: string,
    lang: string = this.defaultLanguage,
  ): Promise<CourseDetailDto> {
    try {
      // Валидируем параметр языка
      this.validateLang(lang);

      // Получаем курс из базы данных
      const course = await this.courseModel
        .findOne({
          slug: slug,
          isPublished: true,
        })
        .exec();

      // Если курс не найден, генерируем ошибку
      if (!course) {
        throw new NotFoundException(
          `Курс с идентификатором "${slug}" не найден`,
        );
      }

      // Форматируем ответ с полной информацией
      return this.mapToDetailResponse(course, lang);
    } catch (error) {
      this.logger.error(
        `Ошибка при получении курса ${slug}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Получить одну главу курса по индексу
   * @param slug Идентификатор курса
   * @param chapterIndex Индекс главы (0-based)
   * @param lang Код языка локализации
   * @returns Информация о главе
   */
  async getCourseChapter(
    slug: string,
    chapterIndex: number,
    lang: string = this.defaultLanguage,
  ): Promise<ChapterResponseDto> {
    try {
      // Валидируем параметр языка
      this.validateLang(lang);

      // Валидируем индекс главы
      if (
        !Number.isInteger(chapterIndex) ||
        chapterIndex < 0
      ) {
        throw new BadRequestException(
          'Параметр chapterIndex должен быть целым числом >= 0',
        );
      }

      // Получаем курс из базы данных
      const course = await this.courseModel
        .findOne({
          slug: slug,
          isPublished: true,
        })
        .exec();

      // Если курс не найден, генерируем ошибку
      if (!course) {
        throw new NotFoundException(
          `Курс с идентификатором "${slug}" не найден`,
        );
      }

      // Получаем перевод для курса
      const translation = this.getTranslation(course.translations, lang);

      // Проверяем, что индекс главы в пределах массива
      if (chapterIndex >= translation.chapters.length) {
        throw new NotFoundException(
          `Глава с индексом ${chapterIndex} не найдена в курсе "${slug}"`,
        );
      }

      // Получаем главу
      const chapter = translation.chapters[chapterIndex];

      // Формируем ответ
      return {
        course: {
          slug: course.slug,
          title: translation.title,
        },
        chapterIndex: chapterIndex,
        chapter: {
          title: chapter.title,
          pages: chapter.pages,
        },
      };
    } catch (error) {
      this.logger.error(
        `Ошибка при получении главы ${chapterIndex} курса ${slug}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Проверяет корректность параметра языка
   */
  private validateLang(lang: string): void {
    if (!this.supportedLanguages.includes(lang)) {
      throw new BadRequestException(
        `Неподдерживаемый язык локализации. Поддерживаемые языки: ${this.supportedLanguages.join(', ')}`,
      );
    }
  }

  /**
   * Получает перевод для заданного языка с запасным вариантом
   */
  private getTranslation(translations: Record<string, any>, lang: string): any {
    return translations[lang] || translations[this.defaultLanguage];
  }

  /**
   * Преобразует курсы в краткий формат для списка
   */
  private mapToListResponse(
    courses: CourseDocument[],
    lang: string,
  ): CourseListItemDto[] {
    return courses.map(course => {
      const translation = this.getTranslation(course.translations, lang);

      return {
        slug: course.slug,
        title: translation.title,
        description: translation.description,
        coverImageUrl: course.coverImageUrl,
        level: course.level,
        price: course.price,
        isPublished: course.isPublished,
        chaptersCount: translation.chapters.length,
      };
    });
  }

  /**
   * Преобразует курс в полный формат
   */
  private mapToDetailResponse(
    course: CourseDocument,
    lang: string,
  ): CourseDetailDto {
    const translation = this.getTranslation(course.translations, lang);

    return {
      slug: course.slug,
      title: translation.title,
      description: translation.description,
      coverImageUrl: course.coverImageUrl,
      level: course.level,
      price: course.price,
      isPublished: course.isPublished,
      chapters: translation.chapters,
      createdAt: course.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: course.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}
