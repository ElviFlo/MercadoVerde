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
exports.JwtAuthGuard = void 0;
var common_1 = require("@nestjs/common");
var jwt = require("jsonwebtoken");
var JwtAuthGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var JwtAuthGuard = _classThis = /** @class */ (function () {
        function JwtAuthGuard_1() {
        }
        JwtAuthGuard_1.prototype.canActivate = function (context) {
            var req = context.switchToHttp().getRequest();
            var header = (req.headers['authorization'] || req.headers['Authorization']);
            if (!header || !header.toLowerCase().startsWith('bearer ')) {
                throw new common_1.UnauthorizedException('Missing Bearer token');
            }
            var token = header.slice(7).trim();
            try {
                var secret = process.env.JWT_SECRET;
                var aud = process.env.JWT_AUD;
                var iss = process.env.JWT_ISS;
                var payload = void 0;
                // Try verifying as client token (audience) first if configured
                if (aud) {
                    try {
                        payload = jwt.verify(token, secret, { audience: aud });
                    }
                    catch (e) {
                        // if audience check fails and we have an issuer configured, try issuer
                        if (iss) {
                            payload = jwt.verify(token, secret, { issuer: iss });
                        }
                        else {
                            throw e;
                        }
                    }
                }
                else if (iss) {
                    // No audience configured, try issuer
                    payload = jwt.verify(token, secret, { issuer: iss });
                }
                else {
                    // No constraints configured, just verify signature
                    payload = jwt.verify(token, secret);
                }
                req.user = payload; // available in controller: req.user?.sub / req.user?.id
                return true;
            }
            catch (_a) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
        };
        return JwtAuthGuard_1;
    }());
    __setFunctionName(_classThis, "JwtAuthGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JwtAuthGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JwtAuthGuard = _classThis;
}();
exports.JwtAuthGuard = JwtAuthGuard;
