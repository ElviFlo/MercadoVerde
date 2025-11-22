"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
/**
 * 🚫 MODO ÚNICO ADMIN
 * La promoción de usuarios está deshabilitada. El admin “oficial” se crea/asegura
 * en el arranque (ensureSingleAdmin). Este endpoint queda clausurado.
 *
 * Si quisieras habilitarlo temporalmente en dev, usa la flag
 *   ALLOW_PROMOTE=true
 * en el .env y reemplaza la respuesta por la lógica anterior.
 */
router.patch("/users/:userId/promote", function (_req, res) {
    var _a;
    var allow = String((_a = process.env.ALLOW_PROMOTE) !== null && _a !== void 0 ? _a : "false").toLowerCase() === "true";
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
exports.default = router;
