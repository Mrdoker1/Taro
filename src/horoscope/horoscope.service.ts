import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyHoroscopeResponseDto } from './schemas/daily-horoscope.schema';
import { AiGenerationService } from '../ai-generation/ai-generation.service';
import { PromptTemplatesService } from '../prompt-templates/prompt-templates.service';
import { Horoscope } from './schemas/horoscope.schema';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { WeeklyHoroscopeResponseDto } from './schemas/weekly-horoscope.schema';
import { MonthlyHoroscopeResponseDto } from './schemas/monthly-horoscope.schema';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Moscow');

@Injectable()
export class HoroscopeService {
  constructor(
    @InjectModel(Horoscope.name) private horoscopeModel: Model<Horoscope>,
    private readonly aiGenerationService: AiGenerationService,
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

  private getCurrentWeek(): string {
    return dayjs().tz().format('YYYY-[W]WW');
  }

  private getCurrentMonth(): string {
    return dayjs().tz().format('YYYY-MM');
  }

  async getDailyHoroscope(
    sign: string,
    day: string = 'TODAY',
    lang: string = 'russian',
  ): Promise<DailyHoroscopeResponseDto> {
    const normalizedDate = this.normalizeDate(day);

    // Поиск в базе данных
    const existingHoroscope = await this.horoscopeModel.findOne({
      sign,
      date: normalizedDate,
      lang,
    });

    if (existingHoroscope) {
      if (!existingHoroscope.date) {
        throw new HttpException(
          'Unexpected server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        sign: existingHoroscope.sign,
        date: existingHoroscope.date,
        prediction: existingHoroscope.prediction,
        mood: existingHoroscope.mood,
        color: existingHoroscope.color,
        number: existingHoroscope.number,
      };
    }

    try {
      // Получение шаблона промпта
      const promptTemplate =
        await this.promptTemplatesService.getTemplateById('daily-horoscope');

      // Генерация гороскопа через LLM
      const horoscope = await this.aiGenerationService.generate({
        prompt: promptTemplate.systemPrompt,
        systemPrompt: promptTemplate.systemPrompt,
        zodiacSign: sign,
        horoscopeDate: normalizedDate,
        responseLang: lang,
        temperature: promptTemplate.temperature,
        maxTokens: promptTemplate.maxTokens,
      });

      // Сохранение в базу данных
      const savedHoroscope = await this.horoscopeModel.create({
        ...horoscope,
        date: normalizedDate,
        lang,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!savedHoroscope.date) {
        throw new HttpException(
          'Unexpected server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        sign: savedHoroscope.sign,
        date: savedHoroscope.date,
        prediction: savedHoroscope.prediction,
        mood: savedHoroscope.mood,
        color: savedHoroscope.color,
        number: savedHoroscope.number,
      };
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

  async getWeeklyHoroscope(
    sign: string,
    lang: string = 'russian',
  ): Promise<WeeklyHoroscopeResponseDto> {
    const currentWeek = this.getCurrentWeek();

    // Поиск в базе данных
    const existingHoroscope = await this.horoscopeModel.findOne({
      sign,
      week: currentWeek,
      lang,
    });

    if (existingHoroscope) {
      if (!existingHoroscope.week) {
        throw new HttpException(
          'Unexpected server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        sign: existingHoroscope.sign,
        week: existingHoroscope.week,
        prediction: existingHoroscope.prediction,
        mood: existingHoroscope.mood,
        color: existingHoroscope.color,
        number: existingHoroscope.number,
      };
    }

    try {
      // Получение шаблона промпта
      const promptTemplate =
        await this.promptTemplatesService.getTemplateById('weekly-horoscope');

      // Генерация гороскопа через LLM
      const horoscope = await this.aiGenerationService.generate({
        prompt: promptTemplate.systemPrompt,
        systemPrompt: promptTemplate.systemPrompt,
        zodiacSign: sign,
        horoscopeWeek: currentWeek,
        responseLang: lang,
        temperature: promptTemplate.temperature,
        maxTokens: promptTemplate.maxTokens,
      });

      // Сохранение в базу данных
      const savedHoroscope = await this.horoscopeModel.create({
        ...horoscope,
        week: currentWeek,
        lang,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!savedHoroscope.week) {
        throw new HttpException(
          'Unexpected server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        sign: savedHoroscope.sign,
        week: savedHoroscope.week,
        prediction: savedHoroscope.prediction,
        mood: savedHoroscope.mood,
        color: savedHoroscope.color,
        number: savedHoroscope.number,
      };
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

  async getMonthlyHoroscope(
    sign: string,
    lang: string = 'russian',
  ): Promise<MonthlyHoroscopeResponseDto> {
    const currentMonth = this.getCurrentMonth();

    // Поиск в базе данных
    const existingHoroscope = await this.horoscopeModel.findOne({
      sign,
      month: currentMonth,
      lang,
    });

    if (existingHoroscope) {
      if (!existingHoroscope.month) {
        throw new HttpException(
          'Unexpected server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        sign: existingHoroscope.sign,
        month: existingHoroscope.month,
        prediction: existingHoroscope.prediction,
        mood: existingHoroscope.mood,
        color: existingHoroscope.color,
        number: existingHoroscope.number,
      };
    }

    try {
      // Получение шаблона промпта
      const promptTemplate =
        await this.promptTemplatesService.getTemplateById('monthly-horoscope');

      // Генерация гороскопа через LLM
      const horoscope = await this.aiGenerationService.generate({
        prompt: promptTemplate.systemPrompt,
        systemPrompt: promptTemplate.systemPrompt,
        zodiacSign: sign,
        horoscopeMonth: currentMonth,
        responseLang: lang,
        temperature: promptTemplate.temperature,
        maxTokens: promptTemplate.maxTokens,
      });

      // Сохранение в базу данных
      const savedHoroscope = await this.horoscopeModel.create({
        ...horoscope,
        month: currentMonth,
        lang,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!savedHoroscope.month) {
        throw new HttpException(
          'Unexpected server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        sign: savedHoroscope.sign,
        month: savedHoroscope.month,
        prediction: savedHoroscope.prediction,
        mood: savedHoroscope.mood,
        color: savedHoroscope.color,
        number: savedHoroscope.number,
      };
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
