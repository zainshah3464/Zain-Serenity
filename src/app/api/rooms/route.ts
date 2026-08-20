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

  // Filter: active + maintenance rooms (inactive excluded)
  const filter: any = { status: { $in: ["active", "maintenance"] } };
  if (featured === "true") {
    filter.isFeatured = true;
  }

  let rooms = await Room.find(filter).lean();

  // If dates provided, filter out booked rooms
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
    room.rating = Math.round(avg * 10) / 10;
  }

  // Sort: active first, then maintenance, then featured, new, rating, createdAt
  rooms.sort((a: any, b: any) => {
    const statusOrder = (status: string) => (status === "active" ? 0 : 1);
    if (statusOrder(a.status) !== statusOrder(b.status))
      return statusOrder(a.status) - statusOrder(b.status);
    if ((a.isFeatured ? 1 : 0) !== (b.isFeatured ? 1 : 0))
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    if ((a.isNewRoom ? 1 : 0) !== (b.isNewRoom ? 1 : 0))
      return (b.isNewRoom ? 1 : 0) - (a.isNewRoom ? 1 : 0);
    if ((a.rating || 0) !== (b.rating || 0))
      return (b.rating || 0) - (a.rating || 0);
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  // Paginate
  const start = (page - 1) * limit;
  const paginatedRooms = rooms.slice(start, start + limit);

  return NextResponse.json(paginatedRooms);
}