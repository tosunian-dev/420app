import { Document, model, Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ILead extends Document {
  name: string;
  city?: string;
  surname: string;
  address?: string;
  contactType: string;
  state?: string;
  businessType: string;
  observations?: string;
  phone: string;
  employeeID: string;
  branchID: string;
  email: string;
  _id?: string;
  status: string;
  interestedIn?: string;
  updatedAt?: string;
  createdAt?: string;
  pendingTask?:string;
}

const leadSchema: Schema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: false,
      default: "",
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    state: {
      type: String,
      required: false,
      default: "",
    },
    surname: {
      type: String,
      required: true,
    },
    contactType: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    observations: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    interestedIn: {
      type: String,
      required: true,
    },
    branchID: {
      type: String,
      required: true,
    },
    employeeID: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    pendingTask: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const LeadModel = models.leads || model("leads", leadSchema);

export default LeadModel;
