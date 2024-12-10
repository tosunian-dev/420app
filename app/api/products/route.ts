import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/app/models/product";

// GET ALL PRODUCTS
export async function GET(request: NextRequest, context: any) {
  await connectDB();
  try {
    const products = await ProductModel.find().sort({updatedAt: -1});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_GET_PRODUCTS" });
  }
}

// CREATE NEW PRODUCT
export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const product = await request.json();
    product.precioAlPublico = Number(product.precioAlPublico);
    product.precioDeLista = Number(product.precioDeLista);
    const newProduct = await ProductModel.create(product);
    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_CREATE_PRODUCT" });
  }
}
