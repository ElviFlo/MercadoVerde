import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as any;

    const header = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined;
    if (!header || !header.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = header.slice(7).trim();
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!, {
        audience: process.env.JWT_AUD || undefined,
        issuer: process.env.JWT_ISS || undefined,
      });
      req.user = payload; // <- disponible en el controller: req.user?.sub / req.user?.id
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
