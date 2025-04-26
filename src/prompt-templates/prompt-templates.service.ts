import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PromptTemplate,
  PromptTemplateDocument,
} from './schemas/prompt-template.schema';
import { PromptTemplateResponseDto } from './dto/prompt-template-response.dto';

/**
 * Сервис для работы с шаблонами запросов к LM модели
 */
@Injectable()
export class PromptTemplatesService {
  private readonly logger = new Logger(PromptTemplatesService.name);

  constructor(
    @InjectModel(PromptTemplate.name)
    private promptTemplateModel: Model<PromptTemplateDocument>,
  ) {}

  /**
   * Получить шаблон запроса по идентификатору
   * @param promptId Идентификатор шаблона запроса
   * @returns Информация о шаблоне запроса
   */
  async getTemplateById(promptId: string): Promise<PromptTemplateResponseDto> {
    try {
      // Получаем шаблон запроса из базы данных
      const template = await this.promptTemplateModel
        .findOne({ key: promptId })
        .exec();

      // Если шаблон не найден, генерируем ошибку
      if (!template) {
        throw new NotFoundException('Prompt template not found');
      }

      // Преобразуем документ в формат ответа
      return this.mapToResponseDto(template);
    } catch (error) {
      this.logger.error(
        `Ошибка при получении шаблона запроса ${promptId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Преобразует документ в формат ответа
   */
  private mapToResponseDto(
    template: PromptTemplateDocument,
  ): PromptTemplateResponseDto {
    return {
      key: template.key,
      temperature: template.temperature,
      maxTokens: template.maxTokens,
      systemPromt: template.systemPromt,
    };
  }
}
