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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const passport_1 = require("@nestjs/passport");
const examples_1 = require("./dto/examples");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(createUserDto) {
        return await this.authService.register(createUserDto);
    }
    async login(loginUserDto) {
        return await this.authService.login(loginUserDto);
    }
    async confirm(userId) {
        return await this.authService.confirmUser(userId);
    }
    async getProfile(req) {
        return await this.authService.getUserById(req.user.userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Регистрация нового пользователя' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Пользователь успешно зарегистрирован',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Данные для регистрации пользователя',
        type: create_user_dto_1.CreateUserDto,
        examples: {
            example1: examples_1.createUserDtoExample,
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Авторизация пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Пользователь успешно авторизован' }),
    (0, swagger_1.ApiBody)({
        description: 'Данные для авторизации пользователя',
        type: login_user_dto_1.LoginUserDto,
        examples: {
            example1: examples_1.loginUserDtoExample,
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('confirm/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Подтверждение аккаунта по email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Аккаунт успешно активирован' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirm", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить информацию о текущем пользователе' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Информация о пользователе' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map