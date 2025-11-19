// src/infrastructure/auth/role.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

function isAudOk(u: any) {
  const envAud = process.env.JWT_AUD;
  return Array.isArray(u?.aud) ? u.aud.includes(envAud) : u?.aud === envAud;
}
function isIssOk(u: any) {
  const envIss = process.env.JWT_ISS;
  return !envIss || u?.iss === envIss;
}

@Injectable()
export class ClientRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const u = req.user ?? {};

    const ok =
      // cliente válido
      (u.role === 'client' && isAudOk(u)) ||
      // o admin (si quieres permitir que un admin “actúe” en endpoints de cliente)
      (u.role === 'admin' && isIssOk(u));

    if (ok) return true;
    throw new ForbiddenException('Requiere rol client');
  }
}

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const u = req.user ?? {};
    const ok = u.role === 'admin' && isIssOk(u);
    if (ok) return true;
    throw new ForbiddenException('Requiere rol admin');
  }
}
