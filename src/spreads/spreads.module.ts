import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpreadsController } from './spreads.controller';
import { SpreadsService } from './spreads.service';
import { Spread, SpreadSchema } from './schemas/spread.schema';
import { SpreadsSeed } from './spreads.seed';
import { SpreadsSeederService } from './spreads-seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Spread.name, schema: SpreadSchema }]),
  ],
  controllers: [SpreadsController],
  providers: [SpreadsService, SpreadsSeed, SpreadsSeederService],
  exports: [SpreadsService],
})
export class SpreadsModule {}
