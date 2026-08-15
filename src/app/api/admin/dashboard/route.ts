import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import User from "@/models/User";
import Review from "@/models/Review";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "7d";
  const customStart = searchParams.get("start");
  const customEnd = searchParams.get("end");

  await dbConnect();

  // --- Revenue data based on range ---
  let revenueData: { date: string; total: number }[] = [];
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  if (range === "all") {
    const allBookings = await Booking.find({ status: { $ne: "cancelled" } }).lean();
    const revenueMap: Record<string, number> = {};
    allBookings.forEach(b => {
      const date = new Date(b.createdAt).toISOString().split("T")[0];
      revenueMap[date] = (revenueMap[date] || 0) + b.totalPrice;
    });
    revenueData = Object.entries(revenueMap).map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } else if (range === "thisYear") {
    const startDate = new Date(now.getFullYear(), 0, 1);
    const bookings = await Booking.find({ createdAt: { $gte: startDate }, status: { $ne: "cancelled" } }).lean();
    const dailyMap: Record<string, number> = {};
    bookings.forEach(b => {
      const date = new Date(b.createdAt).toISOString().split("T")[0];
      dailyMap[date] = (dailyMap[date] || 0) + b.totalPrice;
    });
    revenueData = Object.entries(dailyMap).map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } else if (range === "lastYear") {
    const startDate = new Date(now.getFullYear() - 1, 0, 1);
    const endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
    const bookings = await Booking.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $ne: "cancelled" }
    }).lean();
    const dailyMap: Record<string, number> = {};
    bookings.forEach(b => {
      const date = new Date(b.createdAt).toISOString().split("T")[0];
      dailyMap[date] = (dailyMap[date] || 0) + b.totalPrice;
    });
    revenueData = Object.entries(dailyMap).map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } else if (range === "thisMonth") {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const bookings = await Booking.find({ createdAt: { $gte: startDate }, status: { $ne: "cancelled" } }).lean();
    const dailyMap: Record<string, number> = {};
    bookings.forEach(b => {
      const date = new Date(b.createdAt).toISOString().split("T")[0];
      dailyMap[date] = (dailyMap[date] || 0) + b.totalPrice;
    });
    revenueData = Object.entries(dailyMap).map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } else if (range === "custom" && customStart && customEnd) {
    const start = new Date(customStart);
    const end = new Date(customEnd);
    end.setHours(23, 59, 59, 999);
    const bookings = await Booking.find({ createdAt: { $gte: start, $lte: end }, status: { $ne: "cancelled" } }).lean();
    const dailyMap: Record<string, number> = {};
    bookings.forEach(b => {
      const date = new Date(b.createdAt).toISOString().split("T")[0];
      dailyMap[date] = (dailyMap[date] || 0) + b.totalPrice;
    });
    revenueData = Object.entries(dailyMap).map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } else {
    // default last 7 days
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
    const bookings = await Booking.find({ createdAt: { $gte: startDate }, status: { $ne: "cancelled" } }).lean();
    const dailyMap: Record<string, number> = {};
    bookings.forEach(b => {
      const date = new Date(b.createdAt).toISOString().split("T")[0];
      dailyMap[date] = (dailyMap[date] || 0) + b.totalPrice;
    });
    revenueData = Object.entries(dailyMap).map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // --- Today's stats counts ---
  const todayCheckinsCount = await Booking.countDocuments({
    checkIn: { $gte: todayStart, $lt: todayEnd },
    status: { $ne: "cancelled" }
  });
  const todayCheckoutsCount = await Booking.countDocuments({
    checkOut: { $gte: todayStart, $lt: todayEnd },
    status: { $ne: "cancelled" }
  });
  const todayRevenue = (await Booking.find({
    createdAt: { $gte: todayStart, $lt: todayEnd },
    status: { $ne: "cancelled" }
  }).lean()).reduce((sum, b) => sum + b.totalPrice, 0);
  const todayNewUsersCount = await User.countDocuments({
    createdAt: { $gte: todayStart, $lt: todayEnd }
  });

  // --- Today's detailed lists (for popups) ---
  const todayCheckinsList = await Booking.find({
    checkIn: { $gte: todayStart, $lt: todayEnd },
    status: { $ne: "cancelled" }
  }).sort({ checkIn: 1 }).lean();

  const todayCheckoutsList = await Booking.find({
    checkOut: { $gte: todayStart, $lt: todayEnd },
    status: { $ne: "cancelled" }
  }).sort({ checkOut: 1 }).lean();

  const todayNewUsersList = await User.find({
    createdAt: { $gte: todayStart, $lt: todayEnd }
  }).select("name email createdAt").sort({ createdAt: -1 }).lean();

  const todayReviewsList = await Review.find({
    createdAt: { $gte: todayStart, $lt: todayEnd }
  }).sort({ createdAt: -1 }).lean();

  // Populate user names for today's bookings & reviews
  const todayCheckinsPopulated = await Promise.all(todayCheckinsList.map(async (b) => {
    const room = await Room.findById(b.roomId).select("name").lean();
    const user = await User.findById(b.userId).select("name email").lean();
    return { ...b, roomName: room?.name || "Deleted", user };
  }));

  const todayCheckoutsPopulated = await Promise.all(todayCheckoutsList.map(async (b) => {
    const room = await Room.findById(b.roomId).select("name").lean();
    const user = await User.findById(b.userId).select("name email").lean();
    return { ...b, roomName: room?.name || "Deleted", user };
  }));

  const todayReviewsPopulated = await Promise.all(todayReviewsList.map(async (r) => {
    const user = await User.findById(r.userId).select("name email").lean();
    return { ...r, user };
  }));

  // --- Total stats ---
  const totalBookings = await Booking.countDocuments();
  const totalRevenue = (await Booking.find({ status: { $ne: "cancelled" } }).lean())
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const statusCountsRaw = await Booking.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  const statusCounts = { pending: 0, confirmed: 0, cancelled: 0 };
  statusCountsRaw.forEach((s: any) => {
    (statusCounts as any)[s._id] = s.count;  // ✅ fixed TypeScript error
  });

  // --- Room stats ---
  const allRooms = await Room.find().lean();
  const totalRooms = allRooms.length;
  const activeRooms = allRooms.filter(r => r.status === "active").length;
  const inactiveRooms = allRooms.filter(r => r.status === "inactive").length;
  const maintenanceRooms = allRooms.filter(r => r.status === "maintenance").length;

  // Current occupancy
  const overlapping = await Booking.find({
    checkIn: { $lt: todayEnd },
    checkOut: { $gt: todayStart },
    status: { $ne: "cancelled" }
  }).distinct("roomId");
  const occupiedCount = overlapping.length;
  const availableRooms = totalRooms - occupiedCount;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

  // --- Pending bookings list ---
  const pendingBookingsList = await Booking.find({ status: "pending" })
    .sort({ createdAt: -1 }).lean();
  const pendingPopulated = await Promise.all(pendingBookingsList.map(async (b) => {
    const room = await Room.findById(b.roomId).select("name").lean();
    const user = await User.findById(b.userId).select("name email").lean();
    return { ...b, roomName: room?.name || "Deleted", user };
  }));

  // --- Recent bookings (last 10) ---
  const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(10).lean();
  const recentPopulated = await Promise.all(recentBookings.map(async (b) => {
    const room = await Room.findById(b.roomId).select("name roomType").lean();
    const user = await User.findById(b.userId).select("name email").lean();
    return {
      _id: b._id,
      guestName: user?.name || "Unknown",
      guestEmail: user?.email,
      roomName: room?.name || "Deleted",
      roomType: room?.roomType || "",
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      status: b.status,
      totalPrice: b.totalPrice,
      createdAt: b.createdAt,
    };
  }));

  // --- Upcoming arrivals (confirmed, checkIn >= today) ---
  const upcomingArrivals = await Booking.find({
    checkIn: { $gte: todayStart },
    status: "confirmed"
  }).sort({ checkIn: 1 }).limit(10).lean();
  const upcomingPopulated = await Promise.all(upcomingArrivals.map(async (b) => {
    const room = await Room.findById(b.roomId).select("name").lean();
    const user = await User.findById(b.userId).select("name").lean();
    return { guestName: user?.name, roomName: room?.name, checkIn: b.checkIn };
  }));

  // --- Revenue by room type (this month vs last month) ---
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const thisMonthBookings = await Booking.find({
    createdAt: { $gte: firstDayThisMonth },
    status: { $ne: "cancelled" }
  }).lean();
  const lastMonthBookings = await Booking.find({
    createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
    status: { $ne: "cancelled" }
  }).lean();

  const roomRevenueMap: Record<string, { thisMonth: number; lastMonth: number }> = {};
  thisMonthBookings.forEach(b => {
    const id = b.roomId.toString();
    if (!roomRevenueMap[id]) roomRevenueMap[id] = { thisMonth: 0, lastMonth: 0 };
    roomRevenueMap[id].thisMonth += b.totalPrice;
  });
  lastMonthBookings.forEach(b => {
    const id = b.roomId.toString();
    if (!roomRevenueMap[id]) roomRevenueMap[id] = { thisMonth: 0, lastMonth: 0 };
    roomRevenueMap[id].lastMonth += b.totalPrice;
  });

  const roomRevenueArray = await Promise.all(
    Object.entries(roomRevenueMap).map(async ([roomId, rev]) => {
      const room = await Room.findById(roomId).select("name roomType").lean();
      return {
        roomName: room?.name || "Unknown",
        roomType: room?.roomType || "",
        thisMonthRevenue: rev.thisMonth,
        lastMonthRevenue: rev.lastMonth,
      };
    })
  );

  // --- Room availability grid (next 14 days, includes checkout day) ---
  const next14Days: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(todayStart);
    d.setDate(todayStart.getDate() + i);
    next14Days.push(d);
  }
  const roomAvailability = await Promise.all(allRooms.map(async (room) => {
    const roomId = room._id.toString();
    const bookings = await Booking.find({
      roomId,
      status: { $ne: "cancelled" },
      checkIn: { $lt: new Date(todayStart.getTime() + 14 * 86400000) },
      checkOut: { $gt: todayStart },
    }).lean();
    const dayStatus = next14Days.map(day => {
      const dayStart = new Date(day);
      const dayEnd = new Date(day.getTime() + 86400000);
      const isBooked = bookings.some(b => b.checkIn < dayEnd && b.checkOut > dayStart);
      if (room.status !== "active") return "inactive";
      return isBooked ? "booked" : "available";
    });
    return { roomId, roomName: room.name, status: room.status, dayStatus };
  }));

  // --- Today Revenue breakdown by room ---
  const todayRevenueBreakdown = todayCheckinsPopulated.reduce((acc, b) => {
    const room = b.roomName || "Deleted";
    if (!acc[room]) acc[room] = 0;
    acc[room] += b.totalPrice;
    return acc;
  }, {} as Record<string, number>);

  // --- All Reviews ---
  const totalReviews = await Review.countDocuments();
  const allReviewsList = await Review.find({}).sort({ createdAt: -1 }).limit(100).lean();
  const allReviewsPopulated = await Promise.all(allReviewsList.map(async (r) => {
    const user = await User.findById(r.userId).select("name email").lean();
    const room = await Room.findById(r.roomId).select("name").lean();
    return { ...r, user, roomName: room?.name || "Deleted" };
  }));

  return NextResponse.json({
    // original summary fields
    revenueData,
    todayCheckins: todayCheckinsCount,
    todayCheckouts: todayCheckoutsCount,
    todayRevenue,
    todayNewUsers: todayNewUsersCount,
    todayReviews: todayReviewsList.length,
    totalBookings,
    totalRevenue,
    statusCounts,
    totalRooms,
    activeRooms,
    inactiveRooms,
    maintenanceRooms,
    occupiedCount,
    availableRooms,
    occupancyRate,
    pendingBookings: pendingPopulated.length,
    recentBookings: recentPopulated,
    upcomingArrivals: upcomingPopulated,
    roomRevenue: roomRevenueArray,
    roomAvailability,
    lastWeekReviews: await Review.countDocuments({
      createdAt: { $gte: new Date(todayStart.getTime() - 7 * 86400000), $lt: todayStart }
    }),

    // detailed lists for popups
    todayCheckinsList: todayCheckinsPopulated,
    todayCheckoutsList: todayCheckoutsPopulated,
    todayNewUsersList,
    todayReviewsList: todayReviewsPopulated,
    pendingBookingsList: pendingPopulated,
    totalBookingsList: recentPopulated, // sample (last 10)
    totalRevenueBreakdown: todayRevenueBreakdown,
    totalReviewsCount: totalReviews,
    allReviewsList: allReviewsPopulated,
  });
}