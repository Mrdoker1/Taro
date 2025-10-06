import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Токен сброса пароля из ссылки',
    example: 'abc123token456',
  })
  @IsString({ message: 'Токен должен быть строкой' })
  @IsNotEmpty({ message: 'Токен обязателен' })
  token: string;

  @ApiProperty({
    description: 'Новый пароль',
    example: 'newPassword123',
    minLength: 6,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @IsNotEmpty({ message: 'Новый пароль обязателен' })
  newPassword: string;
}
