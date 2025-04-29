import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Horoscope extends Document {
  @Prop({ required: true })
  sign: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  prediction: string;

  @Prop({ required: true })
  mood: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  luckyNumber: number;
}

export const HoroscopeSchema = SchemaFactory.createForClass(Horoscope);
