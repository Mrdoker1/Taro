import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TemplateService {
  private getTemplate(templateName: string): string {
    const templatePath = join(__dirname, 'templates', `${templateName}.html`);
    return readFileSync(templatePath, 'utf8');
  }

  getPrivacyPolicyTemplate(): string {
    return this.getTemplate('privacy-policy');
  }

  getPrivacyPolicySelunaTemplate(): string {
    return this.getTemplate('privacy-policy-seluna');
  }

  getDeleteAccountTemplate(success?: string): string {
    const template = this.getTemplate('delete-account');

    const successMessage = success
      ? this.getTemplate('success-message')
      : this.getTemplate('warning-message');

    const formContent = success ? '' : this.getTemplate('delete-account-form');

    return template
      .replace('{{SUCCESS_MESSAGE}}', successMessage)
      .replace('{{FORM_CONTENT}}', formContent);
  }
}
