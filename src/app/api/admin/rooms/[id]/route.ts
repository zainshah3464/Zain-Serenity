import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

// ✅ GET – fetch single room (admin only)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await dbConnect();

  try {
    const room = await Room.findById(id).lean();
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}

// PUT update room
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  await dbConnect();

  try {
    const room = await Room.findByIdAndUpdate(id, data, { new: true });
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update room" }, { status: 400 });
  }
}

// DELETE room
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await dbConnect();

  try {
    const room = await Room.findByIdAndDelete(id);
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}

// PATCH – toggle status / featured / isNewRoom (✅ renamed)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status, isFeatured, isNewRoom } = await req.json(); // ✅ renamed
  await dbConnect();

  const updateFields: any = {};
  if (status) updateFields.status = status;
  if (isFeatured !== undefined) updateFields.isFeatured = isFeatured;
  if (isNewRoom !== undefined) updateFields.isNewRoom = isNewRoom; // ✅ renamed

  try {
    const room = await Room.findByIdAndUpdate(id, updateFields, { new: true });
    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}