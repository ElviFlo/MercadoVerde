"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = verifyAccessToken;
exports.requireAdmin = requireAdmin;
var jwt = require("jsonwebtoken");
function requireEnv(name) {
    var v = process.env[name];
    if (!v || v.trim() === "")
        throw new Error("[voice] Falta env ".concat(name));
    return v;
}
var JWT_SECRET = requireEnv("JWT_SECRET");
function verifyAccessToken(req, res, next) {
    var authHeader = req.headers.authorization || "";
    var match = authHeader.match(/^Bearer\s+(.+)$/i);
    var token = match === null || match === void 0 ? void 0 : match[1];
    if (!token) {
        return res.status(401).json({ message: "Falta Bearer token" });
    }
    try {
        var payload = jwt.verify(token, JWT_SECRET);
        var userId = payload.sub || payload.id;
        req.user = __assign(__assign({}, payload), { sub: userId });
        req.token = token; // 👈 guardar el JWT crudo para reenviarlo al Cart
        return next();
    }
    catch (e) {
        var code = (e === null || e === void 0 ? void 0 : e.name) === "TokenExpiredError" ? 401 : 403;
        return res.status(code).json({ message: "Token inválido" });
    }
}
function requireAdmin(req, res, next) {
    var u = req.user;
    if (!u)
        return res.status(401).json({ message: "No autenticado" });
    if (u.role !== "admin")
        return res.status(403).json({ message: "Solo admin" });
    return next();
}
