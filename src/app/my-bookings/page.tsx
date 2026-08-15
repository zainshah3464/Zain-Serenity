"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  Baby,
  MessageSquare,
  RefreshCw,
  Filter,
} from "lucide-react";

interface Booking {
  _id: string;
  roomId: string;
  roomName?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  children?: number;
  specialRequests?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch bookings from API
  const fetchBookings = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setBookings(list);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Initial load + auth check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchBookings();
    }
  }, [status, router, fetchBookings]);

  // Derived filtered list (immediate, no extra state)
  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  // Loading skeleton
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="space-y-4 w-80">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-full h-24 bg-white/60 backdrop-blur-lg border border-white/80 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/20 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800"
          >
            My <span className="text-teal-600">Bookings</span>
          </motion.h1>

          <div className="flex items-center gap-3">
            {/* Status filter */}
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/80 rounded-xl px-4 py-2 text-sm text-gray-700 shadow-sm">
              <Filter size={16} className="text-teal-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none text-sm font-medium cursor-pointer"
              >
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Refresh button – only spins during fetch */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchBookings}
              disabled={refreshing}
              className="p-3 bg-white/70 backdrop-blur-md border border-white/80 rounded-xl text-teal-600 shadow-sm hover:shadow-md transition-shadow disabled:opacity-70"
              title="Refresh bookings"
            >
              <RefreshCw
                size={18}
                className={`${refreshing ? "animate-spin" : ""}`}
              />
            </motion.button>
          </div>
        </div>

        {/* Bookings list */}
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/50 backdrop-blur-lg rounded-3xl border border-white/80"
          >
            <Calendar className="w-12 h-12 text-teal-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {statusFilter === "all"
                ? "No bookings yet. Start exploring our rooms!"
                : "No bookings match this filter."}
            </p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="mt-3 text-teal-600 text-sm underline"
              >
                Clear filter
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -2, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                  className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {booking.roomName || "Room"}
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-teal-500" />
                          <span>
                            {new Date(booking.checkIn).toLocaleDateString()} –{" "}
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-teal-500" />
                          <span>
                            {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                          </span>
                        </div>
                        {booking.children !== undefined && booking.children > 0 && (
                          <div className="flex items-center gap-2">
                            <Baby size={16} className="text-teal-500" />
                            <span>
                              {booking.children} child{booking.children > 1 ? "ren" : ""}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-teal-500" />
                          <span className="font-bold text-teal-700">
                            ${booking.totalPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-teal-500" />
                          <span>
                            Booked {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {booking.specialRequests && (
                          <div className="flex items-start gap-2 col-span-2 mt-1">
                            <MessageSquare
                              size={16}
                              className="text-teal-500 mt-0.5"
                            />
                            <span className="text-gray-500">
                              {booking.specialRequests}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-full text-xs font-bold capitalize tracking-wide ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}