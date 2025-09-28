"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductError = void 0;
var ProductError = /** @class */ (function (_super) {
    __extends(ProductError, _super);
    function ProductError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ProductError';
        return _this;
    }
    ProductError.notFound = function () {
        return new ProductError('Producto no encontrado.');
    };
    ProductError.invalidData = function () {
        return new ProductError('Datos de producto inválidos.');
    };
    return ProductError;
}(Error));
exports.ProductError = ProductError;
