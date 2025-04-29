import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateRequestDto } from './dto/generate-request.dto';
import OpenAI from 'openai';
import { SYSTEM_PROMPT, MAX_OUTPUT_TOKENS } from './constants';

@Injectable()
export class DeepseekService {
  private readonly logger = new Logger(DeepseekService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: this.configService.get<string>('DEEPSEEKAPI'),
    });
  }

  /**
   * Обрабатывает запрос на генерацию контента по переданному промту
   * @param dto Данные запроса
   * @returns Результат генерации
   */
  async generate(dto: GenerateRequestDto) {
    try {
      // Проверка на пустой запрос
      if (!dto.prompt || dto.prompt.trim() === '') {
        throw new BadRequestException('Запрос не может быть пустым');
      }

      // Используем системный промт из запроса, учитывая альтернативное написание
      const systemPrompt = dto.systemPrompt || dto.systemPromt || SYSTEM_PROMPT;

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

      // Выполняем запрос к API DeepSeek
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        model: 'deepseek-chat',
        temperature: dto.temperature || 0.7,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }, // Требуем JSON формат
      });

      const responseText = completion.choices[0].message.content;

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
      this.logger.error(`DeepSeek API error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
