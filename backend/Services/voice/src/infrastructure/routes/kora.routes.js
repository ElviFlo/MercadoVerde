"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/infrastructure/routes/kora.routes.ts
var express_1 = require("express");
var multer_1 = require("multer");
var KoraController_1 = require("../controllers/KoraController");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var router = (0, express_1.Router)();
var controller = new KoraController_1.KoraController();
var upload = (0, multer_1.default)();
// ----- TEXTO -----
router.post("/command", auth_middleware_1.verifyAccessToken, function (req, res) {
    return controller.handleCommand(req, res);
});
// ----- AUDIO -----
router.post("/voice", auth_middleware_1.verifyAccessToken, upload.single("audio"), // campo "audio" en el form-data
function (req, res) { return controller.handleVoiceCommand(req, res); });
exports.default = router;
