"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const auth_routes_1 = require("./infrastructure/routes/auth.routes");
const swaggerUi = require("swagger-ui-express");
const auth_swagger_1 = require("./infrastructure/swagger/auth.swagger");
dotenv.config();
const app = express();
app.use(express.json());
app.use("/auth", auth_routes_1.default);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(auth_swagger_1.authSwagger));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});
//# sourceMappingURL=main.js.map