import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";
import Booking from "@/models/Booking";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // All rooms
  const allRooms = await Room.find({}).lean();

  const total = allRooms.length;
  const active = allRooms.filter((r) => r.status === "active").length;
  const inactive = allRooms.filter((r) => r.status === "inactive").length;
  const maintenance = allRooms.filter((r) => r.status === "maintenance").length;
  const featured = allRooms.filter((r) => r.isFeatured).length;
  const newRooms = allRooms.filter((r) => r.isNewRoom).length;

  // Current occupancy (bookings overlapping today)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const overlappingBookings = await Booking.find({
    status: { $ne: "cancelled" },
    checkIn: { $lt: todayEnd },
    checkOut: { $gt: todayStart },
  }).lean();

  const bookedRoomIds = new Set(overlappingBookings.map((b) => b.roomId.toString()));
  const booked = bookedRoomIds.size;
  const availableRooms = total - booked;

  // Revenue per room (all time, non‑cancelled)
  const allBookings = await Booking.find({ status: { $ne: "cancelled" } }).lean();
  const revenueByRoom: Record<string, number> = {};
  allBookings.forEach((b) => {
    const id = b.roomId.toString();
    revenueByRoom[id] = (revenueByRoom[id] || 0) + b.totalPrice;
  });

  // Build room‑revenue array with name
  const roomRevenue = allRooms.map((room) => ({
    roomId: room._id.toString(),
    roomName: room.name,
    revenue: revenueByRoom[room._id.toString()] || 0,
  })).sort((a, b) => b.revenue - a.revenue); // highest first

  return NextResponse.json({
    total,
    active,
    inactive,
    maintenance,
    featured,
    newRooms,
    booked,
    availableRooms,
    roomRevenue,
  });
}