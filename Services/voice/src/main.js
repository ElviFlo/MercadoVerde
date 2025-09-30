"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var kora_routes_1 = require("./infrastructure/routes/kora.routes");
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/kora", kora_routes_1.default);
app.get("/", function (_req, res) { return res.send("Kora service OK"); });
var PORT = Number(process.env.PORT || 3006);
app.listen(PORT, function () {
    console.log("Kora running on port ".concat(PORT));
});
