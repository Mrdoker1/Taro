import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CourseEditorController } from './course-editor.controller';
import { CourseEditorService } from './course-editor.service';
import { Course, CourseSchema } from '../courses/schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    ConfigModule,
  ],
  controllers: [CourseEditorController],
  providers: [CourseEditorService],
})
export class CourseEditorModule {}
