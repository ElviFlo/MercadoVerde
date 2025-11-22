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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// Services/auth/src/main.ts
require("dotenv/config");
var express_1 = require("express");
var cors_1 = require("cors");
var auth_routes_1 = require("./infrastructure/routes/auth.routes");
var auth_swagger_1 = require("./infrastructure/swagger/auth.swagger");
var admin_bootstrap_1 = require("./infrastructure/bootstrap/admin.bootstrap");
var auth_grpc_1 = require("./infrastructure/grpc/auth.grpc"); // 👈 NUEVO
var app = (0, express_1.default)();
var PORT = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001);
app.disable("x-powered-by");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", function (_req, res) {
    res.status(200).json({ ok: true, service: "auth" });
});
(0, auth_swagger_1.setupSwagger)(app);
// Rutas de Auth
app.use("/auth", auth_routes_1.default);
// 404
app.use(function (_req, res) { return res.status(404).json({ message: "Not found" }); });
// Errores
app.use(function (err, _req, res, _next) {
    console.error("[auth] Error:", err);
    res
        .status((err === null || err === void 0 ? void 0 : err.status) || 500)
        .json({ message: (err === null || err === void 0 ? void 0 : err.message) || "Internal Server Error" });
});
// Arranque con bootstrap de admin
var server = app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, admin_bootstrap_1.ensureSingleAdmin)()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, auth_grpc_1.startAuthGrpcServer)()];
            case 2:
                +(_a.sent()); // 👈 Levanta gRPC en paralelo al HTTP
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error("[auth] Error durante bootstrap:", e_1);
                return [3 /*break*/, 4];
            case 4:
                console.log("\uD83D\uDFE2 Auth service running on http://localhost:".concat(PORT, "/docs with Swagger"));
                return [2 /*return*/];
        }
    });
}); });
var shutdown = function (signal) {
    console.log("[auth] ".concat(signal, " recibido, cerrando servidor..."));
    server.close(function () { return process.exit(0); });
    setTimeout(function () { return process.exit(1); }, 10000).unref();
};
process.on("SIGINT", function () { return shutdown("SIGINT"); });
process.on("SIGTERM", function () { return shutdown("SIGTERM"); });
process.on("unhandledRejection", function (r) {
    return console.error("[auth] Unhandled Rejection:", r);
});
process.on("uncaughtException", function (e) {
    return console.error("[auth] Uncaught Exception:", e);
});
