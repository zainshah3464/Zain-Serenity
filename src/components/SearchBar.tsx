"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search, Calendar, X } from "lucide-react";
import { motion } from "framer-motion";
import { trackSelectDate, trackSearchAvailability } from "@/lib/ga4"; // ← GA4 tracking imports

export default function SearchBar() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // GA4: search_availability event
    trackSearchAvailability({
      check_in_date: checkIn?.toISOString().split('T')[0],
      check_out_date: checkOut?.toISOString().split('T')[0],
    });
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn.toISOString().split("T")[0]);
    if (checkOut) params.append("checkOut", checkOut.toISOString().split("T")[0]);
    router.push(`/rooms?${params.toString()}`);
  };

  const clearDates = () => {
    setCheckIn(null);
    setCheckOut(null);
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      // Always row layout — mobile one line
      className="relative flex flex-row items-stretch gap-2 sm:gap-3 
                 bg-transparent border border-white/40 rounded-2xl p-2.5 sm:p-4"
    >
      {/* Check-in */}
      <div className="flex-1 relative min-w-0">
        <label className="absolute -top-2.5 left-3 sm:left-4 text-white/90 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider z-10">
          Check‑in
        </label>
        <Calendar className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
        <DatePicker
          selected={checkIn}
          onChange={(date: Date | null) => {
            setCheckIn(date);
            // GA4: select_date event for check-in
            if (date) {
              trackSelectDate({
                check_in_date: date.toISOString().split('T')[0],
              });
            }
            if (date && checkOut && date > checkOut) {
              setCheckOut(null);
            }
          }}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          placeholderText="Add date"
          className="w-full bg-transparent text-white placeholder-white/40
                     pl-8 sm:pl-10 pr-7 sm:pr-8 py-2.5 sm:py-3.5 text-sm sm:text-base
                     border-b border-white/30 focus:outline-none focus:border-b-teal-400
                     cursor-pointer transition-all duration-300"
          dateFormat="dd MMM yyyy"
          minDate={new Date()}
          maxDate={checkOut ? checkOut : undefined}
          popperPlacement="bottom-start"
        />
        {checkIn && (
          <button
            type="button"
            onClick={() => setCheckIn(null)}
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 p-1 transition-colors"
          >
            <X size={14} className="sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      {/* Check-out */}
      <div className="flex-1 relative min-w-0">
        <label className="absolute -top-2.5 left-3 sm:left-4 text-white/90 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider z-10">
          Check‑out
        </label>
        <Calendar className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
        <DatePicker
          selected={checkOut}
          onChange={(date: Date | null) => {
            setCheckOut(date);
            // GA4: select_date event for check-out
            if (date) {
              trackSelectDate({
                check_out_date: date.toISOString().split('T')[0],
              });
            }
            if (date && checkIn && date < checkIn) {
              setCheckIn(null);
            }
          }}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || new Date()}
          placeholderText="Add date"
          className="w-full bg-transparent text-white placeholder-white/40
                     pl-8 sm:pl-10 pr-7 sm:pr-8 py-2.5 sm:py-3.5 text-sm sm:text-base
                     border-b border-white/30 focus:outline-none focus:border-b-teal-400
                     cursor-pointer transition-all duration-300"
          dateFormat="dd MMM yyyy"
          popperPlacement="bottom-start"
        />
        {checkOut && (
          <button
            type="button"
            onClick={() => setCheckOut(null)}
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 p-1 transition-colors"
          >
            <X size={14} className="sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      {/* Search Button — icon only on mobile, text + icon on sm+ */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        aria-label="Search"
        className="shrink-0 bg-gradient-to-r from-teal-500 to-emerald-500 
                   text-white rounded-xl font-semibold 
                   flex items-center justify-center gap-2 
                   transition-all hover:from-teal-600 hover:to-emerald-600
                   px-3 py-2.5 sm:px-6 sm:py-3.5"
      >
        <Search size={18} className="sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Search</span>
      </motion.button>

      {/* Clear Dates – small, absolute top-right */}
      {checkIn && checkOut && (
        <button
          type="button"
          onClick={clearDates}
          className="absolute -top-5 right-0 text-[10px] sm:text-xs text-teal-400/80 hover:text-teal-300 underline underline-offset-2"
        >
          Clear dates
        </button>
      )}
    </motion.form>
  );
}