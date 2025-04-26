import {
  Controller,
  Get,
  Param,
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
      // Получаем данные от сервиса
      const template =
        await this.promptTemplatesService.getTemplateById(promptId);

      // Возвращаем успешный ответ
      return res.status(HttpStatus.OK).json(template);
    } catch (error) {
      // Обрабатываем ошибки
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
