"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var order_controller_1 = require("./infrastructure/controllers/order.controller");
dotenv.config();
var app = express();
app.use(express.json());
app.use("/orders", order_controller_1.default);
var PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
    console.log("Orders service running on port ".concat(PORT));
});
