import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly jwtService;
    private userModel;
    private readonly mailService;
    private readonly logger;
    private readonly allowedRoles;
    private readonly popularEmailDomains;
    constructor(jwtService: JwtService, userModel: Model<UserDocument>, mailService: MailService);
    hashPassword(password: string): Promise<string>;
    comparePasswords(password: string, hash: string): Promise<boolean>;
    generateToken(user: {
        id: string;
        role: string;
    }): string;
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    private validateRole;
    private validateEmailDomain;
    private createUser;
    private saveUserAndSendConfirmation;
    checkUser(username: string, email: string, role: string): Promise<void>;
    checkUserExistence(username: string, email: string): Promise<void>;
    login(loginUserDto: LoginUserDto): Promise<{
        token: string;
    }>;
    confirmUser(userId: string): Promise<any>;
    getUserById(userId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
