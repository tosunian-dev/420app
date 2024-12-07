import PageLeadModel from "@/app/models/pagelead";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { questionID: string } }
) {
  await connectDB();
  const data = await request.json();
  console.log(data);

  try {
    const updatedQuestion = await PageLeadModel.findOneAndUpdate(
      { _id: params.questionID },
      data,
      { new: true }
    );
    return NextResponse.json({ msg: "QUESTION_UPDATED", updatedQuestion });
  } catch (error) {
    return NextResponse.json({ msg: "QUESTION_UPDATE_ERROR" });
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
