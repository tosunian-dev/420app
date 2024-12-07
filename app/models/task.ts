import { Document, model, Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ITask extends Document {
  leadID: string;
  title: string;
  dateToDo: Date;
  status: string;
  completedDate: Date;
  observations: string;
}

const taskSchema: Schema = new Schema<ITask>(
  {
    leadID: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    dateToDo: {
      type: Date,
      required: true,
    },
    completedDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    observations: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TaskModel = models.tasks || model("tasks", taskSchema);

export default TaskModel;
