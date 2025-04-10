import { ResendOptions, ResendOptionsAsync } from './resend.interface';
export declare class ResendModule {
    static forRoot(options: ResendOptions): {
        module: typeof ResendModule;
        imports: import("@nestjs/common").DynamicModule[];
    };
    static forRootAsync(options: ResendOptionsAsync): {
        module: typeof ResendModule;
        imports: import("@nestjs/common").DynamicModule[];
    };
}
