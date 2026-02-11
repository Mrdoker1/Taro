import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CoursesSeed {
  private readonly logger = new Logger(CoursesSeed.name);

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  /**
   * Создает начальные данные для курсов из JSON файлов в папке data
   */
  async seed(): Promise<void> {
    const count = await this.courseModel.countDocuments().exec();

    if (count === 0) {
      this.logger.log('База данных пуста. Загрузка курсов из JSON файлов...');

      const seedData = this.loadCoursesFromFiles();

      if (seedData.length === 0) {
        this.logger.warn('Не найдено JSON файлов курсов в папке data');
        return;
      }

      for (const course of seedData) {
        await this.courseModel.create(course);
      }

      this.logger.log(`Создано ${seedData.length} курсов из JSON файлов`);
    } else {
      this.logger.log(`В базе уже есть ${count} курсов. Пропускаем seed.`);
    }
  }

  /**
   * Загружает все курсы из JSON файлов в папке data
   */
  private loadCoursesFromFiles(): Partial<Course>[] {
    try {
      // Определяем путь к папке data
      const isDevelopment = process.env.NODE_ENV !== 'production';
      const dataPath = isDevelopment
        ? path.join(process.cwd(), 'src', 'courses', 'data')
        : path.join(process.cwd(), 'dist', 'courses', 'data');

      this.logger.log(`Загрузка курсов из: ${dataPath}`);

      // Проверяем существование папки
      if (!fs.existsSync(dataPath)) {
        this.logger.warn(`Папка ${dataPath} не найдена`);
        return [];
      }

      // Читаем все файлы в папке
      const files = fs.readdirSync(dataPath);
      
      // Фильтруем только .course.json файлы
      const courseFiles = files.filter(
        (file) => file.endsWith('.course.json'),
      );

      this.logger.log(`Найдено ${courseFiles.length} JSON файлов курсов`);

      // Загружаем и парсим каждый файл
      const courses: Partial<Course>[] = [];
      for (const file of courseFiles) {
        try {
          const filePath = path.join(dataPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const courseData = JSON.parse(fileContent);
          
          courses.push(courseData);
          this.logger.log(`✓ Загружен курс: ${courseData.slug} (${file})`);
        } catch (error) {
          this.logger.error(`✗ Ошибка при загрузке ${file}: ${error.message}`);
        }
      }

      return courses;
    } catch (error) {
      this.logger.error(`Ошибка при загрузке курсов: ${error.message}`);
      return [];
    }
  }
}
