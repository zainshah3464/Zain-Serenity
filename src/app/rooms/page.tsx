"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RoomCard from "@/components/RoomCard";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Search, X } from "lucide-react";

interface Room {
  _id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
}

// Shimmer Skeleton Card
function ShimmerCard() {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden shadow-md">
      <div className="h-56 bg-gradient-to-r from-teal-100/50 via-white/50 to-teal-100/50 animate-shimmer bg-[length:200%_100%]" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-teal-100/60 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-full w-3/4" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-teal-100/60 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-full w-1/2" />
        <div className="h-10 bg-gradient-to-r from-teal-100/40 via-teal-200/40 to-teal-100/40 animate-shimmer bg-[length:200%_100%] rounded-xl w-full mt-4" />
      </div>
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
      // ✅ Map backend's isNewRoom to frontend's isNew
      const mapped = Array.isArray(data)
        ? data.map((room: any) => ({
            ...room,
            isNew: room.isNewRoom,
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
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50/20 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header + Date Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Our <span className="text-teal-600">Rooms</span>
            </h1>
            {checkIn && checkOut && (
              <div className="mt-3 flex items-center gap-2 text-gray-600 bg-white/60 backdrop-blur-lg border border-white/80 rounded-full px-5 py-2 w-fit shadow">
                <Calendar size={18} className="text-teal-600" />
                <span>
                  <span className="font-medium text-teal-700">{checkIn}</span> →{" "}
                  <span className="font-medium text-teal-700">{checkOut}</span>
                </span>
                <button onClick={clearDates} className="ml-2 text-gray-400 hover:text-red-500 transition">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          {!checkIn && !checkOut && (
            <a
              href="/#search"
              className="mt-4 md:mt-0 bg-teal-600 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-teal-700 transition shadow-md self-start"
            >
              <Search size={18} /> Search Availability
            </a>
          )}
        </motion.div>

        {/* Rooms Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Array.from({ length: limit }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </motion.div>
        ) : rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/40 backdrop-blur-lg rounded-3xl border border-white/60 shadow-lg"
          >
            <p className="text-gray-500 text-lg">No rooms available for the selected dates.</p>
            <button
              onClick={clearDates}
              className="mt-4 text-teal-600 hover:underline font-medium"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              <AnimatePresence mode="wait">
                {rooms.map((room) => (
                  <motion.div
                    key={room._id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <RoomCard room={room} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-6 mt-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white/70 backdrop-blur-lg border border-white/80 text-gray-700 hover:text-teal-600 px-5 py-3 rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all"
              >
                ← Previous
              </motion.button>
              <div className="bg-white/60 backdrop-blur-lg border border-white/80 px-5 py-2 rounded-full text-sm font-medium text-gray-600 shadow">
                Page {currentPage}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage + 1)}
                disabled={!hasMore}
                className="bg-white/70 backdrop-blur-lg border border-white/80 text-gray-700 hover:text-teal-600 px-5 py-3 rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all"
              >
                Next →
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}