import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyHoroscopeResponseDto } from './schemas/daily-horoscope.schema';
import { DeepseekService } from '../deepseek/deepseek.service';
import { PromptTemplatesService } from '../prompt-templates/prompt-templates.service';
import { Horoscope } from './schemas/horoscope.schema';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Moscow');

@Injectable()
export class HoroscopeService {
  constructor(
    @InjectModel(Horoscope.name) private horoscopeModel: Model<Horoscope>,
    private readonly deepseekService: DeepseekService,
    private readonly promptTemplatesService: PromptTemplatesService,
  ) {}

  private normalizeDate(day: string): string {
    if (day === 'TODAY') {
      return dayjs().tz().format('YYYY-MM-DD');
    }
    if (day === 'TOMORROW') {
      return dayjs().tz().add(1, 'day').format('YYYY-MM-DD');
    }
    if (day === 'YESTERDAY') {
      return dayjs().tz().subtract(1, 'day').format('YYYY-MM-DD');
    }
    return day;
  }

  async getDailyHoroscope(
    sign: string,
    day: string = 'TODAY',
  ): Promise<DailyHoroscopeResponseDto> {
    const normalizedDate = this.normalizeDate(day);

    // Поиск в базе данных
    const existingHoroscope = await this.horoscopeModel.findOne({
      sign,
      date: normalizedDate,
    });

    if (existingHoroscope) {
      return existingHoroscope;
    }

    try {
      // Получение шаблона промпта
      const promptTemplate =
        await this.promptTemplatesService.getTemplateById('daily-horoscope');

      // Генерация гороскопа через LLM
      const horoscope = await this.deepseekService.generate({
        prompt: promptTemplate.systemPromt,
        systemPrompt: promptTemplate.systemPromt,
        zodiacSign: sign,
        horoscopeDate: normalizedDate,
        responseLang: 'russian',
        temperature: promptTemplate.temperature,
        maxTokens: promptTemplate.maxTokens,
      });

      // Сохранение в базу данных
      const savedHoroscope = await this.horoscopeModel.create({
        ...horoscope,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return savedHoroscope;
    } catch (error) {
      if (error.status === 429) {
        throw new HttpException(
          'Temporarily unable to generate new horoscopes',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        'Unexpected server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
