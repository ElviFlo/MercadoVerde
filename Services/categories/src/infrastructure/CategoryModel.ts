import { Schema, model } from "mongoose";
import { Category } from "../../domain/Category";

const CategorySchema = new Schema<Category>({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String }
}, { timestamps: true });

export default model<Category>("Category", CategorySchema);
