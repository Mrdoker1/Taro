import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import { CourseEditorService } from './course-editor.service';
import * as path from 'path';

@Controller('course-editor')
export class CourseEditorController {
  constructor(private readonly courseEditorService: CourseEditorService) {}

  // Serve React app
  @Get()
  getEditorPage(@Res() res: Response) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    if (isDevelopment) {
      // В режиме разработки редирект на Vite dev server
      return res.redirect('http://localhost:3001');
    }
    
    // В продакшене отдаем собранное React приложение
    // process.cwd() это корень проекта (/srv/myapp/repo)
    const publicPath = path.join(process.cwd(), 'dist', 'course-editor', 'public');
    return res.sendFile(path.join(publicPath, 'index.html'));
  }

  // Login
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    console.log('🔐 Login attempt:', body.username);
    const isValid = await this.courseEditorService.validateCredentials(
      body.username,
      body.password,
    );

    if (!isValid) {
      console.log('❌ Invalid credentials');
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Генерируем простой токен (timestamp + secret)
    const token = Buffer.from(
      `${body.username}:${Date.now()}:tarot-editor-secret`,
    ).toString('base64');
    console.log('✅ Login successful, token generated');
    return { success: true, token };
  }

  // Logout
  @Post('logout')
  logout() {
    return { success: true };
  }

  // Change password
  @Post('api/change-password')
  async changePassword(
    @Headers('authorization') auth: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (!body.oldPassword || !body.newPassword) {
      throw new HttpException(
        'Old password and new password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.newPassword.length < 6) {
      throw new HttpException(
        'New password must be at least 6 characters long',
        HttpStatus.BAD_REQUEST,
      );
    }

    const success = await this.courseEditorService.changePassword(
      body.oldPassword,
      body.newPassword,
    );

    if (!success) {
      throw new HttpException('Invalid old password', HttpStatus.UNAUTHORIZED);
    }

    return { success: true, message: 'Password changed successfully' };
  }

  // Get all courses
  @Get('api/courses')
  async getAllCourses(@Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const courses = await this.courseEditorService.getAllCourses();
    return courses;
  }

  // Get course data (from database)
  @Get('api/courses/:slug')
  async getCourse(
    @Param('slug') slug: string,
    @Headers('authorization') auth: string,
  ) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      const data = await this.courseEditorService.getCourseData(slug);
      return { slug, data };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Save course data (to database and JSON file)
  @Put('api/courses/:slug')
  async saveCourse(
    @Param('slug') slug: string,
    @Body() body: { data: any },
    @Headers('authorization') auth: string,
  ) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      console.log(`[CourseEditor] Saving course: ${slug}`);
      await this.courseEditorService.saveCourseData(slug, body.data);
      console.log(`[CourseEditor] ✅ Course saved: ${slug}`);
      return { success: true };
    } catch (error) {
      console.error(`[CourseEditor] ❌ Error saving course ${slug}:`, error);
      throw new HttpException(
        `Failed to save course: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Create new course
  @Post('api/courses')
  async createCourse(
    @Body() body: { slug: string },
    @Headers('authorization') auth: string,
  ) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    
    // Валидация slug
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!body.slug || !slugRegex.test(body.slug)) {
      throw new HttpException(
        'Invalid slug. Use only lowercase letters, numbers, and hyphens (e.g., "basic-tarot")',
        HttpStatus.BAD_REQUEST,
      );
    }
    
    try {
      await this.courseEditorService.createNewCourse(body.slug);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Delete course
  @Delete('api/courses/:slug')
  async deleteCourse(
    @Param('slug') slug: string,
    @Headers('authorization') auth: string,
  ) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      await this.courseEditorService.deleteCourse(slug);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
