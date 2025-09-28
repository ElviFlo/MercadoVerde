"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv = require("dotenv");
var product_routes_1 = require("./infrastructure/routes/product.routes");
var swaggerUi = require("swagger-ui-express");
var product_swagger_1 = require("./infrastructure/swagger/product.swagger");
dotenv.config();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/products", product_routes_1.default);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(product_swagger_1.productSwagger));
var PORT = process.env.PORT || 3003;
app.listen(PORT, function () {
    console.log("Products service running on port ".concat(PORT));
});
