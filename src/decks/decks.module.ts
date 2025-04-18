import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DecksController } from './decks.controller';
import { DecksService } from './decks.service';
import { Deck, DeckSchema } from './schemas/deck.schema';
import { DecksSeedService } from './decks.seed';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  controllers: [DecksController],
  providers: [DecksService, DecksSeedService],
  exports: [DecksService],
})
export class DecksModule {}
