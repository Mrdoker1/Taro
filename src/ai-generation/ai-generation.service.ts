import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateRequestDto } from './dto/generate-request.dto';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  AI_PROVIDER,
  DEFAULT_AI_PROVIDER,
  SYSTEM_PROMPT,
  MAX_OUTPUT_TOKENS,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_DEEPSEEK_MODEL,
  DEFAULT_OPENAI_MODEL,
  DEFAULT_GROK_MODEL,
} from './constants';

@Injectable()
export class AiGenerationService {
  private readonly logger = new Logger(AiGenerationService.name);
  private readonly deepseekClient: OpenAI;
  private readonly openaiClient: OpenAI;
  private readonly grokClient: OpenAI;
  private readonly googleClient: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    // Инициализация DeepSeek клиента
    this.deepseekClient = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: this.configService.get<string>('DEEPSEEKAPI'),
    });

    // Инициализация OpenAI клиента
    this.openaiClient = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    // Инициализация Grok клиента
    this.grokClient = new OpenAI({
      baseURL: 'https://api.x.ai/v1',
      apiKey: this.configService.get<string>('GROK_API_KEY'),
    });

    // Инициализация Google клиента
    const googleApiKey = this.configService.get<string>('GOOGLEAPI');
    if (googleApiKey) {
      this.googleClient = new GoogleGenerativeAI(googleApiKey);
    }
  }

  /**
   * Основной метод для генерации контента через выбранный AI провайдер
   * @param dto Данные запроса
   * @returns Результат генерации (возвращает тот же формат, что и DeepSeek)
   */
  async generate(dto: GenerateRequestDto): Promise<any> {
    const startTime = Date.now();

    try {
      // Проверка на пустой запрос
      if (!dto.prompt || dto.prompt.trim() === '') {
        throw new BadRequestException('Запрос не может быть пустым');
      }

      // Определяем провайдера (из запроса или по умолчанию)
      const provider = dto.provider || DEFAULT_AI_PROVIDER;

      // Подготавливаем общие параметры
      const systemPrompt = dto.systemPrompt || SYSTEM_PROMPT;
      const maxTokens = dto.maxTokens || MAX_OUTPUT_TOKENS;
      let userPrompt = dto.prompt;

      // Добавляем дополнительную информацию к промту
      if (dto.zodiacSign) {
        userPrompt = `Знак зодиака: ${dto.zodiacSign}\n${userPrompt}`;
      }
      if (dto.horoscopeDate) {
        userPrompt = `Дата гороскопа: ${dto.horoscopeDate}\n${userPrompt}`;
      }
      if (dto.horoscopeWeek) {
        userPrompt = `Неделя гороскопа: ${dto.horoscopeWeek}\n${userPrompt}`;
      }
      if (dto.horoscopeMonth) {
        userPrompt = `Месяц гороскопа: ${dto.horoscopeMonth}\n${userPrompt}`;
      }
      if (dto.responseLang && dto.responseLang !== 'ru') {
        userPrompt = `${userPrompt}\n\nОтветь на ${dto.responseLang} языке.`;
      }

      let baseResult: string;

      // Выбираем провайдера и генерируем контент
      switch (provider) {
        case AI_PROVIDER.DEEPSEEK:
          baseResult = await this.generateWithDeepSeek(
            systemPrompt,
            userPrompt,
            dto,
            maxTokens,
          );
          break;

        case AI_PROVIDER.OPENAI:
          baseResult = await this.generateWithOpenAI(
            systemPrompt,
            userPrompt,
            dto,
            maxTokens,
          );
          break;

        case AI_PROVIDER.GROK:
          baseResult = await this.generateWithGrok(
            systemPrompt,
            userPrompt,
            dto,
            maxTokens,
          );
          break;

        case AI_PROVIDER.GOOGLE:
          baseResult = await this.generateWithGoogle(
            systemPrompt,
            userPrompt,
            dto,
            maxTokens,
          );
          break;

        default:
          throw new BadRequestException(
            `Неподдерживаемый провайдер: ${provider as string}`,
          );
      }

      // Парсим ответ как JSON (как это делал DeepSeek)
      try {
        let jsonString = baseResult;

        // Если ответ в markdown блоке, извлекаем JSON
        const jsonMatch = baseResult.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        }

        const parsedResponse = JSON.parse(jsonString);
        this.logger.log(
          `Сгенерирован контент через ${provider}, время: ${Date.now() - startTime}ms`,
        );
        return parsedResponse;
      } catch {
        // Если не удалось распарсить JSON, возвращаем ошибку
        return {
          error: true,
          message: 'Не удалось получить корректный ответ в формате JSON',
          rawResponse: baseResult,
        };
      }
    } catch (error) {
      this.logger.error(
        `Ошибка при генерации контента: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Генерация через DeepSeek
   */
  private async generateWithDeepSeek(
    systemPrompt: string,
    userPrompt: string,
    dto: GenerateRequestDto,
    maxTokens: number,
  ): Promise<string> {
    const model = dto.deepseekModel || DEFAULT_DEEPSEEK_MODEL;

    const completion = await this.deepseekClient.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: dto.temperature || 0.7,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const content = completion.choices[0]?.message?.content || '';

    return content;
  }

  /**
   * Генерация через OpenAI
   */
  private async generateWithOpenAI(
    systemPrompt: string,
    userPrompt: string,
    dto: GenerateRequestDto,
    maxTokens: number,
  ): Promise<string> {
    if (!this.openaiClient) {
      throw new BadRequestException('OpenAI API ключ не настроен');
    }

    const model = dto.openaiModel || DEFAULT_OPENAI_MODEL;

    const completion = await this.openaiClient.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: dto.temperature || 0.7,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const content = completion.choices[0]?.message?.content || '';

    return content;
  }

  /**
   * Генерация через Grok (xAI)
   */
  private async generateWithGrok(
    systemPrompt: string,
    userPrompt: string,
    dto: GenerateRequestDto,
    maxTokens: number,
  ): Promise<string> {
    if (!this.grokClient) {
      throw new BadRequestException('Grok API ключ не настроен');
    }

    const model = dto.grokModel || DEFAULT_GROK_MODEL;

    // Grok API поддерживает только базовые параметры
    // Увеличиваем лимит токенов для Grok, чтобы избежать обрезания JSON
    const requestParams: any = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: dto.temperature || 0.7,
      max_tokens: Math.max(maxTokens, 1200), // Минимум 1200 токенов для полного JSON
      // Убираем неподдерживаемые параметры для Grok
      // top_p, frequency_penalty, presence_penalty не поддерживаются
    };

    const completion =
      await this.grokClient.chat.completions.create(requestParams);

    const content = completion.choices[0]?.message?.content || '';

    return content;
  }

  /**
   * Генерация через Google Gemini
   */
  private async generateWithGoogle(
    systemPrompt: string,
    userPrompt: string,
    dto: GenerateRequestDto,
    maxTokens: number,
  ): Promise<string> {
    if (!this.googleClient) {
      throw new BadRequestException('Google API ключ не настроен');
    }

    const model = dto.geminiModel || DEFAULT_GEMINI_MODEL;
    const geminiModel = this.googleClient.getGenerativeModel({ model });

    // Объединяем системный и пользовательский промт для Gemini
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: dto.temperature || 0.7,
        maxOutputTokens: maxTokens,
        topP: 1,
      },
    });

    const response = result.response;
    const content = response.text() || '';

    return content;
  }
}
