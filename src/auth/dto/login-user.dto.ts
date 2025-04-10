// src/auth/dto/login-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'Имя пользователя' })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя пользователя не должно быть пустым' })
  readonly username: string;

  @ApiProperty({ description: 'Пароль пользователя' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  readonly password: string;
}
