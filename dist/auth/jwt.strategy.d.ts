import { ConfigService } from '@nestjs/config';
import { Roles } from './roles';
interface JwtPayload {
    id: string;
    role: keyof typeof Roles;
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): {
        userId: string;
        role: "USER" | "ADMIN";
    };
}
export {};
