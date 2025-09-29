import { Schema, model } from "mongoose";

// Category interface
interface Category {
  nombre: string;
  descripcion?: string;
  id?: string;
}

const CategorySchema = new Schema<Category>({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String }
}, { timestamps: true });

export default model<Category>("Category", CategorySchema);
