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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRepository = void 0;
exports.processCommand = processCommand;
var NluParser_1 = require("../../infrastructure/services/NluParser");
var axios_1 = require("axios");
var InMemoryAuditRepository_1 = require("../../infrastructure/repositories/InMemoryAuditRepository");
var AuditLog_1 = require("../../domain/entities/AuditLog");
var crypto_1 = require("crypto");
var fuzzy_1 = require("../../infrastructure/utils/fuzzy");
var PRODUCTS_URL = (_a = process.env.PRODUCTS_URL) !== null && _a !== void 0 ? _a : "http://localhost:3003";
var CART_URL = (_b = process.env.CART_URL) !== null && _b !== void 0 ? _b : "http://localhost:3005";
var MIN_CONF = Number((_c = process.env.MIN_CONFIDENCE) !== null && _c !== void 0 ? _c : 0.55);
var auditRepo = new InMemoryAuditRepository_1.InMemoryAuditRepository();
function processCommand(params) {
    return __awaiter(this, void 0, void 0, function () {
        var text, _a, userId, _b, source, _c, confidence, log, parsed_1, qty, productsResp, products, candidates, top_1, chosen_1, productDetailResp, productDetail, stock, addResp, err_1;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    text = params.text, _a = params.userId, userId = _a === void 0 ? null : _a, _b = params.source, source = _b === void 0 ? null : _b, _c = params.confidence, confidence = _c === void 0 ? null : _c;
                    log = new AuditLog_1.AuditLog((0, crypto_1.randomUUID)(), userId, source, text, confidence !== null && confidence !== void 0 ? confidence : null, new Date().toISOString(), "error", {});
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 24, , 26]);
                    if (!(confidence !== null && confidence < MIN_CONF)) return [3 /*break*/, 3];
                    log.result = "ambiguous";
                    log.details = { reason: "low_confidence", min: MIN_CONF };
                    return [4 /*yield*/, auditRepo.add(log)];
                case 2:
                    _g.sent();
                    return [2 /*return*/, { status: "ambiguous", message: "No se entendió con suficiente confianza. Por favor repite." }];
                case 3:
                    parsed_1 = (0, NluParser_1.parseCommand)(text);
                    if (!(parsed_1.intent === "forbidden")) return [3 /*break*/, 5];
                    log.result = "rejected";
                    log.details = { reason: "forbidden_intent" };
                    return [4 /*yield*/, auditRepo.add(log)];
                case 4:
                    _g.sent();
                    return [2 /*return*/, { status: "rejected", message: "Kora solo puede agregar productos al carrito. Usa la app para otras acciones." }];
                case 5:
                    if (!(parsed_1.intent !== "add")) return [3 /*break*/, 7];
                    log.result = "ambiguous";
                    log.details = { reason: "intent_not_add", parsed: parsed_1 };
                    return [4 /*yield*/, auditRepo.add(log)];
                case 6:
                    _g.sent();
                    return [2 /*return*/, { status: "ambiguous", message: "No detecté una intención de agregar. Dime por ejemplo: 'agrega 2 manzanas'." }];
                case 7:
                    if (!!userId) return [3 /*break*/, 9];
                    log.result = "needs_login";
                    return [4 /*yield*/, auditRepo.add(log)];
                case 8:
                    _g.sent();
                    return [2 /*return*/, { status: "needs_login", message: "Necesitas iniciar sesión para que pueda agregar al carrito." }];
                case 9:
                    qty = (_d = parsed_1.quantity) !== null && _d !== void 0 ? _d : 1;
                    return [4 /*yield*/, axios_1.default.get("".concat(PRODUCTS_URL, "/products")).catch(function (_) { return null; })];
                case 10:
                    productsResp = _g.sent();
                    products = (_e = productsResp === null || productsResp === void 0 ? void 0 : productsResp.data) !== null && _e !== void 0 ? _e : [];
                    if (!(!Array.isArray(products) || products.length === 0)) return [3 /*break*/, 12];
                    log.result = "error";
                    log.details = { reason: "products_unavailable" };
                    return [4 /*yield*/, auditRepo.add(log)];
                case 11:
                    _g.sent();
                    return [2 /*return*/, { status: "error", message: "No se pudo consultar el catálogo de productos." }];
                case 12:
                    candidates = products.map(function (p) {
                        var _a, _b, _c, _d, _e, _f;
                        return ({
                            id: (_c = (_b = (_a = p.id) !== null && _a !== void 0 ? _a : p._id) !== null && _b !== void 0 ? _b : p.productId) !== null && _c !== void 0 ? _c : "",
                            name: (_f = (_e = (_d = p.name) !== null && _d !== void 0 ? _d : p.nombre) !== null && _e !== void 0 ? _e : p.title) !== null && _f !== void 0 ? _f : "",
                        });
                    }).map(function (p) { var _a; return (__assign(__assign({}, p), { score: (0, fuzzy_1.similarity)(p.name, (_a = parsed_1.productName) !== null && _a !== void 0 ? _a : "") })); });
                    candidates.sort(function (a, b) { return b.score - a.score; });
                    top_1 = candidates.slice(0, 5).filter(function (c) { return c.score > 0.35; });
                    if (!(top_1.length === 0 || top_1[0].score < 0.5)) return [3 /*break*/, 14];
                    log.result = "ambiguous";
                    log.details = { parsed: parsed_1, candidates: top_1.slice(0, 3) };
                    return [4 /*yield*/, auditRepo.add(log)];
                case 13:
                    _g.sent();
                    return [2 /*return*/, { status: "ambiguous", message: "No pude encontrar el producto con seguridad. ¿Puedes repetir con el nombre más claro?", candidates: top_1.map(function (c) { return ({ id: c.id, name: c.name, score: c.score }); }) }];
                case 14:
                    if (!(top_1.length > 1 && (top_1[1].score > 0) && (top_1[0].score - top_1[1].score < 0.12))) return [3 /*break*/, 16];
                    log.result = "ambiguous";
                    log.details = { parsed: parsed_1, candidates: top_1.slice(0, 3) };
                    return [4 /*yield*/, auditRepo.add(log)];
                case 15:
                    _g.sent();
                    return [2 /*return*/, { status: "ambiguous", message: "Hay varios productos parecidos: " + top_1.slice(0, 3).map(function (c) { return c.name; }).join(", ") + ". ¿Cuál quieres?", candidates: top_1.slice(0, 3).map(function (c) { return ({ id: c.id, name: c.name, score: c.score }); }) }];
                case 16:
                    chosen_1 = top_1[0];
                    return [4 /*yield*/, axios_1.default.get("".concat(PRODUCTS_URL, "/products/").concat(chosen_1.id)).catch(function (_) { return null; })];
                case 17:
                    productDetailResp = _g.sent();
                    productDetail = (_f = productDetailResp === null || productDetailResp === void 0 ? void 0 : productDetailResp.data) !== null && _f !== void 0 ? _f : chosen_1;
                    stock = typeof productDetail.stock === "number" ? productDetail.stock : null;
                    if (!(stock !== null && stock < qty)) return [3 /*break*/, 19];
                    log.result = "rejected";
                    log.details = { parsed: parsed_1, chosen: chosen_1, stock: stock };
                    return [4 /*yield*/, auditRepo.add(log)];
                case 18:
                    _g.sent();
                    return [2 /*return*/, { status: "rejected", message: "No hay suficiente stock de ".concat(chosen_1.name, ". Hay ").concat(stock, ".") }];
                case 19: return [4 /*yield*/, axios_1.default.post("".concat(CART_URL, "/cart/items"), { userId: userId, productId: chosen_1.id, quantity: qty }).catch(function (e) {
                        var _a, _b;
                        log.result = "error";
                        log.details = { err: (_b = (_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : e.message, parsed: parsed_1, chosen: chosen_1 };
                        return null;
                    })];
                case 20:
                    addResp = _g.sent();
                    if (!!addResp) return [3 /*break*/, 22];
                    return [4 /*yield*/, auditRepo.add(log)];
                case 21:
                    _g.sent();
                    return [2 /*return*/, { status: "error", message: "No se pudo agregar al carrito por un error en el servicio cart." }];
                case 22:
                    log.result = "accepted";
                    log.details = { parsed: parsed_1, chosen: chosen_1, cartResponse: addResp.data };
                    return [4 /*yield*/, auditRepo.add(log)];
                case 23:
                    _g.sent();
                    return [2 /*return*/, { status: "ok", message: "Agregu\u00E9 ".concat(qty, " x ").concat(chosen_1.name, " a tu carrito."), productId: chosen_1.id, quantity: qty }];
                case 24:
                    err_1 = _g.sent();
                    log.result = "error";
                    log.details = { error: err_1.message || String(err_1) };
                    return [4 /*yield*/, auditRepo.add(log)];
                case 25:
                    _g.sent();
                    return [2 /*return*/, { status: "error", message: "Ocurrió un error procesando el comando." }];
                case 26: return [2 /*return*/];
            }
        });
    });
}
exports.auditRepository = auditRepo;
