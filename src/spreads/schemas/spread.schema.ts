import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Схема для metadata пункта расклада
class SpreadMetaItem {
  @Prop({ type: Object, required: true })
  label: Record<string, string>;
}

// Схема для переводов расклада
class SpreadTranslation {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

// Основная схема для расклада
@Schema({ timestamps: true })
export class Spread {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ default: true })
  available: boolean;

  @Prop({ default: false })
  paid: boolean;

  @Prop({ type: Object, required: true })
  translations: Record<string, SpreadTranslation>;

  @Prop({ type: Object, required: true })
  questions: Record<string, string[]>;

  @Prop({ required: true })
  cardsCount: number;

  @Prop({ type: [[Number]], required: true })
  grid: number[][];

  @Prop({ type: Object, required: true })
  meta: Record<string, SpreadMetaItem>;

  @Prop({ required: false })
  imageURL?: string;
}

export type SpreadDocument = Spread & Document;
export const SpreadSchema = SchemaFactory.createForClass(Spread);
