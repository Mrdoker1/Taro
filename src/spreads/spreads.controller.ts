import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Req,
  Res,
  HttpStatus,
  HttpException,
  Logger,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { SpreadsService } from './spreads.service';
import { SpreadSummaryDto, SpreadDetailDto } from './dto/spread-response.dto';
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

  @Get(':spreadId/raw')
  @ApiOperation({ summary: 'Получить raw данные расклада для редактирования' })
  @ApiParam({
    name: 'spreadId',
    required: true,
    description: 'Идентификатор расклада',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Raw данные расклада',
  })
  async getSpreadRaw(
    @Param('spreadId') spreadId: string,
    @Res() res: Response,
  ) {
    try {
      const spread = await this.spreadsService.getSpreadRaw(spreadId);
      return res.status(HttpStatus.OK).json(spread);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  @Get(':spreadId')
  @ApiOperation({ summary: 'Получить детали одного расклада Таро' })
  @ApiParam({
    name: 'spreadId',
    required: true,
    description: 'Идентификатор расклада',
    type: String,
    example: 'one-card',
  })
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
    description: 'Если true, в ответе вернётся полная информация о раскладе',
    type: Boolean,
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Детали расклада успешно получены',
    type: SpreadDetailDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные параметры запроса',
  })
  @ApiResponse({
    status: 404,
    description: 'Расклад с указанным идентификатором не найден',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  async getSpreadById(
    @Param('spreadId') spreadId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // Извлекаем и обрабатываем параметры запроса
      const { lang, includeAll } = this.extractQueryParams(req);

      // Получаем данные от сервиса
      const spread = await this.spreadsService.getSpreadById(
        spreadId,
        lang,
        includeAll,
      );

      // Возвращаем успешный ответ
      return res.status(HttpStatus.OK).json(spread);
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

  @Post()
  @ApiOperation({ summary: 'Создать новый расклад' })
  @ApiResponse({
    status: 201,
    description: 'Расклад успешно создан',
  })
  async createSpread(@Body() spreadData: any, @Res() res: Response) {
    try {
      // Валидация key
      const keyRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (spreadData.key && !keyRegex.test(spreadData.key)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Невалидный key. Используйте только строчные буквы, цифры и дефисы (например, "three-cards")',
        });
      }
      
      const spread = await this.spreadsService.createSpread(spreadData);
      return res.status(HttpStatus.CREATED).json(spread);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  @Put(':spreadId')
  @ApiOperation({ summary: 'Обновить расклад' })
  @ApiParam({
    name: 'spreadId',
    required: true,
    description: 'Идентификатор расклада',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Расклад успешно обновлен',
  })
  async updateSpread(
    @Param('spreadId') spreadId: string,
    @Body() spreadData: any,
    @Res() res: Response,
  ) {
    try {
      const spread = await this.spreadsService.updateSpread(spreadId, spreadData);
      return res.status(HttpStatus.OK).json(spread);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  @Delete(':spreadId')
  @ApiOperation({ summary: 'Удалить расклад' })
  @ApiParam({
    name: 'spreadId',
    required: true,
    description: 'Идентификатор расклада',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Расклад успешно удален',
  })
  async deleteSpread(
    @Param('spreadId') spreadId: string,
    @Res() res: Response,
  ) {
    try {
      await this.spreadsService.deleteSpread(spreadId);
      return res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  /**
   * Обрабатывает ошибки и формирует соответствующий HTTP-ответ
   */
  private handleError(error: any, res: Response) {
    this.logger.error(`Ошибка при обработке запроса: ${error.message}`);

    if (error instanceof NotFoundException) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: true,
        message: 'Spread not found',
      });
    }

    if (error instanceof HttpException) {
      return res.status(error.getStatus()).json({
        error: true,
        message: error.message,
      });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: 'Internal server error',
    });
  }
}
