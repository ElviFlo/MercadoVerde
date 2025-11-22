"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = verifyAccessToken;
exports.requireAdmin = requireAdmin;
exports.requireClient = requireClient;
exports.requireAdminOrOwner = requireAdminOrOwner;
var jwt = require("jsonwebtoken");
require("dotenv/config");
var JWT_SECRET = process.env.JWT_SECRET;
var JWT_ISS = process.env.JWT_ISS;
var JWT_AUD = process.env.JWT_AUD;
function verifyAccessToken(req, res, next) {
    var header = req.headers.authorization || "";
    var token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token)
        return res.status(401).json({ message: "Falta Bearer token" });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    }
    catch (_a) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}
function requireAdmin(req, res, next) {
    var u = req.user;
    var ok = u && u.role === "admin" && u.iss === JWT_ISS;
    if (!ok)
        return res.status(403).json({ message: "Requiere rol admin" });
    next();
}
function requireClient(req, res, next) {
    var u = req.user;
    var hasAud = u && (Array.isArray(u.aud) ? u.aud.includes(JWT_AUD) : (u === null || u === void 0 ? void 0 : u.aud) === JWT_AUD);
    var ok = u && u.role === "client" && hasAud;
    if (!ok)
        return res.status(403).json({ message: "Requiere rol client" });
    next();
}
function requireAdminOrOwner() {
    return function (_req, _res, next) {
        var u = _req.user;
        if (!u)
            return _res.status(401).json({ message: "No autenticado" });
        if (u.role === "admin" && u.iss === JWT_ISS)
            return next();
        // si no es admin, el controller validará ownership comparando order.userId con u.sub
        return next();
    };
}
