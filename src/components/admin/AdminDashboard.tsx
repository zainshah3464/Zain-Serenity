"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { motion } from "framer-motion";
import {
  CalendarCheck, DollarSign, Users, TrendingUp, Loader2,
  BedDouble, DoorOpen, Clock, UserPlus, MessageSquare, Star,
  List, CalendarDays, BadgeCheck, AlertTriangle, Building,
  ArrowUpRight, ArrowDownRight, RefreshCw,
} from "lucide-react";
import DetailModal from "@/components/admin/DetailModal";

// ---------- Interfaces (unchanged) ----------
interface DashboardData {
  revenueData: { date: string; total: number }[];
  todayCheckins: number;
  todayCheckouts: number;
  todayRevenue: number;
  todayNewUsers: number;
  todayReviews: number;
  totalBookings: number;
  totalRevenue: number;
  statusCounts: { pending: number; confirmed: number; cancelled: number };
  totalRooms: number;
  activeRooms: number;
  inactiveRooms: number;
  maintenanceRooms: number;
  occupiedCount: number;
  availableRooms: number;
  occupancyRate: number;
  pendingBookings: number;
  recentBookings: any[];
  upcomingArrivals: any[];
  roomRevenue: any[];
  roomAvailability: any[];
  lastWeekReviews: number;
  todayCheckinsList: any[];
  todayCheckoutsList: any[];
  todayNewUsersList: any[];
  todayReviewsList: any[];
  pendingBookingsList: any[];
  totalBookingsList: any[];
  totalRevenueBreakdown: Record<string, number>;
  totalReviewsCount: number;
  allReviewsList: any[];
}

// ---------- Rating Stars (no emojis) ----------
const RatingStars = ({ rating }: { rating: number }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? "#f59e0b" : "none"}
        className={i < rating ? "text-amber-500" : "text-gray-300"}
        strokeWidth={1.5}
      />
    ))}
  </span>
);

