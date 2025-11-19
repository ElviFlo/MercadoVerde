import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val || val.trim() === '') throw new Error(`[categories] Falta la variable de entorno ${name}`);
  return val;
}

const SECRET   = requireEnv('JWT_SECRET');
const JWT_ALG  = (process.env.JWT_ALG || 'HS256') as jwt.Algorithm;
const JWT_ISS  = process.env.JWT_ISS; // opcional si lo firmas en auth
const JWT_AUD  = process.env.JWT_AUD; // opcional si lo firmas en auth

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] as string | undefined;
    const match = typeof authHeader === 'string' ? authHeader.match(/^Bearer\s+(.+)$/i) : null;
    const token = match?.[1];

    if (!token) throw new UnauthorizedException("Token requerido. Usa 'Authorization: Bearer <token>'");

    try {
      const payload = jwt.verify(token, SECRET, {
        algorithms: [JWT_ALG],
        issuer: JWT_ISS,
        audience: JWT_AUD,
        clockTolerance: 5,
      }) as any;

      // Alineado con products: soporta { id, username } y también { sub }
      const userId = typeof payload === 'string' ? undefined : (payload.sub || payload.id);
      req.user = { ...(typeof payload === 'string' ? {} : payload), userId };
      return true;
    } catch (e: any) {
      // Token expirado -> 401, otros -> 403
      if (e?.name === 'TokenExpiredError') throw new UnauthorizedException('Token expirado');
      throw new ForbiddenException('Token inválido');
    }
  }
}
