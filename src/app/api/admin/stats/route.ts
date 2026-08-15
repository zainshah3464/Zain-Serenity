import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import Review from "@/models/Review";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // Base stats
  const allBookings = await Booking.find({}).lean();
  const totalBookings = allBookings.length;
  const totalRevenue = allBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const statusCounts = allBookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Revenue last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  const bookingsLast7Days = await Booking.find({
    createdAt: { $gte: sevenDaysAgo },
    status: { $ne: "cancelled" },
  }).lean();
  const revenueByDay: { date: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayStr = day.toISOString().split("T")[0];
    const dayBookings = bookingsLast7Days.filter((b) => {
      const created = new Date(b.createdAt);
      return created.toISOString().split("T")[0] === dayStr;
    });
    const dayTotal = dayBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    revenueByDay.push({ date: dayStr, total: dayTotal });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const upcomingCheckins = await Booking.countDocuments({
    checkIn: { $gte: todayStart },
    status: "confirmed",
  });

  const totalRooms = await Room.countDocuments();
  const bookedRoomIds = await Booking.distinct("roomId", {
    checkOut: { $gte: todayStart },
    status: "confirmed",
  });
  const occupiedRooms = bookedRoomIds.length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Room‑wise revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentBookings = await Booking.find({
    createdAt: { $gte: thirtyDaysAgo },
    status: { $ne: "cancelled" },
  }).lean();

  const roomRevenueMap: Record<string, number> = {};
  for (const b of recentBookings) {
    roomRevenueMap[b.roomId] = (roomRevenueMap[b.roomId] || 0) + b.totalPrice;
  }

  // Fetch room names
  const rooms = await Room.find({}, "name").lean();
  const roomNameMap: Record<string, string> = {};
  for (const r of rooms) {
    roomNameMap[r._id.toString()] = r.name;
  }

  const roomRevenue = Object.entries(roomRevenueMap).map(([roomId, rev]) => ({
    roomId,
    roomName: roomNameMap[roomId] || "Unknown Room",
    revenue: rev,
  }));

  // Average rating per room
  const reviews = await Review.find({}).lean();
  const ratingMap: Record<string, { sum: number; count: number }> = {};
  for (const rev of reviews) {
    if (!ratingMap[rev.roomId]) ratingMap[rev.roomId] = { sum: 0, count: 0 };
    ratingMap[rev.roomId].sum += rev.rating;
    ratingMap[rev.roomId].count += 1;
  }
  const roomRating = Object.entries(ratingMap).map(([roomId, data]) => ({
    roomId,
    roomName: roomNameMap[roomId] || "Unknown Room",
    avgRating: data.count > 0 ? Math.round((data.sum / data.count) * 10) / 10 : 0,
  }));

  return NextResponse.json({
    totalBookings,
    totalRevenue,
    statusCounts,
    revenueLast7Days: revenueByDay,
    upcomingCheckins,
    totalRooms,
    occupancyRate,
    roomRevenue,
    roomRating,
  });
}