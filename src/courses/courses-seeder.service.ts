import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CoursesSeed } from './courses.seed';

/**
 * Сервис для начальной загрузки данных для курсов
 */
@Injectable()
export class CoursesSeederService implements OnModuleInit {
  private readonly logger = new Logger(CoursesSeederService.name);

  constructor(private readonly coursesSeed: CoursesSeed) {}

  /**
   * Автоматически запускается при инициализации модуля
   */
  async onModuleInit() {
    try {
      this.logger.log('Запуск инициализации данных для курсов...');
      await this.coursesSeed.seed();
      this.logger.log('Инициализация данных для курсов завершена успешно');
    } catch (error) {
      this.logger.error(
        `Ошибка при инициализации данных для курсов: ${error.message}`,
      );
    }
  }
}
