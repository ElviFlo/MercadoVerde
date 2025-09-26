"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = void 0;
class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthError";
    }
}
exports.AuthError = AuthError;
//# sourceMappingURL=AuthError.js.map