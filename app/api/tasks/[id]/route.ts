import TaskModel from "@/app/models/task";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
  await connectDB();
    
  try {
    const pendingTasks = await TaskModel.find({ $and: [
      {leadID: params.id},
      {status: 'Pendiente'}
    ]}).sort({createdAt: -1});
    const completedTasks = await TaskModel.find({ $and: [
      {leadID: params.id},
      {status: 'Completada'}
    ]}).sort({createdAt: -1});
    return NextResponse.json({ msg: "TASKS_GET", pendingTasks, completedTasks });
  } catch (error) {
    return NextResponse.json({ msg: "GET_TASKS_ERROR" });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const data = await request.json();
  console.log(data);

  try {
    const editedLead = await TaskModel.findByIdAndUpdate(
      { _id: data._id },
      data,
      { new: true }
    );
    return NextResponse.json({ msg: "TASK_EDITED", editedLead });
  } catch (error) {
    return NextResponse.json({ msg: "EDIT_TASK_ERROR" });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const data = await request.json();
  console.log(data);

  try {
    await TaskModel.findByIdAndDelete(data);
    return NextResponse.json({ msg: "TASK_DELETED" });
  } catch (error) {
    return NextResponse.json({ msg: "DELETE_TASK_ERROR" });
  }
}
