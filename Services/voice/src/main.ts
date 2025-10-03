import "dotenv/config";
import express from "express";
import cors from "cors";
import voiceRouter from "./infrastructure/routes/voice.routes";
import { setupSwagger } from "./infrastructure/swagger/voice.swagger";

const app = express();
const PORT = Number(process.env.PORT ?? 3006);

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);
app.get("/health", (_req, res) => res.json({ ok: true, service: "voice" }));
app.use(voiceRouter);
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

app.listen(PORT, () => console.log(`service running on http://localhost:${PORT}/docs with Swagger`));
