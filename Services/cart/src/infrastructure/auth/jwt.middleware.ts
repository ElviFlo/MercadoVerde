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
      const secret = process.env.JWT_SECRET!;
      const aud = process.env.JWT_AUD;
      const iss = process.env.JWT_ISS;

      let payload: any;

      // Try verifying as client token (audience) first if configured
      if (aud) {
        try {
          payload = jwt.verify(token, secret, { audience: aud });
        } catch (e) {
          // if audience check fails and we have an issuer configured, try issuer
          if (iss) {
            payload = jwt.verify(token, secret, { issuer: iss });
          } else {
            throw e;
          }
        }
      } else if (iss) {
        // No audience configured, try issuer
        payload = jwt.verify(token, secret, { issuer: iss });
      } else {
        // No constraints configured, just verify signature
        payload = jwt.verify(token, secret);
      }

      req.user = payload; // available in controller: req.user?.sub / req.user?.id
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
