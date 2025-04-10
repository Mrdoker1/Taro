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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const mail_service_1 = require("../mail/mail.service");
const template_loader_1 = require("../mail/template-loader");
const roles_1 = require("./roles");
let AuthService = AuthService_1 = class AuthService {
    constructor(jwtService, userModel, mailService) {
        this.jwtService = jwtService;
        this.userModel = userModel;
        this.mailService = mailService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.allowedRoles = [roles_1.Roles.USER];
        this.popularEmailDomains = [
            'gmail.com',
            'mail.ru',
            'yahoo.com',
            'yandex.by',
        ];
    }
    async hashPassword(password) {
        try {
            return await bcrypt.hash(password, 10);
        }
        catch (error) {
            this.logger.error('Error hashing password', error.stack);
            throw new Error('Ошибка при хешировании пароля');
        }
    }
    async comparePasswords(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        }
        catch (error) {
            this.logger.error('Error comparing passwords', error.stack);
            throw new Error('Ошибка при сравнении паролей');
        }
    }
    generateToken(user) {
        return this.jwtService.sign({ id: user.id, role: user.role });
    }
    async register(createUserDto) {
        const { username, password, role, email } = createUserDto;
        try {
            await this.checkUser(username, email, role || roles_1.Roles.USER);
            await (0, template_loader_1.validateEmailTemplate)('confirmation');
        }
        catch (error) {
            throw new common_1.ConflictException(error.message);
        }
        const hashedPassword = await this.hashPassword(password);
        const newUser = this.createUser(username, hashedPassword, role || roles_1.Roles.USER, email);
        return this.saveUserAndSendConfirmation(newUser, username);
    }
    validateRole(role) {
        if (!role || !this.allowedRoles.includes(role)) {
            throw new common_1.ConflictException(`Создание пользователей с ролью ${role} запрещено`);
        }
    }
    validateEmailDomain(email) {
        const emailDomain = email.split('@')[1];
        if (!this.popularEmailDomains.includes(emailDomain)) {
            console.log('Неподдерживаемый домен email');
            throw new common_1.UnauthorizedException(`Мы поддерживаем только: ${this.popularEmailDomains.join(', ')}`);
        }
    }
    createUser(username, password, role, email) {
        if (!email) {
            console.log('Email не должен быть пустым');
            throw new common_1.UnauthorizedException('Email не должен быть пустым');
        }
        return new this.userModel({
            username,
            password,
            role,
            email,
            isActive: false,
        });
    }
    async saveUserAndSendConfirmation(newUser, username) {
        try {
            const savedUser = await newUser.save();
            await this.mailService.sendConfirmationEmail(savedUser.email, savedUser._id.toString());
            this.logger.log(`Пользователь ${username} зарегистрирован, письмо для подтверждения отправлено`);
            return {
                message: 'Пользователь успешно зарегистрирован. Письмо для подтверждения отправлено.',
            };
        }
        catch (error) {
            this.logger.error('Error during registration', error.stack);
            throw new Error('Ошибка при регистрации пользователя');
        }
    }
    async checkUser(username, email, role) {
        this.validateEmailDomain(email);
        this.validateRole(role || roles_1.Roles.USER);
        await this.checkUserExistence(username, email);
    }
    async checkUserExistence(username, email) {
        const existingUserByEmail = await this.userModel.findOne({ email });
        if (existingUserByEmail) {
            throw new common_1.ConflictException('Пользователь с таким email уже существует');
        }
        const existingUser = await this.userModel.findOne({ username });
        if (existingUser) {
            throw new common_1.ConflictException('Пользователь с таким именем уже существует');
        }
    }
    async login(loginUserDto) {
        const { username, password } = loginUserDto;
        const user = await this.userModel.findOne({ username });
        if (!user) {
            throw new common_1.UnauthorizedException('Неверное имя пользователя или пароль');
        }
        const passwordMatches = await this.comparePasswords(password, user.password);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Неверное имя пользователя или пароль');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Аккаунт не подтвержден. Пожалуйста, подтвердите email.');
        }
        const token = this.generateToken({
            id: user.id,
            role: user.role,
        });
        this.logger.log(`Пользователь ${username} успешно авторизован`);
        return { token };
    }
    async confirmUser(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Пользователь не найден');
        }
        if (user.isActive) {
            throw new common_1.UnauthorizedException('Аккаунт уже подтвержден');
        }
        user.isActive = true;
        await user.save();
        this.logger.log(`Аккаунт пользователя ${user.username} успешно подтвержден`);
        const html = await (0, template_loader_1.loadTemplate)('confirmation-success', {
            username: user.username,
        });
        return `${html}`;
    }
    async getUserById(userId) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) {
            throw new common_1.NotFoundException('Пользователь не найден');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        mongoose_2.Model,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map