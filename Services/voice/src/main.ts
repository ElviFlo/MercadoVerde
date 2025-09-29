import express from "express";
import dotenv from "dotenv";
import koraRoutes from "./infrastructure/routes/kora.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/kora", koraRoutes);

app.get("/", (_req, res) => res.send("Kora service OK"));

const PORT = Number(process.env.PORT || 3006);
app.listen(PORT, () => {
  console.log(`Kora running on port ${PORT}`);
});
