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
exports.OrdersController = void 0;
var order_repository_1 = require("../repositories/order.repository");
var repo = new order_repository_1.OrderRepository();
exports.OrdersController = {
    // CLIENT: crear orden
    create: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var u, userId, authHeader, items, order, e_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        u = req.user;
                        userId = String((_a = u.sub) !== null && _a !== void 0 ? _a : u.id);
                        authHeader = req.headers.authorization;
                        items = (_b = req.body) === null || _b === void 0 ? void 0 : _b.items;
                        if (!Array.isArray(items) || items.length === 0) {
                            return [2 /*return*/, res.status(400).json({ message: "items[] requerido" })];
                        }
                        return [4 /*yield*/, repo.createOrder(userId, items, authHeader)];
                    case 1:
                        order = _d.sent();
                        return [2 /*return*/, res.status(201).json(order)];
                    case 2:
                        e_1 = _d.sent();
                        return [2 /*return*/, res
                                .status(400)
                                .json({ message: (_c = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) !== null && _c !== void 0 ? _c : "No se pudo crear la orden" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // ADMIN: listar todas
    listAll: function (_req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var orders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, repo.listAll()];
                    case 1:
                        orders = _a.sent();
                        return [2 /*return*/, res.json(orders)];
                }
            });
        });
    },
    // CLIENT: listar mis órdenes
    listMine: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var u, userId, orders;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        u = req.user;
                        userId = String((_a = u.sub) !== null && _a !== void 0 ? _a : u.id);
                        return [4 /*yield*/, repo.getByUser(userId)];
                    case 1:
                        orders = _b.sent();
                        return [2 /*return*/, res.json(orders)];
                }
            });
        });
    },
    // CLIENT: detalle de una orden propia
    getByIdClient: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, u, order;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = String(req.params.id);
                        u = req.user;
                        return [4 /*yield*/, repo.getByUser((_a = u.sub) !== null && _a !== void 0 ? _a : u.id)
                                .then(function (orders) { return orders.find(function (o) { return String(o.id) === id; }); })];
                    case 1:
                        order = _b.sent();
                        if (!order)
                            return [2 /*return*/, res.status(404).json({ message: "No encontrada o no autorizada" })];
                        return [2 /*return*/, res.json(order)];
                }
            });
        });
    },
    // ADMIN: detalle de cualquier orden
    getByIdAdmin: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = String(req.params.id);
                        return [4 /*yield*/, repo.getById(id)];
                    case 1:
                        order = _a.sent();
                        if (!order)
                            return [2 /*return*/, res.status(404).json({ message: "No encontrada" })];
                        return [2 /*return*/, res.json(order)];
                }
            });
        });
    },
};
