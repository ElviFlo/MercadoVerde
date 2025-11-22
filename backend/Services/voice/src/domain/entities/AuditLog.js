"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
var AuditLog = /** @class */ (function () {
    function AuditLog(command, status, createdAt) {
        if (createdAt === void 0) { createdAt = new Date(); }
        this.command = command;
        this.status = status;
        this.createdAt = createdAt;
    }
    return AuditLog;
}());
exports.AuditLog = AuditLog;
