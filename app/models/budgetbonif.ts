import { Document, model, Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IBonif {
  amount: string;
  addOrSub: string;
  details: string;
  _id?: string;
  budgetID?: string;
  leadID?: string;
}

const budgetBonifSchema: Schema = new Schema<IBonif>(
  {
    amount: {
      type: String,
      required: true,
    },
    addOrSub: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    budgetID: {
      type: String,
      required: true,
    },
    leadID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BudgetBonifModel =
  models.budget_bonifs || model("budget_bonifs", budgetBonifSchema);

export default BudgetBonifModel;
