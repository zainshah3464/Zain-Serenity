"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RoomCard from "./RoomCard";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });

interface RoomData {
  _id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
}

export default function FeaturedRoomsCarousel({ rooms }: { rooms: RoomData[] }) {
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Responsive items per page (1 row per slide)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1); // mobile: 1 card per slide
      } else {
        setItemsPerPage(3);
      }
      setCurrentPage(0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Chunk rooms into pages
  const chunks = useCallback(() => {
    const result: RoomData[][] = [];
    for (let i = 0; i < rooms.length; i += itemsPerPage) {
      result.push(rooms.slice(i, i + itemsPerPage));
    }
    return result;
  }, [rooms, itemsPerPage]);

  const pages = chunks();
  const totalPages = pages.length;
  const showStatic = rooms.length <= itemsPerPage;

  // Reset current page if out of range when rooms change
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [totalPages, currentPage]);

  const goToPage = (pageIndex: number) => {
    if (pageIndex < 0 || pageIndex >= totalPages) return;
    setDirection(pageIndex > currentPage ? 1 : -1);
    setCurrentPage(pageIndex);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.touches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        nextPage();
      } else {
        prevPage();
      }
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  // Grid classes: mobile 1 col, desktop 3 cols
  const gridClasses = "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5";

  // Slide variants
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* ✦ Redesigned Elegant Heading ✦ */}
      <div className="relative z-10 text-center mb-8 md:mb-12">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className={`${inter.className} inline-block text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-teal-700 bg-teal-50 px-5 py-2 rounded-full`}
        >
          ✦ Handpicked Stays ✦
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`${playfair.className} mt-5 md:mt-6 text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-[1.15] tracking-tight`}
        >
          Our Featured Rooms
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 flex items-center justify-center gap-3"
        >
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${inter.className} mt-4 text-sm md:text-base text-gray-500 max-w-xl mx-auto italic leading-relaxed`}
        >
          Discover handpicked rooms and suites designed for comfort and style.
        </motion.p>
      </div>

      {showStatic ? (
        /* Static grid (no carousel) */
        <div className={`${gridClasses} relative z-10`}>
          {rooms.map((room, idx) => (
            <RoomCard key={room._id} room={room} index={idx} />
          ))}
        </div>
      ) : (
        /* Carousel with slides */
        <div
          className="relative z-10 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Mobile controls - above cards */}
          <div className="flex md:hidden items-center justify-between gap-3 mb-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-1 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-105 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-medium text-gray-700">Prev</span>
            </button>
            <span className="text-xs font-medium text-gray-500 tabular-nums">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-1 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-105 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="text-xs font-medium text-gray-700">Next</span>
              <ChevronRight className="w-4 h-4 text-teal-600" />
            </button>
          </div>

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.25 },
              }}
              className={`${gridClasses} w-full`}
            >
              {pages[currentPage].map((room, idx) => (
                <RoomCard key={room._id} room={room} index={idx} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - desktop only */}
          {currentPage > 0 && (
            <button
              onClick={prevPage}
              aria-label="Previous rooms"
              className="hidden md:flex absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
            </button>
          )}
          {currentPage < totalPages - 1 && (
            <button
              onClick={nextPage}
              aria-label="Next rooms"
              className="hidden md:flex absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
            </button>
          )}

          {/* Modern Progress Bar + Page Indicator */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="hidden md:inline text-xs font-medium text-gray-500 tabular-nums">
              {currentPage + 1} / {totalPages}
            </span>
            <div className="relative w-40 md:w-56 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <span className="hidden md:inline text-xs text-gray-400">
              {totalPages} pages
            </span>
          </div>
        </div>
      )}
    </div>
  );
}