import LeadModel from "@/app/models/lead";
import LeadVehiclesModel from "@/app/models/leadvehicles";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.formData();
  cloudinary.config({
    cloud_name: "duiw7lwlb",
    api_key: "435529513686272",
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  // Extrae los valores del FormData
  const leadName = data.get("leadName") as string;
  const leadYear = data.get("leadYear") as string;
  const leadKilometers = data.get("leadKilometers") as string;
  const leadMotor = data.get("leadMotor") as string;
  const leadType = data.get("leadType") as string;
  const leadCurrency = data.get("leadCurrency") as string;
  const leadPrice = data.get("leadPrice") as string;
  const interestedIn = data.get("interestedIn") as string;
  const leadID = data.get("leadID") as string;
  const leadPrefVehicleUUID = data.get("leadPrefVehicleUUID") as string;
  const leadObservations = data.get("leadObservations") as string;
  const leadVehicleImage = data.getAll("leadVehicleImage") as File[];

  console.log(leadVehicleImage);
  console.log(leadVehicleImage[0]);

  let leadVehicleImagePath = "empty";

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

      leadVehicleImagePath = cloudinaryResponse.secure_url;
    } catch (error) {
      return NextResponse.json({ msg: "LEAD_VEHICLE_UPLOAD_THUMB_ERROR" });
    }
  }

  // save lead vehicles data
  try {
    const newLeadVehicles = await LeadVehiclesModel.create({
      leadName,
      leadYear,
      leadKilometers,
      leadMotor,
      leadType,
      leadCurrency,
      leadPrice,
      leadID,
      leadPrefVehicleUUID,
      leadObservations,
      leadVehicleImage: leadVehicleImagePath,
    });

    const editLeadInterestedIn = await LeadModel.findByIdAndUpdate(
      { _id: leadID },
      { interestedIn },
      { new: true }
    );
    console.log(editLeadInterestedIn);

    return NextResponse.json({
      msg: "LEAD_VEHICLES_CREATED",
      newLeadVehicles,
    });
  } catch (error) {
    return NextResponse.json({ msg: "LEAD_VEHICLES_CREATION_ERROR" });
  }

}

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const leads = await LeadVehiclesModel.find();
    return NextResponse.json({ msg: "LEAD_GET", leads });
  } catch (error) {
    return NextResponse.json({ msg: "GET_LEAD_ERROR" });
  }
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  delete data.interestedIn
  console.log('edit ',data);
  try {
    const editedLead = await LeadVehiclesModel.findOneAndUpdate(
      { leadID: data.leadID },
      data,
      { new: true }
    );
    return NextResponse.json({ msg: "LEAD_EDITED", editedLead });
  } catch (error) {
    return NextResponse.json({ msg: "EDIT_LEAD_ERROR" });
  }
}

export async function DELETE(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);

  try {
    await LeadVehiclesModel.findByIdAndDelete(data);
    return NextResponse.json({ msg: "LEAD_DELETED" });
  } catch (error) {
    return NextResponse.json({ msg: "DELETE_LEAD_ERROR" });
  }
}
