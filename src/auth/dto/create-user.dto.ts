import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';
import { Roles } from '../roles'; // Import the roles

export class CreateUserDto {
  @ApiProperty({ description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: 'Email пользователя' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'Пароль пользователя' })
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({
    description: 'Роль пользователя',
    default: Roles.USER,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn([Roles.USER, Roles.ADMIN], {
    message: 'Role must be either user or admin',
  })
  readonly role?: string;

  @ApiProperty({
    description: 'Тип приложения от которого регистрируется пользователь',
    example: 'doc-scan',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly appType?: string;
}
