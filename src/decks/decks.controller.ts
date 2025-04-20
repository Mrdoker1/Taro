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
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { DecksService } from './decks.service';
import { DeckSummaryDto, DeckDetailDto } from './dto/deck-response.dto';
import { Request, Response } from 'express';

@ApiTags('Decks')
@Controller('decks')
export class DecksController {
  private readonly logger = new Logger(DecksController.name);

  constructor(private readonly decksService: DecksService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех колод Таро' })
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
      'Если true, в ответе вернётся полный список карт каждой колоды',
    type: Boolean,
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Список колод успешно получен',
    type: [DeckSummaryDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные параметры запроса',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
  })
  async getDecks(@Req() req: Request, @Res() res: Response) {
    try {
      // Извлекаем и обрабатываем параметры запроса
      const { lang, includeAll } = this.extractQueryParams(req);

      // Получаем данные от сервиса
      const decks = await this.decksService.getAllDecks(lang, includeAll);

      // Фильтруем результат при необходимости
      const result = this.processDecksResult(decks, includeAll);

      // Возвращаем успешный ответ
      return res.status(HttpStatus.OK).json(result);
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

    const lang = (queryParams.lang as string) || 'ru';
    const includeAllParam = queryParams.includeAll;

    // Проверка значения includeAll на true/1
    const includeAll = includeAllParam === 'true' || includeAllParam === '1';

    return { lang, includeAll };
  }

  /**
   * Обрабатывает результат для отправки клиенту
   */
  private processDecksResult(
    decks: DeckSummaryDto[] | DeckDetailDto[],
    includeAll: boolean,
  ): DeckSummaryDto[] | DeckDetailDto[] {
    // Если не нужны карты, удаляем их
    if (!includeAll) {
      // Удаляем поле cards из каждого объекта
      return decks.map(deck => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { cards, ...deckWithoutCards } = deck;
        return deckWithoutCards;
      });
    }

    return decks;
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
      message: 'Ошибка при получении колод',
    });
  }

  @Get(':deckId')
  @ApiOperation({ summary: 'Получить детали одной колоды Таро' })
  @ApiParam({
    name: 'deckId',
    required: true,
    description: 'Идентификатор колоды',
    type: String,
    example: 'rider',
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'ISO-код языка локализации (ru, en, ...)',
    type: String,
    example: 'ru',
  })
  @ApiQuery({
    name: 'includeAll',
    required: false,
    description: 'Если true, в ответе вернётся полный список карт колоды',
    type: Boolean,
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Детали колоды успешно получены',
    type: DeckDetailDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректный lang или includeAll',
  })
  @ApiResponse({
    status: 404,
    description: 'Колода с указанным идентификатором не найдена',
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервиса',
  })
  async getDeckById(
    @Param('deckId') deckId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      // Извлекаем и обрабатываем параметры запроса
      const { lang, includeAll } = this.extractQueryParams(req);

      // Получаем данные от сервиса
      const deck = await this.decksService.getDeckById(
        deckId,
        lang,
        includeAll,
      );

      // Фильтруем карты если includeAll=false
      const result = this.processResult(deck, includeAll);

      // Устанавливаем заголовок кэширования
      res.setHeader('Cache-Control', 'public, max-age=3600');

      // Возвращаем успешный ответ
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      // Если колода не найдена, возвращаем 404
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

  /**
   * Обрабатывает результат для одной колоды
   */
  private processResult(
    deck: DeckSummaryDto | DeckDetailDto,
    includeAll: boolean,
  ): DeckSummaryDto | DeckDetailDto {
    if (!includeAll && 'cards' in deck) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { cards, ...deckWithoutCards } = deck;
      return deckWithoutCards;
    }

    return deck;
  }
}
