"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("../controllers/auth.controller");
var AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
var router = (0, express_1.Router)();
router.post("/register", auth_controller_1.AuthController.register);
router.post("/login/client", auth_controller_1.AuthController.login);
router.post("/login/admin", auth_controller_1.AuthController.loginAdmin);
router.get("/validate", AuthMiddleware_1.verifyAccessToken, auth_controller_1.AuthController.validate);
// pruebas de autorización
router.get("/me/admin", AuthMiddleware_1.verifyAccessToken, AuthMiddleware_1.requireAdmin, function (req, res) {
    res.json({ message: "OK admin", user: req.user });
});
router.get("/me/client", AuthMiddleware_1.verifyAccessToken, AuthMiddleware_1.requireClient, function (req, res) {
    res.json({ message: "OK client", user: req.user });
});
exports.default = router;
