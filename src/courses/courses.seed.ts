import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { basicTarotCourse, advancedTarotCourse } from './data';

@Injectable()
export class CoursesSeed {
  private readonly logger = new Logger(CoursesSeed.name);

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  /**
   * Создает начальные данные для курсов
   */
  async seed(): Promise<void> {
    const count = await this.courseModel.countDocuments().exec();

    if (count === 0) {
      this.logger.log('Начато создание начальных данных для курсов');

      const seedData = this.getSeedData();

      for (const course of seedData) {
        await this.courseModel.create(course);
      }

      this.logger.log(`Создано ${seedData.length} курсов`);
    } else {
      this.logger.log('Обновление существующих курсов...');

      const seedData = this.getSeedData();

      for (const course of seedData) {
        await this.courseModel.updateOne(
          { slug: course.slug },
          { $set: course },
          { upsert: true },
        );
      }

      this.logger.log(`Обновлено/создано ${seedData.length} курсов`);
    }
  }

  /**
   * Возвращает данные для начального заполнения
   */
  private getSeedData(): Partial<Course>[] {
    return [basicTarotCourse, advancedTarotCourse];
  }
}
