import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Roles } from '../roles'; // Import roles

@Schema({ timestamps: true }) // Add timestamps for createdAt and updatedAt
export class User {
  @Prop({ required: true, unique: true })
  @IsString()
  @IsNotEmpty()
  username: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({ required: true })
  @IsString()
  @MinLength(6)
  password: string;

  @Prop({ required: true, enum: Object.values(Roles) }) // Use roles enum
  @IsString()
  role: string;

  @Prop({ default: false }) // По умолчанию аккаунт не активирован
  isActive: boolean;

  @Prop({ required: false }) // Тип приложения от которого зарегистрирован пользователь
  appType?: string;

  @Prop({ required: false }) // Дата истечения подписки (опционально)
  subscriptionExpiresAt?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1, email: 1 }); // Add indexing for username and email
