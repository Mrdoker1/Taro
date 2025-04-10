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
import { MailService } from '../mail/mail.service'; // Импортируем MailService
import { loadTemplate, validateEmailTemplate } from '../mail/template-loader'; // Import the loadTemplate and validateEmailTemplate functions
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
    return this.jwtService.sign({ id: user.id, role: user.role });
  }

  // Регистрация пользователя
  async register(createUserDto: CreateUserDto) {
    const { username, password, role, email } = createUserDto;

    try {
      await this.checkUser(username, email, role || Roles.USER);

      // Validate email template before proceeding
      await validateEmailTemplate('confirmation');
    } catch (error) {
      throw new ConflictException(error.message);
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = this.createUser(
      username,
      hashedPassword,
      role || Roles.USER,
      email,
    );

    return this.saveUserAndSendConfirmation(newUser, username);
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
      isActive: false,
    });
  }

  private async saveUserAndSendConfirmation(
    newUser: UserDocument,
    username: string,
  ) {
    try {
      const savedUser: UserDocument = await newUser.save();
      await this.mailService.sendConfirmationEmail(
        savedUser.email,
        (savedUser._id as any).toString(),
      );

      this.logger.log(
        `Пользователь ${username} зарегистрирован, письмо для подтверждения отправлено`,
      );
      return {
        message:
          'Пользователь успешно зарегистрирован. Письмо для подтверждения отправлено.',
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
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    const passwordMatches = await this.comparePasswords(
      password,
      user.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Аккаунт не подтвержден. Пожалуйста, подтвердите email.',
      );
    }

    const token = this.generateToken({
      id: user.id,
      role: user.role,
    });

    this.logger.log(`Пользователь ${username} успешно авторизован`);
    return { token };
  }

  // Подтверждение аккаунта пользователя по ID
  async confirmUser(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (user.isActive) {
      throw new UnauthorizedException('Аккаунт уже подтвержден');
    }

    user.isActive = true;
    await user.save();

    this.logger.log(
      `Аккаунт пользователя ${user.username} успешно подтвержден`,
    );

    // Load the HTML template for the confirmation message
    const html = await loadTemplate('confirmation-success', {
      username: user.username,
    });

    return `${html}`;
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId).select('-password'); // Убираем пароль из ответа
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }
}
