import CarModel, { ICar } from "@/app/models/car";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET ALL CARS
export async function GET(request: NextRequest, context: any) {
  await connectDB();
  const { search } = Object.fromEntries(new URL(request.url).searchParams);
  try {
    const searchQuery =
      search && (search !== "null") !== null
        ? {
            name: { $regex: new RegExp(search.toLowerCase(), "i") }
          }
        : {};
    const cars = await CarModel.find(searchQuery).sort({ createdAt: -1 }).limit(10);
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_GET_CAR" });
  }
}