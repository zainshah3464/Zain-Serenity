"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-teal-600" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Header - FIXED: now always flex row, heading left, refresh right */}
      <div className="flex items-center justify-between gap-3">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight"
        >
          Bookings
        </motion.h1>

        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchBookings}
            disabled={refreshing}
            className="p-2.5 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-teal-600 shadow-sm hover:shadow-md transition disabled:opacity-60"
            title="Refresh bookings"
          >
            <RefreshCw
              size={18}
              className={`${refreshing ? "animate-spin" : ""}`}
            />
          </motion.button>
        </div>
      </div>

      {/* Filters – MOBILE version (shown only on small screens) */}
      <div className="sm:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur border border-gray-200/80 rounded-2xl p-3 shadow-sm space-y-3"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search room or guest..."
              className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Status */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-3 min-h-[44px] active:bg-gray-50 transition">
              <Filter size={16} className="text-teal-600 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Room */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-3 min-h-[44px] active:bg-gray-50 transition">
              <Filter size={16} className="text-teal-600 shrink-0" />
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0"
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
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-3 py-3 min-h-[44px] active:bg-gray-50 transition">
              <Calendar size={16} className="text-teal-600 shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0"
              />
            </div>

            {/* End Date */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-3 py-3 min-h-[44px] active:bg-gray-50 transition">
              <Calendar size={16} className="text-teal-600 shrink-0" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0"
              />
            </div>
          </div>

          {/* Clear dates (if any date is selected) */}
          {(startDate || endDate) && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs font-medium text-teal-600 hover:underline active:text-teal-800"
              >
                Clear dates
              </button>
            </div>
          )}

          {/* Clear all filters */}
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
                className="text-xs font-medium text-teal-600 hover:underline active:text-teal-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Filters – DESKTOP version (original layout, shown on sm and up) */}
      <div className="hidden sm:block">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur border border-gray-200/80 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search room or guest..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
              <Filter size={16} className="text-teal-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Room filter */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
              <Filter size={16} className="text-teal-600" />
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
              >
                <option value="all">All Rooms</option>
                {roomNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date filters (original style) */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-teal-600" />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white border border-gray-200 text-gray-700 text-sm px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none cursor-pointer"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white border border-gray-200 text-gray-700 text-sm px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none cursor-pointer"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="text-xs text-teal-600 hover:underline whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Clear all filters button */}
            {isFiltersActive && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setRoomFilter("all");
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs text-teal-600 hover:underline whitespace-nowrap ml-auto"
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
          className="text-center py-16 bg-white/50 backdrop-blur-lg rounded-2xl border border-white/80"
        >
          <Calendar className="w-10 h-10 text-teal-300 mx-auto mb-3" />
          <p className="text-gray-500">No bookings match your filters.</p>
          {isFiltersActive && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setRoomFilter("all");
                setStartDate("");
                setEndDate("");
              }}
              className="mt-3 text-teal-600 text-sm underline"
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
                  className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div
                    className="flex flex-wrap items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-gray-50/50 active:bg-gray-100/70 transition"
                    onClick={() => toggleExpand(b._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                          {b.roomName || "—"}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold capitalize ${
                            b.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : b.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                        {b.userEmail || "—"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(b.checkIn).toLocaleDateString()} →{" "}
                        {new Date(b.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <span className="text-teal-600 font-bold text-lg sm:text-xl">
                        ${b.totalPrice}
                      </span>
                      <motion.div
                        animate={{ rotate: expandedId === b._id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={20} className="text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === b._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="border-t border-gray-100 bg-gray-50/40 px-4 sm:px-5 py-3 sm:py-4 space-y-3 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users size={14} className="text-teal-500 shrink-0" />
                            <span>
                              <strong>Guests:</strong> {b.guests}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Baby size={14} className="text-teal-500 shrink-0" />
                            <span>
                              <strong>Children:</strong> {b.children || 0}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600 sm:col-span-2">
                            <MessageSquare size={14} className="text-teal-500 mt-0.5 shrink-0" />
                            <span>
                              <strong>Special Requests:</strong>{" "}
                              {b.specialRequests || "None"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                            <Calendar size={14} className="text-teal-500 shrink-0" />
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
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition shadow-sm active:bg-emerald-700"
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
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition shadow-sm active:bg-red-700"
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
                className="p-2 rounded-lg bg-white/80 border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 active:bg-gray-200 transition"
              >
                <ChevronLeft size={18} />
              </motion.button>

              {Array.from({ length: totalPages }, (_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition active:scale-95 ${
                    currentPage === i + 1
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-white/80 border border-gray-200 text-gray-600 hover:bg-gray-50"
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
                className="p-2 rounded-lg bg-white/80 border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 active:bg-gray-200 transition"
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