"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
// src/infrastructure/controllers/cart.controller.ts
var common_1 = require("@nestjs/common");
var jwt_middleware_1 = require("../auth/jwt.middleware");
var swagger_1 = require("@nestjs/swagger");
var add_to_cart_dto_1 = require("../dto/add-to-cart.dto");
var CartController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Cart'), (0, swagger_1.ApiBearerAuth)('bearerAuth'), (0, common_1.Controller)('cart'), (0, common_1.UseGuards)(jwt_middleware_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getByUser_decorators;
    var _addItem_decorators;
    var _decrementItem_decorators;
    var _removeItem_decorators;
    var _clear_decorators;
    var CartController = _classThis = /** @class */ (function () {
        function CartController_1(getCartSummary, addToCart, removeFromCart, clearCartUseCase, decrementItemUseCase) {
            this.getCartSummary = (__runInitializers(this, _instanceExtraInitializers), getCartSummary);
            this.addToCart = addToCart;
            this.removeFromCart = removeFromCart;
            this.clearCartUseCase = clearCartUseCase;
            this.decrementItemUseCase = decrementItemUseCase;
        }
        // 1) GET /cart
        CartController_1.prototype.getByUser = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId;
                var _a;
                return __generator(this, function (_b) {
                    userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub;
                    return [2 /*return*/, this.getCartSummary.execute(userId)];
                });
            });
        };
        // 2) POST /cart/items
        CartController_1.prototype.addItem = function (body, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, authHeader;
                var _a;
                return __generator(this, function (_b) {
                    userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub;
                    authHeader = req.headers['authorization'];
                    return [2 /*return*/, this.addToCart.execute({
                            userId: userId,
                            productId: body.productId,
                            quantity: body.quantity,
                            authHeader: authHeader,
                        })];
                });
            });
        };
        // 3) PATCH /cart/items/{productId}/decrement
        CartController_1.prototype.decrementItem = function (productId, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub;
                            return [4 /*yield*/, this.decrementItemUseCase.execute({ userId: userId, productId: productId })];
                        case 1:
                            _b.sent();
                            // devolvemos el resumen actualizado, igual que en remove
                            return [2 /*return*/, this.getCartSummary.execute(userId)];
                    }
                });
            });
        };
        // 4) DELETE /cart/items/{productId}
        CartController_1.prototype.removeItem = function (productId, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub;
                            return [4 /*yield*/, this.removeFromCart.execute({ userId: userId, productId: productId })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/, this.getCartSummary.execute(userId)];
                    }
                });
            });
        };
        // 5) DELETE /cart
        CartController_1.prototype.clear = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub;
                            return [4 /*yield*/, this.clearCartUseCase.execute(userId)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/, { message: 'Cart cleared' }];
                    }
                });
            });
        };
        return CartController_1;
    }());
    __setFunctionName(_classThis, "CartController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getByUser_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({
                summary: 'Obtener carrito del usuario autenticado',
                description: 'Disponible para usuarios con rol **client** o **admin** autenticados. ' +
                    'Usa el `sub` del JWT para devolver items, cantidad total y subtotal.',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Carrito obtenido correctamente.' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Token ausente o inválido.' })];
        _addItem_decorators = [(0, common_1.Post)('items'), (0, swagger_1.ApiOperation)({
                summary: 'Agregar producto al carrito',
                description: 'Agrega o incrementa un producto en el carrito del usuario autenticado (client o admin). ' +
                    'Valida con el microservicio de Products que el producto exista y esté activo.',
            }), (0, swagger_1.ApiBody)({ type: add_to_cart_dto_1.AddToCartDto }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Item agregado o actualizado en el carrito.',
            }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos.' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Token ausente o inválido.' })];
        _decrementItem_decorators = [(0, common_1.Patch)('items/:productId/decrement'), (0, swagger_1.ApiOperation)({
                summary: 'Disminuir en 1 la cantidad de un producto en el carrito',
                description: 'Disminuye en 1 la cantidad del producto indicado en el carrito del usuario autenticado. ' +
                    'Si la cantidad ya es 1, el item se mantiene y no se elimina. Pensado para flujo de client y admin.',
            }), (0, swagger_1.ApiParam)({ name: 'productId', description: 'ID del producto a decrementar' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Carrito actualizado después de decrementar el producto.',
            }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Token ausente o inválido.' })];
        _removeItem_decorators = [(0, common_1.Delete)('items/:productId'), (0, swagger_1.ApiOperation)({
                summary: 'Eliminar un producto del carrito',
                description: 'Elimina del carrito del usuario autenticado el producto indicado por `productId`. ' +
                    'Operación idempotente: si el producto no está, no falla.',
            }), (0, swagger_1.ApiParam)({ name: 'productId', description: 'ID del producto a eliminar' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Carrito actualizado después de eliminar el producto.',
            }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Token ausente o inválido.' })];
        _clear_decorators = [(0, common_1.Delete)(), (0, swagger_1.ApiOperation)({
                summary: 'Vaciar carrito',
                description: 'Elimina todos los items del carrito del usuario autenticado (client o admin).',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Carrito vaciado correctamente.',
            }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Token ausente o inválido.' })];
        __esDecorate(_classThis, null, _getByUser_decorators, { kind: "method", name: "getByUser", static: false, private: false, access: { has: function (obj) { return "getByUser" in obj; }, get: function (obj) { return obj.getByUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addItem_decorators, { kind: "method", name: "addItem", static: false, private: false, access: { has: function (obj) { return "addItem" in obj; }, get: function (obj) { return obj.addItem; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _decrementItem_decorators, { kind: "method", name: "decrementItem", static: false, private: false, access: { has: function (obj) { return "decrementItem" in obj; }, get: function (obj) { return obj.decrementItem; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeItem_decorators, { kind: "method", name: "removeItem", static: false, private: false, access: { has: function (obj) { return "removeItem" in obj; }, get: function (obj) { return obj.removeItem; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clear_decorators, { kind: "method", name: "clear", static: false, private: false, access: { has: function (obj) { return "clear" in obj; }, get: function (obj) { return obj.clear; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CartController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CartController = _classThis;
}();
exports.CartController = CartController;
