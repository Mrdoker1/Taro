import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck, DeckDocument } from './schemas/deck.schema';
import {
  CardDto,
  DeckDetailDto,
  DeckSummaryDto,
} from './dto/deck-response.dto';
import { CardResponseDto } from './dto/card-response.dto';

/**
 * Сервис для работы с колодами Таро
 */
@Injectable()
export class DecksService {
  private readonly logger = new Logger(DecksService.name);

  // Поддерживаемые языки
  private readonly supportedLanguages = ['ru', 'en'];

  // Язык по умолчанию
  private readonly defaultLanguage = 'ru';

  constructor(@InjectModel(Deck.name) private deckModel: Model<DeckDocument>) {}

  /**
   * Получить все колоды Таро
   * @param lang Код языка локализации
   * @param includeAll Включать ли полную информацию о картах
   * @returns Список колод в соответствии с запрошенным форматом
   */
  async getAllDecks(
    lang: string = this.defaultLanguage,
    includeAll: boolean = false,
  ): Promise<DeckSummaryDto[] | DeckDetailDto[]> {
    try {
      // Валидируем параметр языка
      this.validateLang(lang);

      // Получаем все доступные колоды из базы данных
      const decks = await this.findAvailableDecks();

      // Форматируем ответ в соответствии с запросом
      return this.formatDecksResponse(decks, lang, includeAll);
    } catch (error) {
      this.logger.error(`Ошибка при получении колод: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получить колоду Таро по идентификатору
   * @param deckId Идентификатор колоды
   * @param lang Код языка локализации
   * @param includeAll Включать ли полную информацию о картах
   * @returns Информация о колоде в соответствии с запрошенным форматом
   */
  async getDeckById(
    deckId: string,
    lang: string = this.defaultLanguage,
    includeAll: boolean = false,
  ): Promise<DeckSummaryDto | DeckDetailDto> {
    try {
      // Валидируем параметр языка
      this.validateLang(lang);

      // Получаем колоду из базы данных
      const deck = await this.deckModel
        .findOne({
          key: deckId,
          available: true,
        })
        .exec();

      // Если колода не найдена, генерируем ошибку
      if (!deck) {
        throw new NotFoundException(
          `Колода с идентификатором "${deckId}" не найдена`,
        );
      }

      // Форматируем ответ в соответствии с запросом
      if (includeAll) {
        return this.mapToDetailedResponse([deck], lang)[0];
      } else {
        return this.mapToSummaryResponse([deck], lang)[0];
      }
    } catch (error) {
      this.logger.error(
        `Ошибка при получении колоды ${deckId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Получить карту из колоды по идентификатору
   * @param deckId Идентификатор колоды
   * @param cardId Идентификатор карты
   * @param lang Код языка локализации
   * @returns Информация о карте из указанной колоды
   */
  async getCardFromDeck(
    deckId: string,
    cardId: string,
    lang: string = this.defaultLanguage,
  ): Promise<CardResponseDto> {
    try {
      // Валидируем параметр языка
      this.validateLang(lang);

      // Получаем колоду из базы данных
      const deck = await this.deckModel
        .findOne({
          key: deckId,
          available: true,
        })
        .exec();

      // Если колода не найдена, генерируем ошибку
      if (!deck) {
        throw new NotFoundException(
          `Колода с идентификатором "${deckId}" не найдена`,
        );
      }

      // Находим карту в колоде
      const card = deck.cards.find(card => card.id === cardId);

      // Если карта не найдена, генерируем ошибку
      if (!card) {
        throw new NotFoundException(
          `Карта с идентификатором "${cardId}" не найдена в колоде "${deckId}"`,
        );
      }

      // Получаем переводы
      const deckTranslation = this.getTranslation(deck.translations, lang);
      const cardTranslation = this.getTranslation(card.translations, lang);

      // Формируем объект ответа
      return {
        deck: {
          id: deck.key,
          name: deckTranslation.name,
          description: deckTranslation.description,
        },
        card: {
          id: card.id,
          name: cardTranslation.name,
          imageUrl: card.imageUrl,
          meaning: {
            upright: cardTranslation.meaning.upright,
            reversed: cardTranslation.meaning.reversed,
          },
        },
      };
    } catch (error) {
      this.logger.error(
        `Ошибка при получении карты ${cardId} из колоды ${deckId}: ${error.message}`,
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
   * Получает все доступные колоды из базы данных
   */
  private async findAvailableDecks(): Promise<DeckDocument[]> {
    const decks = await this.deckModel.find({ available: true }).exec();
    return decks;
  }

  /**
   * Форматирует ответ в зависимости от включения подробной информации
   */
  private formatDecksResponse(
    decks: DeckDocument[],
    lang: string,
    includeAll: boolean,
  ): DeckSummaryDto[] | DeckDetailDto[] {
    if (includeAll) {
      return this.mapToDetailedResponse(decks, lang);
    } else {
      return this.mapToSummaryResponse(decks, lang);
    }
  }

  /**
   * Преобразует данные в полный ответ с картами
   */
  private mapToDetailedResponse(
    decks: DeckDocument[],
    lang: string,
  ): DeckDetailDto[] {
    return decks.map(deck => {
      const translation = this.getTranslation(deck.translations, lang);

      return {
        id: deck.key,
        name: translation.name,
        description: translation.description,
        coverImageUrl: deck.coverImageUrl,
        cardsCount: deck.cards.length,
        available: deck.available,
        cards: this.mapCardsForLanguage(deck.cards, lang),
      };
    });
  }

  /**
   * Преобразует данные в краткий ответ без карт
   */
  private mapToSummaryResponse(
    decks: DeckDocument[],
    lang: string,
  ): DeckSummaryDto[] {
    return decks.map(deck => {
      const translation = this.getTranslation(deck.translations, lang);

      return {
        id: deck.key,
        name: translation.name,
        description: translation.description,
        coverImageUrl: deck.coverImageUrl,
        cardsCount: deck.cards.length,
        available: deck.available,
      };
    });
  }

  /**
   * Получает перевод для заданного языка с запасным вариантом
   */
  private getTranslation(translations: Record<string, any>, lang: string): any {
    return translations[lang] || translations[this.defaultLanguage];
  }

  /**
   * Преобразует данные карт для конкретного языка
   */
  private mapCardsForLanguage(cards: any[], lang: string): CardDto[] {
    return cards.map(card => {
      const translation = this.getTranslation(card.translations, lang);

      return {
        id: card.id,
        name: translation.name,
        imageUrl: card.imageUrl,
        meaning: {
          upright: translation.meaning.upright,
          reversed: translation.meaning.reversed,
        },
      };
    });
  }

  /**
   * Получить raw данные колоды для редактирования
   */
  async getDeckRaw(deckId: string): Promise<DeckDocument> {
    try {
      const deck = await this.deckModel.findOne({ key: deckId }).exec();

      if (!deck) {
        throw new NotFoundException(`Колода ${deckId} не найдена`);
      }

      return deck;
    } catch (error) {
      this.logger.error(`Ошибка при получении raw данных колоды ${deckId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Создать новую колоду
   */
  async createDeck(deckData: any): Promise<DeckDocument> {
    try {
      const deck = new this.deckModel(deckData);
      await deck.save();
      this.logger.log(`Колода ${deckData.key} успешно создана`);
      return deck;
    } catch (error) {
      this.logger.error(`Ошибка при создании колоды: ${error.message}`);
      throw new BadRequestException('Не удалось создать колоду');
    }
  }

  /**
   * Обновить колоду
   */
  async updateDeck(deckId: string, deckData: any): Promise<DeckDocument> {
    try {
      // Удаляем служебные поля MongoDB перед обновлением
      const { _id, __v, createdAt, updatedAt, ...updateData } = deckData;
      
      // Также удаляем _id из карт, если они есть
      if (updateData.cards && Array.isArray(updateData.cards)) {
        updateData.cards = updateData.cards.map(card => {
          const { _id: cardId, ...cardData } = card;
          return cardData;
        });
      }
      
      const deck = await this.deckModel
        .findOneAndUpdate({ key: deckId }, updateData, { new: true })
        .exec();

      if (!deck) {
        throw new NotFoundException(`Колода ${deckId} не найдена`);
      }

      this.logger.log(`Колода ${deckId} успешно обновлена`);
      return deck;
    } catch (error) {
      this.logger.error(`Ошибка при обновлении колоды ${deckId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Удалить колоду
   */
  async deleteDeck(deckId: string): Promise<void> {
    try {
      const result = await this.deckModel.deleteOne({ key: deckId }).exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException(`Колода ${deckId} не найдена`);
      }

      this.logger.log(`Колода ${deckId} успешно удалена`);
    } catch (error) {
      this.logger.error(`Ошибка при удалении колоды ${deckId}: ${error.message}`);
      throw error;
    }
  }
}
