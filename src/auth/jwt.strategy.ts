import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Roles } from './roles';

interface JwtPayload {
  id?: string;
  userId?: string;
  role?: string; // Изменяем тип на string для гибкости
  email?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    console.log('JWT payload:', payload);

    // Поддерживаем оба формата токенов для совместимости
    const userId = payload.id || payload.userId;
    const role = payload.role || Roles.USER; // Используем правильную константу роли

    const user = { userId, role };
    console.log('JWT validated user:', user);
    return user;
  }
}
