"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var kora_routes_1 = require("./infrastructure/routes/kora.routes");
var voice_swagger_1 = require("./infrastructure/swagger/voice.swagger");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use("/api/kora", kora_routes_1.default);
(0, voice_swagger_1.setupSwagger)(app);
var PORT = process.env.PORT || 3006;
app.listen(PORT, function () {
    console.log("\uD83C\uDFA7 Voice service running on port ".concat(PORT));
    console.log("\uD83D\uDCDA Swagger docs en: http://localhost:".concat(PORT, "/docs"));
});
