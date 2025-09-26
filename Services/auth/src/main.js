"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var auth_routes_1 = require("./infrastructure/routes/auth.routes");
var swaggerUi = require("swagger-ui-express");
var auth_swagger_1 = require("./infrastructure/swagger/auth.swagger");
dotenv.config();
var app = express();
app.use(express.json());
app.use("/auth", auth_routes_1.default);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(auth_swagger_1.authSwagger));
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    console.log("Auth service running on port ".concat(PORT));
});
