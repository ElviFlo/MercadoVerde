// Services/auth/src/domain/entities/User.ts

export type UserRole = "admin" | "client";

/**
 * Entidad de dominio alineada con prisma:
 * - id: string (UUID)
 * - name: string
 * - email: string
 * - password: string (hasheada en persistencia)
 * - role: 'admin' | 'client'
 * - createdAt: Date
 */
export class User {
  constructor(
    public id: string,           // <-- UUID (string)
    public name: string,
    public email: string,
    public password: string,
    public role: UserRole = "client",
    public createdAt?: Date,
  ) {}
}
