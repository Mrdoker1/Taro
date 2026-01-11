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
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { CourseEditorService } from './course-editor.service';
import * as path from 'path';

@Controller('course-editor')
export class CourseEditorController {
  constructor(private readonly courseEditorService: CourseEditorService) {}

  // Serve HTML page
  @Get()
  getEditorPage(@Res() res: Response, @Session() session: any) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const viewsPath = isDevelopment
      ? path.join(process.cwd(), 'src', 'course-editor', 'views')
      : path.join(process.cwd(), 'dist', 'course-editor', 'views');

    if (!session.authenticated) {
      return res.sendFile(path.join(viewsPath, 'login.html'));
    }
    return res.sendFile(path.join(viewsPath, 'editor.html'));
  }

  // Login
  @Post('login')
  login(
    @Body() body: { username: string; password: string },
    @Session() session: any,
  ) {
    console.log('🔐 Login attempt:', body.username);
    const isValid = this.courseEditorService.validateCredentials(
      body.username,
      body.password,
    );

    if (!isValid) {
      console.log('❌ Invalid credentials');
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    session.authenticated = true;
    console.log('✅ Login successful, session:', session.id);
    return { success: true };
  }

  // Logout
  @Post('logout')
  logout(@Session() session: any) {
    session.authenticated = false;
    return { success: true };
  }

  // Get all courses
  @Get('api/courses')
  getAllCourses(@Session() session: any) {
    console.log('📋 Session state:', { authenticated: session.authenticated, sessionID: session.id });
    if (!session.authenticated) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const courses = this.courseEditorService.getAllCourses();
    console.log('📚 Found courses:', courses);
    return courses;
  }

  // Get course content (raw TypeScript)
  @Get('api/courses/:slug/raw')
  getCourseRaw(@Param('slug') slug: string, @Session() session: any) {
    if (!session.authenticated) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      const content = this.courseEditorService.getCourseContent(slug);
      return { slug, content };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Get course data (parsed JSON)
  @Get('api/courses/:slug')
  getCourse(@Param('slug') slug: string, @Session() session: any) {
    if (!session.authenticated) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      const data = this.courseEditorService.getCourseData(slug);
      return { slug, data };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Save course content (raw TypeScript)
  @Put('api/courses/:slug/raw')
  saveCourseRaw(
    @Param('slug') slug: string,
    @Body() body: { content: string },
    @Session() session: any,
  ) {
    if (!session.authenticated) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      this.courseEditorService.saveCourseContent(slug, body.content);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Save course data (from JSON)
  @Put('api/courses/:slug')
  async saveCourse(
    @Param('slug') slug: string,
    @Body() body: { data: any },
    @Session() session: any,
  ) {
    if (!session.authenticated) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    try {
      await this.courseEditorService.saveCourseData(slug, body.data);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Create new course
  @Post('api/courses')
  async createCourse(@Body() body: { slug: string }, @Session() session: any) {
    if (!session.authenticated) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
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
  async deleteCourse(@Param('slug') slug: string, @Session() session: any) {
    if (!session.authenticated) {
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
