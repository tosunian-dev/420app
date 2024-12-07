import { Document, model, Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAdmin extends Document {
  name: string;
  surname: string;
  username: string;
  password?: string;
  uuid: string;
  role: "ADMIN" | "EMPLOYEE";
  phone: string;
  email: string;
  _id?: string;
}

const adminSchema: Schema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    uuid: {
      type: String,
      required: true,
      value: uuidv4(),
    },
    role: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const AdminModel = models.admin_users || model("admin_users", adminSchema);

export default AdminModel;
