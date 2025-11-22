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
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.reserve = reserve;
exports.release = release;
var GetAllProducts_1 = require("../../application/use-cases/GetAllProducts");
var GetProductById_1 = require("../../application/use-cases/GetProductById");
var CreateProduct_1 = require("../../application/use-cases/CreateProduct");
var UpdateProduct_1 = require("../../application/use-cases/UpdateProduct");
var DeleteProduct_1 = require("../../application/use-cases/DeleteProduct");
var product_repository_impl_1 = require("../repositories/product.repository.impl");
// Simple wiring for the demo: construct repo + use-cases here. In a real app you'd use DI.
var repo = new product_repository_impl_1.InMemoryProductRepository();
var getAllUC = new GetAllProducts_1.GetAllProducts(repo);
var getByIdUC = new GetProductById_1.GetProductById(repo);
var createUC = new CreateProduct_1.CreateProduct(repo);
var updateUC = new UpdateProduct_1.UpdateProduct(repo);
var deleteUC = new DeleteProduct_1.DeleteProduct(repo);
function getAll(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var q, products, filtered;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    q = String((_a = req.query.q) !== null && _a !== void 0 ? _a : "").trim().toLowerCase();
                    return [4 /*yield*/, getAllUC.execute()];
                case 1:
                    products = _b.sent();
                    // 2) Si no hay query, devolvemos todo igual que antes
                    if (!q) {
                        return [2 /*return*/, res.json(products)];
                    }
                    filtered = products.filter(function (p) {
                        var _a, _b;
                        var name = ((_a = p.name) !== null && _a !== void 0 ? _a : "").toLowerCase();
                        var desc = ((_b = p.description) !== null && _b !== void 0 ? _b : "").toLowerCase();
                        return name.includes(q) || desc.includes(q);
                    });
                    return [2 /*return*/, res.json(filtered)];
            }
        });
    });
}
function getById(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    return [4 /*yield*/, getByIdUC.execute(id)];
                case 1:
                    p = _a.sent();
                    if (!p)
                        return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                    return [2 /*return*/, res.json(p)];
            }
        });
    });
}
function create(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var body, productCategoryId, dto, created;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    body = req.body;
                    productCategoryId = (_b = (_a = body.productCategoryId) !== null && _a !== void 0 ? _a : body.categoryId) !== null && _b !== void 0 ? _b : null;
                    dto = {
                        name: body.name,
                        description: (_c = body.description) !== null && _c !== void 0 ? _c : null,
                        price: body.price,
                        // rellenamos ambos campos del DTO, pero internamente usaremos productCategoryId
                        productCategoryId: productCategoryId,
                        categoryId: productCategoryId,
                        createdBy: (_e = (_d = req.user) === null || _d === void 0 ? void 0 : _d.email) !== null && _e !== void 0 ? _e : "unknown",
                        active: body.active,
                        stock: body.stock,
                    };
                    return [4 /*yield*/, createUC.execute(dto)];
                case 1:
                    created = _f.sent();
                    res.status(201).json(created);
                    return [2 /*return*/];
            }
        });
    });
}
function update(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, body, mapped, updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    body = req.body;
                    mapped = __assign({}, body);
                    if (mapped.productCategoryId == null && mapped.categoryId != null) {
                        mapped.productCategoryId = mapped.categoryId;
                    }
                    else if (mapped.productCategoryId != null && mapped.categoryId == null) {
                        mapped.categoryId = mapped.productCategoryId;
                    }
                    return [4 /*yield*/, updateUC.execute(__assign({ id: id }, mapped))];
                case 1:
                    updated = _a.sent();
                    if (!updated)
                        return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                    res.json(updated);
                    return [2 /*return*/];
            }
        });
    });
}
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    return [4 /*yield*/, deleteUC.execute(id)];
                case 1:
                    ok = _a.sent();
                    res.json({ ok: ok });
                    return [2 /*return*/];
            }
        });
    });
}
// POST /products/:id/reserve  { quantity }
function reserve(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, qty, p, updated;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    id = req.params.id;
                    qty = Number((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.quantity) !== null && _b !== void 0 ? _b : 0);
                    if (!(qty > 0))
                        return [2 /*return*/, res.status(400).json({ message: "quantity inválido" })];
                    return [4 /*yield*/, getByIdUC.execute(id)];
                case 1:
                    p = _f.sent();
                    if (!p)
                        return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                    if (((_c = p.stock) !== null && _c !== void 0 ? _c : 0) < qty)
                        return [2 /*return*/, res.status(400).json({ message: "stock insuficiente" })];
                    return [4 /*yield*/, updateUC.execute({ id: id, stock: ((_d = p.stock) !== null && _d !== void 0 ? _d : 0) - qty })];
                case 2:
                    updated = _f.sent();
                    return [2 /*return*/, res.json({ ok: true, remaining: (_e = updated === null || updated === void 0 ? void 0 : updated.stock) !== null && _e !== void 0 ? _e : 0 })];
            }
        });
    });
}
// POST /products/:id/release  { quantity }
function release(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, qty, p, updated;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    id = req.params.id;
                    qty = Number((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.quantity) !== null && _b !== void 0 ? _b : 0);
                    if (!(qty > 0))
                        return [2 /*return*/, res.status(400).json({ message: "quantity inválido" })];
                    return [4 /*yield*/, getByIdUC.execute(id)];
                case 1:
                    p = _e.sent();
                    if (!p)
                        return [2 /*return*/, res.status(404).json({ message: "Product not found" })];
                    return [4 /*yield*/, updateUC.execute({ id: id, stock: ((_c = p.stock) !== null && _c !== void 0 ? _c : 0) + qty })];
                case 2:
                    updated = _e.sent();
                    return [2 /*return*/, res.json({ ok: true, remaining: (_d = updated === null || updated === void 0 ? void 0 : updated.stock) !== null && _d !== void 0 ? _d : 0 })];
            }
        });
    });
}
