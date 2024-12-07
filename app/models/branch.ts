import { Document, model, Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IBranch extends Document {
  branchName: string;
  city: string;
  state: string;
  address: string;
  _id?: string | undefined;
}

const branchSchema: Schema = new Schema<IBranch>(
  {
    branchName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BranchModel = models.branches || model("branches", branchSchema);

export default BranchModel;
