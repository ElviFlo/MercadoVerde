// auth/src/domain/entities/User.ts

export type UserRole = "admin" | "client";

/**
 * Entidad de dominio alineada con prisma:
 * - id: number (autoincrement)
 * - name: string (usas "name", no "username")
 * - email: string
 * - password: string (hasheada en persistencia)
 * - role: 'admin' | 'client' (mapeado desde/para Prisma Role)
 * - createdAt: Date
 */
export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public role: UserRole = "client",
    public createdAt?: Date,
  ) {}
}
