import { IProduct } from "@/interfaces/IProduct";
import { Document, model, Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const productSchema: Schema = new Schema<IProduct>(
  {
    nombre: {
      type: String,
      required: true,
    },
    marca: {
      type: String,
      required: false,
    },
    categoria: {
      type: String,
      required: true,
    },
    precioAlPublico: {
      type: Number,
      required: true,
    },
    precioDeLista: {
      type: Number,
      required: true,
    },
    porcentajeGanancia: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductModel =
  models.products || model("products", productSchema);

export default ProductModel;
