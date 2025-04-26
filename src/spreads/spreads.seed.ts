import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Spread, SpreadDocument } from './schemas/spread.schema';

@Injectable()
export class SpreadsSeed {
  private readonly logger = new Logger(SpreadsSeed.name);

  constructor(
    @InjectModel(Spread.name) private spreadModel: Model<SpreadDocument>,
  ) {}

  /**
   * Создает начальные данные для раскладов
   */
  async seed(): Promise<void> {
    const count = await this.spreadModel.countDocuments().exec();

    if (count === 0) {
      this.logger.log('Начато создание начальных данных для раскладов');

      const seedData = this.getSeedData();

      for (const spread of seedData) {
        await this.spreadModel.create(spread);
      }

      this.logger.log(`Создано ${seedData.length} раскладов`);
    } else {
      this.logger.log('Расклады уже существуют в базе данных');
    }
  }

  /**
   * Возвращает данные для начального заполнения
   */
  private getSeedData(): Partial<Spread>[] {
    return [
      /* ─────────── 1. Одна карта ─────────── */
      {
        key: 'one-card',
        available: true,
        paid: false,
        translations: {
          ru: {
            name: 'Одна карта',
            description: 'Простой ежедневный прогноз.',
          },
          en: { name: 'One Card', description: 'Simple daily forecast.' },
        },
        questions: {
          ru: [
            'Какие перемены ждут меня в ближайшем будущем?',
            'Что мешает мне достичь целей?',
            'Какие качества мне нужно развивать?',
          ],
          en: [
            'What changes await me in the near future?',
            'What is preventing me from achieving my goals?',
            'What qualities do I need to develop?',
          ],
        },
        cardsCount: 1,
        grid: [[1]],
        meta: {
          1: { label: { ru: 'Карта дня', en: 'Daily card' } },
        },
      },

      /* ─────────── 2. Три карты ─────────── */
      {
        key: 'three-cards',
        available: true,
        paid: false,
        translations: {
          ru: {
            name: 'Три карты',
            description: 'Прошлое, настоящее, будущее.',
          },
          en: { name: 'Three Cards', description: 'Past, present, future.' },
        },
        questions: {
          ru: [
            'Что влияет на моё прошлое?',
            'Какие факторы определяют моё настоящее?',
            'Что ждёт меня в будущем?',
          ],
          en: [
            'What influences my past?',
            'What factors define my present?',
            'What awaits me in the future?',
          ],
        },
        cardsCount: 3,
        grid: [[1, 2, 3]],
        meta: {
          1: { label: { ru: 'Прошлое', en: 'Past' } },
          2: { label: { ru: 'Настоящее', en: 'Present' } },
          3: { label: { ru: 'Будущее', en: 'Future' } },
        },
      },

      /* ─────────── 3. Ло Шу ─────────── */
      {
        key: 'lo-shu',
        available: true,
        paid: false,
        translations: {
          ru: {
            name: 'Ло Шу',
            description:
              'Баланс Неба, Человека и Земли — от внешнего к внутреннему.',
          },
          en: {
            name: 'Lo Shu Magic Square',
            description:
              'Balancing Heaven, Human and Earth from outer to inner.',
          },
        },
        questions: {
          ru: [
            'Где проявляются внешние влияния на ситуацию?',
            'Что является ядром текущего состояния?',
            'Как со-настроить внутренние ресурсы с внешним миром?',
          ],
          en: [
            'Where do outer influences appear in the situation?',
            'What is the core of the current state?',
            'How can inner resources be aligned with the outer world?',
          ],
        },
        cardsCount: 9,
        grid: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        meta: {
          1: { label: { ru: 'Небо — внешнее', en: 'Heaven-outer' } },
          2: { label: { ru: 'Небо — центр', en: 'Heaven-center' } },
          3: { label: { ru: 'Небо — внутреннее', en: 'Heaven-inner' } },
          4: { label: { ru: 'Человек — внешнее', en: 'Human-outer' } },
          5: { label: { ru: 'Суть ситуации', en: 'Core issue' } },
          6: { label: { ru: 'Человек — внутреннее', en: 'Human-inner' } },
          7: { label: { ru: 'Земля — внешнее', en: 'Earth-outer' } },
          8: { label: { ru: 'Земля — центр', en: 'Earth-center' } },
          9: { label: { ru: 'Земля — внутреннее', en: 'Earth-inner' } },
        },
      },
    ];
  }
}
