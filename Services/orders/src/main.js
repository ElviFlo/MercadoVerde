"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv = require("dotenv");
var order_routes_1 = require("./infrastructure/routes/order.routes");
var swaggerUi = require("swagger-ui-express");
var order_swagger_1 = require("./infrastructure/swagger/order.swagger");
dotenv.config();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/orders", order_routes_1.default);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(order_swagger_1.orderSwagger));
var PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
    console.log("Orders service running on port ".concat(PORT));
});
