import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './infrastructure/controllers/auth.controller';

const ACCESS_TTL = (process.env.JWT_ACCESS_TTL ?? '2h') as unknown as number; // o as any



@Module({
  imports: [
    JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: ACCESS_TTL, // ← ya casteado
    issuer: process.env.JWT_ISS || 'mercadoverde-auth',
    audience: process.env.JWT_AUD || 'mercadoverde-clients',
    algorithm: (process.env.JWT_ALG as any) || 'HS256',
  },
}),

  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
