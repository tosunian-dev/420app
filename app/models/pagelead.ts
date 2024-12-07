import { Document, model, Schema, models } from "mongoose";

export interface IPageLead extends Document {
  name: string;
  surname: string;
  details?: string;
  phone: string;
  email: string;
  _id?: string;
  status: string;
  updatedAt?: string;
  createdAt?: string;
  employeeAsignedID: string;
}

const pageLeadSchema: Schema = new Schema<IPageLead>(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    details: {
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
    status: {
      type: String,
      required: true,
    },
    employeeAsignedID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const PageLeadModel = models.page_leads || model("page_leads", pageLeadSchema);

export default PageLeadModel;
