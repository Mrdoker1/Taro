import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class BypassAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Для разработки разрешаем все запросы к платежам
    return true;
  }
}
