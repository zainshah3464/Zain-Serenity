import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import User from "@/models/User";
import { isRoomAvailable } from "@/lib/checkAvailability";
import { validateBookingInput } from "@/lib/bookingValidation";

// POST – create a new booking (customer)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId, checkIn, checkOut, guests, children, totalPrice, specialRequests } =
    await req.json(); // ✅ extract new fields

  // Strong validation
  const errors = validateBookingInput({ checkIn, checkOut, guests, price: totalPrice });
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
  }

  // Check room availability
  const available = await isRoomAvailable(roomId, new Date(checkIn), new Date(checkOut));
  if (!available) {
    return NextResponse.json({ error: "Room not available for selected dates" }, { status: 409 });
  }

  await dbConnect();
  const booking = await Booking.create({
    userId: session.user.id,
    roomId,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    guests,
    children: children || 0,          // ✅ save children
    totalPrice,
    specialRequests: specialRequests || "", // ✅ save special requests
  });

  return NextResponse.json(booking, { status: 201 });
}

// GET – list bookings (admin sees all enriched, customer sees own with room name)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  if (session.user.role === "admin") {
    const allBookings = await Booking.find({}).sort({ createdAt: -1 }).lean();

    const roomIds = [...new Set(allBookings.map((b) => b.roomId))];
    const userIds = [...new Set(allBookings.map((b) => b.userId))];

    const rooms = await Room.find({ _id: { $in: roomIds } }, "name").lean();
    const users = await User.find({ _id: { $in: userIds } }, "email").lean();

    const roomMap: Record<string, string> = {};
    rooms.forEach((r) => (roomMap[r._id.toString()] = r.name));
    const userMap: Record<string, string> = {};
    users.forEach((u) => (userMap[u._id.toString()] = u.email));

    const enriched = allBookings.map((b) => ({
      ...b,
      roomName: roomMap[b.roomId] || "Deleted Room",
      userEmail: userMap[b.userId] || "Unknown User",
    }));

    return NextResponse.json(enriched);
  } else {
    const userBookings = await Booking.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const roomIds = [...new Set(userBookings.map((b) => b.roomId))];
    const rooms = await Room.find({ _id: { $in: roomIds } }, "name").lean();
    const roomMap: Record<string, string> = {};
    rooms.forEach((r) => (roomMap[r._id.toString()] = r.name));

    const enriched = userBookings.map((b) => ({
      ...b,
      roomName: roomMap[b.roomId] || "Deleted Room",
    }));

    return NextResponse.json(enriched);
  }
}