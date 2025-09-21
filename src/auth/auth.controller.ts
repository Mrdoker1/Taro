import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Patch,
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
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
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

  // Получение данных о текущем пользователе
  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // Защищаем эндпоинт
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiResponse({ status: 200, description: 'Информация о пользователе' })
  async getProfile(@Req() req) {
    return await this.authService.getUserById(req.user.userId);
  }

  // Обновление подписки пользователя
  @Patch('update-subscription')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить подписку пользователя' })
  @ApiResponse({ status: 200, description: 'Подписка успешно обновлена' })
  @ApiBody({
    description: 'Данные для обновления подписки',
    type: UpdateSubscriptionDto,
  })
  async updateSubscription(
    @Req() req,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return await this.authService.updateUserSubscription(
      req.user.userId,
      updateSubscriptionDto,
    );
  }

  // Смена пароля
  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Изменить пароль пользователя' })
  @ApiResponse({ status: 200, description: 'Пароль успешно изменен' })
  @ApiResponse({ status: 401, description: 'Неверный текущий пароль' })
  @ApiBody({
    description: 'Данные для смены пароля',
    type: ChangePasswordDto,
  })
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(
      req.user.userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}
