// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './status/health.controller';
import { HealthService } from './status/health.service';
import { ConfigModule } from '@nestjs/config';
import { AiGenerationModule } from './ai-generation/ai-generation.module';
import { DecksModule } from './decks/decks.module';
import { SpreadsModule } from './spreads/spreads.module';
import { PromptTemplatesModule } from './prompt-templates/prompt-templates.module';
import { HoroscopeModule } from './horoscope/horoscope.module';
import { OcrModule } from './ocr/ocr.module';
import { PaymentsModule } from './payments/payments.module';
import { TemplateService } from './template.service';

@Module({
  controllers: [AppController, HealthController],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO || 'yourSecretKey'),
    AuthModule,
    AiGenerationModule,
    DecksModule,
    SpreadsModule,
    PromptTemplatesModule,
    HoroscopeModule,
    OcrModule,
    PaymentsModule,
  ],
  providers: [AppService, HealthService, TemplateService],
})
export class AppModule {}
