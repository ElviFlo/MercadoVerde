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
exports.AdminRoleGuard = exports.ClientRoleGuard = void 0;
// src/infrastructure/auth/role.guard.ts
var common_1 = require("@nestjs/common");
function isAudOk(u) {
    var envAud = process.env.JWT_AUD;
    return Array.isArray(u === null || u === void 0 ? void 0 : u.aud) ? u.aud.includes(envAud) : (u === null || u === void 0 ? void 0 : u.aud) === envAud;
}
function isIssOk(u) {
    var envIss = process.env.JWT_ISS;
    return !envIss || (u === null || u === void 0 ? void 0 : u.iss) === envIss;
}
var ClientRoleGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ClientRoleGuard = _classThis = /** @class */ (function () {
        function ClientRoleGuard_1() {
        }
        ClientRoleGuard_1.prototype.canActivate = function (context) {
            var _a;
            var req = context.switchToHttp().getRequest();
            var u = (_a = req.user) !== null && _a !== void 0 ? _a : {};
            var ok = 
            // cliente válido
            (u.role === 'client' && isAudOk(u)) ||
                // o admin (si quieres permitir que un admin “actúe” en endpoints de cliente)
                (u.role === 'admin' && isIssOk(u));
            if (ok)
                return true;
            throw new common_1.ForbiddenException('Requiere rol client');
        };
        return ClientRoleGuard_1;
    }());
    __setFunctionName(_classThis, "ClientRoleGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClientRoleGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClientRoleGuard = _classThis;
}();
exports.ClientRoleGuard = ClientRoleGuard;
var AdminRoleGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminRoleGuard = _classThis = /** @class */ (function () {
        function AdminRoleGuard_1() {
        }
        AdminRoleGuard_1.prototype.canActivate = function (context) {
            var _a;
            var req = context.switchToHttp().getRequest();
            var u = (_a = req.user) !== null && _a !== void 0 ? _a : {};
            var ok = u.role === 'admin' && isIssOk(u);
            if (ok)
                return true;
            throw new common_1.ForbiddenException('Requiere rol admin');
        };
        return AdminRoleGuard_1;
    }());
    __setFunctionName(_classThis, "AdminRoleGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminRoleGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminRoleGuard = _classThis;
}();
exports.AdminRoleGuard = AdminRoleGuard;
