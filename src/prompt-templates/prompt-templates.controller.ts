import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpException,
  Logger,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { PromptTemplatesService } from './prompt-templates.service';
import { PromptTemplateResponseDto } from './dto/prompt-template-response.dto';
import { Response } from 'express';

@ApiTags('Prompt Templates')
@Controller('prompt-template')
export class PromptTemplatesController {
  private readonly logger = new Logger(PromptTemplatesController.name);

  constructor(
    private readonly promptTemplatesService: PromptTemplatesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить все шаблоны запросов' })
  @ApiResponse({
    status: 200,
    description: 'Список всех шаблонов',
    type: [PromptTemplateResponseDto],
  })
  async getAllTemplates(@Res() res: Response) {
    try {
      const templates = await this.promptTemplatesService.getAllTemplates();
      return res.status(HttpStatus.OK).json(templates);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  @Get(':promptId')
  @ApiOperation({
    summary: 'Получить шаблон запроса к LM модели по идентификатору',
  })
  @ApiParam({
    name: 'promptId',
    required: true,
    description: 'Идентификатор шаблона запроса',
    type: String,
    example: 'one-card',
  })
  @ApiResponse({
    status: 200,
    description: 'Шаблон запроса успешно получен',
    type: PromptTemplateResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Шаблон запроса с указанным идентификатором не найден',
  })
  async getTemplateById(
    @Param('promptId') promptId: string,
    @Res() res: Response,
  ) {
    try {
      const template =
        await this.promptTemplatesService.getTemplateById(promptId);
      return res.status(HttpStatus.OK).json(template);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Создать новый шаблон запроса' })
  @ApiResponse({
    status: 201,
    description: 'Шаблон успешно создан',
  })
  async createTemplate(@Body() templateData: any, @Res() res: Response) {
    try {
      const template = await this.promptTemplatesService.createTemplate(templateData);
      return res.status(HttpStatus.CREATED).json(template);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  @Put(':promptId')
  @ApiOperation({ summary: 'Обновить шаблон запроса' })
  @ApiParam({
    name: 'promptId',
    required: true,
    description: 'Идентификатор шаблона запроса',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Шаблон успешно обновлен',
  })
  async updateTemplate(
    @Param('promptId') promptId: string,
    @Body() templateData: any,
    @Res() res: Response,
  ) {
    try {
      const template = await this.promptTemplatesService.updateTemplate(promptId, templateData);
      return res.status(HttpStatus.OK).json(template);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  @Delete(':promptId')
  @ApiOperation({ summary: 'Удалить шаблон запроса' })
  @ApiParam({
    name: 'promptId',
    required: true,
    description: 'Идентификатор шаблона запроса',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Шаблон успешно удален',
  })
  async deleteTemplate(
    @Param('promptId') promptId: string,
    @Res() res: Response,
  ) {
    try {
      await this.promptTemplatesService.deleteTemplate(promptId);
      return res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  /**
   * Обрабатывает ошибки и формирует соответствующий HTTP-ответ
   */
  private handleError(error: any, res: Response) {
    this.logger.error(`Ошибка при обработке запроса: ${error.message}`);

    if (error instanceof NotFoundException) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: true,
        message: 'Prompt template not found',
      });
    }

    if (error instanceof HttpException) {
      return res.status(error.getStatus()).json({
        error: true,
        message: error.message,
      });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: 'Internal server error',
    });
  }
}
