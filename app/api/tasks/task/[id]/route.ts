import LeadModel from "@/app/models/lead";
import TaskModel from "@/app/models/task";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const task = await TaskModel.findOne({ _id: params.id });
    return NextResponse.json({ msg: "TASK_GET", task });
  } catch (error) {
    return NextResponse.json({ msg: "GET_TASK_ERROR" });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const data = await request.json();
  console.log(data);
  console.log(params.id);

  try {
    const editedTask = await TaskModel.findByIdAndUpdate(
      { _id: params.id },
      data,
      { new: true }
    );

    return NextResponse.json({ msg: "TASK_EDITED", editedTask });
  } catch (error) {
    return NextResponse.json({ msg: "EDIT_TASK_ERROR" });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const taskDetails = await TaskModel.findById(params.id);
    await TaskModel.findByIdAndDelete(params.id);
    // consultar tareas pendientes:
    const pendingTasks = await TaskModel.find({
      $and: [{ leadID: taskDetails.leadID }, { status: "Pendiente" }],
    }).sort({ createdAt: 1 });
    console.log("pendingTasks", pendingTasks);

    // - si no hay, actualizar pendingTask en Lead a " - "
    if (pendingTasks.length === 0) {
      console.log("no hay tareas");
      await LeadModel.findByIdAndUpdate(taskDetails.leadID, {
        pendingTask: "-",
      });
    }
    // - si hay, actualizar pendingTask en Lead a la primer tarea pendiente
    if (pendingTasks.length > 0) {
      console.log("hay tareas");
      console.log(pendingTasks[0].title);
      await LeadModel.findByIdAndUpdate(taskDetails.leadID, {
        pendingTask: pendingTasks[0].title,
      });
    }

    return NextResponse.json({ msg: "TASK_DELETED" });
  } catch (error) {
    return NextResponse.json({ msg: "DELETE_TASK_ERROR" });
  }
}
