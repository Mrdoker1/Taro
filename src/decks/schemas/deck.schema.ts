import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Схема для значений карты
class CardMeaning {
  @Prop({ required: true })
  upright: string;

  @Prop({ required: true })
  reversed: string;
}

// Схема для переводов карты
class CardTranslation {
  @Prop({ required: true })
  name: string;

  @Prop({ type: CardMeaning, required: true })
  meaning: CardMeaning;
}

// Схема для карты
class Card {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: Object, required: true })
  translations: Record<string, CardTranslation>;
}

// Схема для переводов колоды
class DeckTranslation {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

// Основная схема для колоды
@Schema({ timestamps: true })
export class Deck {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  coverImageUrl: string;

  @Prop({ default: true })
  available: boolean;

  @Prop({ type: Object, required: true })
  translations: Record<string, DeckTranslation>;

  @Prop({ type: [Card], required: true })
  cards: Card[];
}

export type DeckDocument = Deck & Document;
export const DeckSchema = SchemaFactory.createForClass(Deck);
