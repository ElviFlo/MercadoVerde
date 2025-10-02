// Services/auth/src/infrastructure/repositories/UserRepository.ts
import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User, UserRole } from "../../domain/entities/User";

const prisma = new PrismaClient();

function mapRoleFromDb(r: string): UserRole {
  return r === "ADMIN" ? "admin" : "client";
}
function mapRoleToDb(role: UserRole): "ADMIN" | "CLIENT" {
  return role === "admin" ? "ADMIN" : "CLIENT";
}

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { email } });
    if (!u) return null;
    return new User(
      String(u.id),        // asegura string
      u.name ?? "",        // evita null
      u.email,
      u.password,
      mapRoleFromDb(u.role as string),
      u.createdAt,
    );
  }

  async findByName(name: string): Promise<User | null> {
    const u = await prisma.user.findFirst({ where: { name } });
    if (!u) return null;
    return new User(
      String(u.id),
      u.name ?? "",
      u.email,
      u.password,
      mapRoleFromDb(u.role as string),
      u.createdAt,
    );
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: mapRoleToDb(user.role),
      },
    });
  }

  async updateRole(userId: string, role: UserRole): Promise<void> {
    await prisma.user.update({
      where: { id: userId },            // id: string (UUID)
      data: { role: mapRoleToDb(role) },
    });
  }
}
