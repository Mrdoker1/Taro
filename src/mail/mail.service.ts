import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { loadTemplate } from './template-loader'; // Import the loadTemplate function
import { getServerConfig } from 'src/utils/serverConfig';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.initializeTransporter().catch(error => {
      console.error('Error initializing transporter:', error);
    });
  }

  private async initializeTransporter() {
    this.transporter = await this.createTransporter();
  }

  private createTransporter() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  private createMailOptions(userEmail: string, html: string) {
    return {
      from: 'Renault Club',
      to: userEmail,
      subject: 'Подтверждение email',
      html,
    };
  }

  // Отправка email подтверждения
  async sendConfirmationEmail(userEmail: string, userId: string) {
    const { port, server } = getServerConfig();
    const confirmationUrl = `http://${server}:${port}/auth/confirm/${userId}`;

    // Загружаем HTML-шаблон
    const html = await loadTemplate('confirmation', { confirmationUrl });
    const mailOptions = this.createMailOptions(userEmail, html);

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Ошибка при отправке письма');
    }
  }
}
