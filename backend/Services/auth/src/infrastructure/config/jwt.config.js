"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
function requireEnv(name) {
    var val = process.env[name];
    if (!val || val.trim() === "") {
        throw new Error("[auth] Falta la variable de entorno ".concat(name));
    }
    return val;
}
function asExpiresIn(v) {
    if (!v)
        return "1h";
    var n = Number(v);
    return Number.isFinite(n) ? n : v;
}
exports.jwtConfig = {
    secret: requireEnv("JWT_SECRET"),
    accessTtl: asExpiresIn(process.env.JWT_ACCESS_TTL),
    refreshTtl: asExpiresIn(process.env.JWT_REFRESH_TTL) || "7d",
    issuer: requireEnv("JWT_ISS"), // 👈 obligatorio (admin)
    audience: requireEnv("JWT_AUD"), // 👈 obligatorio (cliente)
};
