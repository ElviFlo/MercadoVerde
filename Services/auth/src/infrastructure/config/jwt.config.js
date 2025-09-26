"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || "supersecret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
};
