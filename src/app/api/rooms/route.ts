import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";
import Booking from "@/models/Booking";
import Review from "@/models/Review";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  await dbConnect();

  // Base filter: only active rooms
  const filter: any = { status: "active" };
  if (featured === "true") {
    filter.isFeatured = true;
  }

  // If dates provided, filter out booked rooms
  let rooms = await Room.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const overlappingBookings = await Booking.find({
      status: { $ne: "cancelled" },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).lean();

    const bookedRoomIds = new Set(
      overlappingBookings.map((b) => b.roomId.toString())
    );
    rooms = rooms.filter(
      (room: any) => !bookedRoomIds.has(room._id.toString())
    );
  }

  // Attach average rating
  for (const room of rooms) {
    const reviews = await Review.find({ roomId: room._id.toString() }).lean();
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
    room.rating = Math.round(avg * 10) / 10; // keep one decimal
  }

  return NextResponse.json(rooms);
}