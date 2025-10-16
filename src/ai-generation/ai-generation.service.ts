import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateRequestDto } from './dto/generate-request.dto';
import { ChatRequestDto, ChatResponseDto } from './dto/chat-request.dto';
import {
  DocumentAnalysisRequestDto,
  DocumentAnalysisResponseDto,
} from './dto/document-analysis-request.dto';
import {
  MultiDocumentAnalysisRequestDto,
  MultiDocumentAnalysisResponseDto,
  DocumentHighlightDto,
} from './dto/multi-document-analysis-request.dto';
import { PromptTemplatesService } from '../prompt-templates/prompt-templates.service';
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
  DEFAULT_QWEN_MODEL,
} from './constants';

@Injectable()
export class AiGenerationService {
  private readonly logger = new Logger(AiGenerationService.name);
  private readonly deepseekClient: OpenAI;
  private readonly openaiClient: OpenAI;
  private readonly grokClient: OpenAI;
  private readonly qwenClient: OpenAI;
  private readonly googleClient: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly promptTemplatesService: PromptTemplatesService,
  ) {
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

    // Инициализация Qwen клиента
    const qwenApiKey = this.configService.get<string>('QWEN_API_KEY');
    if (qwenApiKey) {
      this.qwenClient = new OpenAI({
        baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
        apiKey: qwenApiKey,
      });
      this.logger.log('Qwen клиент инициализирован');
    } else {
      this.logger.warn('QWEN_API_KEY не найден в конфигурации');
    }

    // Инициализация Google клиента
    const googleApiKey = this.configService.get<string>('GOOGLEAPI');
    if (googleApiKey) {
      this.googleClient = new GoogleGenerativeAI(googleApiKey);
    }
  }

  /**
   * Генерация с автоматической перегенерацией при невалидном JSON
   */
  private async generateWithRetry(
    dto: GenerateRequestDto,
    attempt: number = 1,
    maxAttempts: number = 3,
  ): Promise<any> {
    const startTime = Date.now();

    try {
      const result = await this.performGeneration(dto, startTime);
      return result;
    } catch (error) {
      if (attempt < maxAttempts && error.message?.includes('JSON')) {
        this.logger.warn(
          `Попытка ${attempt}/${maxAttempts} неудачна (невалидный JSON), перегенерируем...`,
        );
        return this.generateWithRetry(dto, attempt + 1, maxAttempts);
      }

      // Если все попытки исчерпаны или другая ошибка
      if (error.message?.includes('JSON') && attempt >= maxAttempts) {
        this.logger.error(
          `Все ${maxAttempts} попытки генерации неудачны - возвращаем ошибку`,
        );
        return {
          error: true,
          message:
            'Не удалось получить корректный ответ после 3 попыток. Попробуйте еще раз.',
          attempts: maxAttempts,
        };
      }

      throw error;
    }
  }

  /**
   * Основной метод для генерации контента через выбранный AI провайдер
   * @param dto Данные запроса
   * @returns Результат генерации (возвращает тот же формат, что и DeepSeek)
   */
  async generate(dto: GenerateRequestDto): Promise<any> {
    return this.generateWithRetry(dto);
  }

  /**
   * Выполняет одну попытку генерации
   */
  private async performGeneration(
    dto: GenerateRequestDto,
    startTime: number,
  ): Promise<any> {
    try {
      // Проверка на пустой запрос
      if (!dto.prompt || dto.prompt.trim() === '') {
        throw new BadRequestException('Запрос не может быть пустым');
      }

      // Определяем провайдера (из запроса или по умолчанию)
      const provider = dto.provider || DEFAULT_AI_PROVIDER;

      // Определяем модель для логирования
      let model: string;
      switch (provider) {
        case AI_PROVIDER.OPENAI:
          model = dto.openaiModel || DEFAULT_OPENAI_MODEL;
          break;
        case AI_PROVIDER.QWEN:
          model = dto.qwenModel || DEFAULT_QWEN_MODEL;
          break;
        case AI_PROVIDER.DEEPSEEK:
          model = dto.deepseekModel || DEFAULT_DEEPSEEK_MODEL;
          break;
        case AI_PROVIDER.GROK:
          model = dto.grokModel || DEFAULT_GROK_MODEL;
          break;
        case AI_PROVIDER.GOOGLE:
          model = dto.geminiModel || DEFAULT_GEMINI_MODEL;
          break;
        default:
          model = 'неизвестная';
      }

      this.logger.log(
        `Генерация: провайдер=${provider}, модель=${model}, температура=${dto.temperature ?? 'default'}`,
      );

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
      if (dto.responseLang) {
        const langMap: Record<string, string> = {
          russian: 'русском',
          english: 'английском',
          ru: 'русском',
          en: 'английском',
        };
        const langName =
          langMap[dto.responseLang.toLowerCase()] || dto.responseLang;

        // Определяем язык для инструкций
        const isEnglish =
          dto.responseLang.toLowerCase() === 'english' ||
          dto.responseLang.toLowerCase() === 'en';

        if (isEnglish) {
          userPrompt = `${userPrompt}\n\nIMPORTANT: Reply in English language. ALL text fields including color name must be in English (e.g., "crimson#DC143C", NOT "малиновый#DC143C").`;
        } else {
          userPrompt = `${userPrompt}\n\nВАЖНО: Отвечай на ${langName} языке. ВСЕ текстовые поля включая название цвета должны быть на русском (например: "малиновый#DC143C", НЕ "crimson#DC143C").`;
        }
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

        case AI_PROVIDER.QWEN:
          baseResult = await this.generateWithQwen(
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

      // Парсим ответ как JSON
      try {
        let jsonString = baseResult;

        // Если ответ в markdown блоке, извлекаем JSON
        const jsonMatch = baseResult.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        }

        const parsedResponse = JSON.parse(jsonString);
        this.logger.log(
          `Сгенерирован контент: ${provider}/${model}, время: ${Date.now() - startTime}ms`,
        );
        return parsedResponse;
      } catch (parseError) {
        // Бросаем ошибку для перегенерации
        this.logger.warn(
          `Невалидный JSON от ${provider}: ${parseError.message}`,
        );
        throw new Error(`JSON parse error: ${parseError.message}`);
      }
    } catch (error) {
      // Для JSON ошибок используем WARN вместо ERROR (это промежуточные ошибки)
      if (error.message?.includes('JSON')) {
        this.logger.warn(`JSON ошибка при генерации: ${error.message}`);
      } else {
        this.logger.error(
          `Ошибка при генерации контента: ${error.message}`,
          error.stack,
        );
      }
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

  /**
   * Генерация через Qwen
   */
  private async generateWithQwen(
    systemPrompt: string,
    userPrompt: string,
    dto: GenerateRequestDto,
    maxTokens: number,
  ): Promise<string> {
    if (!this.qwenClient) {
      throw new BadRequestException(
        'Qwen клиент не инициализирован. Проверьте QWEN_API_KEY',
      );
    }

    const model = dto.qwenModel || DEFAULT_QWEN_MODEL;

    try {
      const completion = await this.qwenClient.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature: dto.temperature,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error(`Ошибка при запросе к Qwen API: ${error.message}`);
      throw error;
    }
  }

  /**
   * Простой чат с AI без шаблонов
   */
  async chat(dto: ChatRequestDto): Promise<ChatResponseDto> {
    const provider = dto.provider || DEFAULT_AI_PROVIDER;
    const temperature = dto.temperature ?? 0.7;
    const maxTokens = dto.maxTokens ?? 1000;

    // Определяем модель для логирования
    let model: string;
    switch (provider) {
      case AI_PROVIDER.OPENAI:
        model = DEFAULT_OPENAI_MODEL;
        break;
      case AI_PROVIDER.QWEN:
        model = DEFAULT_QWEN_MODEL;
        break;
      case AI_PROVIDER.DEEPSEEK:
        model = DEFAULT_DEEPSEEK_MODEL;
        break;
      case AI_PROVIDER.GROK:
        model = DEFAULT_GROK_MODEL;
        break;
      case AI_PROVIDER.GOOGLE:
        model = DEFAULT_GEMINI_MODEL;
        break;
      default:
        model = 'неизвестная';
    }

    this.logger.log(
      `Чат: провайдер=${provider}, модель=${model}, температура=${temperature}, maxTokens=${maxTokens}`,
    );

    let response: string;

    try {
      switch (provider) {
        case AI_PROVIDER.DEEPSEEK:
          response = await this.chatWithDeepSeek(
            dto.message,
            temperature,
            maxTokens,
          );
          break;

        case AI_PROVIDER.OPENAI:
          response = await this.chatWithOpenAI(
            dto.message,
            temperature,
            maxTokens,
          );
          break;

        case AI_PROVIDER.GROK:
          response = await this.chatWithGrok(
            dto.message,
            temperature,
            maxTokens,
          );
          break;

        case AI_PROVIDER.QWEN:
          response = await this.chatWithQwen(
            dto.message,
            temperature,
            maxTokens,
          );
          break;

        case AI_PROVIDER.GOOGLE:
          response = await this.chatWithGoogle(
            dto.message,
            temperature,
            maxTokens,
          );
          break;

        default:
          throw new BadRequestException(
            `Неподдерживаемый провайдер: ${provider as string}`,
          );
      }

      this.logger.log(
        `Чат завершен: ${provider}/${model}, длина ответа: ${response.length} символов`,
      );

      return {
        response,
        provider,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Ошибка в чате с ${provider}: ${error.message}`);
      throw error;
    }
  }

  private async chatWithDeepSeek(
    message: string,
    temperature: number,
    maxTokens: number,
  ): Promise<string> {
    try {
      const completion = await this.deepseekClient.chat.completions.create({
        model: DEFAULT_DEEPSEEK_MODEL,
        messages: [{ role: 'user', content: message }],
        max_tokens: maxTokens,
        temperature: temperature,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error(`Ошибка при запросе к DeepSeek API: ${error.message}`);
      throw error;
    }
  }

  private async chatWithOpenAI(
    message: string,
    temperature: number,
    maxTokens: number,
  ): Promise<string> {
    try {
      const completion = await this.openaiClient.chat.completions.create({
        model: DEFAULT_OPENAI_MODEL,
        messages: [{ role: 'user', content: message }],
        max_tokens: maxTokens,
        temperature: temperature,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error(`Ошибка при запросе к OpenAI API: ${error.message}`);
      throw error;
    }
  }

  private async chatWithGrok(
    message: string,
    temperature: number,
    maxTokens: number,
  ): Promise<string> {
    try {
      const completion = await this.grokClient.chat.completions.create({
        model: DEFAULT_GROK_MODEL,
        messages: [{ role: 'user', content: message }],
        max_tokens: maxTokens,
        temperature: temperature,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error(`Ошибка при запросе к Grok API: ${error.message}`);
      throw error;
    }
  }

  private async chatWithQwen(
    message: string,
    temperature: number,
    maxTokens: number,
  ): Promise<string> {
    try {
      const completion = await this.qwenClient.chat.completions.create({
        model: DEFAULT_QWEN_MODEL,
        messages: [{ role: 'user', content: message }],
        max_tokens: maxTokens,
        temperature: temperature,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error(`Ошибка при запросе к Qwen API: ${error.message}`);
      throw error;
    }
  }

  private async chatWithGoogle(
    message: string,
    temperature: number,
    maxTokens: number,
  ): Promise<string> {
    try {
      const model = this.googleClient.getGenerativeModel({
        model: DEFAULT_GEMINI_MODEL,
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
        },
      });

      const result = await model.generateContent(message);
      const response = result.response;
      return response.text();
    } catch (error) {
      this.logger.error(`Ошибка при запросе к Google API: ${error.message}`);
      throw error;
    }
  }

  /**
   * Глубокий анализ документа с подсветкой полей
   */
  async analyzeDocument(
    dto: DocumentAnalysisRequestDto,
  ): Promise<DocumentAnalysisResponseDto> {
    const startTime = Date.now();

    try {
      const provider = dto.provider || DEFAULT_AI_PROVIDER;

      // Получаем шаблон из базы данных
      const templateKey = dto.templateKey || 'document-analysis';
      const template =
        await this.promptTemplatesService.getTemplateById(templateKey);

      if (!template || !template.prompt) {
        throw new BadRequestException(
          `Шаблон ${templateKey} не найден или не содержит промпт`,
        );
      }

      this.logger.log(
        `Начинаем анализ документа: провайдер=${provider}, шаблон=${templateKey}`,
      );

      // Формируем промпт из шаблона, заменяя плейсхолдеры
      const systemPrompt = template.systemPrompt;
      const userPrompt = template.prompt
        .replace(
          '{document_context}',
          JSON.stringify(dto.documentContext, null, 2),
        )
        .replace('{user_question}', dto.question);

      let result: string;

      // Создаем совместимый объект для методов генерации
      const generateDto = {
        ...dto,
        prompt: userPrompt, // добавляем недостающее поле
        temperature: dto.temperature ?? template.temperature,
      } as GenerateRequestDto;

      // Определяем модель для логирования
      let model: string;
      switch (provider) {
        case AI_PROVIDER.OPENAI:
          model = generateDto.openaiModel || DEFAULT_OPENAI_MODEL;
          break;
        case AI_PROVIDER.QWEN:
          model = generateDto.qwenModel || DEFAULT_QWEN_MODEL;
          break;
        case AI_PROVIDER.DEEPSEEK:
          model = generateDto.deepseekModel || DEFAULT_DEEPSEEK_MODEL;
          break;
        case AI_PROVIDER.GROK:
          model = generateDto.grokModel || DEFAULT_GROK_MODEL;
          break;
        case AI_PROVIDER.GOOGLE:
          model = generateDto.geminiModel || DEFAULT_GEMINI_MODEL;
          break;
        default:
          model = 'неизвестная';
      }

      this.logger.log(
        `Анализ документа: провайдер=${provider}, модель=${model}, температура=${generateDto.temperature}`,
      );

      switch (provider) {
        case AI_PROVIDER.OPENAI:
          result = await this.generateWithOpenAI(
            systemPrompt,
            userPrompt,
            generateDto,
            dto.maxTokens || template.maxTokens,
          );
          break;
        case AI_PROVIDER.QWEN:
          result = await this.generateWithQwen(
            systemPrompt,
            userPrompt,
            generateDto,
            dto.maxTokens || template.maxTokens,
          );
          break;
        case AI_PROVIDER.DEEPSEEK:
          result = await this.generateWithDeepSeek(
            systemPrompt,
            userPrompt,
            generateDto,
            dto.maxTokens || template.maxTokens,
          );
          break;
        case AI_PROVIDER.GROK:
          result = await this.generateWithGrok(
            systemPrompt,
            userPrompt,
            generateDto,
            dto.maxTokens || template.maxTokens,
          );
          break;
        default:
          throw new Error(`Неподдерживаемый провайдер: ${provider}`);
      }

      // Очищаем результат от возможной markdown разметки
      let cleanedResult = result.trim();
      if (cleanedResult.startsWith('```json')) {
        cleanedResult = cleanedResult
          .replace(/^```json\s*/, '')
          .replace(/\s*```$/, '');
      }
      if (cleanedResult.startsWith('```')) {
        cleanedResult = cleanedResult
          .replace(/^```\s*/, '')
          .replace(/\s*```$/, '');
      }

      // Парсим JSON ответ
      let parsedResult;
      try {
        parsedResult = JSON.parse(cleanedResult);
        this.logger.log(
          `Успешно распарсен JSON ответ с ${parsedResult.highlights?.length || 0} подсветками`,
        );
      } catch (error) {
        this.logger.warn(`Не удалось распарсить JSON ответ: ${error.message}`);
        // Если не удалось распарсить, возвращаем как обычный ответ
        parsedResult = {
          answer: cleanedResult,
          highlights: [],
        };
      }

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `Анализ документа завершен за ${processingTime}мс (${provider}/${model}, подсветок: ${parsedResult.highlights?.length || 0})`,
      );

      return {
        answer: parsedResult.answer || cleanedResult,
        highlights: Array.isArray(parsedResult.highlights)
          ? parsedResult.highlights
          : [],
        provider,
        timestamp: new Date().toISOString(),
        processingTime,
      };
    } catch (error) {
      this.logger.error(`Ошибка при анализе документа: ${error.message}`);
      throw new BadRequestException(`Ошибка анализа: ${error.message}`);
    }
  }

  /**
   * Глубокий анализ нескольких документов с подсветкой полей
   */
  async analyzeMultipleDocuments(
    dto: MultiDocumentAnalysisRequestDto,
  ): Promise<MultiDocumentAnalysisResponseDto> {
    const startTime = Date.now();

    try {
      this.logger.log(
        `Начинаем анализ ${dto.documents.length} документов: ${dto.documents.map(d => d.name).join(', ')}`,
      );

      // Получаем шаблон промпта
      const templateKey = dto.templateKey || 'multi-document-analysis';
      const template =
        await this.promptTemplatesService.getTemplateById(templateKey);

      if (!template || !template.prompt) {
        throw new BadRequestException(
          `Шаблон ${templateKey} не найден или не содержит промпт`,
        );
      }

      // Формируем контекст всех документов
      const documentsContext = dto.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        data: doc.context,
      }));

      // Формируем промпты из шаблона, заменяя плейсхолдеры
      const systemPrompt = template.systemPrompt;
      const userPrompt = template.prompt
        .replace('{documents}', JSON.stringify(documentsContext, null, 2))
        .replace('{user_question}', dto.question)
        .replace('{documents_count}', dto.documents.length.toString());

      this.logger.log('Промпты сформированы для анализа документов');

      // Определяем провайдер и модель
      const provider = dto.provider || DEFAULT_AI_PROVIDER;
      const generateDto = {
        prompt: userPrompt,
        systemPrompt,
        provider,
        temperature: dto.temperature || 0.3,
        openaiModel: DEFAULT_OPENAI_MODEL,
        geminiModel: DEFAULT_GEMINI_MODEL,
        deepseekModel: DEFAULT_DEEPSEEK_MODEL,
        grokModel: DEFAULT_GROK_MODEL,
        qwenModel: DEFAULT_QWEN_MODEL,
      };

      let model: string;
      switch (provider) {
        case AI_PROVIDER.OPENAI:
          model = generateDto.openaiModel || DEFAULT_OPENAI_MODEL;
          break;
        case AI_PROVIDER.QWEN:
          model = generateDto.qwenModel || DEFAULT_QWEN_MODEL;
          break;
        case AI_PROVIDER.DEEPSEEK:
          model = generateDto.deepseekModel || DEFAULT_DEEPSEEK_MODEL;
          break;
        case AI_PROVIDER.GROK:
          model = generateDto.grokModel || DEFAULT_GROK_MODEL;
          break;
        case AI_PROVIDER.GOOGLE:
          model = generateDto.geminiModel || DEFAULT_GEMINI_MODEL;
          break;
        default:
          model = 'неизвестная';
      }

      this.logger.log(
        `Анализ документов: провайдер=${provider}, модель=${model}, температура=${generateDto.temperature}`,
      );

      // Генерируем ответ через выбранный провайдер
      let result: string;
      switch (provider) {
        case AI_PROVIDER.OPENAI:
          result = await this.generateWithOpenAI(
            systemPrompt,
            userPrompt,
            generateDto,
            dto.maxTokens || template.maxTokens,
          );
          break;
        case AI_PROVIDER.QWEN:
          result = await this.generateWithQwen(
            systemPrompt,
            userPrompt,
            generateDto,
            dto.maxTokens || template.maxTokens,
          );
          break;
        case AI_PROVIDER.DEEPSEEK:
          result = await this.generateWithDeepSeek(
            systemPrompt,
            userPrompt,
            generateDto,
            dto.maxTokens || template.maxTokens,
          );
          break;
        case AI_PROVIDER.GROK:
          result = await this.generateWithGrok(
            systemPrompt,
            userPrompt,
            generateDto,
            dto.maxTokens || template.maxTokens,
          );
          break;
        default:
          throw new Error(`Неподдерживаемый провайдер: ${provider}`);
      }

      // Очищаем результат от возможной markdown разметки
      let cleanedResult = result.trim();
      if (cleanedResult.startsWith('```json')) {
        cleanedResult = cleanedResult
          .replace(/^```json\s*/, '')
          .replace(/\s*```$/, '');
      }
      if (cleanedResult.startsWith('```')) {
        cleanedResult = cleanedResult
          .replace(/^```\s*/, '')
          .replace(/\s*```$/, '');
      }

      // Парсим JSON ответ
      let parsedResult;
      try {
        parsedResult = JSON.parse(cleanedResult);
        this.logger.log(
          `Успешно распарсен JSON ответ с ${parsedResult.highlights?.length || 0} подсветками`,
        );
      } catch (error) {
        this.logger.warn(`Не удалось распарсить JSON ответ: ${error.message}`);
        // Если не удалось распарсить, возвращаем как обычный ответ
        parsedResult = {
          answer: cleanedResult,
          highlights: [],
        };
      }

      // Преобразуем подсветки в правильный формат
      let highlights: DocumentHighlightDto[] = [];
      if (Array.isArray(parsedResult.highlights)) {
        highlights = parsedResult.highlights.map((highlight: any) => {
          const doc = dto.documents.find(d => d.id === highlight.documentId);
          return {
            documentId: highlight.documentId,
            documentName: doc?.name || 'Неизвестный документ',
            fieldPath: highlight.fieldPath,
            fieldValue: highlight.fieldValue,
          };
        });
      }

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `Анализ ${dto.documents.length} документов завершен за ${processingTime}мс (${provider}/${model}, подсветок: ${highlights.length})`,
      );

      return {
        answer: parsedResult.answer || cleanedResult,
        highlights,
        provider,
        timestamp: new Date().toISOString(),
        processingTime,
        documentsCount: dto.documents.length,
      };
    } catch (error) {
      this.logger.error(`Ошибка при анализе документов: ${error.message}`);
      throw new BadRequestException(
        `Ошибка анализа документов: ${error.message}`,
      );
    }
  }
}
