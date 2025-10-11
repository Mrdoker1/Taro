// src/auth/dto/login-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'Имя пользователя или email' })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя пользователя не должно быть пустым' })
  readonly username: string;

  @ApiProperty({ description: 'Пароль пользователя' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  readonly password: string;

  @ApiProperty({
    description: 'Тип приложения',
    example: 'doc-scan',
    enum: ['doc-scan', 'taro'],
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['doc-scan', 'taro'], {
    message: 'appType must be either doc-scan or taro',
  })
  readonly appType: string;
}
