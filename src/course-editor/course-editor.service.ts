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

  getAllCourses(): string[] {
    const files = fs.readdirSync(this.coursesDataPath);
    return files
      .filter(file => file.endsWith('.course.ts') && file !== 'index.ts')
      .map(file => file.replace('.course.ts', ''));
  }

  getCourseContent(courseSlug: string): string {
    const filePath = path.join(this.coursesDataPath, `${courseSlug}.course.ts`);
    if (!fs.existsSync(filePath)) {
      throw new Error('Course not found');
    }
    return fs.readFileSync(filePath, 'utf-8');
  }

  // Парсинг курса из TypeScript файла в JSON
  getCourseData(courseSlug: string): any {
    const content = this.getCourseContent(courseSlug);
    
    // Извлекаем объект курса из TypeScript файла
    // Это упрощенный парсер - в реальности можно использовать @babel/parser
    const match = content.match(/export const \w+Course: Partial<Course> = ({[\s\S]*});/);
    if (!match) {
      throw new Error('Invalid course file format');
    }
    
    // Преобразуем TypeScript объект в JSON (убираем trailing commas и т.д.)
    const objectStr = match[1];
    
    // Используем eval для парсинга (в продакшене лучше использовать babel parser)
    try {
      const courseData = eval(`(${objectStr})`);
      return courseData;
    } catch (error) {
      throw new Error('Failed to parse course data');
    }
  }

  // Сохранение курса из JSON в TypeScript файл
  async saveCourseData(courseSlug: string, data: any): Promise<void> {
    const camelCaseName = this.toCamelCase(courseSlug);
    
    // Генерируем TypeScript файл
    const content = `import { Course } from '../schemas/course.schema';

export const ${camelCaseName}Course: Partial<Course> = ${JSON.stringify(data, null, 2)};
`;
    
    this.saveCourseContent(courseSlug, content);
    
    // Обновляем базу данных
    await this.syncCourseToDatabase(courseSlug, data);
  }

  // Синхронизация курса с базой данных
  private async syncCourseToDatabase(
    courseSlug: string,
    data: any,
  ): Promise<void> {
    try {
      // Ищем курс в базе по slug
      const existingCourse = await this.courseModel.findOne({ slug: courseSlug });

      if (existingCourse) {
        // Обновляем существующий курс
        await this.courseModel.updateOne(
          { slug: courseSlug },
          {
            $set: {
              coverImageUrl: data.coverImageUrl,
              level: data.level,
              price: data.price,
              isPublished: data.isPublished,
              translations: data.translations,
            },
          },
        );
        console.log(`✅ Course "${courseSlug}" updated in database`);
      } else {
        // Создаем новый курс в базе
        await this.courseModel.create({
          slug: courseSlug,
          coverImageUrl: data.coverImageUrl,
          level: data.level,
          price: data.price,
          isPublished: data.isPublished,
          translations: data.translations,
        });
        console.log(`✅ Course "${courseSlug}" created in database`);
      }
    } catch (error) {
      console.error(`❌ Failed to sync course "${courseSlug}" to database:`, error);
      throw new Error(`Failed to sync course to database: ${error.message}`);
    }
  }

  saveCourseContent(courseSlug: string, content: string): void {
    const filePath = path.join(this.coursesDataPath, `${courseSlug}.course.ts`);
    fs.writeFileSync(filePath, content, 'utf-8');
    this.updateIndexFile();
  }

  async createNewCourse(courseSlug: string): Promise<void> {
    const filePath = path.join(this.coursesDataPath, `${courseSlug}.course.ts`);
    if (fs.existsSync(filePath)) {
      throw new Error('Course already exists');
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

    const template = `import { Course } from '../schemas/course.schema';

export const ${this.toCamelCase(courseSlug)}Course: Partial<Course> = ${JSON.stringify(newCourseData, null, 2)};
`;

    fs.writeFileSync(filePath, template, 'utf-8');
    this.updateIndexFile();
    
    // Создаем в базе данных
    await this.syncCourseToDatabase(courseSlug, newCourseData);
  }

  async deleteCourse(courseSlug: string): Promise<void> {
    const filePath = path.join(this.coursesDataPath, `${courseSlug}.course.ts`);
    if (!fs.existsSync(filePath)) {
      throw new Error('Course not found');
    }
    
    // Удаляем файл
    fs.unlinkSync(filePath);
    this.updateIndexFile();
    
    // Удаляем из базы данных
    try {
      await this.courseModel.deleteOne({ slug: courseSlug });
      console.log(`✅ Course "${courseSlug}" deleted from database`);
    } catch (error) {
      console.error(`❌ Failed to delete course "${courseSlug}" from database:`, error);
    }
  }

  private updateIndexFile(): void {
    const courses = this.getAllCourses();
    const imports = courses
      .map(
        slug =>
          `export { ${this.toCamelCase(slug)}Course } from './${slug}.course';`,
      )
      .join('\n');

    const indexPath = path.join(this.coursesDataPath, 'index.ts');
    fs.writeFileSync(indexPath, imports + '\n', 'utf-8');
  }

  private toCamelCase(str: string): string {
    return str
      .split('-')
      .map((word, index) =>
        index === 0
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join('');
  }
}
