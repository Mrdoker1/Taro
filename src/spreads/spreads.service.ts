import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Spread, SpreadDocument } from './schemas/spread.schema';
import { SpreadDetailDto, SpreadSummaryDto } from './dto/spread-response.dto';

/**
 * Сервис для работы с раскладами Таро
 */
@Injectable()
export class SpreadsService {
  private readonly logger = new Logger(SpreadsService.name);

  // Поддерживаемые языки
  private readonly supportedLanguages = ['ru', 'en'];

  // Язык по умолчанию
  private readonly defaultLanguage = 'ru';

  constructor(
    @InjectModel(Spread.name) private spreadModel: Model<SpreadDocument>,
  ) {}

  /**
   * Получить все расклады Таро
   * @param lang Код языка локализации
   * @param includeAll Включать ли подробную информацию
   * @returns Список раскладов в соответствии с запрошенным форматом
   */
  async getAllSpreads(
    lang: string = this.defaultLanguage,
    includeAll: boolean = false,
  ): Promise<SpreadSummaryDto[] | SpreadDetailDto[]> {
    try {
      // Валидируем параметр языка
      this.validateLang(lang);

      // Получаем все доступные расклады из базы данных
      const spreads = await this.findAvailableSpreads();

      // Форматируем ответ в соответствии с запросом
      return this.formatSpreadsResponse(spreads, lang, includeAll);
    } catch (error) {
      this.logger.error(`Ошибка при получении раскладов: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получить расклад по идентификатору
   * @param spreadId Идентификатор расклада
   * @param lang Код языка локализации
   * @param includeAll Включать ли подробную информацию
   * @returns Информация о раскладе в соответствии с запрошенным форматом
   */
  async getSpreadById(
    spreadId: string,
    lang: string = this.defaultLanguage,
    includeAll: boolean = false,
  ): Promise<SpreadSummaryDto | SpreadDetailDto> {
    try {
      // Валидируем параметр языка
      this.validateLang(lang);

      // Получаем расклад из базы данных
      const spread = await this.spreadModel
        .findOne({
          key: spreadId,
          available: true,
        })
        .exec();

      // Если расклад не найден, генерируем ошибку
      if (!spread) {
        throw new NotFoundException('Spread not found');
      }

      // Форматируем ответ в соответствии с запросом
      if (includeAll) {
        return this.mapToDetailedResponse([spread], lang)[0];
      } else {
        return this.mapToSummaryResponse([spread], lang)[0];
      }
    } catch (error) {
      this.logger.error(
        `Ошибка при получении расклада ${spreadId}: ${error.message}`,
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
   * Получает все доступные расклады из базы данных
   */
  private async findAvailableSpreads(): Promise<SpreadDocument[]> {
    const spreads = await this.spreadModel.find({ available: true }).exec();
    return spreads;
  }

  /**
   * Форматирует ответ в зависимости от включения подробной информации
   */
  private formatSpreadsResponse(
    spreads: SpreadDocument[],
    lang: string,
    includeAll: boolean,
  ): SpreadSummaryDto[] | SpreadDetailDto[] {
    if (includeAll) {
      return this.mapToDetailedResponse(spreads, lang);
    } else {
      return this.mapToSummaryResponse(spreads, lang);
    }
  }

  /**
   * Преобразует документы в детальный формат ответа
   */
  private mapToDetailedResponse(
    spreads: SpreadDocument[],
    lang: string,
  ): SpreadDetailDto[] {
    return spreads.map(spread => {
      const translation = this.getTranslation(spread.translations, lang);

      // Преобразуем meta объекты
      const metaObj: Record<string, { label: string }> = {};
      if (spread.meta && typeof spread.meta === 'object') {
        for (const [key, meta] of Object.entries(spread.meta)) {
          metaObj[key] = {
            label: meta.label[lang] || meta.label[this.defaultLanguage],
          };
        }
      }

      return {
        id: spread.key,
        name: translation.name,
        description: translation.description,
        available: spread.available,
        paid: spread.paid,
        imageURL: spread.imageURL,
        promptTemplateKey: spread.promptTemplateKey,
        questions: spread.questions 
          ? (spread.questions[lang] || spread.questions[this.defaultLanguage] || [])
          : [],
        cardsCount: spread.cardsCount,
        grid: spread.grid || [],
        meta: metaObj,
      };
    });
  }

  /**
   * Преобразует документы в краткий формат ответа
   */
  private mapToSummaryResponse(
    spreads: SpreadDocument[],
    lang: string,
  ): SpreadSummaryDto[] {
    return spreads.map(spread => {
      const translation = this.getTranslation(spread.translations, lang);

      return {
        id: spread.key,
        name: translation.name,
        description: translation.description,
        available: spread.available,
        paid: spread.paid,
        imageURL: spread.imageURL,
        promptTemplateKey: spread.promptTemplateKey,
        cardsCount: spread.cardsCount,
      };
    });
  }

  /**
   * Получить raw данные расклада для редактирования
   */
  async getSpreadRaw(spreadId: string): Promise<Spread> {
    try {
      const spread = await this.spreadModel.findOne({ key: spreadId }).exec();
      
      if (!spread) {
        throw new NotFoundException('Spread not found');
      }

      return spread.toObject();
    } catch (error) {
      this.logger.error(`Ошибка при получении raw расклада ${spreadId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Создать новый расклад
   */
  async createSpread(spreadData: Partial<Spread>): Promise<Spread> {
    try {
      const spread = new this.spreadModel(spreadData);
      const saved = await spread.save();
      this.logger.log(`Создан расклад: ${saved.key}`);
      return saved;
    } catch (error) {
      this.logger.error(`Ошибка при создании расклада: ${error.message}`);
      throw error;
    }
  }

  /**
   * Обновить расклад
   */
  async updateSpread(spreadId: string, spreadData: Partial<Spread>): Promise<Spread> {
    try {
      const spread = await this.spreadModel
        .findOneAndUpdate(
          { key: spreadId },
          { $set: spreadData },
          { new: true }
        )
        .exec();

      if (!spread) {
        throw new NotFoundException('Spread not found');
      }

      this.logger.log(`Обновлен расклад: ${spreadId}`);
      return spread;
    } catch (error) {
      this.logger.error(`Ошибка при обновлении расклада ${spreadId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Удалить расклад
   */
  async deleteSpread(spreadId: string): Promise<void> {
    try {
      const result = await this.spreadModel
        .deleteOne({ key: spreadId })
        .exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException('Spread not found');
      }

      this.logger.log(`Удален расклад: ${spreadId}`);
    } catch (error) {
      this.logger.error(`Ошибка при удалении расклада ${spreadId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получает перевод для указанного языка или возвращает перевод для языка по умолчанию
   */
  private getTranslation(translations: Record<string, any>, lang: string): any {
    return translations[lang] || translations[this.defaultLanguage];
  }
}
