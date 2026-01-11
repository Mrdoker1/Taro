import {
  Controller,
  Get,
  Req,
  Res,
  HttpStatus,
  HttpException,
  Logger,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CourseDetailDto, ChapterResponseDto } from './dto/course-response.dto';
import { Request, Response } from 'express';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  private readonly logger = new Logger(CoursesController.name);

  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех курсов Таро' })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'ISO-код языка локализации (например, ru, en)',
    type: String,
    example: 'ru',
  })
  @ApiResponse({
    status: 200,
    description: 'Список курсов успешно получен',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/CourseListItemDto' },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректный параметр lang',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  async getCourses(@Req() req: Request, @Res() res: Response) {
    try {
      // Извлекаем параметр языка
      const lang = this.extractLangParam(req);

      // Получаем данные от сервиса
      const courses = await this.coursesService.getAllCourses(lang);

      // Возвращаем успешный ответ
      return res.status(HttpStatus.OK).json({
        items: courses,
      });
    } catch (error) {
      // Обрабатываем ошибки
      return this.handleError(error, res);
    }
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Получить полный курс по slug' })
  @ApiParam({
    name: 'slug',
    required: true,
    description: 'Идентификатор курса',
    type: String,
    example: 'basic-tarot',
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'ISO-код языка локализации (ru, en, ...)',
    type: String,
    example: 'ru',
  })
  @ApiResponse({
    status: 200,
    description: 'Курс успешно получен',
    type: CourseDetailDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректный параметр lang',
  })
  @ApiResponse({
    status: 404,
    description: 'Курс с указанным slug не найден',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
  })
  async getCourseBySlug(
    @Param('slug') slug: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // Извлекаем параметр языка
      const lang = this.extractLangParam(req);

      // Получаем данные от сервиса
      const course = await this.coursesService.getCourseBySlug(slug, lang);

      // Устанавливаем заголовок кэширования
      res.setHeader('Cache-Control', 'public, max-age=3600');

      // Возвращаем успешный ответ
      return res.status(HttpStatus.OK).json(course);
    } catch (error) {
      // Если курс не найден, возвращаем 404
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }

      // Обрабатываем другие ошибки
      return this.handleError(error, res);
    }
  }

  @Get(':slug/chapters/:chapterIndex')
  @ApiOperation({ summary: 'Получить одну главу курса по индексу' })
  @ApiParam({
    name: 'slug',
    required: true,
    description: 'Идентификатор курса',
    type: String,
    example: 'basic-tarot',
  })
  @ApiParam({
    name: 'chapterIndex',
    required: true,
    description: 'Индекс главы (0-based)',
    type: Number,
    example: 0,
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'ISO-код языка локализации (ru, en, ...)',
    type: String,
    example: 'ru',
  })
  @ApiResponse({
    status: 200,
    description: 'Глава успешно получена',
    type: ChapterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректный параметр lang или chapterIndex',
  })
  @ApiResponse({
    status: 404,
    description: 'Курс не найден или chapterIndex вне диапазона',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
  })
  async getCourseChapter(
    @Param('slug') slug: string,
    @Param('chapterIndex') chapterIndex: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // Извлекаем параметр языка
      const lang = this.extractLangParam(req);

      // Преобразуем chapterIndex в число
      const index = parseInt(chapterIndex, 10);

      // Проверяем валидность индекса
      if (isNaN(index) || index < 0) {
        throw new BadRequestException(
          'Параметр chapterIndex должен быть целым числом >= 0',
        );
      }

      // Получаем данные от сервиса
      const chapter = await this.coursesService.getCourseChapter(
        slug,
        index,
        lang,
      );

      // Устанавливаем заголовок кэширования
      res.setHeader('Cache-Control', 'public, max-age=3600');

      // Возвращаем успешный ответ
      return res.status(HttpStatus.OK).json(chapter);
    } catch (error) {
      // Если курс или глава не найдены, возвращаем 404
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }

      // Если некорректный параметр, возвращаем 400
      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        });
      }

      // Обрабатываем другие ошибки
      return this.handleError(error, res);
    }
  }

  /**
   * Извлекает параметр языка из запроса
   */
  private extractLangParam(req: Request): string {
    return (req.query.lang as string) || 'ru';
  }

  /**
   * Обрабатывает ошибки и формирует соответствующий HTTP-ответ
   */
  private handleError(error: any, res: Response) {
    this.logger.error(`Ошибка при обработке запроса: ${error.message}`);

    if (error instanceof HttpException) {
      return res.status(error.getStatus()).json({
        statusCode: error.getStatus(),
        message: error.message,
      });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Ошибка при получении курсов',
    });
  }
}
