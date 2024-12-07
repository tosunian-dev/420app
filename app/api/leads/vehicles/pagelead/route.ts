import LeadModel from "@/app/models/lead";
import LeadVehiclesModel from "@/app/models/leadvehicles";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  // save lead vehicles data
  try {
    const newLeadVehicles = await LeadVehiclesModel.create(data);

    return NextResponse.json({
      msg: "LEAD_VEHICLES_CREATED",
      newLeadVehicles,
    });
  } catch (error) {
    return NextResponse.json({ msg: "LEAD_VEHICLES_CREATION_ERROR" });
  }
}
