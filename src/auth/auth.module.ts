// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';
import { JwtConfigService } from './jwt-config.service';

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
