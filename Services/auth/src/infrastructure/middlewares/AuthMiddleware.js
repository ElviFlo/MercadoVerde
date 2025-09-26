"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = AuthMiddleware;
var jwt = require("jsonwebtoken");
var jwt_config_1 = require("../config/jwt.config");
function AuthMiddleware(req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "No token provided" });
    var token = authHeader.split(" ")[1];
    try {
        var decoded = jwt.verify(token, jwt_config_1.jwtConfig.secret);
        req.user = decoded;
        next();
    }
    catch (_a) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
