import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { createUserDtoExample, loginUserDtoExample } from './dto/examples';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiBody({
    description: 'Данные для регистрации пользователя',
    type: CreateUserDto,
    examples: {
      example1: createUserDtoExample,
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно авторизован' })
  @ApiBody({
    description: 'Данные для авторизации пользователя',
    type: LoginUserDto,
    examples: {
      example1: loginUserDtoExample,
    },
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  // Эндпоинт для подтверждения аккаунта
  @Get('confirm/:userId')
  @ApiOperation({ summary: 'Подтверждение аккаунта по email' })
  @ApiResponse({ status: 200, description: 'Аккаунт успешно активирован' })
  async confirm(@Param('userId') userId: string) {
    return await this.authService.confirmUser(userId);
  }

  // Получение данных о текущем пользователе
  @Get('me')
  @UseGuards(AuthGuard('jwt')) // Защищаем эндпоинт
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiResponse({ status: 200, description: 'Информация о пользователе' })
  async getProfile(@Req() req) {
    return await this.authService.getUserById(req.user.userId);
  }
}
