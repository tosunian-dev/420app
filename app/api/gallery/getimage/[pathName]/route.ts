import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import CarImageModel from "@/app/models/carimage";
import connectDB from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pathName: string } }
) {
  await connectDB();
  console.log(params);
  try {
    cloudinary.config({
      cloud_name: "duiw7lwlb",
      api_key: "435529513686272",
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    const imageData = await CarImageModel.findOne({ uuid: params.pathName });
    console.log(imageData.public_id);

    const deleteOnDB = await CarImageModel.findOneAndDelete({
      uuid: params.pathName,
    });
    const result = await cloudinary.uploader.destroy(imageData.public_id);
    console.log(result);
    return NextResponse.json({ msg: "IMAGE_DELETED", deleteOnDB });
  } catch (error) {
    return NextResponse.json(
      { message: "ERROR_DELETING_IMAGE" },
      { status: 404 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { pathName: string } }
) {
  await connectDB();
  try {
    const { pathName } = params;
    // Verificar la ruta completa donde se suben los archivos
    const filePath = path.join(process.cwd(), `uploads/carGallery/${pathName}`);
    console.log("Buscando el archivo en:", filePath);

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      console.log("Archivo no encontrado:", filePath);
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Definir tipo MIME basado en la extensión del archivo
    let contentType = "application/octet-stream";
    if (pathName.endsWith(".webp")) contentType = "image/webp";
    else if (pathName.endsWith(".jpg") || pathName.endsWith(".jpeg"))
      contentType = "image/jpeg";
    else if (pathName.endsWith(".png")) contentType = "image/png";

    const response = new NextResponse(fileBuffer);
    response.headers.set("Content-Type", contentType);

    return response;
  } catch (error) {
    console.log("Error al obtener el archivo:", error);
    return NextResponse.json(
      { message: "Error fetching file" },
      { status: 500 }
    );
  }
}
