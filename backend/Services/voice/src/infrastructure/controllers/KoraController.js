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
exports.KoraController = void 0;
var NluParser_1 = require("../services/NluParser");
var products_service_1 = require("../../services/products.service");
var cart_service_1 = require("../../services/cart.service");
var KoraController = /** @class */ (function () {
    function KoraController() {
    }
    // -------- TEXTO: POST /api/kora/command --------
    KoraController.prototype.handleCommand = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var u, userId, authHeader, text, parsed, quantity, productQuery, found, chosen, cartResult, err_1;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 3, , 4]);
                        u = req.user;
                        if (!u) {
                            return [2 /*return*/, res.status(401).json({ message: "Usuario no autenticado" })];
                        }
                        userId = String((_a = u.sub) !== null && _a !== void 0 ? _a : u.id);
                        authHeader = req.headers.authorization;
                        text = req.body.text;
                        if (!text || typeof text !== "string") {
                            return [2 /*return*/, res.status(400).json({ message: "text requerido" })];
                        }
                        parsed = (0, NluParser_1.parseCommand)(text);
                        if (parsed.intent === "forbidden") {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ message: "Ese tipo de acción no está permitida por Kora" })];
                        }
                        if (parsed.intent !== "add" || !parsed.productName) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json({ message: "No entendí qué producto agregar" })];
                        }
                        quantity = (_b = parsed.quantity) !== null && _b !== void 0 ? _b : 1;
                        productQuery = parsed.productName;
                        console.log("[Kora] comando", { text: text, productQuery: productQuery, quantity: quantity, userId: userId }, "authHeader?", !!authHeader);
                        return [4 /*yield*/, products_service_1.ProductsService.searchProducts(productQuery, authHeader)];
                    case 1:
                        found = _g.sent();
                        console.log("[Kora] productos encontrados:", found === null || found === void 0 ? void 0 : found.length);
                        if (!found || found.length === 0) {
                            return [2 /*return*/, res.status(200).json({
                                    message: "No encontr\u00E9 el producto '".concat(productQuery, "' en el cat\u00E1logo."),
                                })];
                        }
                        chosen = found[0];
                        return [4 /*yield*/, cart_service_1.CartService.addToCart(userId, chosen.id, quantity, authHeader)];
                    case 2:
                        cartResult = _g.sent();
                        return [2 /*return*/, res.status(200).json({
                                message: "Agregu\u00E9 ".concat(quantity, " unidad(es) de '").concat(chosen.name, "' al carrito :)"),
                                product: chosen,
                                cart: cartResult,
                            })];
                    case 3:
                        err_1 = _g.sent();
                        console.error("[KoraController.handleCommand] error:", (_c = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _c === void 0 ? void 0 : _c.status, ((_d = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _d === void 0 ? void 0 : _d.data) || (err_1 === null || err_1 === void 0 ? void 0 : err_1.message));
                        return [2 /*return*/, res.status(500).json({
                                message: "Error procesando comando",
                                error: err_1 === null || err_1 === void 0 ? void 0 : err_1.message,
                                status: (_e = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _e === void 0 ? void 0 : _e.status,
                                data: (_f = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _f === void 0 ? void 0 : _f.data,
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // -------- AUDIO: POST /api/kora/voice --------
    KoraController.prototype.handleVoiceCommand = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var file, text;
            return __generator(this, function (_a) {
                try {
                    file = req.file;
                    if (!file) {
                        return [2 /*return*/, res.status(400).json({ message: "Falta archivo de audio" })];
                    }
                    text = "agrega dos cafés molidos";
                    req.body = { text: text };
                    return [2 /*return*/, this.handleCommand(req, res)];
                }
                catch (err) {
                    console.error("[KoraController.handleVoiceCommand] error:", err);
                    return [2 /*return*/, res.status(500).json({
                            message: "Error procesando comando de voz",
                            error: err === null || err === void 0 ? void 0 : err.message,
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    return KoraController;
}());
exports.KoraController = KoraController;
