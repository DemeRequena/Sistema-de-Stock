import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      Array<'ADMIN' | 'USER'>
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as { userId: number; role: 'ADMIN' | 'USER' } | undefined;

    if (!user) return false;

    return requiredRoles.includes(user.role);
  }
}
