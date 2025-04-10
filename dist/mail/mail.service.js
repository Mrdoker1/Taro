"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const template_loader_1 = require("./template-loader");
const serverConfig_1 = require("../utils/serverConfig");
let MailService = class MailService {
    constructor() {
        this.initializeTransporter().catch((error) => {
            console.error('Error initializing transporter:', error);
        });
    }
    async initializeTransporter() {
        this.transporter = await this.createTransporter();
    }
    createTransporter() {
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
    createMailOptions(userEmail, html) {
        return {
            from: 'Renault Club',
            to: userEmail,
            subject: 'Подтверждение email',
            html,
        };
    }
    async sendConfirmationEmail(userEmail, userId) {
        const { port, server } = (0, serverConfig_1.getServerConfig)();
        const confirmationUrl = `http://${server}:${port}/auth/confirm/${userId}`;
        const html = await (0, template_loader_1.loadTemplate)('confirmation', { confirmationUrl });
        const mailOptions = this.createMailOptions(userEmail, html);
        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Confirmation email sent successfully');
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Ошибка при отправке письма');
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map