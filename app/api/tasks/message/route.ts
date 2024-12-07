import LeadModel from "@/app/models/lead";
import TaskModel from "@/app/models/task";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);
  
  try {
    const newTask = await TaskModel.create(data);
    return NextResponse.json({ msg: "TASK_CREATED", newTask });
  } catch (error) {
    return NextResponse.json({ msg: "TASK_CREATION_ERROR" });
  }
}
