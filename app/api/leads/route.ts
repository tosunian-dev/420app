import LeadModel from "@/app/models/lead";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);
  if (data.observations === "") {
    data.observations === "No hay descripcion.";
  }
  try {
    const newLead = await LeadModel.create(data);
    return NextResponse.json({ msg: "LEAD_CREATED", newLead });
  } catch (error) {
    return NextResponse.json({ msg: "LEAD_CREATION_ERROR" });
  }
}

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const leads = await LeadModel.find().sort({updatedAt: -1});
    return NextResponse.json({ msg: "LEAD_GET", leads });
  } catch (error) {
    return NextResponse.json({ msg: "GET_LEAD_ERROR" });
  }
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);

  try {
    const editedLead = await LeadModel.findByIdAndUpdate(
      { _id: data._id },
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
    await LeadModel.findByIdAndDelete(data);
    return NextResponse.json({ msg: "LEAD_DELETED" });
  } catch (error) {
    return NextResponse.json({ msg: "DELETE_LEAD_ERROR" });
  }
}
