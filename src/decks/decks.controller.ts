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
  Query,
  DefaultValuePipe,
  BadRequestException,
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
import { CardResponseDto } from './dto/card-response.dto';
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

  @Get(':deckId/cards/:cardId')
  @ApiOperation({ summary: 'Получить информацию о карте из колоды' })
  @ApiParam({
    name: 'deckId',
    description: 'Идентификатор колоды',
    required: true,
    example: 'rider',
  })
  @ApiParam({
    name: 'cardId',
    description: 'Идентификатор карты',
    required: true,
    example: 'the-fool',
  })
  @ApiQuery({
    name: 'lang',
    description: 'ISO-код языка локализации (ru, en, ...)',
    required: false,
    example: 'ru',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Информация о карте успешно получена',
    type: CardResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Колода или карта не найдены',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверный параметр lang',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Внутренняя ошибка сервера',
  })
  async getCardFromDeck(
    @Param('deckId') deckId: string,
    @Param('cardId') cardId: string,
    @Query('lang', new DefaultValuePipe('ru')) lang: string,
    @Res() res: Response,
  ) {
    try {
      // Получаем информацию о карте из сервиса
      const cardData = await this.decksService.getCardFromDeck(
        deckId,
        cardId,
        lang,
      );

      // Устанавливаем заголовок кэширования
      res.setHeader('Cache-Control', 'public, max-age=3600');

      // Возвращаем успешный ответ
      return res.status(HttpStatus.OK).json(cardData);
    } catch (error) {
      // Если колода или карта не найдены, возвращаем 404
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
        });
      }

      // Если неверный параметр языка, возвращаем 400
      if (
        error instanceof BadRequestException ||
        (error.message && error.message.includes('язык'))
      ) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        });
      }

      // Обрабатываем другие ошибки
      return this.handleError(error, res);
    }
  }

  @Get(':deckId/raw')
  @ApiOperation({ summary: 'Получить raw данные колоды для редактирования' })
  @ApiParam({
    name: 'deckId',
    required: true,
    description: 'Идентификатор колоды',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Raw данные колоды успешно получены',
  })
  @ApiResponse({
    status: 404,
    description: 'Колода не найдена',
  })
  async getDeckRaw(@Param('deckId') deckId: string) {
    try {
      return await this.decksService.getDeckRaw(deckId);
    } catch (error) {
      this.logger.error(`Ошибка при получении raw данных колоды: ${error.message}`);
      throw error;
    }
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую колоду' })
  @ApiResponse({
    status: 201,
    description: 'Колода успешно создана',
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные',
  })
  async createDeck(@Body() deckData: any) {
    try {
      return await this.decksService.createDeck(deckData);
    } catch (error) {
      this.logger.error(`Ошибка при создании колоды: ${error.message}`);
      throw new BadRequestException('Не удалось создать колоду');
    }
  }

  @Put(':deckId')
  @ApiOperation({ summary: 'Обновить колоду' })
  @ApiParam({
    name: 'deckId',
    required: true,
    description: 'Идентификатор колоды',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Колода успешно обновлена',
  })
  @ApiResponse({
    status: 404,
    description: 'Колода не найдена',
  })
  async updateDeck(@Param('deckId') deckId: string, @Body() deckData: any) {
    try {
      return await this.decksService.updateDeck(deckId, deckData);
    } catch (error) {
      this.logger.error(`Ошибка при обновлении колоды: ${error.message}`);
      throw error;
    }
  }

  @Delete(':deckId')
  @ApiOperation({ summary: 'Удалить колоду' })
  @ApiParam({
    name: 'deckId',
    required: true,
    description: 'Идентификатор колоды',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Колода успешно удалена',
  })
  @ApiResponse({
    status: 404,
    description: 'Колода не найдена',
  })
  async deleteDeck(@Param('deckId') deckId: string) {
    try {
      await this.decksService.deleteDeck(deckId);
      return { message: 'Колода успешно удалена' };
    } catch (error) {
      this.logger.error(`Ошибка при удалении колоды: ${error.message}`);
      throw error;
    }
  }
}
