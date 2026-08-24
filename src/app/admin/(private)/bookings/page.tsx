"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Users,
  Baby,
  MessageSquare,
  Calendar,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Booking {
  _id: string;
  roomName?: string;
  userEmail?: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  guests: number;
  children?: number;
  specialRequests?: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 12;

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch bookings
  const fetchBookings = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, roomFilter, startDate, endDate]);

  // Extract unique room names
  const roomNames = useMemo(() => {
    const names = new Set<string>();
    bookings.forEach((b) => {
      if (b.roomName) names.add(b.roomName);
    });
    return Array.from(names).sort();
  }, [bookings]);

  // Update booking status
  const updateStatus = async (id: string, newStatus: string) => {
    const booking = bookings.find((b) => b._id === id);
    if (!booking || booking.status !== "pending") {
      alert("Booking is already finalized.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Update failed");
        return;
      }
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      alert("An error occurred");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filtering logic
  const filtered = useMemo(() => {
    let result = bookings;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.roomName?.toLowerCase().includes(s) ||
          b.userEmail?.toLowerCase().includes(s)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (roomFilter !== "all") {
      result = result.filter((b) => b.roomName === roomFilter);
    }

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        result = result.filter((b) => {
          const checkIn = new Date(b.checkIn);
          const checkOut = new Date(b.checkOut);
          return checkIn < end && checkOut > start;
        });
      } else {
        result = result.filter((b) => {
          const checkIn = new Date(b.checkIn);
          const checkOut = new Date(b.checkOut);
          return checkIn <= start && checkOut > start;
        });
      }
    }

    return result;
  }, [bookings, search, statusFilter, roomFilter, startDate, endDate]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedBookings = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isFiltersActive =
    search !== "" ||
    statusFilter !== "all" ||
    roomFilter !== "all" ||
    startDate !== "" ||
    endDate !== "";

  // ---------- White Personalized Loader for Bookings ----------
  if (loading) {
    return (
      <div className="relative flex flex-col items-center justify-center py-10 sm:py-16 px-4 overflow-hidden bg-white rounded-3xl shadow-xl min-h-[420px] sm:min-h-[500px] border border-slate-200/60 select-none">
        {/* Subtle caustic light overlay for white bg */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, rgba(0,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,200,255,0.05) 0%, transparent 55%), radial-gradient(circle at 50% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* God rays – very light */}
        <motion.div
          className="absolute top-0 left-[12%] w-4 h-[70vh] bg-gradient-to-b from-cyan-100/60 via-cyan-50/30 to-transparent blur-2xl rotate-12 pointer-events-none"
          animate={{ opacity: [0.4, 0.7, 0.4], x: [-30, 30, -30] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 left-[45%] w-5 h-[80vh] bg-gradient-to-b from-teal-100/60 via-teal-50/30 to-transparent blur-2xl rotate-[-10deg] pointer-events-none"
          animate={{ opacity: [0.4, 0.8, 0.4], x: [25, -25, 25] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-0 right-[8%] w-3 h-[60vh] bg-gradient-to-b from-sky-100/60 via-sky-50/30 to-transparent blur-2xl rotate-6 pointer-events-none"
          animate={{ opacity: [0.35, 0.6, 0.35], x: [-40, 15, -40] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Bottom ocean waves – layer 1 */}
        <motion.div
          className="absolute bottom-0 left-0 w-[200%] h-24 sm:h-32 md:h-40 flex pointer-events-none"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((i) => (
            <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="rgba(0,168,204,0.08)" d="M0,160 C240,220 480,100 720,160 C960,220 1200,100 1440,160 L1440,320 L0,320 Z" />
            </svg>
          ))}
        </motion.div>

        {/* Bottom ocean waves – layer 2 */}
        <motion.div
          className="absolute bottom-0 left-0 w-[200%] h-16 sm:h-24 md:h-32 flex pointer-events-none"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((i) => (
            <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="rgba(56,189,248,0.05)" d="M0,220 C180,260 360,100 720,220 C1080,340 1260,160 1440,220 L1440,320 L0,320 Z" />
            </svg>
          ))}
        </motion.div>

        {/* Bottom ocean waves – layer 3 */}
        <motion.div
          className="absolute bottom-0 left-0 w-[200%] h-10 sm:h-16 md:h-24 flex pointer-events-none"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((i) => (
            <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="rgba(14,165,233,0.03)" d="M0,280 C300,240 600,320 900,280 C1200,240 1320,300 1440,280 L1440,320 L0,320 Z" />
            </svg>
          ))}
        </motion.div>

        {/* Floating booking icons with micro-interactions */}
        {[
          { Icon: Calendar, top: "18%", left: "10%", delay: 0.4, size: "w-6 h-6 sm:w-8 sm:h-8", rotate: [0, 10, 0] },
          { Icon: Users, top: "22%", right: "12%", delay: 1.1, size: "w-5 h-5 sm:w-7 sm:h-7", rotate: [0, -8, 0] },
          { Icon: Search, bottom: "25%", left: "8%", delay: 1.8, size: "w-6 h-6 sm:w-8 sm:h-8", rotate: [0, 6, 0] },
          { Icon: Baby, bottom: "20%", right: "10%", delay: 2.5, size: "w-5 h-5 sm:w-7 sm:h-7", rotate: [0, -10, 0] },
        ].map(({ Icon, top, right, bottom, left, delay, size, rotate }, i) => (
          <motion.div
            key={i}
            className={`absolute ${size} text-slate-300 pointer-events-none`}
            style={{ top, right, bottom, left }}
            animate={{
              y: [0, -15, 0],
              rotate: rotate,
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          >
            <Icon className="w-full h-full" />
          </motion.div>
        ))}

        {/* Central loader with calendar icon */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 mb-4 sm:mb-6">
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-slate-100/80 blur-xl pointer-events-none"
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              fill="none"
              className="relative z-10"
            >
              <defs>
                <clipPath id="bookingLoaderClip">
                  <circle cx="50" cy="50" r="42" />
                </clipPath>
                <linearGradient id="bookingWaterGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#22D3EE" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0E7490" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Animated water fill inside circle */}
              <g clipPath="url(#bookingLoaderClip)">
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="-100 0"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                  <path
                    d="M0 65 Q 12 60 25 65 T50 65 T75 65 T100 65 L100 100 L0 100 Z"
                    fill="url(#bookingWaterGradLight)"
                  />
                  <path
                    d="M100 65 Q112 60 125 65 T150 65 T175 65 T200 65 L200 100 L100 100 Z"
                    fill="url(#bookingWaterGradLight)"
                  />
                </g>
                {/* Second slower water surface */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="-50 0"
                    dur="7s"
                    repeatCount="indefinite"
                  />
                  <path
                    d="M0 70 Q 6 67 12 70 T24 70 T36 70 T48 70 T60 70 L60 100 L0 100 Z"
                    fill="rgba(255,255,255,0.2)"
                  />
                </g>
              </g>

              {/* Outer rotating dashed ring */}
              <circle
                cx="50"
                cy="50"
                r="47"
                stroke="rgba(0,168,204,0.25)"
                strokeWidth="1"
                strokeDasharray="4 6"
                fill="none"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Frame */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="rgba(0,168,204,0.5)"
                strokeWidth="1.5"
                fill="rgba(255,255,255,0.8)"
              />
              <circle
                cx="50"
                cy="50"
                r="39"
                stroke="rgba(0,168,204,0.12)"
                strokeWidth="0.5"
                fill="none"
              />

              {/* Calendar icon with pulse */}
              <motion.g
                transform="translate(50,50)"
                animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <rect x="-12" y="-9" width="24" height="18" rx="2" stroke="#00A8CC" strokeWidth="1.5" fill="none" />
                <line x1="-12" y1="-4" x2="12" y2="-4" stroke="#00A8CC" strokeWidth="1.5" />
                <line x1="-6" y1="-13" x2="-6" y2="-6" stroke="#00A8CC" strokeWidth="1.5" />
                <line x1="6" y1="-13" x2="6" y2="-6" stroke="#00A8CC" strokeWidth="1.5" />
              </motion.g>
            </svg>
          </div>

          {/* Loading text */}
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600 tracking-wide drop-shadow-sm text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading Bookings
          </motion.h2>
          <motion.p
            className="mt-2 text-xs sm:text-sm text-slate-500 tracking-[0.2em] uppercase text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Diving into your reservations
            <motion.span
              className="inline-block ml-1"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.5, 1] }}
            >
              ...
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Skeleton filters / booking rows */}
        <div className="relative z-10 w-full max-w-2xl mt-6 sm:mt-8 space-y-3 px-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-slate-200/60 backdrop-blur-md rounded-lg animate-pulse" />
            ))}
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-slate-200/60 backdrop-blur-md rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-slate-300/60 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-300/60 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------- Main Content ----------
  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-sky-600">
            Bookings
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage guest reservations</p>
        </motion.div>

        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchBookings}
            disabled={refreshing}
            className="p-2.5 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl text-cyan-700 shadow-sm hover:shadow-md transition disabled:opacity-60"
            title="Refresh bookings"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          </motion.button>
        </div>
      </div>

      {/* Filters – MOBILE version */}
      <div className="sm:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-3 shadow-lg shadow-slate-200/50 space-y-3"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search room or guest..."
              className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Status */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-3 min-h-[44px] active:bg-cyan-50 transition">
              <Filter size={16} className="text-cyan-600 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer w-full min-w-0"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Room */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-3 min-h-[44px] active:bg-cyan-50 transition">
              <Filter size={16} className="text-cyan-600 shrink-0" />
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer w-full min-w-0"
              >
                <option value="all">All Rooms</option>
                {roomNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl px-3 py-3 min-h-[44px] active:bg-cyan-50 transition">
              <Calendar size={16} className="text-cyan-600 shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer w-full min-w-0"
              />
            </div>

            {/* End Date */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl px-3 py-3 min-h-[44px] active:bg-cyan-50 transition">
              <Calendar size={16} className="text-cyan-600 shrink-0" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer w-full min-w-0"
              />
            </div>
          </div>

          {(startDate || endDate) && (
            <div className="flex justify-end">
              <button
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="text-xs font-medium text-cyan-700 hover:underline active:text-cyan-800"
              >
                Clear dates
              </button>
            </div>
          )}

          {isFiltersActive && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setRoomFilter("all");
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs font-medium text-cyan-700 hover:underline active:text-cyan-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Filters – DESKTOP version */}
      <div className="hidden sm:block">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-4 shadow-lg shadow-slate-200/50"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search room or guest..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2.5">
              <Filter size={16} className="text-cyan-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Room filter */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2.5">
              <Filter size={16} className="text-cyan-600" />
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Rooms</option>
                {roomNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date filters */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-cyan-600" />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-sm px-3 py-2.5 rounded-2xl focus:ring-2 focus:ring-cyan-200 outline-none cursor-pointer"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-sm px-3 py-2.5 rounded-2xl focus:ring-2 focus:ring-cyan-200 outline-none cursor-pointer"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(""); setEndDate(""); }}
                  className="text-xs text-cyan-700 hover:underline whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>

            {isFiltersActive && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setRoomFilter("all");
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs text-cyan-700 hover:underline whitespace-nowrap ml-auto"
              >
                Clear all filters
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bookings list with pagination */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-lg shadow-slate-200/50"
        >
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No bookings match your filters.</p>
          {isFiltersActive && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setRoomFilter("all");
                setStartDate("");
                setEndDate("");
              }}
              className="mt-3 text-cyan-700 text-sm underline"
            >
              Clear all filters
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {paginatedBookings.map((b, index) => (
                <motion.div
                  key={b._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.01, duration: 0.2 }}
                  className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-md shadow-slate-200/40 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-shadow"
                >
                  <div
                    className="flex flex-wrap items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-cyan-50/40 active:bg-cyan-50/70 transition"
                    onClick={() => toggleExpand(b._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800 truncate text-sm sm:text-base">
                          {b.roomName || "—"}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold capitalize ${
                            b.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : b.status === "cancelled"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
                        {b.userEmail || "—"}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500">
                        {new Date(b.checkIn).toLocaleDateString()} →{" "}
                        {new Date(b.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <span className="text-cyan-700 font-bold text-lg sm:text-xl">
                        ${b.totalPrice}
                      </span>
                      <motion.div
                        animate={{ rotate: expandedId === b._id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={20} className="text-slate-400" />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === b._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="border-t border-slate-200/50 bg-slate-50/50 px-4 sm:px-5 py-3 sm:py-4 space-y-3 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Users size={14} className="text-cyan-600 shrink-0" />
                            <span>
                              <strong>Guests:</strong> {b.guests}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Baby size={14} className="text-cyan-600 shrink-0" />
                            <span>
                              <strong>Children:</strong> {b.children || 0}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-slate-600 sm:col-span-2">
                            <MessageSquare size={14} className="text-cyan-600 mt-0.5 shrink-0" />
                            <span>
                              <strong>Special Requests:</strong>{" "}
                              {b.specialRequests || "None"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 sm:col-span-2">
                            <Calendar size={14} className="text-cyan-600 shrink-0" />
                            <span>
                              <strong>Booked on:</strong>{" "}
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {b.status === "pending" && (
                          <div className="flex gap-2 pt-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(b._id, "confirmed");
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-xs font-semibold transition shadow-md active:bg-emerald-700"
                            >
                              Confirm
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(b._id, "cancelled");
                              }}
                              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 rounded-xl text-xs font-semibold transition shadow-md active:bg-rose-700"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white/80 border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-cyan-50 active:bg-cyan-100 transition"
              >
                <ChevronLeft size={18} />
              </motion.button>

              {Array.from({ length: totalPages }, (_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition active:scale-95 ${
                    currentPage === i + 1
                      ? "bg-sky-600 text-white shadow-md shadow-slate-300/50"
                      : "bg-white/80 border border-slate-200 text-slate-600 hover:bg-cyan-50"
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white/80 border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-cyan-50 active:bg-cyan-100 transition"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
}