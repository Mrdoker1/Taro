import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { TemplateService } from './template.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly templateService: TemplateService,
  ) {}

  @Get('privacy/docscan')
  getDocScanPrivacyPolicy(@Res() res: Response) {
    const html = this.templateService.getPrivacyPolicyTemplate();
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('privacy/seluna')
  getSelunaPrivacyPolicy(@Res() res: Response) {
    const html = this.templateService.getPrivacyPolicySelunaTemplate();
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('privacy/delete-account')
  getDeleteAccountForm(
    @Res() res: Response,
    @Query('success') success?: string,
    @Query('app') app?: string,
  ) {
    const html = this.templateService.getDeleteAccountTemplate(success, app);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
