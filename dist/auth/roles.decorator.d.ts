import { Roles as RoleTypes } from './roles';
export declare const Roles: (...roles: (keyof typeof RoleTypes)[]) => import("@nestjs/common").CustomDecorator<string>;
