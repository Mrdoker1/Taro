import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HoroscopeController } from './horoscope.controller';
import { HoroscopeService } from './horoscope.service';
import { DeepseekModule } from '../deepseek/deepseek.module';
import { PromptTemplatesModule } from '../prompt-templates/prompt-templates.module';
import { Horoscope, HoroscopeSchema } from './schemas/horoscope.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Horoscope.name, schema: HoroscopeSchema },
    ]),
    DeepseekModule,
    PromptTemplatesModule,
  ],
  controllers: [HoroscopeController],
  providers: [HoroscopeService],
  exports: [HoroscopeService],
})
export class HoroscopeModule {}
