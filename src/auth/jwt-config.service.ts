import { Injectable } from '@nestjs/common';
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions {
    return {
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '30d' }, // Токен на 30 дней - оптимальный баланс
    };
  }
}
