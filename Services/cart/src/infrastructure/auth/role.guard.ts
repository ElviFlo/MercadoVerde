// src/infrastructure/auth/role.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class ClientRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const u = req.user || {};
    const issOk = u.iss === process.env.JWT_ISS;
    const audOk = Array.isArray(u.aud)
      ? u.aud?.includes(process.env.JWT_AUD)
      : u.aud === process.env.JWT_AUD;
    const isClient = u.role === "client" && audOk;
    if (isClient || (u.role === "admin" && issOk)) return true; // si permites admin también
    throw new ForbiddenException("Requiere rol client");
  }
}
