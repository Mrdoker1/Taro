import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { loadTemplate } from './template-loader';

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
}
