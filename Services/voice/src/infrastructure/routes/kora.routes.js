"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var KoraController_1 = require("../controllers/KoraController");
var router = (0, express_1.Router)();
router.use("/", KoraController_1.default);
exports.default = router;
