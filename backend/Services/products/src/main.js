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
// Services/products/src/main.ts
require("dotenv/config");
var express_1 = require("express");
var cors_1 = require("cors");
// Rutas del dominio
var product_routes_1 = require("./infrastructure/routes/product.routes");
// Swagger
var product_swagger_1 = require("./infrastructure/swagger/product.swagger");
// Si usas PG (opcional)
var pg_1 = require("./infrastructure/db/pg");
var app = (0, express_1.default)();
var PORT = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3003);
// Seguridad y parsers
app.disable("x-powered-by");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ---------- Health público ----------
app.get("/health", function (_req, res) {
    res.status(200).json({ ok: true, service: "products" });
});
// ---------- Swagger público ----------
(0, product_swagger_1.setupSwagger)(app);
// ---------- Rutas ----------
app.use("/products", product_routes_1.default);
// 404 handler
app.use(function (_req, res) { return res.status(404).json({ message: "Not found" }); });
// Error handler
app.use(function (err, _req, res, _next) {
    console.error("[products] Error:", err);
    res
        .status((err === null || err === void 0 ? void 0 : err.status) || 500)
        .json({ message: (err === null || err === void 0 ? void 0 : err.message) || "Internal Server Error" });
});
var server = app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (pg_1.ensureSchema === null || pg_1.ensureSchema === void 0 ? void 0 : (0, pg_1.ensureSchema)())];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                _a = _b.sent();
                return [3 /*break*/, 3];
            case 3:
                console.log("\uD83D\uDFE2 Products service running on http://localhost:".concat(PORT, "/docs/ with Swagger"));
                return [2 /*return*/];
        }
    });
}); });
// Apagado limpio
var shutdown = function (signal) {
    console.log("[products] ".concat(signal, " recibido, cerrando servidor..."));
    server.close(function () { return process.exit(0); });
    setTimeout(function () { return process.exit(1); }, 10000).unref();
};
process.on("SIGINT", function () { return shutdown("SIGINT"); });
process.on("SIGTERM", function () { return shutdown("SIGTERM"); });
process.on("unhandledRejection", function (r) {
    return console.error("[products] Unhandled Rejection:", r);
});
process.on("uncaughtException", function (e) {
    return console.error("[products] Uncaught Exception:", e);
});
