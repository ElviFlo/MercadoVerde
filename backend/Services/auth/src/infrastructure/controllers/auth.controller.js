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
exports.AuthController = void 0;
var RegisterUser_1 = require("../../application/use-cases/RegisterUser");
var LoginUser_1 = require("../../application/use-cases/LoginUser");
var ValidateToken_1 = require("../../application/use-cases/ValidateToken");
var UserRepository_1 = require("../repositories/UserRepository");
var jsonwebtoken_1 = require("jsonwebtoken");
// Inyección básica
var userRepository = new UserRepository_1.UserRepository();
var registerUser = new RegisterUser_1.RegisterUser(userRepository);
var loginUser = new LoginUser_1.LoginUser(userRepository);
var validateToken = new ValidateToken_1.ValidateToken();
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name_1, email, password, e_1;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        _a = (_b = req.body) !== null && _b !== void 0 ? _b : {}, name_1 = _a.name, email = _a.email, password = _a.password;
                        if (!name_1 || !email || !password) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ message: "name, email y password son requeridos" })];
                        }
                        return [4 /*yield*/, registerUser.execute(name_1, email, password)];
                    case 1:
                        _d.sent();
                        return [2 /*return*/, res.status(201).json({ message: "Usuario registrado" })];
                    case 2:
                        e_1 = _d.sent();
                        return [2 /*return*/, res
                                .status(400)
                                .json({ message: (_c = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _c !== void 0 ? _c : "Error registrando usuario" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Login de cliente
     * Acepta email O name + password
     * BLOQUEA si el usuario es admin (no debe poder entrar aquí)
     */
    AuthController.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, name_2, password, _b, role, token, normalizedRole, e_2;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        _a = (_c = req.body) !== null && _c !== void 0 ? _c : {}, email = _a.email, name_2 = _a.name, password = _a.password;
                        if ((!email && !name_2) || !password) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ message: "Debes enviar email o name, y el password" })];
                        }
                        return [4 /*yield*/, loginUser.execute({ email: email, name: name_2 }, password)];
                    case 1:
                        _b = _e.sent(), role = _b.role, token = _b.token;
                        normalizedRole = (role !== null && role !== void 0 ? role : "").toLowerCase();
                        // 🔒 Blindaje: este endpoint es SOLO para clientes
                        if (normalizedRole !== "client") {
                            return [2 /*return*/, res.status(403).json({ message: "Prohibido: solo client" })];
                        }
                        return [2 /*return*/, res.status(200).json({ role: normalizedRole, accessToken: token })];
                    case 2:
                        e_2 = _e.sent();
                        return [2 /*return*/, res
                                .status(401)
                                .json({ message: (_d = e_2 === null || e_2 === void 0 ? void 0 : e_2.message) !== null && _d !== void 0 ? _d : "Credenciales inválidas" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.validate = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var header, token, payload, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        header = req.headers.authorization || "";
                        token = header.startsWith("Bearer ") ? header.slice(7) : null;
                        if (!token)
                            return [2 /*return*/, res.status(401).json({ message: "Falta Bearer token" })];
                        return [4 /*yield*/, validateToken.execute(token)];
                    case 1:
                        payload = _b.sent();
                        return [2 /*return*/, res.json({ valid: true, payload: payload })];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, res
                                .status(401)
                                .json({ valid: false, message: "Token inválido o expirado" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Login de admin
     * Acepta email O name + password
     * Valida contra ADMIN_EMAIL / ADMIN_NAME y ADMIN_PASSWORD
     * Emite token con rol=admin
     */
    AuthController.loginAdmin = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, name_3, password, identifier, adminEmail, adminName, adminPassword, jwtSecret, jwtIss, jwtAud, accessTtl, identifierOk, payload, options, token;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                try {
                    _a = (_b = req.body) !== null && _b !== void 0 ? _b : {}, email = _a.email, name_3 = _a.name, password = _a.password;
                    identifier = (_c = (email !== null && email !== void 0 ? email : name_3)) === null || _c === void 0 ? void 0 : _c.trim();
                    if (!identifier || !password) {
                        return [2 /*return*/, res
                                .status(400)
                                .json({ message: "Debes enviar email o name, y el password" })];
                    }
                    adminEmail = process.env.ADMIN_EMAIL;
                    adminName = process.env.ADMIN_NAME;
                    adminPassword = process.env.ADMIN_PASSWORD;
                    jwtSecret = process.env.JWT_SECRET;
                    if (!jwtSecret) {
                        return [2 /*return*/, res.status(500).json({ message: "JWT_SECRET no configurado" })];
                    }
                    jwtIss = process.env.JWT_ISS || undefined;
                    jwtAud = process.env.JWT_AUD || undefined;
                    accessTtl = ((_d = process.env.JWT_ACCESS_TTL) !== null && _d !== void 0 ? _d : "2h");
                    identifierOk = (email && adminEmail && email === adminEmail) ||
                        (name_3 && adminName && name_3 === adminName);
                    if (!identifierOk || password !== adminPassword) {
                        return [2 /*return*/, res.status(401).json({ message: "Credenciales inválidas" })];
                    }
                    payload = {
                        sub: "superadmin",
                        role: "admin",
                        email: adminEmail,
                        name: adminName,
                    };
                    options = {
                        expiresIn: accessTtl,
                        issuer: jwtIss,
                        audience: jwtAud,
                    };
                    token = (0, jsonwebtoken_1.sign)(payload, jwtSecret, options);
                    return [2 /*return*/, res.status(200).json({ role: "admin", accessToken: token })];
                }
                catch (err) {
                    console.error("[auth] Error en loginAdmin:", err);
                    return [2 /*return*/, res.status(500).json({ message: "Error interno del servidor" })];
                }
                return [2 /*return*/];
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
