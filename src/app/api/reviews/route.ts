import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const { roomId, rating, comment } = await req.json();
  if (!roomId || !rating || !comment) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  await dbConnect();
  // Optional: prevent duplicate review per user per room
  const existing = await Review.findOne({ userId: session.user.id, roomId });
  if (existing) {
    return NextResponse.json({ error: "You already reviewed this room" }, { status: 409 });
  }
  const review = await Review.create({
    userId: session.user.id,
    roomId,
    rating,
    comment,
  });
  return NextResponse.json(review, { status: 201 });
}