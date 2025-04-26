import {
  Controller,
  Get,
  Req,
  Res,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpreadsService } from './spreads.service';
import { SpreadSummaryDto } from './dto/spread-response.dto';
import { Request, Response } from 'express';

@ApiTags('Spreads')
@Controller('spreads')
export class SpreadsController {
  private readonly logger = new Logger(SpreadsController.name);

  constructor(private readonly spreadsService: SpreadsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех раскладов Таро' })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'Код языка локализации (например, ru, en)',
    type: String,
    example: 'ru',
  })
  @ApiQuery({
    name: 'includeAll',
    required: false,
    description:
      'Если true, в ответе вернётся полная информация о каждом раскладе',
    type: Boolean,
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Список раскладов успешно получен',
    type: [SpreadSummaryDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные параметры запроса',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  async getSpreads(@Req() req: Request, @Res() res: Response) {
    try {
      // Извлекаем и обрабатываем параметры запроса
      const { lang, includeAll } = this.extractQueryParams(req);

      // Получаем данные от сервиса
      const spreads = await this.spreadsService.getAllSpreads(lang, includeAll);

      // Возвращаем успешный ответ
      return res.status(HttpStatus.OK).json(spreads);
    } catch (error) {
      // Обрабатываем ошибки
      return this.handleError(error, res);
    }
  }

  /**
   * Извлекает и преобразует параметры запроса
   */
  private extractQueryParams(req: Request): {
    lang: string;
    includeAll: boolean;
  } {
    const queryParams = req.query;

    // Получение параметра lang
    let lang = (queryParams.lang as string) || 'ru';

    // Получение языка из заголовка Accept-Language, если lang не задан
    if (!queryParams.lang && req.headers['accept-language']) {
      lang = req.headers['accept-language'].split(',')[0].trim();
    }

    // Проверка значения includeAll
    const includeAllParam = queryParams.includeAll;
    const includeAll = includeAllParam === 'true' || includeAllParam === '1';

    return { lang, includeAll };
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
      message: 'Ошибка при получении раскладов',
    });
  }
}
