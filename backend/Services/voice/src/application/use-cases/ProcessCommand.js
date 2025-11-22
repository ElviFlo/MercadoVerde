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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessCommand = void 0;
// src/application/use-cases/ProcessCommand.ts
var axios_1 = require("axios");
var wordsToNumber_1 = require("../../infrastructure/utils/wordsToNumber");
var AuditLog_1 = require("../../domain/entities/AuditLog");
var CART_BASE_URL = (_a = process.env.CART_URL) !== null && _a !== void 0 ? _a : "http://cart:3005";
var PRODUCTS_BASE_URL = (_b = process.env.PRODUCTS_URL) !== null && _b !== void 0 ? _b : "http://products:3003";
function normalizar(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}
// muy simple: "cafes" -> "cafe", "molidos" -> "molido"
function singular(word) {
    var w = normalizar(word);
    if (w.endsWith("s"))
        return w.slice(0, -1);
    return w;
}
var ProcessCommand = /** @class */ (function () {
    function ProcessCommand() {
    }
    ProcessCommand.prototype.execute = function (text, jwtToken) {
        return __awaiter(this, void 0, void 0, function () {
            var originalText, forbidden, qtyRegex, qtyMatch, quantity, cleaned, cleanedWords, products, resp, err_1, product, resp, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        originalText = text.toLowerCase().trim();
                        console.log("\uD83C\uDF99\uFE0F Comando: \"".concat(originalText, "\""));
                        forbidden = ["eliminar", "quitar", "borrar", "cambiar"];
                        if (forbidden.some(function (w) { return originalText.includes(w); })) {
                            return [2 /*return*/, {
                                    message: "Por ahora solo puedo agregar productos al carrito 😊",
                                }];
                        }
                        qtyRegex = /\b(cero|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|\d+)\b/;
                        qtyMatch = originalText.match(qtyRegex);
                        quantity = qtyMatch ? (0, wordsToNumber_1.wordsToNumber)(qtyMatch[0]) : 1;
                        cleaned = originalText
                            .replace(/\b(agrega|añade|agregar|añadir|compra|comprar|quiero|pon|pone|mete|ponme|meteme|al|carrito|por|favor|porfa)\b/g, "")
                            .replace(qtyRegex, "")
                            .trim();
                        cleaned = normalizar(cleaned);
                        if (!cleaned || cleaned.length < 2) {
                            return [2 /*return*/, {
                                    message: "No entendí qué producto quieres agregar. ¿Puedes repetirlo?",
                                }];
                        }
                        console.log("\uD83E\uDDE9 Producto interpretado: \"".concat(cleaned, "\""));
                        cleanedWords = cleaned
                            .split(/\s+/)
                            .filter(function (w) { return w.length > 1; })
                            .map(singular);
                        products = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get("".concat(PRODUCTS_BASE_URL, "/products"), {
                                headers: {
                                    // IMPORTANTE: Products también requiere JWT
                                    Authorization: "Bearer ".concat(jwtToken),
                                },
                            })];
                    case 2:
                        resp = _d.sent();
                        products = resp.data;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _d.sent();
                        console.error("❌ Error pidiendo Products:", ((_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) || err_1);
                        return [2 /*return*/, {
                                message: "No pude consultar el catálogo de productos. Intenta más tarde.",
                            }];
                    case 4:
                        if (!Array.isArray(products)) {
                            return [2 /*return*/, { message: "Error: Products devolvió un formato inválido." }];
                        }
                        product = products.find(function (p) {
                            var _a;
                            var nameNorm = normalizar((_a = p.name) !== null && _a !== void 0 ? _a : "");
                            return cleanedWords.every(function (word) { return nameNorm.includes(word); });
                        }) || // si no matchea todo, probamos con al menos una palabra
                            products.find(function (p) {
                                var _a;
                                var nameNorm = normalizar((_a = p.name) !== null && _a !== void 0 ? _a : "");
                                return cleanedWords.some(function (word) { return nameNorm.includes(word); });
                            });
                        if (!product) {
                            return [2 /*return*/, {
                                    message: "No encontr\u00E9 el producto \"".concat(cleaned, "\" en el cat\u00E1logo."),
                                }];
                        }
                        console.log("\u2705 Producto encontrado: ".concat(product.name, " (").concat(product.id, ")"));
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, axios_1.default.post("".concat(CART_BASE_URL, "/cart/items"), {
                                productId: product.id,
                                quantity: quantity,
                            }, {
                                headers: {
                                    Authorization: "Bearer ".concat(jwtToken),
                                },
                            })];
                    case 6:
                        resp = _d.sent();
                        console.log("🛒 Respuesta cart:", resp.data);
                        return [2 /*return*/, {
                                message: "Agregu\u00E9 ".concat(quantity, " unidad(es) de \"").concat(product.name, "\" al carrito \uD83D\uDED2"),
                            }];
                    case 7:
                        error_1 = _d.sent();
                        console.error("❌ Error comunicando con cart:", (_b = error_1.response) === null || _b === void 0 ? void 0 : _b.status, (_c = error_1.response) === null || _c === void 0 ? void 0 : _c.data);
                        return [2 /*return*/, {
                                message: "No pude agregar el producto al carrito. Intenta de nuevo más tarde.",
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ProcessCommand.prototype.logAttempt = function (command, status) {
        return __awaiter(this, void 0, void 0, function () {
            var log;
            return __generator(this, function (_a) {
                log = new AuditLog_1.AuditLog(command, status, new Date());
                console.log("\uD83E\uDDFE [Kora Log] ".concat(status.toUpperCase(), " \u2192 \"").concat(command, "\""));
                return [2 /*return*/];
            });
        });
    };
    return ProcessCommand;
}());
exports.ProcessCommand = ProcessCommand;
