import CarImageModel from "@/app/models/carimage";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile } from "fs/promises";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// SAVE GALLERY IMAGES
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const carID = data.get("carID") as string;
    const files = data.getAll("gallery_images") as File[];
    cloudinary.config({
      cloud_name: "duiw7lwlb",
      api_key: "435529513686272",
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    if (files.length === 0) {
      return NextResponse.json({ msg: "NO_FILES_PROVIDED" }, { status: 400 });
    }


    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const cloudinaryResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({}, (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          })
          .end(buffer);
      });
      console.log(cloudinaryResponse);
      await CarImageModel.create({
        carID,
        path: cloudinaryResponse.secure_url,
        uuid: uuidv4(),
        public_id: cloudinaryResponse.public_id
      });
    }

    return NextResponse.json({ msg: "FILES_UPLOADED" });
  } catch (error) {
    return NextResponse.json({ msg: "NO_FILE_PROVIDED" }, { status: 400 });
  }
}
