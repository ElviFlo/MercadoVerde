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
exports.OrderRepository = void 0;
// Services/orders/src/infrastructure/repositories/order.repository.ts
var client_1 = require("@prisma/client");
var products_client_1 = require("../services/products.client");
var products_client_2 = require("../services/products.client");
var prisma = new client_1.PrismaClient();
var OrderRepository = /** @class */ (function () {
    function OrderRepository() {
    }
    OrderRepository.prototype.createOrder = function (userId, items, authHeader) {
        return __awaiter(this, void 0, void 0, function () {
            var enriched, total, reserved, _i, enriched_1, it, created, e_1, _a, reserved_1, r, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.all(items.map(function (i) { return __awaiter(_this, void 0, void 0, function () {
                            var p, nameSnapshot, unitPrice, quantity, subtotal;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, (0, products_client_1.fetchProduct)(i.productId, authHeader)];
                                    case 1:
                                        p = _d.sent();
                                        if (!(p === null || p === void 0 ? void 0 : p.id))
                                            throw new Error("Producto ".concat(i.productId, " no existe"));
                                        nameSnapshot = String((_a = p.name) !== null && _a !== void 0 ? _a : "");
                                        unitPrice = Number((_b = p.price) !== null && _b !== void 0 ? _b : 0);
                                        if (!(unitPrice >= 0))
                                            throw new Error("Precio inv\u00E1lido para ".concat(i.productId));
                                        quantity = Number((_c = i.quantity) !== null && _c !== void 0 ? _c : 0);
                                        if (!(quantity > 0))
                                            throw new Error("quantity inv\u00E1lido para ".concat(i.productId));
                                        subtotal = unitPrice * quantity;
                                        return [2 /*return*/, {
                                                productId: String(i.productId),
                                                nameSnapshot: nameSnapshot,
                                                unitPrice: unitPrice,
                                                quantity: quantity,
                                                subtotal: subtotal,
                                            }];
                                }
                            });
                        }); }))];
                    case 1:
                        enriched = _c.sent();
                        total = enriched.reduce(function (acc, it) { return acc + Number(it.subtotal); }, 0);
                        reserved = [];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 8, , 15]);
                        _i = 0, enriched_1 = enriched;
                        _c.label = 3;
                    case 3:
                        if (!(_i < enriched_1.length)) return [3 /*break*/, 6];
                        it = enriched_1[_i];
                        return [4 /*yield*/, (0, products_client_2.reserveProduct)(it.productId, it.quantity)];
                    case 4:
                        _c.sent();
                        reserved.push({ productId: it.productId, quantity: it.quantity });
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, prisma.order.create({
                            data: {
                                userId: userId,
                                status: "PENDING",
                                total: total,
                                items: { create: enriched },
                            },
                            include: { items: true },
                        })];
                    case 7:
                        created = _c.sent();
                        return [2 /*return*/, created];
                    case 8:
                        e_1 = _c.sent();
                        _a = 0, reserved_1 = reserved;
                        _c.label = 9;
                    case 9:
                        if (!(_a < reserved_1.length)) return [3 /*break*/, 14];
                        r = reserved_1[_a];
                        _c.label = 10;
                    case 10:
                        _c.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, (0, products_client_2.releaseProduct)(r.productId, r.quantity)];
                    case 11:
                        _c.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        _b = _c.sent();
                        return [3 /*break*/, 13];
                    case 13:
                        _a++;
                        return [3 /*break*/, 9];
                    case 14: throw e_1;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    OrderRepository.prototype.getById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prisma.order.findUnique({
                        where: { id: id },
                        include: { items: true },
                    })];
            });
        });
    };
    OrderRepository.prototype.getByUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prisma.order.findMany({
                        where: { userId: userId },
                        orderBy: { createdAt: "desc" },
                        include: { items: true },
                    })];
            });
        });
    };
    OrderRepository.prototype.listAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prisma.order.findMany({
                        orderBy: { createdAt: "desc" },
                        include: { items: true },
                    })];
            });
        });
    };
    return OrderRepository;
}());
exports.OrderRepository = OrderRepository;
