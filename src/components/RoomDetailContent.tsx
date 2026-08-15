"use client";
import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReviewForm from "@/components/ReviewForm";
import Room3DViewer from "@/components/Room3DViewer";
import {
  Star, Check, ChevronRight, ChevronLeft,
  Users, BedDouble, Ruler, Wifi, Tv, Wind, Mountain, Coffee,
  Shield, Maximize2, CalendarDays, Sparkles, Info, X, Box,
} from "lucide-react";

// ---------- TYPES ----------
interface RoomData {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  amenities?: string[];
  capacity?: number;
  bedType?: string;
  roomType?: string;
  size?: string;
  discount?: number;
  isFeatured?: boolean;
  isNew?: boolean;
}

interface ReviewData {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { name?: string; email?: string };
}

interface BookingData {
  _id: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

// ---------- CONSISTENT DATE FORMAT ----------
function formatDate(dateString: string) {
  const d = new Date(dateString);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ---------- BOOKED CALENDAR (check‑out day included) ----------
function BookedCalendar({ bookings }: { bookings: BookingData[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const bookedDates = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      // Normalize to local midnight
      const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      // ✅ include check‑out day
      while (current <= endDate) {
        const localStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
        set.add(localStr);
        current.setDate(current.getDate() + 1);
      }
    });
    return set;
  }, [bookings]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isToday = (day: number) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-teal-600 hover:text-teal-800 p-1.5 rounded-full hover:bg-teal-50 transition">
          <ChevronLeft size={20} />
        </button>
        <h4 className="text-lg font-bold text-gray-800">
          {viewDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h4>
        <button onClick={nextMonth} className="text-teal-600 hover:text-teal-800 p-1.5 rounded-full hover:bg-teal-50 transition">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs flex-1">
        {dayNames.map((d) => (
          <div key={d} className="font-semibold text-gray-400 py-1.5">{d}</div>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isBooked = bookedDates.has(dateStr);
          const todayClass = isToday(day) ? "ring-2 ring-teal-500 ring-offset-1" : "";
          return (
            <div
              key={day}
              className={`relative py-1.5 rounded-lg text-sm font-medium transition cursor-default select-none ${
                isBooked
                  ? "bg-red-100 text-red-600"
                  : "bg-white/80 text-gray-700 hover:bg-teal-50"
              } ${todayClass}`}
              title={isBooked ? "Booked" : "Available"}
            >
              {day}
              {isBooked && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-red-100 border border-red-200 rounded" /> Booked
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-white/80 border border-gray-200 rounded" /> Available
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-white/80 rounded ring-2 ring-teal-500" /> Today
        </div>
      </div>
    </div>
  );
}

// ---------- 3D VIEWER PLACEHOLDER ----------
function ThreeDPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-50/30 to-white rounded-3xl">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-teal-600 text-xs font-medium">Loading 3D Room</p>
      </div>
    </div>
  );
}

// ---------- MAIN COMPONENT ----------
export default function RoomDetailContent({
  room,
  reviews,
  upcomingBookings,
}: {
  room: RoomData;
  reviews: ReviewData[];
  upcomingBookings: BookingData[];
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const galleryImages = room.images?.length ? room.images : [room.image];

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;
  const reviewCount = reviews.length;

  const featuredAmenitiesIcons: Record<string, any> = {
    WiFi: Wifi,
    TV: Tv,
    "Air Conditioning": Wind,
    "Mountain View": Mountain,
    "Coffee Maker": Coffee,
    "Free Parking": Shield,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50/20 to-white pb-16">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* ───── GALLERY + INFO GRID ───── */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* LEFT: Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3 space-y-4"
          >
            <div
              className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-white/60 cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={galleryImages[selectedImage]}
                alt={room.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute top-4 right-4 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow"
              >
                <Maximize2 size={18} className="text-gray-700" />
              </motion.div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {galleryImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 md:h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImage === idx
                      ? "border-teal-500 shadow-lg shadow-teal-100"
                      : "border-white/60 hover:border-teal-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${room.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-teal-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      Main
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Room Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {room.isNew && (
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={12} /> New
                </span>
              )}
              {room.isFeatured && (
                <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} /> Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight">
              {room.name}
            </h1>
            {avgRating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={
                        star <= Math.round(Number(avgRating))
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {avgRating} ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
                </span>
              </div>
            )}
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-4xl font-bold text-teal-600">${room.price}</p>
              <span className="text-lg text-gray-400 font-normal">/ night</span>
              {room.discount && room.discount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full ml-2">
                  {room.discount}% OFF
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-5 leading-relaxed">{room.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {room.capacity && (
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-teal-50/50 rounded-xl p-3">
                  <Users size={18} className="text-teal-600" />
                  <span>Up to {room.capacity} guests</span>
                </div>
              )}
              {room.bedType && (
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-teal-50/50 rounded-xl p-3">
                  <BedDouble size={18} className="text-teal-600" />
                  <span>{room.bedType}</span>
                </div>
              )}
              {room.size && (
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-teal-50/50 rounded-xl p-3">
                  <Ruler size={18} className="text-teal-600" />
                  <span>{room.size} sq. ft.</span>
                </div>
              )}
              {room.roomType && (
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-teal-50/50 rounded-xl p-3">
                  <Info size={18} className="text-teal-600" />
                  <span>{room.roomType}</span>
                </div>
              )}
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((a) => {
                    const Icon = featuredAmenitiesIcons[a] || Check;
                    return (
                      <motion.span
                        key={a}
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-1.5 bg-white/80 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700"
                      >
                        <Icon size={14} className="text-teal-600" /> {a}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-auto pt-6"
            >
              <Link
                href={`/booking?roomId=${room._id}&roomName=${encodeURIComponent(room.name)}&price=${room.price}&image=${encodeURIComponent(room.image)}&rating=${avgRating || 0}`}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Book Now <ChevronRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ───── AVAILABILITY + 3D VIEWER ───── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CalendarDays className="text-teal-600" /> Availability
            </h2>
            <BookedCalendar bookings={upcomingBookings} />
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Box className="text-teal-600" /> 3D Room View
            </h2>
            <div className="relative flex-1 min-h-[400px] rounded-3xl overflow-hidden border border-white/60 shadow-2xl bg-gradient-to-br from-teal-50/30 to-white group">
              <Suspense fallback={<ThreeDPlaceholder />}>
                <Room3DViewer />
              </Suspense>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Drag to rotate • Scroll to zoom
              </div>
            </div>
          </div>
        </motion.div>

        {/* ───── REVIEWS ───── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-400" /> Guest Reviews
            {reviewCount > 0 && (
              <span className="text-sm font-normal text-gray-500">({reviewCount})</span>
            )}
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Coffee size={32} className="mx-auto mb-3 text-gray-300" />
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {reviews.map((rev) => (
                <motion.div
                  key={rev._id}
                  whileHover={{ y: -3 }}
                  className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                      {rev.user?.name?.charAt(0) || "G"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {rev.user?.name || "Guest"}
                      </p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < rev.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">
                      {formatDate(rev.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    “{rev.comment}”
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-10">
            <ReviewForm roomId={room._id} />
          </div>
        </motion.div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Plain img to preserve actual aspect ratio */}
              <img
                src={galleryImages[selectedImage]}
                alt={room.name}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
              />
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 text-white transition"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}