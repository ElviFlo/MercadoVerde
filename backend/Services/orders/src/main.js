"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// Services/orders/src/main.ts
require("dotenv/config");
var express_1 = require("express");
var cors_1 = require("cors");
// 👉 importa tu router
var order_routes_1 = require("./infrastructure/routes/order.routes");
// 👉 importa y monta swagger (si ya tienes orderSwagger + setupSwagger)
var order_swagger_1 = require("./infrastructure/swagger/order.swagger");
var app = (0, express_1.default)();
var PORT = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3002);
app.disable("x-powered-by");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health público
app.get("/health", function (_req, res) {
    res.status(200).json({ ok: true, service: "orders" });
});
// Swagger (público)
(0, order_swagger_1.setupSwagger)(app); // expone /docs y /docs.json
// 🔥 MONTA EL ROUTER DE ORDERS con prefijo correcto
app.use("/orders", order_routes_1.default);
// Si quisieras /api/orders, sería: app.use("/api", ordersRouter);
// 404
app.use(function (_req, res) { return res.status(404).json({ message: "Not found" }); });
// Errores
app.use(function (err, _req, res, _next) {
    console.error("[orders] Error:", err);
    res.status((err === null || err === void 0 ? void 0 : err.status) || 500).json({ message: (err === null || err === void 0 ? void 0 : err.message) || "Internal Server Error" });
});
app.listen(PORT, function () {
    console.log("\uD83D\uDFE2 Orders service running on http://localhost:".concat(PORT, "/docs/ with Swagger"));
});
