import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email пользователя для сброса пароля',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @ApiProperty({
    description: 'Тип приложения, от которого приходит запрос',
    example: 'doc-scan',
    enum: ['doc-scan', 'taro'],
  })
  @IsNotEmpty({ message: 'Тип приложения обязателен' })
  // eslint-disable-next-line prettier/prettier
  @IsIn(['doc-scan', 'taro'], { message: 'Поддерживаемые типы приложений: doc-scan, taro' })
  appType: string;
}
