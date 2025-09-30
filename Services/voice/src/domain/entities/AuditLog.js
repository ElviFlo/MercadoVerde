"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
var AuditLog = /** @class */ (function () {
    function AuditLog(id, userId, source, text, confidence, timestamp, result, details) {
        this.id = id;
        this.userId = userId;
        this.source = source;
        this.text = text;
        this.confidence = confidence;
        this.timestamp = timestamp;
        this.result = result;
        this.details = details;
    }
    return AuditLog;
}());
exports.AuditLog = AuditLog;
