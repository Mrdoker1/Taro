import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        token: string;
    }>;
    confirm(userId: string): Promise<any>;
    getProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument> & import("./schemas/user.schema").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
