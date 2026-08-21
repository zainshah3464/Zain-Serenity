"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion"; // ← useInView added
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Inter, Playfair_Display } from "next/font/google";
import { trackViewReviews } from "@/lib/ga4"; // ← GA4 tracking import

const inter = Inter({ subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });

/* ────────────────────────────────────
   Reviews data with better avatars
   ──────────────────────────────────── */
const reviews = [
  {
    name: "Ayesha K.",
    comment:
      "Zain's Serenity is a slice of heaven. The overwater spa and private beach made our honeymoon unforgettable.",
    rating: 5,
    location: "Dubai, UAE",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Usman R.",
    comment:
      "Every detail whispers luxury – volcanic stone villas, cliff‑edge yoga at sunrise. True eco‑elegance.",
    rating: 5,
    location: "London, UK",
    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
  },
  {
    name: "Sara M.",
    comment:
      "Six restaurants, each a culinary journey. The Peruvian‑Argentinian Sol Kitchen is a must‑try!",
    rating: 5,
    location: "Lahore, PK",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  {
    name: "Bilal H.",
    comment:
      "My personal host curated every moment – sunset sailing, private dining on the beach. Flawless.",
    rating: 5,
    location: "New York, USA",
    avatar: "https://randomuser.me/api/portraits/men/88.jpg",
  },
  {
    name: "Fatima T.",
    comment:
      "Organic farm‑to‑table at its best. Fresh, vibrant, delicious. Already planning our return.",
    rating: 5,
    location: "Istanbul, TR",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Ali Z.",
    comment:
      "Zero‑waste luxury without compromise. The infinity pool overlooking the Indian Ocean is magic.",
    rating: 5,
    location: "Sydney, AU",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
];

/* ────────────────────────────────────
   Decorative background (neutral, no colored glow)
   ──────────────────────────────────── */
function FloatingBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Rotating neutral rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-dashed border-gray-200/60 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-gray-200/40 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ────────────────────────────────────
   Review Card – interactive & elegant
   ──────────────────────────────────── */
function ReviewCard({ review, index }: { review: (typeof reviews)[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="relative bg-white/90 backdrop-blur-xl border border-gray-200/70 rounded-3xl p-6 sm:p-7 md:p-8 flex flex-col justify-between overflow-hidden shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-teal-900/10 min-h-[260px] sm:min-h-[280px] group transition-shadow duration-300"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {/* Gradient border on hover (teal/emerald) */}
      <div
        className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(16,185,129,0.2))",
          border: "1px solid rgba(20,184,166,0.3)",
        }}
      />

      {/* Quote icon with micro animation */}
      <motion.div
        animate={{ rotate: isHovered ? 15 : 0, scale: isHovered ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="absolute top-4 right-4 z-10"
      >
        <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-gray-200 group-hover:text-teal-200 transition-colors" />
      </motion.div>

      {/* Shine sweep effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />
      )}

      {/* Star rating with animated stars */}
      <div className="flex mb-4 gap-1.5 relative z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.4, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="cursor-default"
          >
            <Star
              size={16}
              className={
                i < review.rating
                  ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                  : "text-gray-300"
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Review text */}
      <p className="text-gray-700 italic leading-relaxed mb-5 text-sm sm:text-base md:text-[0.95rem] font-light flex-1 relative z-10">
        “{review.comment}”
      </p>

      {/* User info */}
      <div className="flex items-center gap-3 relative z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          className="relative"
        >
          <img
            src={review.avatar}
            alt={review.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-md border-2 border-white ring-2 ring-teal-100"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </motion.div>
        <div>
          <h4 className={`${inter.className} font-semibold text-gray-800 text-sm sm:text-base`}>
            {review.name}
          </h4>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-gray-300 rounded-full" />
            {review.location}
          </p>
        </div>
      </div>

      {/* Decorative corner accent */}
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-transparent via-teal-100/30 to-transparent rounded-br-3xl pointer-events-none" />
    </motion.div>
  );
}

/* ────────────────────────────────────
   Main Carousel – auto‑play, 3 on PC, 1 on mobile
   ──────────────────────────────────── */
export default function ReviewCarousel() {
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // GA4: view_reviews tracking with IntersectionObserver
  const sectionRef = useRef<HTMLDivElement>(null); // attach to <section>
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      trackViewReviews({ page_path: window.location.pathname });
    }
  }, [isInView]);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(3);
      }
      setCurrentPage(0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) =>
    reviews.slice(i * itemsPerPage, i * itemsPerPage + itemsPerPage)
  );

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
    resetAutoPlay();
  };

  const resetAutoPlay = () => {
    if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
    autoPlayTimer.current = setTimeout(() => {
      setDirection(1);
      setCurrentPage((prev) => (prev + 1) % totalPages);
      resetAutoPlay();
    }, 5000);
  };

  useEffect(() => {
    if (!isPaused) {
      resetAutoPlay();
    }
    return () => {
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
    };
  }, [totalPages, isPaused]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 400 : -400, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -400 : 400, opacity: 0, scale: 0.95 }),
  };

  return (
    <section
      ref={sectionRef} // ← added for view_reviews tracking
      className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <FloatingBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 text-teal-600 text-xs sm:text-sm uppercase tracking-[0.25em] mb-4 font-semibold bg-teal-50/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-teal-100"
          >
            <Sparkles size={14} className="text-teal-500" />
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight`}
          >
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
              Guests Say
            </span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="w-20 h-1.5 bg-gradient-to-r from-teal-400 via-emerald-500 to-emerald-600 mx-auto mb-4 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed"
          >
            Real stories from travellers who experienced Zain's Serenity.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 250, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              className="flex gap-4 md:gap-6 justify-center items-stretch"
            >
              {pages[currentPage].map((review, idx) => (
                <div
                  key={idx}
                  className="w-full max-w-[300px] sm:max-w-[320px] md:max-w-[340px] flex"
                >
                  <ReviewCard review={review} index={idx} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Edge fade overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-12 bg-gradient-to-r from-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-12 bg-gradient-to-l from-white/80 to-transparent z-10" />
        </div>

        {/* Navigation controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-4 mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goToPage(currentPage - 1)}
            className="p-2.5 rounded-full bg-white border border-gray-200 shadow-md hover:border-teal-300 transition"
            aria-label="Previous reviews"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </motion.button>

          <div className="flex gap-2.5 items-center">
            {Array.from({ length: totalPages }).map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.25 }}
                onClick={() => goToPage(i)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  i === currentPage
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 w-8 shadow-md shadow-teal-200"
                    : "bg-gray-300 hover:bg-gray-400 w-2.5"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goToPage(currentPage + 1)}
            className="p-2.5 rounded-full bg-white border border-gray-200 shadow-md hover:border-teal-300 transition"
            aria-label="Next reviews"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </motion.button>
        </motion.div>

        {/* Auto-play indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <span className="inline-flex items-center gap-2 text-xs text-gray-400 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            {isPaused ? "Paused on hover" : "Auto‑playing reviews"}
          </span>
        </motion.div>
      </div>
    </section>
  );
}