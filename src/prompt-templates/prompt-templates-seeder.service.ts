import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PromptTemplatesSeed } from './prompt-templates.seed';

/**
 * Сервис для начальной загрузки данных для шаблонов запросов
 */
@Injectable()
export class PromptTemplatesSeederService implements OnModuleInit {
  private readonly logger = new Logger(PromptTemplatesSeederService.name);

  constructor(private readonly promptTemplatesSeed: PromptTemplatesSeed) {}

  /**
   * Автоматически запускается при инициализации модуля
   */
  async onModuleInit() {
    try {
      this.logger.log('Запуск инициализации данных для шаблонов запросов...');
      await this.promptTemplatesSeed.seed();
      this.logger.log(
        'Инициализация данных для шаблонов запросов завершена успешно',
      );
    } catch (error) {
      this.logger.error(
        `Ошибка при инициализации данных для шаблонов запросов: ${error.message}`,
      );
    }
  }
}
