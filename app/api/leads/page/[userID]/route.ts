import PageLeadModel from "@/app/models/pagelead";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);

  data.status = "PENDING";
  data.employeeAsignedID = "";
  try {
    const newLead = await PageLeadModel.create(data);
    return NextResponse.json({ msg: "LEAD_CREATED", newLead });
  } catch (error) {
    return NextResponse.json({ msg: "LEAD_CREATION_ERROR" });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userID: string } }
) {
  await connectDB();

  try {
    const questions = await PageLeadModel.find({ status: "PENDING" });
    const asignedQuestions = await PageLeadModel.find({
      employeeAsignedID: params.userID,
    });
    return NextResponse.json({
      msg: "QUESTIONS_GET",
      questions,
      asignedQuestions,
    });
  } catch (error) {
    return NextResponse.json({ msg: "QUESTIONS_GET_ERROR" });
  }
}
