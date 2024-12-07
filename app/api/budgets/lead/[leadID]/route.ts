import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import BudgetModel from "@/app/models/budget";
import BudgetBonifModel from "@/app/models/budgetbonif";
import connectDB from "@/lib/db";

// get budgets only by leadID
export async function GET(
  request: NextRequest,
  { params }: { params: { leadID: string } }
) {
  await connectDB();
  try {
    const budgets = await BudgetModel.find({ leadID: params.leadID });
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_GET_BUDGETS" });
  }
}
