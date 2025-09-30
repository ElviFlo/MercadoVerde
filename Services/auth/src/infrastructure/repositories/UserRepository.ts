// Services/auth/src/infrastructure/repositories/UserRepository.ts
import { PrismaClient, Role } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User, UserRole } from "../../domain/entities/User";

const prisma = new PrismaClient();

function mapRole(r: Role): UserRole {
  return r === Role.ADMIN ? "admin" : "client";
}

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { email } }); // email sí es @unique
    if (!u) return null;
    return new User(
      u.id,
      u.name,
      u.email,
      u.password,
      mapRole(u.role),
      u.createdAt,
    );
  }

  async findByName(name: string): Promise<User | null> {
    // name NO es único en tu schema, por eso usamos findFirst
    const u = await prisma.user.findFirst({ where: { name } });
    if (!u) return null;
    return new User(
      u.id,
      u.name,
      u.email,
      u.password,
      mapRole(u.role),
      u.createdAt,
    );
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role === "admin" ? Role.ADMIN : Role.CLIENT,
      },
    });
  }

  async updateRole(userId: number, role: UserRole): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { role: role === "admin" ? Role.ADMIN : Role.CLIENT },
    });
  }
}
