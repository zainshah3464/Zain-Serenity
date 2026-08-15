import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import GalleryImage from "@/models/GalleryImage";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  await GalleryImage.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { category, caption } = body;

  const updateFields: Record<string, any> = {};

  if (category) {
    const allowed = [
      "featured", "rooms", "bathroom", "exterior", "amenities", "pool", "other",
    ];
    if (allowed.includes(category)) {
      updateFields.category = category;
    } else {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
  }

  if (caption !== undefined) {
    updateFields.caption = caption;
  }

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await dbConnect();
  const updated = await GalleryImage.findByIdAndUpdate(id, updateFields, {
    new: true,
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}