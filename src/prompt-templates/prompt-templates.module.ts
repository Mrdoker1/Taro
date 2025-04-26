import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromptTemplatesController } from './prompt-templates.controller';
import { PromptTemplatesService } from './prompt-templates.service';
import {
  PromptTemplate,
  PromptTemplateSchema,
} from './schemas/prompt-template.schema';
import { PromptTemplatesSeed } from './prompt-templates.seed';
import { PromptTemplatesSeederService } from './prompt-templates-seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromptTemplate.name, schema: PromptTemplateSchema },
    ]),
  ],
  controllers: [PromptTemplatesController],
  providers: [
    PromptTemplatesService,
    PromptTemplatesSeed,
    PromptTemplatesSeederService,
  ],
  exports: [PromptTemplatesService],
})
export class PromptTemplatesModule {}
