"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = verifyAccessToken;
exports.requireAdmin = requireAdmin;
exports.requireClient = requireClient;
exports.allowAnyAuthenticated = allowAnyAuthenticated;
var jwt = require("jsonwebtoken");
require("dotenv/config");
function requireEnv(name) {
    var v = process.env[name];
    if (!v || v.trim() === "") {
        throw new Error("[products] Falta la variable de entorno ".concat(name));
    }
    return v;
}
var JWT_SECRET = requireEnv("JWT_SECRET");
var JWT_ISS = requireEnv("JWT_ISS"); // para admins
var JWT_AUD = requireEnv("JWT_AUD"); // para clientes
var JWT_ALG = (process.env.JWT_ALG || "HS256");
/**
 * ✅ Verifica el JWT y deja el payload en req.user.
 * No fuerza issuer/audience aquí; lo validan los guards por rol.
 */
function verifyAccessToken(req, res, next) {
    var _a, _b, _c;
    var header = req.headers.authorization || "";
    var token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) {
        return res.status(401).json({ message: "Falta Bearer token" });
    }
    try {
        var payload = jwt.verify(token, JWT_SECRET, {
            algorithms: [JWT_ALG],
            clockTolerance: 5,
        });
        // Normalizamos y convertimos el rol a minúsculas
        req.user = {
            sub: (_b = (_a = payload.sub) !== null && _a !== void 0 ? _a : payload.id) !== null && _b !== void 0 ? _b : payload.userId,
            name: payload.name,
            email: payload.email,
            role: ((_c = payload.role) !== null && _c !== void 0 ? _c : "").toString().toLowerCase(),
            iss: payload.iss,
            aud: payload.aud,
            iat: payload.iat,
            exp: payload.exp,
        };
        return next();
    }
    catch (e) {
        console.error("[products] JWT ERROR:", e === null || e === void 0 ? void 0 : e.name, e === null || e === void 0 ? void 0 : e.message);
        var code = (e === null || e === void 0 ? void 0 : e.name) === "TokenExpiredError" ? 401 : 401;
        return res.status(code).json({ message: "Token inválido o expirado" });
    }
}
/** ✅ Guard: solo ADMIN (rol + issuer si existe) */
function requireAdmin(req, res, next) {
    var u = req.user;
    if (!u)
        return res.status(401).json({ message: "No autenticado" });
    var isAdmin = u.role === "admin";
    // Si viene issuer en el token, que coincida; si no viene, no bloquea
    var issuerOk = !u.iss || u.iss === JWT_ISS;
    if (!(isAdmin && issuerOk)) {
        console.log("[requireAdmin] user payload:", u); // 👈 Debug temporal
        return res.status(403).json({ message: "Requiere rol admin" });
    }
    next();
}
/** ✅ Guard: solo CLIENT (rol + audience) */
function requireClient(req, res, next) {
    var u = req.user;
    if (!u)
        return res.status(401).json({ message: "No autenticado" });
    var hasAud = Array.isArray(u.aud)
        ? u.aud.includes(JWT_AUD)
        : u.aud === JWT_AUD;
    var ok = u.role === "client" && hasAud;
    if (!ok)
        return res.status(403).json({ message: "Requiere rol client" });
    next();
}
/**
 * ✅ Guard para endpoints de lectura: permite admin o client autenticado.
 */
function allowAnyAuthenticated(req, res, next) {
    var u = req.user;
    if (!u)
        return res.status(401).json({ message: "No autenticado" });
    // Admin válido (si viene issuer, debe coincidir)
    if (u.role === "admin" && (!u.iss || u.iss === JWT_ISS))
        return next();
    // Client válido
    var hasAud = Array.isArray(u.aud)
        ? u.aud.includes(JWT_AUD)
        : u.aud === JWT_AUD;
    if (u.role === "client" && hasAud)
        return next();
    return res.status(403).json({ message: "Prohibido" });
}
