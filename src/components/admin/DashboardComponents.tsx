"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Star,
  Clock,
  BadgeCheck,
  AlertTriangle,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export interface DashboardData {
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
  totalRevenueBreakdownAll: Record<string, number>;
  totalReviewsCount: number;
  allReviewsList: any[];
}

// ---------- Rating Stars ----------
export const RatingStars = ({ rating }: { rating: number }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? "#f59e0b" : "none"}
        className={i < rating ? "text-amber-500" : "text-slate-300"}
        strokeWidth={1.5}
      />
    ))}
  </span>
);

// ---------- Enhanced SummaryCard (Ocean Glass) ----------
export const SummaryCard = ({ title, value, icon: Icon, color, bg, sub, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    whileHover={onClick ? { scale: 1.03, boxShadow: "0 12px 24px rgba(0,168,204,0.15)" } : {}}
    onClick={onClick}
    className={`relative group flex items-center bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-4 sm:p-5 shadow-lg shadow-cyan-100/40 transition-all duration-200 ${
      onClick ? "cursor-pointer" : "cursor-default"
    }`}
  >
    <div className="min-w-0 flex-1">
      <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
      <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1 font-medium">{sub}</p>}
    </div>
    <div className={`p-2.5 sm:p-3 rounded-2xl ${bg} ml-3 flex-shrink-0 shadow-inner`}>
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
    </div>
    {onClick && (
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs bg-gradient-to-r from-[#05668D] to-[#00A8CC] text-white px-2 py-0.5 rounded-full shadow-sm">
          View
        </span>
      </div>
    )}
  </motion.div>
);

// ---------- Status Badge ----------
export const StatusBadge = ({ status }: { status: string }) => {
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
      bg: "bg-cyan-100 border-cyan-200",
      text: "text-cyan-800",
      icon: <TrendingUp size={14} className="mr-1" />,
    },
  };
  const { bg, text, icon } = config[status] || {
    bg: "bg-slate-100 border-slate-200",
    text: "text-slate-800",
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
export const RoomAvailabilityGrid = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0)
    return <p className="text-sm text-slate-500 py-4 text-center">No rooms data.</p>;

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-cyan-100/60">
      <table className="min-w-full text-xs">
        <thead>
          <tr className="bg-gradient-to-r from-cyan-50 to-sky-50 text-slate-600">
            <th className="text-left py-3 px-4 font-semibold sticky left-0 bg-cyan-50/80 backdrop-blur">Room</th>
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
            <tr key={room.roomId} className="border-t border-cyan-100/40 hover:bg-cyan-50/40 transition-colors">
              <td className="py-2.5 px-4 font-semibold text-slate-700 truncate max-w-[120px] sticky left-0 bg-white/80 backdrop-blur">
                <span title={room.roomName}>{room.roomName}</span>
              </td>
              {Array.from({ length: 14 }).map((_, idx) => {
                const status = room.dayStatus?.[idx] || "inactive";
                return (
                  <td key={idx} className="text-center p-1">
                    <div
                      className={`w-5 h-5 mx-auto rounded-md transition-transform hover:scale-110 shadow-sm ${
                        status === "available"
                          ? "bg-cyan-400/80 ring-1 ring-cyan-300"
                          : status === "booked"
                          ? "bg-rose-400/80 ring-1 ring-rose-300"
                          : "bg-slate-300/80 ring-1 ring-slate-200"
                      }`}
                      title={`${room.roomName}: ${status}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 p-3 text-xs font-medium text-slate-600 bg-gradient-to-r from-cyan-50 to-sky-50 border-t border-cyan-100/60">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 bg-cyan-400/80 rounded ring-1 ring-cyan-300" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 bg-rose-400/80 rounded ring-1 ring-rose-300" /> Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 bg-slate-300/80 rounded ring-1 ring-slate-200" /> Unavailable
        </span>
      </div>
    </div>
  );
};

// ---------- Revenue by Room Type Table ----------
export const RevenueByRoomTypeChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0)
    return <p className="text-sm text-slate-500 py-4 text-center">No revenue data available.</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-cyan-100/60">
      <table className="min-w-full text-sm">
        <thead className="bg-gradient-to-r from-cyan-50 to-sky-50 text-slate-700">
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
            const pct =
              item.lastMonthRevenue > 0
                ? `${((change / item.lastMonthRevenue) * 100).toFixed(0)}%`
                : change > 0
                ? "New"
                : "0%";
            return (
              <tr key={i} className="border-t border-cyan-100/40 hover:bg-cyan-50/40 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-700">
                  {item.roomName}
                  {item.roomType && <span className="text-xs text-slate-400 ml-1">({item.roomType})</span>}
                </td>
                <td className="text-right py-3 px-4">${item.thisMonthRevenue.toLocaleString()}</td>
                <td className="text-right py-3 px-4">${item.lastMonthRevenue.toLocaleString()}</td>
                <td className={`text-right py-3 px-4 font-medium ${
                  change >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}>
                  <span className="inline-flex items-center justify-end gap-1">
                    {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {pct}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ---------- Custom Tooltip for Revenue Chart ----------
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label + "T00:00:00");
    const formatted = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return (
      <div className="bg-white/95 backdrop-blur p-3 rounded-2xl shadow-xl border border-cyan-100 text-sm">
        <p className="font-medium text-slate-700 mb-1">{formatted}</p>
        <p className="text-cyan-700 font-bold">
          ${(payload[0]?.value ?? 0).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// ---------- Revenue Chart (Ocean Styled with Area Gradient) ----------
export const RevenueChart = ({ data, onRangeChange, currentRange }: any) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (currentRange !== "custom") {
      setStartDate("");
      setEndDate("");
    }
  }, [currentRange]);

  const applyCustomRange = () => {
    if (startDate && endDate) {
      onRangeChange("custom", startDate, endDate);
    }
  };

  const ranges = [
    { label: "7 Days", value: "7d" },
    { label: "Month", value: "thisMonth" },
    { label: "Year", value: "thisYear" },
    { label: "Last Yr", value: "lastYear" },
    { label: "All", value: "all" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mb-5 sm:items-center">
        <div className="flex bg-white/80 backdrop-blur rounded-xl p-1 gap-1 border border-cyan-100/60 shadow-sm">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => onRangeChange(r.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentRange === r.value
                  ? "bg-gradient-to-r from-[#05668D] to-[#00A8CC] text-white shadow-md shadow-cyan-200/50"
                  : "text-slate-600 hover:text-cyan-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`px-3 py-1.5 text-xs border rounded-xl bg-white/80 backdrop-blur focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${
              currentRange === "custom" ? "border-cyan-300" : "border-cyan-100"
            }`}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`px-3 py-1.5 text-xs border rounded-xl bg-white/80 backdrop-blur focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${
              currentRange === "custom" ? "border-cyan-300" : "border-cyan-100"
            }`}
          />
          <button
            onClick={applyCustomRange}
            disabled={!startDate || !endDate}
            className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-[#05668D] to-[#00A8CC] text-white rounded-xl hover:shadow-lg hover:shadow-cyan-200/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>

      {!data || data.length === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-slate-400 font-medium">
          No revenue data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="oceanRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00A8CC" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#00A8CC" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
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
            <Area
              type="monotone"
              dataKey="total"
              stroke="none"
              fill="url(#oceanRevenueFill)"
              fillOpacity={1}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#00A8CC"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};