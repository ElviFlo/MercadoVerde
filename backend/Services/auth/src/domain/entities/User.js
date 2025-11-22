"use strict";
// Services/auth/src/domain/entities/User.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/**
 * Entidad de dominio alineada con prisma:
 * - id: string (UUID)
 * - name: string
 * - email: string
 * - password: string (hasheada en persistencia)
 * - role: 'admin' | 'client'
 * - createdAt: Date
 */
var User = /** @class */ (function () {
    function User(id, // <-- UUID (string)
    name, email, password, role, createdAt) {
        if (role === void 0) { role = "client"; }
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }
    return User;
}());
exports.User = User;
