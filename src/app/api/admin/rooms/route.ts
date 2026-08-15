import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  await dbConnect();
  const rooms = await Room.find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json(rooms);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  await dbConnect();

  try {
    // Ensure default values for new fields
    const roomData = {
      ...data,
      status: data.status || "active",
      isFeatured: data.isFeatured || false,
      isNewRoom: data.isNewRoom !== undefined ? data.isNewRoom : true, // ✅ fixed
    };
    const room = await Room.create(roomData);
    return NextResponse.json(room, { status: 201 });
  } catch (error: any) {
    console.error("Create room error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create room" },
      { status: 400 }
    );
  }
}