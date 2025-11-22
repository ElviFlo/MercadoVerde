"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = verifyAccessToken;
exports.requireAdmin = requireAdmin;
exports.requireClient = requireClient;
var jwt = require("jsonwebtoken");
var jwt_config_1 = require("../config/jwt.config");
function getBearer(req) {
    var h = req.headers.authorization || "";
    return h.startsWith("Bearer ") ? h.slice(7) : null;
}
function verifyAccessToken(req, res, next) {
    var _a;
    try {
        var token = getBearer(req);
        if (!token)
            return res.status(401).json({ message: "Falta Bearer token" });
        var payload = jwt.verify(token, jwt_config_1.jwtConfig.secret);
        req.user = payload;
        return next();
    }
    catch (e) {
        return res.status(401).json({ message: (_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : "Token inválido" });
    }
}
function requireAdmin(req, res, next) {
    var user = req.user;
    if (!user)
        return res.status(401).json({ message: "No autenticado" });
    if (user.role !== "admin" || user.iss !== jwt_config_1.jwtConfig.issuer) {
        return res
            .status(403)
            .json({ message: "Requiere rol admin (iss inválido o role incorrecto)" });
    }
    return next();
}
function requireClient(req, res, next) {
    var user = req.user;
    if (!user)
        return res.status(401).json({ message: "No autenticado" });
    if (user.role !== "client" || user.aud !== jwt_config_1.jwtConfig.audience) {
        return res
            .status(403)
            .json({
            message: "Requiere rol client (aud inválido o role incorrecto)",
        });
    }
    return next();
}
