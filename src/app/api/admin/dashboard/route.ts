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

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  // Load all rooms once for reuse
  const allRooms = await Room.find().lean();
  const roomMap = new Map(allRooms.map((r) => [r._id.toString(), { name: r.name, roomType: r.roomType }]));

  // ---------- REVENUE DATA (Solid) ----------
  const buildRevenueData = async (startDate: Date, endDate?: Date) => {
    const filter: any = {
      status: { $ne: "cancelled" },
      createdAt: { $gte: startDate },
    };
    if (endDate) {
      filter.createdAt.$lte = endDate;
    }

    const bookings = await Booking.find(filter).select("createdAt totalPrice").lean();
    const dailyMap: Record<string, number> = {};

    bookings.forEach((b) => {
      const date = new Date(b.createdAt).toISOString().split("T")[0];
      dailyMap[date] = (dailyMap[date] || 0) + b.totalPrice;
    });

    return Object.entries(dailyMap)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  let revenueData: { date: string; total: number }[] = [];

  if (range === "all") {
    revenueData = await buildRevenueData(new Date(0));
  } else if (range === "thisYear") {
    revenueData = await buildRevenueData(new Date(now.getFullYear(), 0, 1));
  } else if (range === "lastYear") {
    const start = new Date(now.getFullYear() - 1, 0, 1);
    const end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
    revenueData = await buildRevenueData(start, end);
  } else if (range === "thisMonth") {
    revenueData = await buildRevenueData(new Date(now.getFullYear(), now.getMonth(), 1));
  } else if (range === "custom") {
    const start = customStart ? new Date(customStart) : new Date(0);
    const end = customEnd ? new Date(customEnd) : now;
    end.setHours(23, 59, 59, 999);
    revenueData = await buildRevenueData(start, end);
  } else {
    // default 7 days
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    revenueData = await buildRevenueData(start);
  }

  // ---------- TODAY CHECK-INS & REVENUE (FIXED) ----------
  const todayCheckinsList = await Booking.find({
    checkIn: { $gte: todayStart, $lt: todayEnd },
    status: { $ne: "cancelled" },
  })
    .sort({ checkIn: 1 })
    .lean();

  const todayRevenue = todayCheckinsList.reduce((sum, b) => sum + b.totalPrice, 0);

  const todayCheckoutsList = await Booking.find({
    checkOut: { $gte: todayStart, $lt: todayEnd },
    status: { $ne: "cancelled" },
  })
    .sort({ checkOut: 1 })
    .lean();

  const todayNewUsersList = await User.find({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  })
    .select("name email createdAt")
    .sort({ createdAt: -1 })
    .lean();

  const todayReviewsList = await Review.find({
    createdAt: { $gte: todayStart, $lt: todayEnd },
  })
    .sort({ createdAt: -1 })
    .lean();

  // Helper to populate booking room and user
  const populateBooking = async (b: any) => {
    const [room, user] = await Promise.all([
      Room.findById(b.roomId).select("name roomType").lean(),
      User.findById(b.userId).select("name email").lean(),
    ]);
    return {
      ...b,
      roomName: room?.name || "Deleted",
      roomType: room?.roomType || "",
      user,
    };
  };

  const todayCheckinsPopulated = await Promise.all(todayCheckinsList.map(populateBooking));
  const todayCheckoutsPopulated = await Promise.all(todayCheckoutsList.map(populateBooking));

  const todayReviewsPopulated = await Promise.all(
    todayReviewsList.map(async (r) => {
      const [user, room] = await Promise.all([
        User.findById(r.userId).select("name email").lean(),
        Room.findById(r.roomId).select("name").lean(),
      ]);
      return { ...r, user, roomName: room?.name || "Deleted" };
    })
  );

  // ---------- TOTAL STATS ----------
  const totalBookings = await Booking.countDocuments();

  const allNonCancelledBookings = await Booking.find({ status: { $ne: "cancelled" } })
    .select("roomId totalPrice")
    .lean();

  const totalRevenue = allNonCancelledBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  // All-time revenue breakdown by room (solid)
  const allTimeRevenueAgg: Record<string, number> = {};
  allNonCancelledBookings.forEach((b) => {
    const roomId = b.roomId.toString();
    allTimeRevenueAgg[roomId] = (allTimeRevenueAgg[roomId] || 0) + b.totalPrice;
  });

  const totalRevenueBreakdownAll: Record<string, number> = {};
  for (const [roomId, total] of Object.entries(allTimeRevenueAgg)) {
    const roomInfo = roomMap.get(roomId);
    const roomName = roomInfo?.name || "Deleted Room";
    totalRevenueBreakdownAll[roomName] = total;
  }

  const statusCountsRaw = await Booking.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const statusCounts: any = { pending: 0, confirmed: 0, cancelled: 0 };
  statusCountsRaw.forEach((s: any) => {
    statusCounts[s._id] = s.count;
  });

  // ---------- ROOM STATS ----------
  const totalRooms = allRooms.length;
  const activeRooms = allRooms.filter((r) => r.status === "active").length;
  const inactiveRooms = allRooms.filter((r) => r.status === "inactive").length;
  const maintenanceRooms = allRooms.filter((r) => r.status === "maintenance").length;

  const overlapping = await Booking.find({
    checkIn: { $lt: todayEnd },
    checkOut: { $gt: todayStart },
    status: { $ne: "cancelled" },
  }).distinct("roomId");

  const occupiedCount = overlapping.length;
  const availableRooms = totalRooms - occupiedCount;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

  // ---------- PENDING BOOKINGS ----------
  const pendingBookingsList = await Booking.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .lean();
  const pendingPopulated = await Promise.all(pendingBookingsList.map(populateBooking));

  // ---------- RECENT BOOKINGS ----------
  const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(10).lean();
  const recentPopulated = await Promise.all(
    recentBookings.map(async (b) => {
      const roomInfo = roomMap.get(b.roomId.toString());
      const user = await User.findById(b.userId).select("name email").lean();
      return {
        _id: b._id,
        guestName: user?.name || "Unknown",
        guestEmail: user?.email,
        roomName: roomInfo?.name || "Deleted",
        roomType: roomInfo?.roomType || "",
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        status: b.status,
        totalPrice: b.totalPrice,
        createdAt: b.createdAt,
      };
    })
  );

  // ---------- UPCOMING ARRIVALS ----------
  const upcomingArrivals = await Booking.find({
    checkIn: { $gte: todayStart },
    status: "confirmed",
  })
    .sort({ checkIn: 1 })
    .limit(10)
    .lean();

  const upcomingPopulated = await Promise.all(
    upcomingArrivals.map(async (b) => {
      const roomInfo = roomMap.get(b.roomId.toString());
      const user = await User.findById(b.userId).select("name").lean();
      return {
        guestName: user?.name || "Unknown",
        roomName: roomInfo?.name || "Deleted",
        checkIn: b.checkIn,
      };
    })
  );

  // ---------- REVENUE BY ROOM TYPE (THIS MONTH vs LAST MONTH) ----------
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const thisMonthBookings = await Booking.find({
    createdAt: { $gte: firstDayThisMonth },
    status: { $ne: "cancelled" },
  })
    .select("roomId totalPrice")
    .lean();

  const lastMonthBookings = await Booking.find({
    createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth },
    status: { $ne: "cancelled" },
  })
    .select("roomId totalPrice")
    .lean();

  const roomRevenueMap: Record<string, { thisMonth: number; lastMonth: number }> = {};

  thisMonthBookings.forEach((b) => {
    const roomId = b.roomId.toString();
    if (!roomRevenueMap[roomId]) roomRevenueMap[roomId] = { thisMonth: 0, lastMonth: 0 };
    roomRevenueMap[roomId].thisMonth += b.totalPrice;
  });

  lastMonthBookings.forEach((b) => {
    const roomId = b.roomId.toString();
    if (!roomRevenueMap[roomId]) roomRevenueMap[roomId] = { thisMonth: 0, lastMonth: 0 };
    roomRevenueMap[roomId].lastMonth += b.totalPrice;
  });

  const roomRevenueArray = Object.entries(roomRevenueMap).map(([roomId, rev]) => {
    const roomInfo = roomMap.get(roomId);
    return {
      roomName: roomInfo?.name || "Unknown",
      roomType: roomInfo?.roomType || "",
      thisMonthRevenue: rev.thisMonth,
      lastMonthRevenue: rev.lastMonth,
    };
  });

  // ---------- ROOM AVAILABILITY GRID (NEXT 14 DAYS) ----------
  const next14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(todayStart);
    d.setDate(todayStart.getDate() + i);
    return d;
  });

  const gridEnd = new Date(todayStart);
  gridEnd.setDate(todayStart.getDate() + 14);

  const roomAvailability = await Promise.all(
    allRooms.map(async (room) => {
      const roomId = room._id.toString();
      const bookings = await Booking.find({
        roomId,
        status: { $ne: "cancelled" },
        checkIn: { $lt: gridEnd },
        checkOut: { $gt: todayStart },
      })
        .select("checkIn checkOut")
        .lean();

      const dayStatus = next14Days.map((day) => {
        const dayStart = new Date(day);
        const dayEnd = new Date(day.getTime() + 86400000);

        if (room.status !== "active") return "inactive";
        const isBooked = bookings.some(
          (b) => new Date(b.checkIn) < dayEnd && new Date(b.checkOut) > dayStart
        );
        return isBooked ? "booked" : "available";
      });

      return {
        roomId,
        roomName: room.name,
        status: room.status,
        dayStatus,
      };
    })
  );

  // ---------- TODAY REVENUE BREAKDOWN (BY ROOM) ----------
  const todayRevenueBreakdown: Record<string, number> = {};
  todayCheckinsPopulated.forEach((b) => {
    const room = b.roomName || "Deleted";
    todayRevenueBreakdown[room] = (todayRevenueBreakdown[room] || 0) + b.totalPrice;
  });

  // ---------- ALL REVIEWS ----------
  const totalReviews = await Review.countDocuments();
  const allReviewsList = await Review.find({}).sort({ createdAt: -1 }).limit(100).lean();
  const allReviewsPopulated = await Promise.all(
    allReviewsList.map(async (r) => {
      const [user, room] = await Promise.all([
        User.findById(r.userId).select("name email").lean(),
        Room.findById(r.roomId).select("name").lean(),
      ]);
      return { ...r, user, roomName: room?.name || "Deleted" };
    })
  );

  return NextResponse.json({
    revenueData,
    todayCheckins: todayCheckinsList.length,
    todayCheckouts: todayCheckoutsList.length,
    todayRevenue,
    todayNewUsers: todayNewUsersList.length,
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
      createdAt: {
        $gte: new Date(todayStart.getTime() - 7 * 86400000),
        $lt: todayStart,
      },
    }),
    todayCheckinsList: todayCheckinsPopulated,
    todayCheckoutsList: todayCheckoutsPopulated,
    todayNewUsersList,
    todayReviewsList: todayReviewsPopulated,
    pendingBookingsList: pendingPopulated,
    totalBookingsList: recentPopulated, // sample (last 10)
    totalRevenueBreakdown: todayRevenueBreakdown,
    totalRevenueBreakdownAll, // ⬅️ Added for Total Revenue modal
    totalReviewsCount: totalReviews,
    allReviewsList: allReviewsPopulated,
  });
}