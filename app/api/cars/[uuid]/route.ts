import connectDB from "@/lib/db";
import CarModel, { ICar } from "@/app/models/car";
import { NextRequest, NextResponse } from "next/server";
import BranchModel from "@/app/models/branch";
import { v2 as cloudinary } from "cloudinary";
import CarImageModel from "@/app/models/carimage";

// GET CAR BY UUID
export async function GET(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  await connectDB();
  try {
    const car = await CarModel.findOne({ uuid: params.uuid });
    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_GET_CAR" });
  }
}

// DELETE CAR BY UUID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  await connectDB();

  try {
    cloudinary.config({
      cloud_name: "duiw7lwlb",
      api_key: "435529513686272",
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    // get car data
    const carToDelete = await CarModel.findOne({ uuid: params.uuid });
    // get gallery data
    const gallery = await CarImageModel.find({ carID: params.uuid });
    // delete car
    const deletedCar = await CarModel.findOneAndDelete({ uuid: params.uuid });
    // delete thumbnail from cloudinary
    await cloudinary.uploader.destroy(carToDelete.imagePublicID);
    // delete gallery images from cloudinary
    for (const image of gallery) {
      await cloudinary.uploader.destroy(image.public_id);
      await CarImageModel.deleteOne({ _id: image._id });
    }

    return NextResponse.json({ msg: "CAR_DELETED" });
  } catch (error) {
    console.log("error deleted");

    return NextResponse.json({ msg: "ERROR_DELETE_CAR" });
  }
}

// EDIT CAR
export async function PUT(
  request: NextRequest,
  { params }: { params: { uuid: string } }
) {
  await connectDB();
  const { uuid } = params;
  const data: ICar = await request.json();
  const branchAddress = await BranchModel.findOne({ _id: data.branchID });
  data.branchAddress = branchAddress.address;
  try {
    const car = await CarModel.findOneAndUpdate({ uuid }, data, {
      new: true,
    });
    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ msg: "ERROR_EDIT_CAR" });
  }
}
