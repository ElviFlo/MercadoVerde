// Services/auth/src/infrastructure/bootstrap/admin.bootstrap.ts
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "")
    throw new Error(`[auth] Falta la variable de entorno ${name}`);
  return v;
}

/**
 * Crea (o asegura) el ÚNICO admin del sistema en base a .env.
 * - Si no existe, lo crea con rol "ADMIN".
 * - Si existe:
 *    - Asegura rol "ADMIN".
 *    - Si ADMIN_RESET_ON_START=true, actualiza nombre y password (re-hash).
 * - Despromueve cualquier otro usuario que tenga rol "ADMIN" (lo pasa a "CLIENT").
 */
export async function ensureSingleAdmin() {
  const email = requireEnv("ADMIN_EMAIL");
  const name = requireEnv("ADMIN_NAME");
  const password = requireEnv("ADMIN_PASSWORD");
  const reset =
    String(process.env.ADMIN_RESET_ON_START ?? "false").toLowerCase() ===
    "true";

  // Busca por email del admin “oficial”
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, password: hashed, role: "ADMIN" },
    });
    console.log(`[auth] Admin creado: ${email}`);
  } else {
    if (reset) {
      const hashed = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: existing.id },
        data: { name, password: hashed, role: "ADMIN" },
      });
      console.log(`[auth] Admin asegurado y actualizado (reset=true): ${email}`);
    } else if (existing.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: "ADMIN" },
      });
      console.log(`[auth] Admin asegurado (rol promovido): ${email}`);
    } else {
      console.log(`[auth] Admin ya existente: ${email}`);
    }
  }

  // Despromueve CUALQUIER otro admin que no sea el “oficial”
  const others = await prisma.user.findMany({
    where: { role: "ADMIN", email: { not: email } },
    select: { id: true, email: true },
  });

  if (others.length > 0) {
    await prisma.user.updateMany({
      where: { role: "ADMIN", email: { not: email } },
      data: { role: "CLIENT" },
    });
    console.log(
      `[auth] Se despromovieron ${others.length} admins “no oficiales” a CLIENT.`,
    );
  }
}
