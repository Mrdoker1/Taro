import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck, DeckDocument } from './schemas/deck.schema';
import { SAMPLE_DECKS } from './sample-data';

@Injectable()
export class DecksSeedService implements OnModuleInit {
  private readonly logger = new Logger(DecksSeedService.name);

  constructor(@InjectModel(Deck.name) private deckModel: Model<DeckDocument>) {}

  async onModuleInit() {
    await this.seedDecks();
  }

  private async seedDecks() {
    try {
      // Проверяем, есть ли уже колоды в базе данных
      const count = await this.deckModel.countDocuments().exec();
      if (count > 0) {
        this.logger.log(
          'Колоды уже существуют в базе данных. Пропускаем заполнение.',
        );
        return;
      }

      // Если колод нет, добавляем примеры
      await this.deckModel.insertMany(SAMPLE_DECKS);
      this.logger.log(
        `Успешно добавлено ${SAMPLE_DECKS.length} колод в базу данных.`,
      );
    } catch (error) {
      this.logger.error(
        `Ошибка при заполнении базы данных: ${error.message}`,
        error.stack,
      );
    }
  }
}
