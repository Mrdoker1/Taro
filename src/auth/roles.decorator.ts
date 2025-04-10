// auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Roles as RoleTypes } from './roles';

export const Roles = (...roles: (keyof typeof RoleTypes)[]) =>
  SetMetadata('roles', roles);
