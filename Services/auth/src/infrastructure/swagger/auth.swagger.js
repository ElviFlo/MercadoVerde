"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSwagger = void 0;
exports.authSwagger = {
    openapi: "3.0.0",
    info: {
        title: "Auth Service",
        version: "1.0.0",
    },
    paths: {
        "/auth/register": {
            post: {
                summary: "Register new user",
                requestBody: { required: true },
                responses: { "201": { description: "User created" } },
            },
        },
        "/auth/login": {
            post: {
                summary: "Login user",
                requestBody: { required: true },
                responses: { "200": { description: "Token generated" } },
            },
        },
        "/auth/validate": {
            post: {
                summary: "Validate token",
                requestBody: { required: true },
                responses: { "200": { description: "Token valid" } },
            },
        },
    },
};
