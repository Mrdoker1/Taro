import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiGenerationController } from './ai-generation.controller';
import { AiGenerationService } from './ai-generation.service';
import { PromptTemplatesModule } from '../prompt-templates/prompt-templates.module';

@Module({
  imports: [ConfigModule, PromptTemplatesModule],
  controllers: [AiGenerationController],
  providers: [AiGenerationService],
  exports: [AiGenerationService],
})
export class AiGenerationModule {}
