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
exports.LoginUser = void 0;
// auth/src/application/use-cases/LoginUser.ts
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var jwt_config_1 = require("../../infrastructure/config/jwt.config");
var LoginUser = /** @class */ (function () {
    function LoginUser(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Login por email o por name (username).
     * Se firma el JWT según el rol persistido en DB:
     *  - admin  -> issuer (iss = JWT_ISS)
     *  - client -> audience (aud = JWT_AUD)
     */
    LoginUser.prototype.execute = function (identifier, password) {
        return __awaiter(this, void 0, void 0, function () {
            var email, name, user, isValid, payload, common, signOpts, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = identifier.email, name = identifier.name;
                        if (!email && !name) {
                            throw new Error("Debes enviar email o name para iniciar sesión");
                        }
                        user = null;
                        if (!email) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.userRepository.findByEmail(email.trim().toLowerCase())];
                    case 1:
                        user = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(!user && name)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.userRepository.findByName(name.trim())];
                    case 3:
                        user = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!user)
                            throw new Error("Credenciales inválidas");
                        return [4 /*yield*/, bcrypt.compare(password, user.password)];
                    case 5:
                        isValid = _a.sent();
                        if (!isValid)
                            throw new Error("Credenciales inválidas");
                        payload = {
                            sub: user.id, // id Int (autoincrement)
                            name: user.name, // tu campo real
                            email: user.email, // útil para otros servicios
                            role: user.role, // 'admin' | 'client'
                        };
                        common = {
                            expiresIn: jwt_config_1.jwtConfig.accessTtl,
                        };
                        signOpts = user.role === "admin"
                            ? __assign(__assign({}, common), { issuer: jwt_config_1.jwtConfig.issuer }) : __assign(__assign({}, common), { audience: jwt_config_1.jwtConfig.audience });
                        token = jwt.sign(payload, jwt_config_1.jwtConfig.secret, signOpts);
                        return [2 /*return*/, { role: user.role, token: token }];
                }
            });
        });
    };
    return LoginUser;
}());
exports.LoginUser = LoginUser;
