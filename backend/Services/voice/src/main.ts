import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import koraRoutes from "./infrastructure/routes/kora.routes";
import { setupSwagger } from "./infrastructure/swagger/voice.swagger";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas de Kora
app.use("/api/kora", koraRoutes);

// Swagger (monta /docs)
setupSwagger(app);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🎧 Voice service running on port ${PORT}`);
  console.log(`📚 Swagger docs en: http://localhost:${PORT}/docs`);
});
