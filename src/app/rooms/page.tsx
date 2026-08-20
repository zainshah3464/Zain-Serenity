"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RoomCard from "@/components/RoomCard";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Search, X, ArrowLeft, ArrowRight } from "lucide-react";

interface Room {
  _id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
  status?: string;
}

// Improved Shimmer Skeleton Card
function ShimmerCard() {
  return (
    <div className="bg-white/50 backdrop-blur-xl border border-white/70 rounded-3xl overflow-hidden shadow-lg relative">
      <div className="h-52 bg-gradient-to-r from-teal-100/60 via-white/80 to-teal-100/60 animate-shimmer bg-[length:200%_100%]" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gradient-to-r from-gray-200/80 via-teal-100/80 to-gray-200/80 animate-shimmer bg-[length:200%_100%] rounded-full w-3/4" />
        <div className="h-4 bg-gradient-to-r from-gray-200/80 via-teal-100/80 to-gray-200/80 animate-shimmer bg-[length:200%_100%] rounded-full w-1/2" />
        <div className="h-10 bg-gradient-to-r from-teal-100/60 via-teal-200/60 to-teal-100/60 animate-shimmer bg-[length:200%_100%] rounded-xl w-full mt-4" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shine" />
    </div>
  );
}

export default function RoomsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;

  const updateURL = (newPage: number) => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("page", newPage.toString());
    router.replace(`/rooms?${params.toString()}`, { scroll: false });
  };

  const fetchRooms = useCallback(async (page: number) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    try {
      const res = await fetch(`/api/rooms?${params.toString()}`);
      const data = await res.json();
      const mapped = Array.isArray(data)
        ? data.map((room: any) => ({
            ...room,
            isNew: room.isNewRoom,
            status: room.status || "active",
          }))
        : [];
      setRooms(mapped);
      setHasMore(mapped.length === limit);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    fetchRooms(currentPage);
  }, [currentPage, fetchRooms]);

  const clearDates = () => {
    router.replace("/rooms");
  };

  const goToPage = (page: number) => {
    updateURL(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-white relative overflow-hidden">
      {/* Animated background blobs removed as requested */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
        {/* Header + Date Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12"
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight"
            >
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Rooms
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 mt-2 text-sm md:text-base"
            >
              Discover comfort & luxury tailored for you
            </motion.p>
            {checkIn && checkOut && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="mt-4 flex items-center gap-2 text-gray-700 bg-white/80 backdrop-blur-lg border border-white/90 rounded-full px-5 py-2 w-fit shadow-lg shadow-teal-100/50"
              >
                <Calendar size={18} className="text-teal-600" />
                <span className="text-sm">
                  <span className="font-semibold text-teal-700">{checkIn}</span>{" "}
                  →{" "}
                  <span className="font-semibold text-teal-700">{checkOut}</span>
                </span>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearDates}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Clear dates"
                >
                  <X size={16} />
                </motion.button>
              </motion.div>
            )}
          </div>
          {!checkIn && !checkOut && (
            <motion.a
              href="/#search"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(20, 184, 166, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 md:mt-0 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg shadow-teal-200/60 hover:shadow-xl transition-all self-start"
            >
              <Search size={18} /> Search Availability
            </motion.a>
          )}
        </motion.div>

        {/* Rooms Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {Array.from({ length: limit }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </motion.div>
        ) : rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 md:py-24 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block text-6xl mb-4"
            >
              🛏️
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-700">No Rooms Found</h3>
            <p className="text-gray-500 mt-2">Try different dates or clear filters.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearDates}
              className="mt-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.12 },
                },
              }}
            >
              <AnimatePresence mode="popLayout">
                {rooms.map((room) => (
                  <motion.div
                    key={room._id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 40, scale: 0.95 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <RoomCard room={room} index={0} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-4 md:gap-6 mt-12 md:mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-lg border border-white/90 text-gray-700 hover:text-teal-600 px-4 md:px-5 py-2.5 md:py-3 rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
              >
                <ArrowLeft size={16} />{" "}
                <span className="hidden sm:inline">Previous</span>
              </motion.button>
              <motion.div
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-teal-200/60"
                whileHover={{ scale: 1.05 }}
              >
                Page {currentPage}
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage + 1)}
                disabled={!hasMore}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-lg border border-white/90 text-gray-700 hover:text-teal-600 px-4 md:px-5 py-2.5 md:py-3 rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
              >
                <span className="hidden sm:inline">Next</span>{" "}
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}