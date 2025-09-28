"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
var jwt = require("jsonwebtoken");
var authenticateToken = function (req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Token requerido" });
    jwt.verify(token, process.env.JWT_SECRET || "supersecret", function (err, user) {
        if (err)
            return res.status(403).json({ message: "Token inválido" });
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
