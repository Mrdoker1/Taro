import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { loadTemplate } from './template-loader';
import { marked } from 'marked';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;

  constructor() {
    // Инициализируем Resend с API ключом
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.error('RESEND_API_KEY не установлен в переменных окружения');
      throw new Error('RESEND_API_KEY required');
    }
    this.resend = new Resend(apiKey);
    this.logger.log('Resend сервис инициализирован');
  }

  // Отправка email подтверждения (оставляем для совместимости)
  async sendConfirmationEmail(userEmail: string, userId: string) {
    const confirmationUrl = `${process.env.FRONTEND_URL || 'https://taroapi.uno'}/auth/confirm/${userId}`;

    // Загружаем HTML-шаблон
    const html = await loadTemplate('confirmation', { confirmationUrl });

    try {
      const { data, error } = await this.resend.emails.send({
        from: process.env.MAIL_FROM || 'Taro API <noreply@taroapi.uno>',
        to: [userEmail],
        subject: 'Подтверждение email - Taro API',
        html,
      });

      if (error) {
        this.logger.error('Ошибка отправки email подтверждения:', error);
        throw new Error('Ошибка при отправке письма');
      }

      this.logger.log(
        `Email подтверждения отправлен на ${userEmail}, ID: ${data?.id}`,
      );
    } catch (error) {
      this.logger.error('Ошибка отправки email:', error);
      throw new Error('Ошибка при отправке письма');
    }
  }

  // Отправка email для сброса пароля
  async sendPasswordResetEmail(
    userEmail: string,
    username: string,
    resetUrl: string,
    appName: string,
  ) {
    this.logger.log(
      `Отправляем email сброса пароля на: ${userEmail} от приложения: ${appName}`,
    );

    try {
      // Загружаем HTML-шаблон для сброса пароля
      const html = await loadTemplate('password-reset', {
        username,
        resetUrl,
        appName,
        validUntil: new Date(Date.now() + 15 * 60 * 1000).toLocaleString(
          'ru-RU',
        ),
      });

      const { data, error } = await this.resend.emails.send({
        from: process.env.MAIL_FROM || 'Viachas Kul <noreply@taroapi.uno>',
        to: [userEmail],
        subject: `🔐 Password Reset - ${appName}`,
        html,
      });

      if (error) {
        this.logger.error('Ошибка Resend API:', error);
        throw new Error(`Ошибка Resend: ${error.message}`);
      }

      this.logger.log(
        `Email сброса пароля отправлен на ${userEmail}, ID: ${data?.id}`,
      );
    } catch (error) {
      this.logger.error('Ошибка отправки email сброса пароля:', error.message);
      throw new Error('Ошибка при отправке письма для сброса пароля');
    }
  }

  // Массовая отправка email
  async sendBulkEmail(
    userEmail: string,
    username: string,
    subject: string,
    markdownContent: string,
  ) {
    this.logger.log(`Отправляем массовый email на: ${userEmail}`);

    try {
      // Конвертируем markdown в HTML (простая реализация)
      const htmlContent = this.markdownToHtml(markdownContent);

      const { data, error } = await this.resend.emails.send({
        from: process.env.MAIL_FROM || 'Seluna App <noreply@taroapi.uno>',
        to: [userEmail],
        subject: subject,
        html: this.wrapInEmailTemplate(username, htmlContent),
      });

      if (error) {
        this.logger.error('Ошибка Resend API:', error);
        throw new Error(`Ошибка Resend: ${error.message}`);
      }

      this.logger.log(`Email отправлен на ${userEmail}, ID: ${data?.id}`);
    } catch (error) {
      this.logger.error('Ошибка отправки email:', error.message);
      throw new Error('Ошибка при отправке письма');
    }
  }

  // Конвертация markdown в HTML с помощью marked
  private markdownToHtml(markdown: string): string {
    // Настройка marked для безопасного рендеринга
    marked.setOptions({
      breaks: true, // Переносы строк как <br>
      gfm: true, // GitHub Flavored Markdown
    });

    // Конвертируем markdown в HTML
    return marked.parse(markdown) as string;
  }

  // Обёртка HTML контента в email шаблон
  private wrapInEmailTemplate(username: string, content: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.5; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
        .email-wrapper { max-width: 600px; margin: 0 auto; }
        .container { background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden; }
        .header { padding: 32px 24px 0; text-align: center; }
        .app-name { font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 8px; }
        .content { padding: 24px; }
        .greeting { font-size: 16px; margin-bottom: 16px; color: #374151; }
        .message { font-size: 14px; line-height: 1.6; color: #4b5563; }
        .message h1 { font-size: 24px; font-weight: 700; color: #111827; margin: 20px 0 12px 0; }
        .message h2 { font-size: 20px; font-weight: 600; color: #1f2937; margin: 18px 0 10px 0; }
        .message h3 { font-size: 18px; font-weight: 600; color: #374151; margin: 16px 0 8px 0; }
        .message h4 { font-size: 16px; font-weight: 600; color: #4b5563; margin: 14px 0 8px 0; }
        .message h5 { font-size: 14px; font-weight: 600; color: #6b7280; margin: 12px 0 6px 0; }
        .message h6 { font-size: 12px; font-weight: 600; color: #9ca3af; margin: 10px 0 6px 0; }
        .message p { margin: 12px 0; }
        .message strong { font-weight: 600; color: #111827; }
        .message em { font-style: italic; }
        .message del { text-decoration: line-through; color: #9ca3af; }
        .message a { color: #8b5cf6; text-decoration: underline; }
        .message a:hover { color: #7c3aed; }
        .message code { background-color: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; font-size: 13px; color: #dc2626; }
        .message pre { background-color: #1f2937; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 16px 0; }
        .message pre code { background-color: transparent; padding: 0; color: #10b981; font-size: 13px; }
        .message blockquote { border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 16px 0; color: #6b7280; font-style: italic; }
        .message hr { border: none; border-top: 2px solid #e5e7eb; margin: 20px 0; }
        .message ul { margin: 12px 0; padding-left: 24px; list-style-type: disc; }
        .message ol { margin: 12px 0; padding-left: 24px; list-style-type: decimal; }
        .message li { margin: 6px 0; }
        .message img { max-width: 100%; height: auto; border-radius: 6px; margin: 12px 0; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { font-size: 12px; color: #6b7280; margin: 0; }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <div class="app-name">Seluna App</div>
            </div>
            <div class="content">
                <p class="greeting">Hello, <strong>${username}</strong></p>
                <div class="message"><p>${content}</p></div>
            </div>
            <div class="footer">
                <p class="footer-text">Seluna App Team</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  }
}
