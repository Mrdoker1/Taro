import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SpreadsSeed } from './spreads.seed';

/**
 * Сервис для начальной загрузки данных для раскладов
 */
@Injectable()
export class SpreadsSeederService implements OnModuleInit {
  private readonly logger = new Logger(SpreadsSeederService.name);

  constructor(private readonly spreadsSeed: SpreadsSeed) {}

  /**
   * Автоматически запускается при инициализации модуля
   */
  async onModuleInit() {
    try {
      this.logger.log('Запуск инициализации данных для раскладов...');
      await this.spreadsSeed.seed();
      this.logger.log('Инициализация данных для раскладов завершена успешно');
    } catch (error) {
      this.logger.error(
        `Ошибка при инициализации данных для раскладов: ${error.message}`,
      );
    }
  }
}
