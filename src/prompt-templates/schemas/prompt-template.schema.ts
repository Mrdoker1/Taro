import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Основная схема для шаблона запроса
@Schema({ timestamps: true })
export class PromptTemplate {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  maxTokens: number;

  @Prop({ required: true })
  systemPromt: string;
}

export type PromptTemplateDocument = PromptTemplate & Document;
export const PromptTemplateSchema =
  SchemaFactory.createForClass(PromptTemplate);
