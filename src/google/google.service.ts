import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerateRequestDto } from './dto/generate-request.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, MAX_OUTPUT_TOKENS, DEFAULT_MODEL } from './constants';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLEAPI');
    if (!apiKey) {
      throw new Error('GOOGLEAPI key is not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Обрабатывает запрос на генерацию контента по переданному промту через Google Gemini
   * @param dto Данные запроса
   * @returns Результат генерации
   */
  async generate(dto: GoogleGenerateRequestDto) {
    try {
      // Проверка на пустой запрос
      if (!dto.prompt || dto.prompt.trim() === '') {
        throw new BadRequestException('Запрос не может быть пустым');
      }

      // Используем системный промт из запроса или дефолтный
      const systemPrompt = dto.systemPrompt || SYSTEM_PROMPT;

      // Формируем запрос пользователя, добавляя знак зодиака, если он указан
      let userPrompt = dto.prompt;
      if (dto.zodiacSign) {
        userPrompt = `Знак зодиака: ${dto.zodiacSign}\n${userPrompt}`;
      }
      if (dto.horoscopeDate) {
        userPrompt = `Дата гороскопа: ${dto.horoscopeDate}\n${userPrompt}`;
      }

      // Добавляем информацию о языке ответа, если указан
      if (dto.responseLang && dto.responseLang !== 'ru') {
        userPrompt = `${userPrompt}\n\nОтветь на ${dto.responseLang} языке.`;
      }

      // Определяем максимальное количество токенов
      const maxTokens = dto.maxTokens || MAX_OUTPUT_TOKENS;

      // Определяем модель
      const modelName = dto.model || DEFAULT_MODEL;

      // Получаем модель Google Gemini
      const model = this.genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: dto.temperature || 0.7,
          maxOutputTokens: maxTokens,
          responseMimeType: 'application/json',
        },
        systemInstruction: systemPrompt,
      });

      // Выполняем запрос к Google Gemini API
      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();

      // Парсим ответ как JSON
      try {
        const parsedResponse = JSON.parse(responseText || '{}');

        // Возвращаем чистый ответ от модели без дополнительных метаданных
        return parsedResponse;
      } catch {
        // Если не удалось распарсить JSON, возвращаем ошибку
        return {
          error: true,
          message: 'Не удалось получить корректный ответ в формате JSON',
          rawResponse: responseText,
        };
      }
    } catch (error) {
      this.logger.error(
        `Google Gemini API error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
