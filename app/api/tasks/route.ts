import LeadModel from "@/app/models/lead";
import TaskModel from "@/app/models/task";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  data.status = "Pendiente";
  try {
    // chequear que el lead no tenga tareas anteriores para cambiar status de lead a "En gestión"
    const existsTask = await TaskModel.find({ leadID: data.leadID });

    const newTask = await TaskModel.create(data);

    if (existsTask.length === 0) {
      const updatedLead = await LeadModel.findOneAndUpdate(
        data.leadID,
        { status: "En gestión", pendingTask: data.title },
        {
          new: true,
        }
      );
      return NextResponse.json({ msg: "TASK_CREATED", newTask, updatedLead });
    } else {
      // consultar tareas pendientes:
      const pendingTasks = await TaskModel.find({
        $and: [{ leadID: data.leadID }, { status: "Pendiente" }],
      }).sort({ createdAt: 1 });
      console.log("pendingTasks", pendingTasks);

      // - si no hay, actualizar pendingTask en Lead a " - "
      if (pendingTasks.length === 0) {
        console.log("no hay tareas");

        await LeadModel.findByIdAndUpdate(data.leadID, {
          pendingTask: "-",
        });
      }
      // - si hay, actualizar pendingTask en Lead a la primer tarea pendiente
      if (pendingTasks.length > 0) {
        console.log("hay tareas");
        console.log(pendingTasks[0].title);
        await LeadModel.findByIdAndUpdate(data.leadID, {
          pendingTask: pendingTasks[0].title,
        });
      }
      return NextResponse.json({ msg: "TASK_CREATED", newTask });
    }
  } catch (error) {
    return NextResponse.json({ msg: "TASK_CREATION_ERROR" });
  }
}

export async function PUT(request: NextRequest) {
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

export async function DELETE(request: NextRequest) {
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
