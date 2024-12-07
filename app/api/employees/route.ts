import AdminModel from "@/app/models/admin";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);
  try {
    const newUser = await AdminModel.create(data);
    return NextResponse.json({ msg: "USER_CREATED", newUser });
  } catch (error) {
    return NextResponse.json({ msg: "USER_CREATION_ERROR" });
  }
}

export async function GET(request: NextRequest) {
  await connectDB();

  try {
    const employees = await AdminModel.find();
    return NextResponse.json({ msg: "USER_GET", employees });
  } catch (error) {
    return NextResponse.json({ msg: "GET_USER_ERROR" });
  }
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);

  try {
    const editedUser = await AdminModel.findByIdAndUpdate(
      { _id: data._id },
      data,
      { new: true }
    );
    return NextResponse.json({ msg: "USER_EDITED", editedUser });
  } catch (error) {
    return NextResponse.json({ msg: "EDIT_USER_ERROR" });
  }
}

export async function DELETE(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  console.log(data);

  try {
    await AdminModel.findByIdAndDelete(data);
    return NextResponse.json({ msg: "USER_DELETED" });
  } catch (error) {
    return NextResponse.json({ msg: "DELETE_USER_ERROR" });
  }
}
