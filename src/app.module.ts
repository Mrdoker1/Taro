// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './status/health.controller';
import { HealthService } from './status/health.service';
import { ConfigModule } from '@nestjs/config';
import { DeepseekModule } from './deepseek/deepseek.module';
import { DecksModule } from './decks/decks.module';
import { SpreadsModule } from './spreads/spreads.module';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO || 'yourSecretKey'),
    AuthModule,
    DeepseekModule,
    DecksModule,
    SpreadsModule,
  ],
  providers: [HealthService],
})
export class AppModule {}
