"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
// cart/src/app.module.ts
var common_1 = require("@nestjs/common");
var axios_1 = require("@nestjs/axios");
var cart_controller_1 = require("./infrastructure/controllers/cart.controller");
var get_cart_summary_use_case_1 = require("./application/use-cases/get-cart-summary.use-case");
var add_to_cart_use_case_1 = require("./application/use-cases/add-to-cart.use-case");
var remove_from_cart_use_case_1 = require("./application/use-cases/remove-from-cart.use-case");
var clear_cart_use_case_1 = require("./application/use-cases/clear-cart.use-case");
var decrement_item_use_case_1 = require("./application/use-cases/decrement-item.use-case");
var cart_repository_1 = require("./infrastructure/repositories/cart.repository");
var cart_repository_impl_1 = require("./infrastructure/repositories/cart.repository.impl");
var products_client_1 = require("./infrastructure/clients/products.client");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                axios_1.HttpModule.register({
                    timeout: 5000,
                }),
            ],
            controllers: [cart_controller_1.CartController],
            providers: [
                // 🧠 Casos de uso
                get_cart_summary_use_case_1.GetCartSummaryUseCase,
                add_to_cart_use_case_1.AddToCartUseCase,
                remove_from_cart_use_case_1.RemoveFromCartUseCase,
                clear_cart_use_case_1.ClearCartUseCase,
                decrement_item_use_case_1.DecrementItemUseCase,
                // 🌐 Cliente HTTP a products_service
                products_client_1.ProductsClient,
                // 🗄️ Implementación del repositorio
                {
                    provide: cart_repository_1.CART_REPO,
                    useClass: cart_repository_impl_1.CartRepositoryImpl,
                },
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
