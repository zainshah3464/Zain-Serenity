"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  CalendarCheck,
  DollarSign,
  DoorOpen,
  UserPlus,
  MessageSquare,
  Star,
  List,
  BedDouble,
  BadgeCheck,
  AlertTriangle,
  Building,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import DetailModal from "@/components/admin/DetailModal";
import DashboardLoader from "@/components/admin/DashboardLoader";
import DashboardEntryAnimation from "@/components/admin/DashboardEntryAnimation";
import {
  DashboardData,
  RatingStars,
  SummaryCard,
  StatusBadge,
  RoomAvailabilityGrid,
  RevenueByRoomTypeChart,
  RevenueChart,
} from "@/components/admin/DashboardComponents";

// ---------- Individual item variants (used by stagger container) ----------
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// ---------- Main Dashboard Component ----------
export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartRange, setChartRange] = useState("7d");
  const [customStart, setCustomStart] = useState<string | undefined>(undefined);
  const [customEnd, setCustomEnd] = useState<string | undefined>(undefined);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalColumns, setModalColumns] = useState<{ key: string; label: string }[]>([]);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalRenderCell, setModalRenderCell] = useState<any>(undefined);

  const fetchDashboard = async (
    range = chartRange,
    start?: string,
    end?: string,
    isRefresh = false
  ) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      let url = `/api/admin/dashboard?range=${range}`;
      if (range === "custom") {
        if (start) url += `&start=${start}`;
        if (end) url += `&end=${end}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRangeChange = (range: string, start?: string, end?: string) => {
    setChartRange(range);
    if (range === "custom") {
      setCustomStart(start);
      setCustomEnd(end);
      if (start && end) {
        fetchDashboard("custom", start, end);
      }
    } else {
      fetchDashboard(range);
    }
  };

  const openModal = (
    title: string,
    columns: { key: string; label: string }[],
    data: any[],
    renderCell?: any
  ) => {
    setModalTitle(title);
    setModalColumns(columns);
    setModalData(data);
    setModalRenderCell(renderCell || undefined);
    setModalOpen(true);
  };

  if (loading || !data) {
    return <DashboardLoader />;
  }

  // Safe fallbacks
  const totalRevenueBreakdown = data.totalRevenueBreakdown || {};
  const totalRevenueBreakdownAll = data.totalRevenueBreakdownAll || {};
  const roomAvailability = data.roomAvailability || [];

  const pieData = [
    { name: "Pending", value: data.statusCounts.pending },
    { name: "Confirmed", value: data.statusCounts.confirmed },
    { name: "Cancelled", value: data.statusCounts.cancelled },
  ];
  const COLORS = ["#F59E0B", "#10B981", "#F43F5E"];

  const roomStatusPie = [
    { name: "Active", value: data.activeRooms },
    { name: "Inactive", value: data.inactiveRooms },
    { name: "Maintenance", value: data.maintenanceRooms },
  ];
  const ROOM_STATUS_COLORS = ["#0EA5E9", "#94A3B8", "#F97316"];

  return (
    <DashboardEntryAnimation>
      <div className="relative min-h-screen bg-sky-50 pb-10 pt-6 px-3 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto space-y-8 sm:space-y-10">
          {/* Header with refresh button */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-sky-600">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Real-time hotel performance &amp; booking insights
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchDashboard(chartRange, customStart, customEnd, true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl shadow-lg shadow-slate-900/30 hover:shadow-xl hover:shadow-slate-900/40 transition disabled:opacity-60"
              title="Refresh dashboard"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              <span className="font-semibold">Refresh</span>
            </motion.button>
          </motion.div>

          {/* Row 1: Super Summary Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            <SummaryCard
              title="Today Revenue"
              value={`$${data.todayRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Today's Revenue Breakdown",
                  [{ key: "room", label: "Room" }, { key: "revenue", label: "Revenue" }],
                  Object.entries(totalRevenueBreakdown).map(([room, rev]) => ({
                    room,
                    revenue: `$${rev}`,
                  }))
                )
              }
            />
            <SummaryCard
              title="Today Check-ins"
              value={data.todayCheckins}
              icon={CalendarCheck}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Today's Check-ins",
                  [
                    { key: "guest", label: "Guest" },
                    { key: "room", label: "Room" },
                    { key: "checkIn", label: "Check-in" },
                    { key: "status", label: "Status" },
                  ],
                  data.todayCheckinsList.map((b) => ({
                    guest: b.user?.name || "Guest",
                    room: b.roomName,
                    checkIn: new Date(b.checkIn).toLocaleString(),
                    status: <StatusBadge status={b.status} />,
                  }))
                )
              }
            />
            <SummaryCard
              title="Today Check-outs"
              value={data.todayCheckouts}
              icon={DoorOpen}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Today's Check-outs",
                  [
                    { key: "guest", label: "Guest" },
                    { key: "room", label: "Room" },
                    { key: "checkOut", label: "Check-out" },
                    { key: "status", label: "Status" },
                  ],
                  data.todayCheckoutsList.map((b) => ({
                    guest: b.user?.name || "Guest",
                    room: b.roomName,
                    checkOut: new Date(b.checkOut).toLocaleString(),
                    status: <StatusBadge status={b.status} />,
                  }))
                )
              }
            />
            <SummaryCard
              title="New Users"
              value={data.todayNewUsers}
              icon={UserPlus}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "New Users Today",
                  [
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "joined", label: "Joined" },
                  ],
                  data.todayNewUsersList.map((u) => ({
                    name: u.name,
                    email: u.email,
                    joined: new Date(u.createdAt).toLocaleString(),
                  }))
                )
              }
            />
            <SummaryCard
              title="Today Reviews"
              value={data.todayReviews}
              icon={Star}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Today's Reviews",
                  [
                    { key: "user", label: "User" },
                    { key: "rating", label: "Rating" },
                    { key: "comment", label: "Comment" },
                    { key: "time", label: "Time" },
                  ],
                  data.todayReviewsList.map((r) => ({
                    user: r.user?.name || "Guest",
                    rating: <RatingStars rating={r.rating} />,
                    comment: r.comment?.slice(0, 50) + (r.comment?.length > 50 ? "..." : ""),
                    time: new Date(r.createdAt).toLocaleString(),
                  }))
                )
              }
            />
            <SummaryCard
              title="Pending Bookings"
              value={data.pendingBookings}
              icon={Clock}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Pending Bookings",
                  [
                    { key: "guest", label: "Guest" },
                    { key: "room", label: "Room" },
                    { key: "dates", label: "Dates" },
                    { key: "price", label: "Price" },
                    { key: "status", label: "Status" },
                  ],
                  data.pendingBookingsList.map((b) => ({
                    guest: b.user?.name || "Guest",
                    room: b.roomName,
                    dates: `${new Date(b.checkIn).toLocaleDateString()} - ${new Date(b.checkOut).toLocaleDateString()}`,
                    price: `$${b.totalPrice}`,
                    status: <StatusBadge status={b.status} />,
                  }))
                )
              }
            />
          </motion.div>

          {/* Row 2: Overall Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            <SummaryCard
              title="Total Bookings"
              value={data.totalBookings}
              icon={List}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Total Bookings (Recent)",
                  [
                    { key: "guest", label: "Guest" },
                    { key: "room", label: "Room" },
                    { key: "dates", label: "Dates" },
                    { key: "status", label: "Status" },
                  ],
                  data.totalBookingsList.map((b) => ({
                    guest: b.guestName,
                    room: b.roomName,
                    dates: `${new Date(b.checkIn).toLocaleDateString()} - ${new Date(b.checkOut).toLocaleDateString()}`,
                    status: <StatusBadge status={b.status} />,
                  }))
                )
              }
            />
            <SummaryCard
              title="Total Revenue"
              value={`$${data.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Total Revenue (All Time)",
                  [{ key: "room", label: "Room" }, { key: "revenue", label: "Revenue" }],
                  Object.entries(totalRevenueBreakdownAll).map(([room, rev]) => ({
                    room,
                    revenue: `$${rev}`,
                  }))
                )
              }
            />
            <SummaryCard
              title="Occupancy"
              value={`${data.occupiedCount}/${data.totalRooms} (${data.occupancyRate}%)`}
              icon={Building}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Current Occupancy Detail",
                  [
                    { key: "room", label: "Room" },
                    { key: "status", label: "Status" },
                  ],
                  roomAvailability.map((r) => ({
                    room: r.roomName,
                    status: r.status === "active" ? (r.dayStatus?.[0] === "booked" ? "Occupied" : "Available") : r.status,
                  }))
                )
              }
            />
            <SummaryCard
              title="Available Rooms"
              value={data.availableRooms}
              icon={BedDouble}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Available Rooms",
                  [{ key: "room", label: "Room" }, { key: "type", label: "Type" }],
                  roomAvailability
                    .filter((r) => r.dayStatus?.[0] === "available")
                    .map((r) => ({ room: r.roomName, type: "Active" }))
                )
              }
            />
            <SummaryCard
              title="Active Rooms"
              value={data.activeRooms}
              icon={BadgeCheck}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Active Rooms",
                  [{ key: "room", label: "Room" }],
                  roomAvailability.filter((r) => r.status === "active").map((r) => ({ room: r.roomName }))
                )
              }
            />
            <SummaryCard
              title="Maintenance"
              value={data.maintenanceRooms}
              icon={AlertTriangle}
              color="text-sky-600"
              bg="bg-sky-50"
              onClick={() =>
                openModal(
                  "Maintenance Rooms",
                  [{ key: "room", label: "Room" }],
                  roomAvailability.filter((r) => r.status === "maintenance").map((r) => ({ room: r.roomName }))
                )
              }
            />
          </motion.div>

          {/* Row 3: Revenue & Booking Status Charts */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-shadow">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="h-6 w-1.5 bg-sky-500 rounded-full" />
                Revenue Over Time
              </h2>
              <RevenueChart data={data.revenueData} onRangeChange={handleRangeChange} currentRange={chartRange} />
            </div>
            <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-shadow">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="h-6 w-1.5 bg-sky-500 rounded-full" />
                Booking Status
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-5 mt-4 flex-wrap">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm font-medium">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Row 4: Room Status Pie & Revenue by Room Type */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-shadow">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="h-6 w-1.5 bg-sky-500 rounded-full" />
                Room Status
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={roomStatusPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {roomStatusPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ROOM_STATUS_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-5 mt-4 flex-wrap">
                {roomStatusPie.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm font-medium">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ROOM_STATUS_COLORS[index] }} />
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-shadow">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="h-6 w-1.5 bg-sky-500 rounded-full" />
                Revenue by Room Type
              </h2>
              <RevenueByRoomTypeChart data={data.roomRevenue} />
            </div>
          </motion.div>

          {/* Row 5: Room Availability Grid */}
          <motion.div variants={itemVariants} className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-shadow">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="h-6 w-1.5 bg-sky-500 rounded-full" />
              Room Availability (Next 14 Days)
            </h2>
            <RoomAvailabilityGrid data={roomAvailability} />
          </motion.div>

          {/* Row 6: Recent Bookings & Upcoming Arrivals */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-shadow">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="h-6 w-1.5 bg-sky-500 rounded-full" />
                Recent Bookings
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-sky-100">
                <table className="min-w-full text-sm">
                  <thead className="bg-sky-50 text-slate-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Guest</th>
                      <th className="text-left py-3 px-4 font-semibold">Room</th>
                      <th className="text-left py-3 px-4 font-semibold">Dates</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentBookings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-500">No recent bookings</td>
                      </tr>
                    ) : (
                      data.recentBookings.map((b) => (
                        <tr key={b._id} className="border-t border-sky-100 hover:bg-sky-50/60 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-800">{b.guestName}</td>
                          <td className="py-3 px-4">{b.roomName}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                            {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-shadow">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="h-6 w-1.5 bg-sky-500 rounded-full" />
                Upcoming Arrivals
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-sky-100">
                <table className="min-w-full text-sm">
                  <thead className="bg-sky-50 text-slate-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Guest</th>
                      <th className="text-left py-3 px-4 font-semibold">Room</th>
                      <th className="text-left py-3 px-4 font-semibold">Check-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.upcomingArrivals.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-slate-500">No upcoming arrivals</td>
                      </tr>
                    ) : (
                      data.upcomingArrivals.map((a, i) => (
                        <tr key={i} className="border-t border-sky-100 hover:bg-sky-50/60 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-800">{a.guestName}</td>
                          <td className="py-3 px-4">{a.roomName}</td>
                          <td className="py-3 px-4 text-slate-600">{new Date(a.checkIn).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Row 7: Total Reviews */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Reviews"
              value={data.totalReviewsCount}
              icon={MessageSquare}
              color="text-sky-600"
              bg="bg-sky-50"
              sub={`Last 7 days: ${data.lastWeekReviews}`}
              onClick={() =>
                openModal(
                  "All Reviews",
                  [
                    { key: "user", label: "User" },
                    { key: "room", label: "Room" },
                    { key: "rating", label: "Rating" },
                    { key: "comment", label: "Comment" },
                    { key: "date", label: "Date" },
                  ],
                  data.allReviewsList.map((r) => ({
                    user: r.user?.name || "Guest",
                    room: r.roomName,
                    rating: <RatingStars rating={r.rating} />,
                    comment: r.comment?.slice(0, 60) + (r.comment?.length > 60 ? "..." : ""),
                    date: new Date(r.createdAt).toLocaleDateString(),
                  }))
                )
              }
            />
          </motion.div>

          {/* Modal */}
          <DetailModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={modalTitle}
            columns={modalColumns}
            data={modalData}
            renderCell={modalRenderCell}
          />
        </div>
      </div>
    </DashboardEntryAnimation>
  );
}