// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Извлекаем требуемые роли, установленные декоратором
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // если роли не заданы, доступ разрешен
    }
    // Получаем объект запроса
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Проверяем, соответствует ли роль пользователя хотя бы одной из требуемых
    return requiredRoles.some(role => user?.role === role);
  }
}
