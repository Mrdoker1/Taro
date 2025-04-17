import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeepseekRequestDto } from './dto/deepseek-request.dto';
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

  async processPrompt(dto: DeepseekRequestDto) {
    try {
      // Проверка на пустой запрос
      if (!dto.prompt || dto.prompt.trim() === '') {
        throw new BadRequestException('Запрос не может быть пустым');
      }

      // Используем предустановленный системный промт
      const systemPrompt = SYSTEM_PROMPT;

      // Формируем запрос пользователя, добавляя знак зодиака, если он указан
      let userPrompt = dto.prompt;
      if (dto.zodiacSign) {
        userPrompt = `Знак зодиака: ${dto.zodiacSign}\nВопрос: ${dto.prompt}`;
      }

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
        temperature: dto.temperature || 0.7, // Оптимальная температура для конкретных задач
        max_tokens: MAX_OUTPUT_TOKENS,
        response_format: { type: 'json_object' }, // Принудительно требуем JSON формат
      });

      const responseText = completion.choices[0].message.content;
      // Парсим ответ как JSON и проверяем его структуру
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText || '{}');
        // Проверка на наличие обязательного поля message
        if (!parsedResponse.message && !parsedResponse.error) {
          parsedResponse = {
            error: true,
            message: 'Ответ не содержит обязательного поля message',
          };
        } else if (!parsedResponse.error) {
          // Явно устанавливаем error: false для успешных ответов
          parsedResponse.error = false;
        }
      } catch {
        // Если не удалось распарсить JSON, возвращаем ошибку
        parsedResponse = {
          error: true,
          message: 'Не удалось получить корректный ответ в формате JSON',
          rawResponse: responseText,
        };
      }
      return {
        ...parsedResponse,
        tokens: completion.usage?.total_tokens || 0,
        model: 'deepseek-chat',
        zodiacSign: dto.zodiacSign || null, // Добавляем знак зодиака в ответ
      };
    } catch (error) {
      this.logger.error(`DeepSeek API error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
