import { Document, model, Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICar extends Document {
  name: string;
  year: number;
  kilometers: number;
  motor: string;
  type:
    | "BIKE"
    | "CAR"
    | "QUAD"
    | "UTV"
    | "TRUCK"
    | "PICKUP"
    | "UTILITARY"
    | "SUV"
    | "VAN"
    | "MINIVAN"
    | "CONVERTIBLE"
    | "COUPE"
    | "HATCHBACK"
    | "SEDAN"
    | "MOTORHOME"
    | "ATV"
    | "SCOOTER";
  price: number;
  currency: "ARS" | "USD";
  brand:
    | "Audi"
    | "Chevrolet"
    | "Citroen"
    | "Fiat"
    | "Ford"
    | "Volkswagen"
    | "Nissan"
    | "Jeep"
    | "Mini"
    | "Honda"
    | "Porsche"
    | "Peugeot"
    | "Renault"
    | "Mercedes-Benz"
    | "BMW"
    | "Dodge"
    | "Chery"
    | "Land Rover"
    | "Toyota"
    | "Suzuki"
    | "Chrysler"
    | "Harley Davidson"
    | "Opel"
    | "Hyundai"
    | "Kia"
    | "KTM"
    | "Benelli"
    | "Yamaha"
    | "Alfa Romeo"
    | "Aston Martin"
    | "Bentley"
    | "Cadillac"
    | "Ferrari"
    | "GMC"
    | "Hummer"
    | "Jaguar"
    | "Lamborghini"
    | "Lancia"
    | "Lexus"
    | "Lincoln"
    | "Lotus"
    | "Maserati"
    | "Mazda"
    | "Mitsubishi"
    | "RAM"
    | "Rover"
    | "Seat"
    | "Subaru"
    | "Tesla"
    | "Volvo";
  modelName: string;
  status: "RESERVED" | "SOLD" | "AVAILABLE";
  gearbox: "AUTOMATIC" | "MANUAL";
  doors: "2P" | "3P" | "4P" | "5P" | "6P";
  gas: "GNC" | "DIESEL" | "NAFTA";
  show: boolean;
  description: string;
  uuid: string;
  imagePath?: string;
  imagePublicID?: string;
  branchID?: string;
  branchAddress?: string;
  createdAt?: Date | undefined;
}

const carSchema: Schema = new Schema<ICar>(
  {
    uuid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: false,
      default: "",
      value: "",
    },
    imagePublicID: {
      type: String,
      required: false,
      default: "",
      value: "",
    },
    year: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    kilometers: {
      type: Number,
      required: true,
    },
    motor: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      default: "AVAILABLE",
    },
    gearbox: {
      type: String,
      required: true,
    },
    doors: {
      type: String,
      required: true,
    },
    gas: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      required: false,
      default: true,
    },
    branchID: {
      type: String,
      required: true,
    },
    branchAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CarModel = models.cars || model("cars", carSchema);

export default CarModel;
