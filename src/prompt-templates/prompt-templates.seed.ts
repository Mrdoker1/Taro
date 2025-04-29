import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PromptTemplate,
  PromptTemplateDocument,
} from './schemas/prompt-template.schema';

@Injectable()
export class PromptTemplatesSeed {
  private readonly logger = new Logger(PromptTemplatesSeed.name);

  constructor(
    @InjectModel(PromptTemplate.name)
    private promptTemplateModel: Model<PromptTemplateDocument>,
  ) {}

  /**
   * Создает начальные данные для шаблонов запросов
   */
  async seed(): Promise<void> {
    const count = await this.promptTemplateModel.countDocuments().exec();

    if (count === 0) {
      this.logger.log('Начато создание начальных данных для шаблонов запросов');

      const seedData = this.getSeedData();

      for (const template of seedData) {
        await this.promptTemplateModel.create(template);
      }

      this.logger.log(`Создано ${seedData.length} шаблонов запросов`);
    } else {
      this.logger.log('Шаблоны запросов уже существуют в базе данных');
    }
  }

  /**
   * Возвращает данные для начального заполнения
   */
  private getSeedData(): Partial<PromptTemplate>[] {
    return [
      /* ── 1. Одна карта ── */
      {
        key: 'one-card',
        temperature: 0.7,
        maxTokens: 800,
        responseLang: 'russian',
        systemPromt: `Ты — профессиональный таролог. Отвечай ТОЛЬКО на вопросы о таро, предсказаниях и эзотерике.
          ФОРМАТ ОТВЕТА (JSON):
          {
            "message":  "общее толкование карты",
            "positions": [ { "index": 1, "interpretation": "…" } ]
          }

          Если вопрос не относится к таро — верни { "error": true, "message": "Ваш вопрос не относится к таро…" }. Без markdown, ≤ 800 токенов.`,
        prompt: `Вопрос пользователя: Как мне улучшить финансовую ситуацию?
          Расклад: Одна карта
          Карты и позиции:
          1. Карта дня — Major_The_Magician

          Сформируй ответ строго по описанному JSON-формату.`,
      },

      /* ── 2. Три карты ── */
      {
        key: 'three-cards',
        temperature: 0.7,
        maxTokens: 900,
        responseLang: 'russian',
        systemPromt:
          'Ты — эксперт по раскладу «Прошлое / Настоящее / Будущее». Отвечай ТОЛЬКО на вопросы по таро.\n\nФОРМАТ ОТВЕТА (JSON):\n{\n  "message":  "общее толкование трёх карт",\n  "positions": [ { "index": 1, "interpretation": "…" }, { "index": 2, "interpretation": "…" }, { "index": 3, "interpretation": "…" } ]\n}\n\nЕсли вопрос не по теме — верни объект ошибки. Без markdown, ≤ 900 токенов.',
      },

      /* ── 3. Ло Шу ── */
      {
        key: 'lo-shu',
        temperature: 0.75,
        maxTokens: 1000,
        responseLang: 'russian',
        systemPromt:
          'Ты — эксперт по раскладу «Ло Шу» (магический квадрат 3×3). Отвечай ТОЛЬКО на вопросы о таро.\n\nФОРМАТ ОТВЕТА (JSON):\n{\n  "message":  "общее толкование девяти карт",\n  "positions": [ { "index": 1, "interpretation": "…" }, … { "index": 9, "interpretation": "…" } ]\n}\n\nЕсли вопрос не по теме — верни объект ошибки. Без markdown, ≤ 1000 токенов.',
      },

      /* ── 4. Ежедневный гороскоп ── */
      {
        key: 'daily-horoscope',
        temperature: 0.7,
        maxTokens: 400,
        responseLang: 'russian',
        systemPromt: `Ты — профессиональный астролог. Отвечай ТОЛЬКО про знаки зодиака и гороскопы.
          ФОРМАТ ОТВЕТА (JSON, без markdown):
          {
            "sign":        "<знак>",
            "date":        "<YYYY-MM-DD>",
            "prediction":  "<краткий прогноз на день>",
            "mood":        "<эмодзи>",
            "color":       "<случайный hex-код цвета, напр. #FF0000>",
            "number":      "<любое целое число от 1 до 100>"
          }

          Заполни поля, используя metadata (zodiacSign, horoscopeDate). Используй ТОЧНО ту дату, которая указана в horoscopeDate. Никаких лишних полей.`,
        prompt: `Сгенерируй дневной гороскоп, опираясь на переданные метаданные.`,
      },

      /* ── 5. Недельный гороскоп ── */
      {
        key: 'weekly-horoscope',
        temperature: 0.7,
        maxTokens: 450,
        responseLang: 'russian',
        systemPromt: `Ты — профессиональный астролог. Отвечай ТОЛЬКО про знаки зодиака и гороскопы.
          ФОРМАТ ОТВЕТА (JSON, без markdown):
          {
            "sign":        "<знак>",
            "week":        "<YYYY-Www>",
            "prediction":  "<краткий прогноз на неделю>",
            "mood":        "<эмодзи>",
            "color":       "<случайный hex-код цвета, напр. #FF0000>",
            "number":      "<любое целое число от 1 до 100>"
          }

          Заполни поля, используя metadata (zodiacSign, horoscopeWeek). Используй ТОЧНО ту неделю, которая указана в horoscopeWeek. Никаких лишних полей.`,
        prompt: `Сгенерируй недельный гороскоп, опираясь на переданные метаданные.`,
      },

      /* ── 6. Месячный гороскоп ── */
      {
        key: 'monthly-horoscope',
        temperature: 0.7,
        maxTokens: 500,
        responseLang: 'russian',
        systemPromt: `Ты — профессиональный астролог. Отвечай ТОЛЬКО про знаки зодиака и гороскопы.
          ФОРМАТ ОТВЕТА (JSON, без markdown):
          {
            "sign":        "<знак>",
            "month":       "<YYYY-MM>",
            "prediction":  "<краткий прогноз на месяц>",
            "mood":        "<эмодзи>",
            "color":       "<случайный hex-код цвета, напр. #FF0000>",
            "number":      "<любое целое число от 1 до 100>"
          }

          Заполни поля, используя metadata (zodiacSign, horoscopeMonth). Используй ТОЧНО тот месяц, который указан в horoscopeMonth. Никаких лишних полей.`,
        prompt: `Сгенерируй месячный гороскоп, опираясь на переданные метаданные.`,
      },
    ];
  }
}
