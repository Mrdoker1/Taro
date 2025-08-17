import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenerationController } from './deepseek.controller';
import { DeepseekService } from './deepseek.service';

@Module({
  imports: [ConfigModule],
  controllers: [GenerationController],
  providers: [DeepseekService],
  exports: [DeepseekService],
})
export class DeepseekModule {}
