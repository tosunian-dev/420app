import { Document, model, Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ILeadVehicle extends Document {
  leadName: string;
  leadKilometers?: string;
  leadMotor: string;
  leadType?: string;
  leadYear: string;
  leadCurrency?: string;
  leadPrice: string;
  leadObservations?: string;
  leadPrefVehicleUUID: string;
  leadID: string;
  _id?: string;
  leadVehicleImage?: string;
}

const leadVehiclesSchema: Schema = new Schema<ILeadVehicle>(
  {
    leadName: {
      type: String,
      required: false,
    },
    leadKilometers: {
      type: String,
      required: false,
      default: "",
    },
    leadMotor: {
      type: String,
      required: false,
      default: "",
    },
    leadType: {
      type: String,
      required: false,
      default: "",
    },
    leadYear: {
      type: String,
      required: false,
    },
    leadCurrency: {
      type: String,
      required: false,
    },
    leadPrice: {
      type: String,
      required: false,
    },
    leadObservations: {
      type: String,
      required: false,
      default: "",
      value: "",
    },
    leadID: {
      type: String,
      required: true,
    },
    leadPrefVehicleUUID: {
      type: String,
      required: false,
    },
    leadVehicleImage: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const LeadVehiclesModel =
  models.lead_vehicles || model("lead_vehicles", leadVehiclesSchema);

export default LeadVehiclesModel;
