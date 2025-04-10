import { DynamicModule } from '@nestjs/common';
import { ResendOptions, ResendOptionsAsync } from './resend.interface';
export declare class ResendCoreModule {
    static forRoot(options: ResendOptions): DynamicModule;
    static forRootAsync(options: ResendOptionsAsync): DynamicModule;
}
