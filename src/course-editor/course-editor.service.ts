import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../courses/schemas/course.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CourseEditorService {
  private readonly coursesDataPath = this.getCoursesDataPath();

  private getCoursesDataPath(): string {
    // В режиме разработки используем src, в продакшене - dist
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    if (isDevelopment) {
      return path.join(process.cwd(), 'src', 'courses', 'data');
    } else {
      return path.join(process.cwd(), 'dist', 'courses', 'data');
    }
  }

  // Статический логин/пароль (в продакшене лучше использовать env переменные)
  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'tarot2024';

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  validateCredentials(username: string, password: string): boolean {
    return username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD;
  }

  async getAllCourses(): Promise<Array<{ slug: string; title: string; isValid: boolean }>> {
    // Загружаем все курсы из базы данных (включая невалидные)
    const courses = await this.courseModel.find({}).exec();
    
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    
    return courses.map(course => ({
      slug: course.slug,
      title: course.translations?.ru?.title || course.slug,
      isValid: slugRegex.test(course.slug),
    }));
  }

  /**
   * Получает данные курса из базы данных
   */
  async getCourseData(courseSlug: string): Promise<any> {
    try {
      // Сначала пытаемся загрузить из базы данных
      const course = await this.courseModel.findOne({ slug: courseSlug }).exec();
      
      if (course) {
        // Преобразуем Mongoose документ в plain object
        return course.toObject();
      }
      
      // Если курса нет в базе, пытаемся загрузить из JSON файла
      const filePath = path.join(this.coursesDataPath, `${courseSlug}.course.json`);
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const courseData = JSON.parse(fileContent);
        
        // Сохраняем в базу данных для будущего использования
        await this.courseModel.create(courseData);
        
        return courseData;
      }
      
      throw new Error('Course not found');
    } catch (error) {
      throw new Error(`Failed to load course: ${error.message}`);
    }
  }

  /**
   * Сохраняет курс в базу данных и в JSON файл
   */
  async saveCourseData(courseSlug: string, data: any): Promise<void> {
    try {
      // 1. Сохраняем в базу данных (обязательно)
      await this.syncCourseToDatabase(courseSlug, data);
      console.log(`✅ Course "${courseSlug}" saved to database`);
      
      // 2. Пытаемся сохранить в JSON файл (опционально, для backup)
      try {
        // Проверяем существование папки
        if (!fs.existsSync(this.coursesDataPath)) {
          console.warn(`⚠️ Data path does not exist: ${this.coursesDataPath}`);
          fs.mkdirSync(this.coursesDataPath, { recursive: true });
        }
        
        const filePath = path.join(this.coursesDataPath, `${courseSlug}.course.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✅ Course "${courseSlug}" saved to JSON file`);
      } catch (fileError) {
        // Если не удалось сохранить в файл - не критично, главное что в базе сохранено
        console.warn(`⚠️ Failed to save JSON file for "${courseSlug}":`, fileError.message);
      }
    } catch (error) {
      console.error(`❌ Failed to save course "${courseSlug}":`, error);
      throw new Error(`Failed to save course: ${error.message}`);
    }
  }

  // Синхронизация курса с базой данных
  private async syncCourseToDatabase(
    courseSlug: string,
    data: any,
  ): Promise<void> {
    try {
      // Удаляем MongoDB-специфичные поля
      const { _id, __v, createdAt, updatedAt, ...cleanData } = data;
      
      // Ищем курс в базе по slug
      const existingCourse = await this.courseModel.findOne({ slug: courseSlug });

      if (existingCourse) {
        // Обновляем существующий курс
        await this.courseModel.updateOne(
          { slug: courseSlug },
          {
            $set: {
              coverImageUrl: cleanData.coverImageUrl,
              level: cleanData.level,
              price: cleanData.price,
              isPublished: cleanData.isPublished,
              translations: cleanData.translations,
            },
          },
        );
        console.log(`✅ Course "${courseSlug}" updated in database`);
      } else {
        // Создаем новый курс в базе
        await this.courseModel.create({
          slug: courseSlug,
          coverImageUrl: cleanData.coverImageUrl,
          level: cleanData.level,
          price: cleanData.price,
          isPublished: cleanData.isPublished,
          translations: cleanData.translations,
        });
        console.log(`✅ Course "${courseSlug}" created in database`);
      }
    } catch (error) {
      console.error(`❌ Failed to sync course "${courseSlug}" to database:`, error);
      throw new Error(`Failed to sync course to database: ${error.message}`);
    }
  }


  /**
   * Создает новый курс в базе данных и JSON файл
   */
  async createNewCourse(courseSlug: string): Promise<void> {
    try {
      // Проверяем, существует ли курс в базе
      const existingCourse = await this.courseModel.findOne({ slug: courseSlug }).exec();
      if (existingCourse) {
        throw new Error('Course already exists in database');
      }

      const newCourseData = {
        slug: courseSlug,
        coverImageUrl: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&h=600&fit=crop',
        level: 'beginner',
        price: 0,
        isPublished: true,
        translations: {
          ru: {
            title: 'Новый курс',
            description: 'Описание курса',
            chapters: [],
          },
          en: {
            title: 'New Course',
            description: 'Course description',
            chapters: [],
          },
        },
      };

      // Создаем курс в базе данных
      await this.courseModel.create(newCourseData);
      
      // Сохраняем JSON файл
      const filePath = path.join(this.coursesDataPath, `${courseSlug}.course.json`);
      fs.writeFileSync(filePath, JSON.stringify(newCourseData, null, 2), 'utf-8');
      
      console.log(`✅ New course "${courseSlug}" created`);
    } catch (error) {
      throw new Error(`Failed to create course: ${error.message}`);
    }
  }

  /**
   * Удаляет курс из базы данных и JSON файл
   */
  async deleteCourse(courseSlug: string): Promise<void> {
    try {
      // Удаляем из базы данных
      const result = await this.courseModel.deleteOne({ slug: courseSlug });
      
      if (result.deletedCount === 0) {
        throw new Error('Course not found in database');
      }
      
      // Удаляем JSON файл (если существует)
      const filePath = path.join(this.coursesDataPath, `${courseSlug}.course.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      console.log(`✅ Course "${courseSlug}" deleted`);
    } catch (error) {
      throw new Error(`Failed to delete course: ${error.message}`);
    }
  }

}
