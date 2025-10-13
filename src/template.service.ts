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

  getDeleteAccountTemplate(success?: string, app?: string): string {
    const template = this.getTemplate('delete-account');

    const successMessage = success
      ? this.getTemplate('success-message')
      : this.getTemplate('warning-message');

    let formContent = success ? '' : this.getTemplate('delete-account-form');

    // Map app parameter to full app name
    const appMapping = {
      seluna: 'Seluna App',
      scanner: 'Smart Doc Scanner',
      'doc-scanner': 'Smart Doc Scanner',
      'smart-doc-scanner': 'Smart Doc Scanner',
    };

    const appName = app ? appMapping[app.toLowerCase()] : null;

    // Update title
    let title = 'Delete Account Request';
    if (appName) {
      title = `Delete ${appName} Account`;
    }

    // Pre-select app in dropdown if app parameter provided
    if (appName && formContent) {
      // Replace the select options to mark the correct one as selected
      const optionPattern = new RegExp(
        `<option value="${appName}">${appName}</option>`,
        'g',
      );
      formContent = formContent.replace(
        optionPattern,
        `<option value="${appName}" selected>${appName}</option>`,
      );
    }

    return template
      .replace('{{SUCCESS_MESSAGE}}', successMessage)
      .replace('{{FORM_CONTENT}}', formContent)
      .replace('{{TITLE}}', title);
  }
}
