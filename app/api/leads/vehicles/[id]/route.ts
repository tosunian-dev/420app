import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import LeadVehiclesModel from "@/app/models/leadvehicles";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.formData();
    const leadVehicleImage = data.getAll("leadVehicleImage") as File[];

    cloudinary.config({
      cloud_name: "duiw7lwlb",
      api_key: "435529513686272",
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    if (leadVehicleImage.length === 0) {
      return NextResponse.json({ msg: "NO_FILES_PROVIDED" }, { status: 400 });
    }

    // upload lead vehicle thumbnail in cloudinary
    if (leadVehicleImage[0]) {
      const bytes = await leadVehicleImage[0].arrayBuffer();
      const buffer = Buffer.from(bytes);
      try {
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

        const updateLeadVehicleImage = await LeadVehiclesModel.findOneAndUpdate(
          { leadID: params.id },
          { leadVehicleImage: cloudinaryResponse.secure_url },
          { new: true }
        );
        return NextResponse.json({
          msg: "IMAGE_UPDATED",
          updateLeadVehicleImage,
        });
      } catch (error) {
        return NextResponse.json({ msg: "LEAD_VEHICLE_UPLOAD_THUMB_ERROR" });
      }
    }

    return NextResponse.json({ msg: "THUMBNAIL_UPLOADED" });
  } catch (error) {
    return NextResponse.json({ msg: "NO_FILE_PROVIDED" }, { status: 400 });
  }
}
