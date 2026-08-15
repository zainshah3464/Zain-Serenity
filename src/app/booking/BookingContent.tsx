"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-custom.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Users, DollarSign, AlertCircle,
  Plus, Minus, Star, Wifi, Mountain, Car, Coffee,
  MessageSquare, Loader2, ArrowLeft, Info, ChevronDown,
  Baby, Check
} from "lucide-react";
import Link from "next/link";

const amenities = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Mountain, label: "Mountain View" },
  { icon: Coffee, label: "Breakfast Included" },
  { icon: Car, label: "Free Parking" },
];

const SPECIAL_REQUEST_OPTIONS = [
  "Extra pillows",
  "Late check-out",
  "Early check-in",
  "Airport pickup",
  "Vegetarian meals",
  "High floor",
  "Crib for baby",
];

export default function BookingContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") || "";
  const roomName = searchParams.get("roomName") || "";
  const roomImage = searchParams.get("image") || "/images/room-placeholder.jpg";
  const pricePerNight = Number(searchParams.get("price")) || 0;
  const roomRating = Number(searchParams.get("rating")) || 0;

  const { data: session } = useSession();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

  const subtotal = nights * pricePerNight;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const handleGuestChange = (delta: number) => {
    setGuests((prev) => Math.min(5, Math.max(1, prev + delta)));
  };

  const handleChildrenChange = (delta: number) => {
    setChildren((prev) => Math.min(5, Math.max(0, prev + delta)));
  };

  const toggleRequestOption = (option: string) => {
    setSelectedRequests((prev) =>
      prev.includes(option) ? prev.filter((r) => r !== option) : [...prev, option]
    );
  };

  const combinedSpecialRequests = [
    ...selectedRequests,
    customRequest.trim(),
  ]
    .filter(Boolean)
    .join(". ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select both dates.");
      return;
    }
    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }
    if (nights < 1) {
      setError("Stay must be at least 1 night.");
      return;
    }
    if (!session) {
      router.push(`/login?callbackUrl=/booking?${searchParams.toString()}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests,
          children,
          totalPrice: total,
          specialRequests: combinedSpecialRequests,
        }),
      });
      if (res.ok) {
        router.push("/my-bookings?success=booking");
      } else {
        const data = await res.json();
        setError(data.error || "Booking failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/20 pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href={`/rooms/${roomId}`}
          className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 mb-4 transition"
        >
          <ArrowLeft size={16} /> Back to room
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden">
              <img src={roomImage} alt={roomName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{roomName}</h1>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < roomRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">({roomRating}/5)</span>
              </div>
              <p className="text-teal-600 font-bold text-2xl mt-2">
                ${pricePerNight}
                <span className="text-sm text-gray-500 font-normal"> / night</span>
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                {amenities.map((item, i) => (
                  <div key={i} className="flex items-center gap-1 text-gray-600 text-sm">
                    <item.icon size={14} className="text-teal-600" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-xl space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-1">Reservation Details</h2>
          <p className="text-gray-500 text-sm -mt-2 mb-4">Fill in the details to confirm your stay.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <CalendarDays size={18} className="text-teal-600" /> Check-in
              </label>
              <DatePicker
                selected={checkIn}
                onChange={(date: Date | null) => setCheckIn(date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={today}
                placeholderText="Select check-in"
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 placeholder-gray-400 transition-all"
                dateFormat="dd MMM yyyy"
                calendarClassName="light-calendar"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <CalendarDays size={18} className="text-teal-600" /> Check-out
              </label>
              <DatePicker
                selected={checkOut}
                onChange={(date: Date | null) => setCheckOut(date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn || today}
                placeholderText="Select check-out"
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 placeholder-gray-400 transition-all"
                dateFormat="dd MMM yyyy"
                calendarClassName="light-calendar"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <Users size={18} className="text-teal-600" /> Guests
              </label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => handleGuestChange(-1)} disabled={guests <= 1} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-teal-50 disabled:opacity-40">
                  <Minus size={18} />
                </button>
                <span className="text-xl font-semibold text-gray-800 w-8 text-center">{guests}</span>
                <button type="button" onClick={() => handleGuestChange(1)} disabled={guests >= 5} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-teal-50 disabled:opacity-40">
                  <Plus size={18} />
                </button>
                <span className="text-sm text-gray-500">Max 5</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <Baby size={18} className="text-teal-600" /> Children
              </label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => handleChildrenChange(-1)} disabled={children <= 0} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-teal-50 disabled:opacity-40">
                  <Minus size={18} />
                </button>
                <span className="text-xl font-semibold text-gray-800 w-8 text-center">{children}</span>
                <button type="button" onClick={() => handleChildrenChange(1)} disabled={children >= 5} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-teal-50 disabled:opacity-40">
                  <Plus size={18} />
                </button>
                <span className="text-sm text-gray-500">Max 5</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
              <MessageSquare size={18} className="text-teal-600" /> Special Requests
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {SPECIAL_REQUEST_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleRequestOption(option)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                    selectedRequests.includes(option)
                      ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"
                  }`}
                >
                  {selectedRequests.includes(option) && <Check size={12} />}
                  {option}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="Any other special requests? (optional)"
              className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 resize-none transition-all"
            />
          </div>

          {nights > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-teal-50/60 backdrop-blur-sm border border-teal-100 rounded-2xl p-5 space-y-3"
            >
              <div className="flex justify-between text-gray-600">
                <span>${pricePerNight} × {nights} night{nights !== 1 ? "s" : ""}</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes & fees (10%)</span>
                <span>${tax}</span>
              </div>
              <hr className="border-teal-200" />
              <div className="flex justify-between font-bold text-lg text-teal-800">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </motion.div>
          )}

          <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-4">
            <button
              type="button"
              onClick={() => setShowPolicy(!showPolicy)}
              className="flex items-center gap-2 text-amber-700 font-medium text-sm w-full"
            >
              <Info size={16} />
              Cancellation Policy
              <motion.span animate={{ rotate: showPolicy ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} />
              </motion.span>
            </button>
            <AnimatePresence>
              {showPolicy && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-amber-600 mt-2 leading-relaxed"
                >
                  Free cancellation up to 48 hours before check‑in. After that, the first night is non‑refundable.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading || nights <= 0}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}