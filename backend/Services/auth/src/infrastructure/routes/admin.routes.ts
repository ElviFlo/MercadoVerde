import { Router } from "express";

const router = Router();

/**
 * 🚫 MODO ÚNICO ADMIN
 * La promoción de usuarios está deshabilitada. El admin “oficial” se crea/asegura
 * en el arranque (ensureSingleAdmin). Este endpoint queda clausurado.
 *
 * Si quisieras habilitarlo temporalmente en dev, usa la flag
 *   ALLOW_PROMOTE=true
 * en el .env y reemplaza la respuesta por la lógica anterior.
 */
router.patch("/users/:userId/promote", (_req, res) => {
  const allow =
    String(process.env.ALLOW_PROMOTE ?? "false").toLowerCase() === "true";
  if (!allow) {
    return res
      .status(410)
      .json({
        message: "Promote deshabilitado: sistema en modo de único admin",
      });
  }

  // Si algún día lo reactivas, aquí re-montas la lógica anterior:
  // - Verificar token y requireAdmin
  // - userRepo.updateRole(userId, "admin") PERO OJO: rompería la regla de único admin
  //   (recomiendo NO usarlo en prod).
  return res.status(403).json({ message: "Promote temporalmente bloqueado" });
});

export default router;
