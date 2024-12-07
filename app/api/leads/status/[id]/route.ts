import connectDB from "@/lib/db";
import LeadModel, { ILead } from "@/app/models/lead";
import { NextRequest, NextResponse } from "next/server";
import LeadVehiclesModel from "@/app/models/leadvehicles";
import CarModel from "@/app/models/car";
import TaskModel from "@/app/models/task";

// EDIT CAR
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { id } = params;
  const data = await request.json();
  try {
    const user = await LeadModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_EDIT_STATUS" });
  }
}
