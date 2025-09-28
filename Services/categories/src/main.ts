import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import categoryRoutes from "./infrastructure/routes/categoryRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use("/categories", categoryRoutes);

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mercadoverde")
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () => console.log(`🚀 Categories service corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error(err));
