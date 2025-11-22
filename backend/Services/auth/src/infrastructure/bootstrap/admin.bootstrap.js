"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSingleAdmin = ensureSingleAdmin;
// Services/auth/src/infrastructure/bootstrap/admin.bootstrap.ts
var client_1 = require("@prisma/client");
var bcrypt = require("bcrypt");
var prisma = new client_1.PrismaClient();
function requireEnv(name) {
    var v = process.env[name];
    if (!v || v.trim() === "")
        throw new Error("[auth] Falta la variable de entorno ".concat(name));
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
function ensureSingleAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var email, name, password, reset, existing, hashed, hashed, others;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    email = requireEnv("ADMIN_EMAIL");
                    name = requireEnv("ADMIN_NAME");
                    password = requireEnv("ADMIN_PASSWORD");
                    reset = String((_a = process.env.ADMIN_RESET_ON_START) !== null && _a !== void 0 ? _a : "false").toLowerCase() ===
                        "true";
                    return [4 /*yield*/, prisma.user.findUnique({ where: { email: email } })];
                case 1:
                    existing = _b.sent();
                    if (!!existing) return [3 /*break*/, 4];
                    return [4 /*yield*/, bcrypt.hash(password, 10)];
                case 2:
                    hashed = _b.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: { name: name, email: email, password: hashed, role: "ADMIN" },
                        })];
                case 3:
                    _b.sent();
                    console.log("[auth] Admin creado: ".concat(email));
                    return [3 /*break*/, 10];
                case 4:
                    if (!reset) return [3 /*break*/, 7];
                    return [4 /*yield*/, bcrypt.hash(password, 10)];
                case 5:
                    hashed = _b.sent();
                    return [4 /*yield*/, prisma.user.update({
                            where: { id: existing.id },
                            data: { name: name, password: hashed, role: "ADMIN" },
                        })];
                case 6:
                    _b.sent();
                    console.log("[auth] Admin asegurado y actualizado (reset=true): ".concat(email));
                    return [3 /*break*/, 10];
                case 7:
                    if (!(existing.role !== "ADMIN")) return [3 /*break*/, 9];
                    return [4 /*yield*/, prisma.user.update({
                            where: { id: existing.id },
                            data: { role: "ADMIN" },
                        })];
                case 8:
                    _b.sent();
                    console.log("[auth] Admin asegurado (rol promovido): ".concat(email));
                    return [3 /*break*/, 10];
                case 9:
                    console.log("[auth] Admin ya existente: ".concat(email));
                    _b.label = 10;
                case 10: return [4 /*yield*/, prisma.user.findMany({
                        where: { role: "ADMIN", email: { not: email } },
                        select: { id: true, email: true },
                    })];
                case 11:
                    others = _b.sent();
                    if (!(others.length > 0)) return [3 /*break*/, 13];
                    return [4 /*yield*/, prisma.user.updateMany({
                            where: { role: "ADMIN", email: { not: email } },
                            data: { role: "CLIENT" },
                        })];
                case 12:
                    _b.sent();
                    console.log("[auth] Se despromovieron ".concat(others.length, " admins \u201Cno oficiales\u201D a CLIENT."));
                    _b.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
