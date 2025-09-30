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
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
// src/infrastructure/controllers/cart.controller.ts
var jwt_middleware_1 = require("../auth/jwt.middleware");
;
var CartController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('cart'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_middleware_1.JwtAuthGuard), (0, common_1.Controller)('cart')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getItems_decorators;
    var _addItem_decorators;
    var _removeItemByBody_decorators;
    var _removeItemByParam_decorators;
    var _clear_decorators;
    var CartController = _classThis = /** @class */ (function () {
        function CartController_1(addUC, getUC, removeUC) {
            this.addUC = (__runInitializers(this, _instanceExtraInitializers), addUC);
            this.getUC = getUC;
            this.removeUC = removeUC;
        }
        CartController_1.prototype.getItems = function (req) {
            var _a, _b, _c;
            var userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) !== null && _b !== void 0 ? _b : (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
            return this.getUC.execute(userId);
        };
        CartController_1.prototype.addItem = function (req, dto) {
            var _a, _b, _c;
            var userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) !== null && _b !== void 0 ? _b : (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
            return this.addUC.execute({
                userId: userId,
                productId: dto.productId, // UUID string
                quantity: dto.quantity,
                price: dto.price,
            });
        };
        CartController_1.prototype.removeItemByBody = function (req, dto) {
            var _a, _b, _c;
            var userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) !== null && _b !== void 0 ? _b : (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
            return this.removeUC.execute({ userId: userId, productId: dto.productId });
        };
        CartController_1.prototype.removeItemByParam = function (req, productId) {
            var _a, _b, _c;
            var userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) !== null && _b !== void 0 ? _b : (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
            return this.removeUC.execute({ userId: userId, productId: productId });
        };
        CartController_1.prototype.clear = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, items, _i, items_1, it;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.sub) !== null && _b !== void 0 ? _b : (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
                            return [4 /*yield*/, this.getUC.execute(userId)];
                        case 1:
                            items = _d.sent();
                            _i = 0, items_1 = items;
                            _d.label = 2;
                        case 2:
                            if (!(_i < items_1.length)) return [3 /*break*/, 5];
                            it = items_1[_i];
                            return [4 /*yield*/, this.removeUC.execute({ userId: userId, productId: it.productId })];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, { ok: true, cleared: items.length }];
                    }
                });
            });
        };
        return CartController_1;
    }());
    __setFunctionName(_classThis, "CartController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getItems_decorators = [(0, common_1.Get)('items')];
        _addItem_decorators = [(0, common_1.Post)('items')];
        _removeItemByBody_decorators = [(0, common_1.Delete)('items')];
        _removeItemByParam_decorators = [(0, common_1.Delete)('items/:productId'), (0, swagger_1.ApiParam)({
                name: 'productId',
                description: 'UUID del producto',
                example: 'a3f1bc00-9e5a-4d3b-84d4-7a1f3d0a7f3a',
            })];
        _clear_decorators = [(0, common_1.Delete)('clear')];
        __esDecorate(_classThis, null, _getItems_decorators, { kind: "method", name: "getItems", static: false, private: false, access: { has: function (obj) { return "getItems" in obj; }, get: function (obj) { return obj.getItems; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addItem_decorators, { kind: "method", name: "addItem", static: false, private: false, access: { has: function (obj) { return "addItem" in obj; }, get: function (obj) { return obj.addItem; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeItemByBody_decorators, { kind: "method", name: "removeItemByBody", static: false, private: false, access: { has: function (obj) { return "removeItemByBody" in obj; }, get: function (obj) { return obj.removeItemByBody; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeItemByParam_decorators, { kind: "method", name: "removeItemByParam", static: false, private: false, access: { has: function (obj) { return "removeItemByParam" in obj; }, get: function (obj) { return obj.removeItemByParam; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _clear_decorators, { kind: "method", name: "clear", static: false, private: false, access: { has: function (obj) { return "clear" in obj; }, get: function (obj) { return obj.clear; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CartController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CartController = _classThis;
}();
exports.CartController = CartController;
