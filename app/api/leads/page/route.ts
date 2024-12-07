import PageLeadModel from "@/app/models/pagelead";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  data.status = "PENDING";
  data.employeeAsignedID = "-";

  try {
    const newQuestion = await PageLeadModel.create(data);
    return NextResponse.json({ msg: "QUESTION_CREATED", newQuestion });
  } catch (error) {
    return NextResponse.json({ msg: "QUESTION_CREATION_ERROR" });
  }
}

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const questions = await PageLeadModel.find({ status: "PENDING" });
    return NextResponse.json({ msg: "QUESTIONS_GET", questions });
  } catch (error) {
    return NextResponse.json({ msg: "QUESTIONS_GET_ERROR" });
  }
}
