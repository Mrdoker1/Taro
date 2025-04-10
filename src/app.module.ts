// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './status/health.controller';
import { HealthService } from './status/health.service';

@Module({
  controllers: [HealthController],
  imports: [
    MongooseModule.forRoot(process.env.MONGO || 'yourSecretKey'),
    AuthModule,
  ],
  providers: [HealthService],
})
export class AppModule {}
