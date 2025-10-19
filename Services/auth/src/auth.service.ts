import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  issueToken(user: any) {
    const roles = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : []);
    const payload = {
      sub: user.id ?? user.username ?? 'superadmin',
      email: user.email,
      role: roles[0] ?? 'client',
      roles,
    };

    // ⬇️ Fuerza iss/aud/ttl/alg en la firma
    const accessToken = this.jwt.sign(payload, {
      issuer: process.env.JWT_ISS || 'mercadoverde-auth',
      audience: process.env.JWT_AUD || 'mercadoverde-clients',
      expiresIn: (process.env.JWT_ACCESS_TTL ?? '2h') as any,
      algorithm: (process.env.JWT_ALG as any) || 'HS256',
    });

    return { accessToken, user: { id: payload.sub, email: payload.email, roles } };
  }
}
