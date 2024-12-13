import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/app/models/product";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const product = await request.json();
  product.precioAlPublico = Number(product.precioDeLista) * (1 + Number(product.porcentajeGanancia) / 100);
  try {
    const editedProduct = await ProductModel.findByIdAndUpdate(
      params.id,
      product,
      { new: true }
    );
    return NextResponse.json(editedProduct);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_EDIT_PRODUCT" });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    await ProductModel.findByIdAndDelete(params.id);
    return NextResponse.json("PRODUCT_DELETED");
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_DELETE_PRODUCT" });
  }
}
