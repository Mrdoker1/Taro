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
   * Получить все шаблоны запросов
   */
  async getAllTemplates(): Promise<PromptTemplateResponseDto[]> {
    try {
      const templates = await this.promptTemplateModel.find().exec();
      return templates.map(template => this.mapToResponseDto(template));
    } catch (error) {
      this.logger.error(`Ошибка при получении шаблонов: ${error.message}`);
      throw error;
    }
  }

  /**
   * Получить шаблон запроса по идентификатору
   * @param promptId Идентификатор шаблона запроса
   * @returns Информация о шаблоне запроса
   */
  async getTemplateById(promptId: string): Promise<PromptTemplateResponseDto> {
    try {
      const template = await this.promptTemplateModel
        .findOne({ key: promptId })
        .exec();

      if (!template) {
        throw new NotFoundException('Prompt template not found');
      }

      return this.mapToResponseDto(template);
    } catch (error) {
      this.logger.error(
        `Ошибка при получении шаблона запроса ${promptId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Создать новый шаблон
   */
  async createTemplate(templateData: Partial<PromptTemplate>): Promise<PromptTemplateResponseDto> {
    try {
      const template = new this.promptTemplateModel(templateData);
      const saved = await template.save();
      this.logger.log(`Создан шаблон: ${saved.key}`);
      return this.mapToResponseDto(saved);
    } catch (error) {
      this.logger.error(`Ошибка при создании шаблона: ${error.message}`);
      throw error;
    }
  }

  /**
   * Обновить шаблон
   */
  async updateTemplate(promptId: string, templateData: Partial<PromptTemplate>): Promise<PromptTemplateResponseDto> {
    try {
      const template = await this.promptTemplateModel
        .findOneAndUpdate(
          { key: promptId },
          { $set: templateData },
          { new: true }
        )
        .exec();

      if (!template) {
        throw new NotFoundException('Prompt template not found');
      }

      this.logger.log(`Обновлен шаблон: ${promptId}`);
      return this.mapToResponseDto(template);
    } catch (error) {
      this.logger.error(`Ошибка при обновлении шаблона ${promptId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Удалить шаблон
   */
  async deleteTemplate(promptId: string): Promise<void> {
    try {
      const result = await this.promptTemplateModel
        .deleteOne({ key: promptId })
        .exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException('Prompt template not found');
      }

      this.logger.log(`Удален шаблон: ${promptId}`);
    } catch (error) {
      this.logger.error(`Ошибка при удалении шаблона ${promptId}: ${error.message}`);
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
      systemPrompt: template.systemPrompt,
      prompt: template.prompt,
      responseLang: template.responseLang,
    };
  }
}
