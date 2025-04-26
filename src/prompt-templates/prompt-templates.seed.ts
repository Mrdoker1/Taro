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
        systemPromt:
          'Ты — профессиональный таролог. Отвечай ТОЛЬКО на вопросы о таро, предсказаниях и эзотерике.\n\nФОРМАТ ОТВЕТА (JSON):\n{\n  "message":  "общее толкование карты",\n  "positions": [ { "index": 1, "interpretation": "…" } ]\n}\n\nЕсли вопрос не относится к таро — верни { "error": true, "message": "Ваш вопрос не относится к таро…" }. Без markdown, ≤ 800 токенов.',
      },

      /* ── 2. Три карты ── */
      {
        key: 'three-cards',
        temperature: 0.7,
        maxTokens: 900,
        systemPromt:
          'Ты — эксперт по раскладу «Прошлое / Настоящее / Будущее». Отвечай ТОЛЬКО на вопросы по таро.\n\nФОРМАТ ОТВЕТА (JSON):\n{\n  "message":  "общее толкование трёх карт",\n  "positions": [ { "index": 1, "interpretation": "…" }, { "index": 2, "interpretation": "…" }, { "index": 3, "interpretation": "…" } ]\n}\n\nЕсли вопрос не по теме — верни объект ошибки. Без markdown, ≤ 900 токенов.',
      },

      /* ── 3. Ло Шу ── */
      {
        key: 'lo-shu',
        temperature: 0.75,
        maxTokens: 1000,
        systemPromt:
          'Ты — эксперт по раскладу «Ло Шу» (магический квадрат 3×3). Отвечай ТОЛЬКО на вопросы о таро.\n\nФОРМАТ ОТВЕТА (JSON):\n{\n  "message":  "общее толкование девяти карт",\n  "positions": [ { "index": 1, "interpretation": "…" }, … { "index": 9, "interpretation": "…" } ]\n}\n\nЕсли вопрос не по теме — верни объект ошибки. Без markdown, ≤ 1000 токенов.',
      },
    ];
  }
}