// ---------- Enhanced SummaryCard ----------
const SummaryCard = ({ title, value, icon: Icon, color, bg, sub, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    whileHover={onClick ? { scale: 1.02, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" } : {}}
    onClick={onClick}
    className={`relative group bg-white/80 backdrop-blur border border-gray-100/80 rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200 ${
      onClick ? "cursor-pointer" : "cursor-default"
    }`}
  >
    <div className="min-w-0 flex-1">
      <p className="text-xs sm:text-sm font-medium text-gray-500 tracking-wide uppercase">{title}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1 font-medium">{sub}</p>}
    </div>
    <div className={`p-2.5 sm:p-3 rounded-xl ${bg} ml-3 flex-shrink-0 shadow-inner`}>
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
    </div>
    {onClick && (
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">View</span>
      </div>
    )}
  </motion.div>
);

// ---------- Status Badge ----------
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: {
      bg: "bg-yellow-100 border-yellow-200",
      text: "text-yellow-800",
      icon: <Clock size={14} className="mr-1" />,
    },
    confirmed: {
      bg: "bg-green-100 border-green-200",
      text: "text-green-800",
      icon: <BadgeCheck size={14} className="mr-1" />,
    },
    cancelled: {
      bg: "bg-red-100 border-red-200",
      text: "text-red-800",
      icon: <AlertTriangle size={14} className="mr-1" />,
    },
    checkedin: {
      bg: "bg-blue-100 border-blue-200",
      text: "text-blue-800",
      icon: <CalendarCheck size={14} className="mr-1" />,
    },
    completed: {
      bg: "bg-indigo-100 border-indigo-200",
      text: "text-indigo-800",
      icon: <TrendingUp size={14} className="mr-1" />,
    },
  };
  const { bg, text, icon } = config[status] || {
    bg: "bg-gray-100 border-gray-200",
    text: "text-gray-800",
    icon: null,
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${bg} ${text}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ---------- Room Availability Grid ----------
const RoomAvailabilityGrid = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0)
    return <p className="text-sm text-gray-500 py-4 text-center">No rooms data.</p>;

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200/60">
      <table className="min-w-full text-xs">
        <thead>
          <tr className="bg-gray-50/80 text-gray-600">
            <th className="text-left py-3 px-4 font-semibold">Room</th>
            {days.map((day, idx) => (
              <th
                key={idx}
                className="text-center px-1 py-3 font-medium whitespace-nowrap"
                title={day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              >
                <span className="block text-[0.7rem] uppercase tracking-wider">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="block text-sm font-bold">{day.getDate()}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((room) => (
            <tr key={room.roomId} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td className="py-2.5 px-4 font-semibold text-gray-700 truncate max-w-[120px]">
                <span title={room.roomName}>{room.roomName}</span>
              </td>
              {room.dayStatus.map((status: string, idx: number) => (
                <td key={idx} className="text-center p-1">
                  <div
                    className={`w-5 h-5 mx-auto rounded-md transition-transform hover:scale-110 shadow-sm ${
                      status === "available"
                        ? "bg-emerald-400/80 ring-1 ring-emerald-300"
                        : status === "booked"
                        ? "bg-red-400/80 ring-1 ring-red-300"
                        : "bg-gray-300/80 ring-1 ring-gray-200"
                    }`}
                    title={`${room.roomName}: ${status}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 p-3 text-xs font-medium text-gray-600 bg-gray-50/80 border-t border-gray-200/60">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 bg-emerald-400/80 rounded ring-1 ring-emerald-300" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 bg-red-400/80 rounded ring-1 ring-red-300" /> Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 bg-gray-300/80 rounded ring-1 ring-gray-200" /> Unavailable
        </span>
      </div>
    </div>
  );
};

// ---------- Revenue by Room Type Table ----------
const RevenueByRoomTypeChart = ({ data }: { data: any[] }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200/60">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50/80 text-gray-600">
        <tr>
          <th className="text-left py-3 px-4 font-semibold">Room Type</th>
          <th className="text-right py-3 px-4 font-semibold">This Month</th>
          <th className="text-right py-3 px-4 font-semibold">Last Month</th>
          <th className="text-right py-3 px-4 font-semibold">Change</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => {
          const change = item.thisMonthRevenue - item.lastMonthRevenue;
          const pct = item.lastMonthRevenue ? ((change / item.lastMonthRevenue) * 100).toFixed(0) : "∞";
          return (
            <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td className="py-3 px-4 font-medium text-gray-700">{item.roomName}</td>
              <td className="text-right py-3 px-4">${item.thisMonthRevenue.toLocaleString()}</td>
              <td className="text-right py-3 px-4">${item.lastMonthRevenue.toLocaleString()}</td>
              <td className={`text-right py-3 px-4 flex items-center justify-end gap-1 font-medium ${
                change >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}>
                {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {pct}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// ---------- Custom Tooltip for Revenue Chart ----------
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label + "T00:00:00");
    const formatted = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200 text-sm">
        <p className="font-medium text-gray-700 mb-1">{formatted}</p>
        <p className="text-teal-600 font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// ---------- Revenue Chart (with custom date inputs) ----------
const RevenueChart = ({ data, onRangeChange, currentRange }: any) => {
  const ranges = [
    { label: "7 Days", value: "7d" },
    { label: "Month", value: "thisMonth" },
    { label: "Year", value: "thisYear" },
    { label: "Last Yr", value: "lastYear" },
    { label: "All", value: "all" },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => onRangeChange(r.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                currentRange === r.value
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <input
            type="date"
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            onChange={(e) => onRangeChange("custom", e.target.value, undefined)}
          />
          <input
            type="date"
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            onChange={(e) => onRangeChange("custom", undefined, e.target.value)}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tickFormatter={(dateStr) =>
              new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#0d9488"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ---------- Advanced Loading Animation ----------
const DashboardLoader = () => (
  <div className="relative flex flex-col items-center justify-center py-20 px-6 select-none">
    {/* Animated conic gradient border wrapper */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative p-[1.5px] rounded-[2rem] overflow-hidden"
    >
      {/* Rotating conic gradient border */}
      <motion.div
        className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,#14b8a6_20%,#22d3ee_40%,#0ea5e9_60%,transparent_80%)]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      />
      {/* Inner card - flat white, no glow, no blur, no dot pattern */}
      <div className="relative bg-white rounded-[calc(2rem-1.5px)] px-10 py-12 flex flex-col items-center overflow-hidden">
        {/* Loader circle container */}
        <div className="relative w-28 h-28">
          {/* Outer conic gradient ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#14b8a6,#22d3ee,#0ea5e9,#14b8a6)]"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          >
            <div className="absolute inset-[3px] rounded-full bg-white" />
          </motion.div>

          {/* Inner rotating gradient ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-teal-500 border-r-teal-500"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
          />

          {/* Dashed decorative ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-dashed border-cyan-300/60"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          />

          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute top-0 left-1/2 w-2 h-2 -ml-1 rounded-full bg-teal-400"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 2 + i * 0.5,
                ease: "linear",
                delay: i * 0.3,
              }}
              style={{
                transformOrigin: "50% 56px", // orbit radius
              }}
            />
          ))}

          {/* Core icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* analytics / bar chart icon */}
                <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                <path d="M7 13v3" />
                <path d="M11 9v7" />
                <path d="M15 6v10" />
                <path d="M19 3v13" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Floating data pills - left side */}
        <div className="absolute left-2 top-1/4 hidden md:flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-16 rounded-full bg-teal-100"
              animate={{ scaleX: [1, 0.6, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: "easeInOut", delay: i * 0.2 }}
            />
          ))}
        </div>

        {/* Floating data pills - right side */}
        <div className="absolute right-2 bottom-1/4 hidden md:flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-16 rounded-full bg-cyan-100"
              animate={{ scaleX: [1, 0.6, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: "easeInOut", delay: i * 0.4 }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          className="mt-8 text-teal-800 font-semibold text-lg tracking-wide"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          Loading Dashboard
          <motion.span
            className="inline-block"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.5, 1] }}
          >
            ...
          </motion.span>
        </motion.p>

        {/* Subtext - simple solid color */}
        <p className="mt-2 text-xs text-teal-500 uppercase tracking-[0.3em]">
          Preparing insights
        </p>
      </div>
    </motion.div>

    {/* Bottom progress shimmer bars */}
    <div className="mt-10 w-64 space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-1">
          <motion.div
            className="h-1.5 rounded-full bg-teal-100 overflow-hidden relative"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 rounded-full relative"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              {/* Shine effect on bar */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear", delay: i * 0.2 }}
              />
            </motion.div>
          </motion.div>
          {/* Tiny dots below bars */}
          <motion.div
            className="flex gap-1"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
          >
            {[0, 1, 2, 3, 4].map((d) => (
              <span key={d} className="w-1 h-1 rounded-full bg-teal-300/60" />
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  </div>
);
// ---------- Main Dashboard Component ----------
export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartRange, setChartRange] = useState("7d");

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
      if (start) fetchDashboard("custom", start, end);
    } else {
      fetchDashboard(range);
    }
  };

  const openModal = (title: string, columns: { key: string; label: string }[], data: any[], renderCell?: any) => {
    setModalTitle(title);
    setModalColumns(columns);
    setModalData(data);
    setModalRenderCell(renderCell || undefined);
    setModalOpen(true);
  };

  if (loading || !data) {
    return <DashboardLoader />;
  }

  const pieData = [
    { name: "Pending", value: data.statusCounts.pending },
    { name: "Confirmed", value: data.statusCounts.confirmed },
    { name: "Cancelled", value: data.statusCounts.cancelled },
  ];
  const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

  const roomStatusPie = [
    { name: "Active", value: data.activeRooms },
    { name: "Inactive", value: data.inactiveRooms },
    { name: "Maintenance", value: data.maintenanceRooms },
  ];
  const ROOM_STATUS_COLORS = ["#10b981", "#6b7280", "#f97316"];

  return (
    <div className="space-y-8 sm:space-y-10 pb-10">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between gap-3">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight"
        >
          Admin Dashboard
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchDashboard(chartRange, undefined, undefined, true)}
          disabled={refreshing}
          className="p-2.5 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-teal-600 shadow-sm hover:shadow-md transition disabled:opacity-60"
          title="Refresh dashboard"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin" : ""}
          />
        </motion.button>
      </div>

      {/* ---------- Row 1: Super Summary Cards (6 cards) ---------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <SummaryCard
          title="Today Revenue"
          value={`$${data.todayRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="text-emerald-600"
          bg="bg-emerald-50"
          onClick={() =>
            openModal(
              "Today's Revenue Breakdown",
              [{ key: "room", label: "Room" }, { key: "revenue", label: "Revenue" }],
              Object.entries(data.totalRevenueBreakdown).map(([room, rev]) => ({ room, revenue: `$${rev}` }))
            )
          }
        />
        <SummaryCard
          title="Today Check-ins"
          value={data.todayCheckins}
          icon={CalendarCheck}
          color="text-blue-600"
          bg="bg-blue-50"
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
          color="text-purple-600"
          bg="bg-purple-50"
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
          color="text-indigo-600"
          bg="bg-indigo-50"
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
          color="text-amber-600"
          bg="bg-amber-50"
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
          color="text-orange-600"
          bg="bg-orange-50"
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
      </div>

      {/* ---------- Row 2: Overall Stats (6 cards) ---------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <SummaryCard
          title="Total Bookings"
          value={data.totalBookings}
          icon={List}
          color="text-gray-600"
          bg="bg-gray-50"
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
          color="text-teal-600"
          bg="bg-teal-50"
          onClick={() =>
            openModal(
              "Total Revenue (All Time)",
              [{ key: "room", label: "Room" }, { key: "revenue", label: "Revenue" }],
              Object.entries(
                data.totalBookingsList.reduce((acc: Record<string, number>, b) => {
                  acc[b.roomName] = (acc[b.roomName] || 0) + b.totalPrice;
                  return acc;
                }, {})
              ).map(([room, rev]) => ({ room, revenue: `$${rev}` }))
            )
          }
        />
        <SummaryCard
          title="Occupancy"
          value={`${data.occupiedCount}/${data.totalRooms} (${data.occupancyRate}%)`}
          icon={Building}
          color="text-cyan-600"
          bg="bg-cyan-50"
          onClick={() =>
            openModal(
              "Current Occupancy Detail",
              [
                { key: "room", label: "Room" },
                { key: "status", label: "Status" },
              ],
              data.roomAvailability.map((r) => ({
                room: r.roomName,
                status: r.status === "active" ? (r.dayStatus[0] === "booked" ? "Occupied" : "Available") : r.status,
              }))
            )
          }
        />
        <SummaryCard
          title="Available Rooms"
          value={data.availableRooms}
          icon={BedDouble}
          color="text-green-600"
          bg="bg-green-50"
          onClick={() =>
            openModal(
              "Available Rooms",
              [{ key: "room", label: "Room" }, { key: "type", label: "Type" }],
              data.roomAvailability
                .filter((r) => r.dayStatus[0] === "available")
                .map((r) => ({ room: r.roomName, type: "Active" }))
            )
          }
        />
        <SummaryCard
          title="Active Rooms"
          value={data.activeRooms}
          icon={BadgeCheck}
          color="text-lime-600"
          bg="bg-lime-50"
          onClick={() =>
            openModal(
              "Active Rooms",
              [{ key: "room", label: "Room" }],
              data.roomAvailability.filter((r) => r.status === "active").map((r) => ({ room: r.roomName }))
            )
          }
        />
        <SummaryCard
          title="Maintenance"
          value={data.maintenanceRooms}
          icon={AlertTriangle}
          color="text-red-600"
          bg="bg-red-50"
          onClick={() =>
            openModal(
              "Maintenance Rooms",
              [{ key: "room", label: "Room" }],
              data.roomAvailability.filter((r) => r.status === "maintenance").map((r) => ({ room: r.roomName }))
            )
          }
        />
      </div>

      {/* ---------- Row 3: Revenue & Booking Status Charts ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur border border-gray-100/80 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Over Time</h2>
          <RevenueChart data={data.revenueData} onRangeChange={handleRangeChange} currentRange={chartRange} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur border border-gray-100/80 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-3">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm font-medium">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---------- Row 4: Room Status Pie & Revenue by Room Type ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur border border-gray-100/80 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Room Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={roomStatusPie} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>
                {roomStatusPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ROOM_STATUS_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-5 mt-2">
            {roomStatusPie.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm font-medium">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ROOM_STATUS_COLORS[index] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur border border-gray-100/80 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Room Type</h2>
          <RevenueByRoomTypeChart data={data.roomRevenue} />
        </motion.div>
      </div>

      {/* ---------- Row 5: Room Availability Grid ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur border border-gray-100/80 rounded-2xl p-5 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Room Availability (Next 14 Days)</h2>
        <RoomAvailabilityGrid data={data.roomAvailability} />
      </motion.div>

      {/* ---------- Row 6: Recent Bookings & Upcoming Arrivals ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur border border-gray-100/80 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200/60">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50/80 text-gray-600">
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
                    <td colSpan={4} className="text-center py-8 text-gray-500">No recent bookings</td>
                  </tr>
                ) : (
                  data.recentBookings.map((b) => (
                    <tr key={b._id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-800">{b.guestName}</td>
                      <td className="py-3 px-4">{b.roomName}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                        {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur border border-gray-100/80 rounded-2xl p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Arrivals</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200/60">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50/80 text-gray-600">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Guest</th>
                  <th className="text-left py-3 px-4 font-semibold">Room</th>
                  <th className="text-left py-3 px-4 font-semibold">Check-in</th>
                </tr>
              </thead>
              <tbody>
                {data.upcomingArrivals.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-500">No upcoming arrivals</td>
                  </tr>
                ) : (
                  data.upcomingArrivals.map((a, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-800">{a.guestName}</td>
                      <td className="py-3 px-4">{a.roomName}</td>
                      <td className="py-3 px-4 text-gray-600">{new Date(a.checkIn).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* ---------- Row 7: Total Reviews ---------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
      </div>

      {/* ---------- Modal ---------- */}
      <DetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        columns={modalColumns}
        data={modalData}
        renderCell={modalRenderCell}
      />
    </div>
  );
}