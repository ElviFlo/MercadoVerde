import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./infrastructure/routes/auth.routes";
import { authSwagger } from "./infrastructure/swagger/auth.swagger";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(authSwagger));
app.get("/docs-json", (_req, res) => res.json(authSwagger));

const PORT = Number(process.env.PORT ?? 3001);
app.listen(PORT, () => console.log(`Auth escuchando en http://localhost:${PORT}`));

