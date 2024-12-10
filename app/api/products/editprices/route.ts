import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/app/models/product";

export async function PUT(
  request: NextRequest,
  response: NextResponse
) {
  await connectDB();
  try {
    const products = await request.json();
    console.log(products);
    
    if (!Array.isArray(products)) {
      return NextResponse.json({ message: "Invalid data format" });
    }

    const bulkOperations = products.map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            nombre: product.nombre,
            marca: product.marca,
            categoria: product.categoria,
            precioAlPublico: product.precioAlPublico,
            precioDeLista: product.precioDeLista,
            porcentajeGanancia: product.porcentajeGanancia,
          },
        },
      },
    }));

    const result = await ProductModel.bulkWrite(bulkOperations);

    return NextResponse.json({ message: "PRODUCTS_PRICES_MODIFIED", result });
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_MODIFY_PRODUCTS_PRICES" });
  }
}

