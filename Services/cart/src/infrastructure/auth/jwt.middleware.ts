import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const h = req.headers?.authorization;
    if (!h?.startsWith('Bearer ')) throw new UnauthorizedException('Token requerido');
    const token = h.slice(7).trim();
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, {
        issuer: process.env.JWT_ISS || undefined,
        audience: process.env.JWT_AUD || undefined,
      }) as any;
      req.user = { sub: payload?.sub || payload?.id || payload?.userId };
      if (!req.user.sub) throw new UnauthorizedException('Token inválido');
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
