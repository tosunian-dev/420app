import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import BudgetModel from "@/app/models/budget";
import BudgetBonifModel from "@/app/models/budgetbonif";
import connectDB from "@/lib/db";
import TaskModel from "@/app/models/task";
import LeadModel from "@/app/models/lead";

export async function POST(request: NextRequest, response: NextResponse) {
  await connectDB();
  try {
    const data = await request.json();

    const uploadedBudget = await BudgetModel.create(data.budgetData);
    const updateLeadStatus = await LeadModel.findOneAndUpdate(
      { _id: data.budgetData.leadID },
      { status: "Negociando" },
      { new: true }
    );
    const taskHistory = await TaskModel.create({
      leadID: updateLeadStatus._id,
      title: "Presupuesto creado",
      observations: `El presupuesto N° ${data.budgetData.budgetNumber} fue creado.`,
      dateToDo: new Date(),
      completedDate: new Date(),
      status: "Completada",
    });

    if (data.bonifs.length > 0) {
      data.bonifs.map(async (bonif: any) => {
        bonif.budgetID = uploadedBudget._id;
        bonif.leadID = data.budgetData.leadID;
        const uploadedBudgetBonif = await BudgetBonifModel.create(bonif);
        console.log(uploadedBudgetBonif);
      });
    }
    return NextResponse.json({ msg: "BUDGET_UPLOADED", uploadedBudget });
  } catch (error) {
    return NextResponse.json({ msg: "BUDGET_UPLOAD_ERROR" }, { status: 400 });
  }
}
