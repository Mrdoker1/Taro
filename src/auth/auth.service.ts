import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { MailService } from '../mail/mail.service'; // Импортируем MailService

import { Roles } from './roles'; // Import the roles

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // Логер для сообщений

  // Define allowed roles using the imported Roles
  private readonly allowedRoles = [Roles.USER];

  private readonly popularEmailDomains = [
    'gmail.com',
    'mail.ru',
    'yahoo.com',
    'yandex.by',
    'yandex.ru',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'rambler.ru',
    'bk.ru',
    'list.ru',
    'inbox.ru',
    'yandex.com',
    'ya.ru',
  ];

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService, // Добавляем MailService
  ) {}

  // Хеширование пароля
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      this.logger.error('Error hashing password', error.stack);
      throw new Error('Ошибка при хешировании пароля');
    }
  }

  // Сравнение паролей
  async comparePasswords(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      this.logger.error('Error comparing passwords', error.stack);
      throw new Error('Ошибка при сравнении паролей');
    }
  }

  // Генерация JWT токена
  generateToken(user: { id: string; role: string }): string {
    this.logger.log(
      `Генерация токена для пользователя ID: ${user.id}, роль: ${user.role}`,
    );
    return this.jwtService.sign({ id: user.id, role: user.role });
  }

  // Регистрация пользователя
  async register(createUserDto: CreateUserDto) {
    const { username, password, role, email, appType } = createUserDto;

    try {
      await this.checkUser(username, email, role || Roles.USER);
    } catch (error) {
      throw new ConflictException(error.message);
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = this.createUser(
      username,
      hashedPassword,
      role || Roles.USER,
      email,
      appType,
    );

    return this.saveUserWithoutEmail(newUser, username);
  }

  private validateRole(role: string) {
    if (!role || !this.allowedRoles.includes(role)) {
      throw new ConflictException(
        `Создание пользователей с ролью ${role} запрещено`,
      );
    }
  }

  private validateEmailDomain(email: string): void {
    const emailDomain = email.split('@')[1];
    if (!this.popularEmailDomains.includes(emailDomain)) {
      console.log('Неподдерживаемый домен email');
      throw new UnauthorizedException(
        `Мы поддерживаем только: ${this.popularEmailDomains.join(', ')}`,
      );
    }
  }

  private createUser(
    username: string,
    password: string,
    role: string,
    email: string,
    appType?: string,
  ): UserDocument {
    if (!email) {
      console.log('Email не должен быть пустым');
      throw new UnauthorizedException('Email не должен быть пустым');
    }
    return new this.userModel({
      username,
      password,
      role,
      email,
      appType,
      isActive: false,
    });
  }

  private async saveUserWithoutEmail(newUser: UserDocument, username: string) {
    try {
      newUser.isActive = true; // Автоматически активируем всех пользователей
      const savedUser: UserDocument = await newUser.save();

      this.logger.log(
        `Пользователь ${username} зарегистрирован и автоматически активирован`,
      );

      return {
        message: 'Пользователь успешно зарегистрирован',
        user: savedUser,
        token: this.generateToken({
          id: (savedUser._id as any).toString(),
          role: savedUser.role,
        }),
      };
    } catch (error) {
      this.logger.error('Error during registration', error.stack);
      throw new Error('Ошибка при регистрации пользователя');
    }
  }

  async checkUser(username: string, email: string, role: string) {
    // Validate email domain before proceeding
    this.validateEmailDomain(email);
    this.validateRole(role || Roles.USER);
    await this.checkUserExistence(username, email);
  }

  async checkUserExistence(username: string, email: string) {
    const existingUserByEmail = await this.userModel.findOne({ email });
    if (existingUserByEmail) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Пользователь с таким именем уже существует');
    }
  }

  // Логика авторизации
  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    this.logger.log(`Попытка входа пользователя: ${username}`);

    // Ищем пользователя по username или email
    const user = await this.userModel.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      this.logger.warn(`Пользователь не найден: ${username}`);
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    this.logger.log(
      `Пользователь найден: ${user.username} (${user.email}), проверяем пароль`,
    );
    const passwordMatches = await this.comparePasswords(
      password,
      user.password,
    );

    this.logger.log(
      `Результат проверки пароля для ${username}: ${passwordMatches}`,
    );
    if (!passwordMatches) {
      this.logger.warn(`Неверный пароль для пользователя: ${username}`);
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    const token = this.generateToken({
      id: (user._id as any).toString(),
      role: user.role,
    });

    this.logger.log(`Пользователь ${user.username} успешно авторизован`);

    // Возвращаем токен и данные пользователя (без пароля)
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: (user as any).createdAt || new Date(),
      updatedAt: (user as any).updatedAt || new Date(),
      subscriptionExpiresAt: user.subscriptionExpiresAt,
    };

    return {
      token,
      user: userWithoutPassword,
    };
  }

  async getUserById(userId: string) {
    this.logger.log(`Поиск пользователя по ID: ${userId}`);
    const user = await this.userModel.findById(userId).select('-password'); // Убираем пароль из ответа
    if (!user) {
      this.logger.error(`Пользователь с ID ${userId} не найден`);
      throw new NotFoundException('Пользователь не найден');
    }
    this.logger.log(`Пользователь найден: ${user.email}`);
    return user;
  }

  // Обновление подписки пользователя
  async updateUserSubscription(
    userId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Обновляем дату истечения подписки
    if (updateSubscriptionDto.subscriptionExpiresAt) {
      user.subscriptionExpiresAt = new Date(
        updateSubscriptionDto.subscriptionExpiresAt,
      );
    }

    await user.save();

    this.logger.log(
      `Подписка пользователя ${user.username} обновлена до ${user.subscriptionExpiresAt?.toISOString() || 'не установлена'}`,
    );

    // Возвращаем пользователя без пароля
    return await this.userModel.findById(userId).select('-password');
  }

  // Смена пароля
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    this.logger.log(`Попытка смены пароля для пользователя ID: ${userId}`);

    const user = await this.userModel.findById(userId);
    if (!user) {
      this.logger.warn(`Пользователь с ID ${userId} не найден`);
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем текущий пароль
    const currentPasswordMatches = await this.comparePasswords(
      currentPassword,
      user.password,
    );

    if (!currentPasswordMatches) {
      this.logger.warn(
        `Неверный текущий пароль для пользователя ${user.username}`,
      );
      throw new UnauthorizedException('Текущий пароль неверен');
    }

    // Хешируем новый пароль
    const hashedNewPassword = await this.hashPassword(newPassword);

    // Обновляем пароль
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      updatedAt: new Date(),
    });

    this.logger.log(`Пароль для пользователя ${user.username} успешно изменен`);

    return { message: 'Пароль успешно изменен' };
  }
}
