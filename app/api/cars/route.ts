import connectDB from "@/lib/db";
import CarModel from "@/app/models/car";
import { NextRequest, NextResponse } from "next/server";
import BranchModel from "@/app/models/branch";
import { v4 as uuidv4 } from "uuid";
// GET ALL CARS
export async function GET(request: NextRequest, context: any) {
  await connectDB();
  const { search } = Object.fromEntries(new URL(request.url).searchParams);
  try {
    const searchQuery =
      search && (search !== "null") !== null
        ? {
            name: { $regex: new RegExp(search.toLowerCase(), "i") },
          }
        : {};
    const cars = await CarModel.find(searchQuery);
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_GET_CAR" });
  }
}

// CREATE NEW CAR
export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);
  
  const branchAddress = await BranchModel.findOne({ _id: data.branchID });
  data.branchAddress = branchAddress.address;
  try {
    const vehicle = await CarModel.create(data);
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_CREATE_CAR" });
  }
}
