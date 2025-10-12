import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Horoscope extends Document {
  @Prop({ required: true })
  sign: string;

  @Prop({ required: false })
  date?: string;

  @Prop({ required: false })
  week?: string;

  @Prop({ required: false })
  month?: string;

  @Prop({ required: true })
  prediction: string;

  @Prop({ required: true })
  mood: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  lang: string;
}

export const HoroscopeSchema = SchemaFactory.createForClass(Horoscope);

// Индексы для оптимизации поиска
HoroscopeSchema.index({ sign: 1, date: 1, lang: 1 });
HoroscopeSchema.index({ sign: 1, week: 1, lang: 1 });
HoroscopeSchema.index({ sign: 1, month: 1, lang: 1 });
