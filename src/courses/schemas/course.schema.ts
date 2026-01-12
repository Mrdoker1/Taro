import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Схема для блока контента
class ContentBlock {
  @Prop({ required: true, enum: ['md', 'image', 'card', 'video'] })
  type: string;

  @Prop()
  content?: string; // Для type: 'md'

  @Prop()
  url?: string; // Для type: 'image' | 'video'

  @Prop()
  caption?: string; // Для type: 'image'

  @Prop()
  cardId?: string; // Для type: 'card'

  @Prop()
  deckId?: string; // Для type: 'card'
}

// Схема для страницы
class CoursePage {
  @Prop({ required: false })
  _id?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [ContentBlock], required: true })
  blocks: ContentBlock[];
}

// Схема для главы
class CourseChapter {
  @Prop({ required: false })
  _id?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [CoursePage], required: true })
  pages: CoursePage[];
}

// Схема для переводов курса
class CourseTranslation {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [CourseChapter], required: true })
  chapters: CourseChapter[];
}

// Основная схема для курса
@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  coverImageUrl?: string;

  @Prop({
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  })
  level: string;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ required: true, default: true })
  isPublished: boolean;

  @Prop({ type: Object, required: true })
  translations: Record<string, CourseTranslation>;
}

export type CourseDocument = Course & Document & {
  createdAt: Date;
  updatedAt: Date;
};
export const CourseSchema = SchemaFactory.createForClass(Course);
