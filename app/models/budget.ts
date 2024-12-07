import { Document, model, Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IBudget extends Document {
  budgetNumber: number;
  businessType: string;
  dateOfIssue: Date;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  clientName: string;
  clientPhone: number;
  clientEmail: string;
  vehicleName: string;
  vehicleType: string;
  vehicleYear: number;
  vehicleMotor: string;
  vehicleDoors: string;
  vehiclePrice: number;
  vehicleGas: string;
  vehicleKilometers: number;
  vehicleGearbox: string;
  clientVehicleName: string;
  clientVehiclePrice: number;
  clientVehicleYear: number;
  clientVehicleKilometers: number;
  clientVehicleMotor: string;
  budgetCurrency: "ARS" | "USD";
  bonifsSubtotal: number;
  transfer: number;
  total: number;
  _id?: string;
  leadID: string;
  createdAt?: Date;
}

const budgetSchema: Schema = new Schema<IBudget>(
  {
    budgetNumber: {
      type: Number,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    dateOfIssue: {
      type: Date,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    sellerPhone: {
      type: String,
      required: true,
    },
    sellerEmail: {
      type: String,
      required: true,
    },
    budgetCurrency: {
      type: String,
      enum: ["ARS", "USD"],
    },
    clientName: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: Number,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    vehicleName: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: false,
    },
    vehicleYear: {
      type: Number,
      required: false,
    },
    vehicleMotor: {
      type: String,
      required: false,
    },
    vehicleDoors: {
      type: String,
      required: false,
    },
    vehiclePrice: {
      type: Number,
      required: false,
    },
    vehicleGas: {
      type: String,
      required: false,
    },
    vehicleKilometers: {
      type: Number,
      required: false,
    },
    vehicleGearbox: {
      type: String,
      required: false,
    },
    clientVehicleName: {
      type: String,
      required: false,
    },
    clientVehiclePrice: {
      type: Number,
      required: false,
    },
    clientVehicleYear: {
      type: Number,
      required: false,
    },
    clientVehicleKilometers: {
      type: Number,
      required: false,
    },
    clientVehicleMotor: {
      type: String,
      required: false,
    },
    bonifsSubtotal: {
      type: Number,
      required: false,
    },
    transfer: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
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

const BudgetModel = models.budgets || model("budgets", budgetSchema);

export default BudgetModel;
