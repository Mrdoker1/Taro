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
      this.logger.log('Обновление существующих раскладов...');

      const seedData = this.getSeedData();

      for (const spread of seedData) {
        await this.spreadModel.updateOne(
          { key: spread.key },
          { $set: spread },
          { upsert: true },
        );
      }

      this.logger.log(`Обновлено/создано ${seedData.length} раскладов`);
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
        imageURL: 'https://i.ibb.co/sJNzV60L/Image.png',
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
        imageURL: 'https://i.ibb.co/twLp8jP5/Image-2.png',
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
        imageURL: 'https://i.ibb.co/prbNMpfq/Image.png',
      },
      /* ─────────── 4. Ступени Решения ─────────── */
      {
        key: 'decision-steps',
        available: true,
        paid: false,
        translations: {
          ru: {
            name: 'Ступени Решения',
            description:
              'Десять шагов от контекста и ресурсов к выбору и действию. Чтение змейкой: верхний ряд → правый край → нижний ряд влево.',
          },
          en: {
            name: 'Decision Steps',
            description:
              'Ten steps from context and resources to choice and action. Serpentine reading: top row → right edge → bottom row leftwards.',
          },
        },
        questions: {
          ru: [
            'Каков текущий контекст и отправная точка?',
            'Что даёт импульс/мотивацию?',
            'Какие ресурсы доступны прямо сейчас?',
            'Что тормозит или ограничивает?',
            'Какая возможность уже на горизонте?',
            'В чём суть выбора/порог решения?',
            'Какой практический шаг сделать первым?',
            'На чью поддержку можно опереться?',
            'Как снизить риск и цену ошибки?',
            'Каков ближайший результат и урок?',
          ],
          en: [
            'What is the current context and starting point?',
            'What provides the impulse/motivation?',
            'Which resources are immediately available?',
            'What slows down or limits you?',
            'Which opportunity is already on the horizon?',
            'What is the decision threshold/core choice?',
            'What practical first step to take?',
            'Whose support can you rely on?',
            'How to mitigate risk and cost?',
            'What is the near-term result and lesson?',
          ],
        },
        cardsCount: 10,
        // Порядок выкладки: 1–2–3–4–5 (верхний ряд), затем 6–7–8–9–10 (нижний ряд справа-налево)
        grid: [
          [1, 2, 3, 4, 5],
          [10, 9, 8, 7, 6],
        ],
        meta: {
          1: { label: { ru: 'Контекст', en: 'Context' } },
          2: { label: { ru: 'Импульс', en: 'Impulse' } },
          3: { label: { ru: 'Ресурсы', en: 'Resources' } },
          4: { label: { ru: 'Ограничение', en: 'Constraint' } },
          5: { label: { ru: 'Возможность', en: 'Opportunity' } },
          6: { label: { ru: 'Порог решения', en: 'Decision threshold' } },
          7: { label: { ru: 'Первый шаг', en: 'First step' } },
          8: { label: { ru: 'Поддержка', en: 'Support' } },
          9: { label: { ru: 'Снижение риска', en: 'Risk mitigation' } },
          10: { label: { ru: 'Исход и урок', en: 'Outcome & lesson' } },
        },
        imageURL: 'https://i.ibb.co/mVHSdZMq/image-163.png',
      },
    ];
  }
}
