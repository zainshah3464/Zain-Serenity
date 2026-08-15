"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Star, Quote } from "lucide-react";

/* ────────────────────────────────────
   Reviews data (unchanged)
   ──────────────────────────────────── */
const reviews = [
  {
    name: "Ayesha K.",
    comment:
      "Zain's Serenity is a slice of heaven. The overwater spa and private beach made our honeymoon unforgettable.",
    rating: 5,
    location: "Dubai, UAE",
  },
  {
    name: "Usman R.",
    comment:
      "Every detail whispers luxury – volcanic stone villas, cliff‑edge yoga at sunrise. True eco‑elegance.",
    rating: 5,
    location: "London, UK",
  },
  {
    name: "Sara M.",
    comment:
      "Six restaurants, each a culinary journey. The Peruvian‑Argentinian Sol Kitchen is a must‑try!",
    rating: 5,
    location: "Lahore, PK",
  },
  {
    name: "Bilal H.",
    comment:
      "My personal host curated every moment – sunset sailing, private dining on the beach. Flawless.",
    rating: 5,
    location: "New York, USA",
  },
  {
    name: "Fatima T.",
    comment:
      "Organic farm‑to‑table at its best. Fresh, vibrant, delicious. Already planning our return.",
    rating: 5,
    location: "Istanbul, TR",
  },
  {
    name: "Ali Z.",
    comment:
      "Zero‑waste luxury without compromise. The infinity pool overlooking the Indian Ocean is magic.",
    rating: 5,
    location: "Sydney, AU",
  },
];

/* ────────────────────────────────────
   Enhanced background (GPU‑friendly)
   ──────────────────────────────────── */
function FloatingBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Soft radial base */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(20,184,166,0.08)_0%,_transparent_60%)]" />

      {/* Drifting blobs */}
      <motion.div
        className="absolute top-[10%] left-[5%] w-56 h-56 md:w-80 md:h-80 rounded-full bg-teal-400/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -15, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[5%] w-64 h-64 md:w-96 md:h-96 rounded-full bg-emerald-300/10 blur-3xl"
        animate={{ x: [0, -35, 0], y: [0, 15, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rotating rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-teal-400/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-emerald-400/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />

      {/* Tiny floating dots */}
      <motion.div
        className="absolute top-[20%] right-[15%] w-2 h-2 bg-teal-400/40 rounded-full"
        animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[10%] w-2 h-2 bg-emerald-400/40 rounded-full"
        animate={{ y: [8, -8, 8], opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ────────────────────────────────────
   Review Card – elegant & modern
   ──────────────────────────────────── */
function ReviewCard({
  review,
  index,
}: {
  review: (typeof reviews)[0];
  index: number;
}) {
  return (
    <motion.div
      className="relative w-[80vw] sm:w-[360px] md:w-[400px] shrink-0 bg-white/70 backdrop-blur-lg border border-teal-200/40 rounded-3xl p-7 md:p-8 flex flex-col justify-between overflow-hidden group shadow-xl shadow-teal-900/5"
      // Gentle floating animation
      animate={{ y: [0, -5, 0] }}
      transition={{
        duration: 6 + index * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.15,
      }}
      // Hover: lift, deeper shadow, border glow
      whileHover={{
        y: -10,
        scale: 1.02,
        boxShadow: "0 35px 60px -15px rgba(20, 184, 166, 0.3)",
        borderColor: "rgba(20, 184, 166, 0.7)",
        transition: { type: "spring", stiffness: 300, damping: 15 },
      }}
    >
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-400 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Shine sweep on hover */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      </div>

      {/* Quote icon (top right, semi‑transparent) */}
      <Quote className="absolute top-5 right-5 w-12 h-12 text-teal-600/10 group-hover:text-teal-600/20 transition-colors" />

      {/* Stars */}
      <div className="flex mb-5 gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.4, rotate: 15 }}
            className="relative"
          >
            <Star
              size={20}
              className={
                i < review.rating
                  ? "text-yellow-500 fill-yellow-500 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]"
                  : "text-gray-300"
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-700 italic leading-relaxed mb-6 flex-1 text-sm md:text-base font-light tracking-wide">
        “{review.comment}”
      </p>

      {/* Author info */}
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md"
        >
          {review.name.charAt(0)}
        </motion.div>
        <div>
          <h4 className="font-semibold text-gray-800 tracking-tight">
            {review.name}
          </h4>
          <p className="text-xs text-gray-500">{review.location}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────
   Main Carousel (glitch‑free)
   ──────────────────────────────────── */
export default function ReviewCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Ultra‑smooth spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    mass: 0.5,
    restDelta: 0.001,
  });

  // ⚡ Glitch fix: only render the animated track once sizes are known
  const [sizesReady, setSizesReady] = useState(false);
  const [maxTranslate, setMaxTranslate] = useState(0);

  const measureSizes = useCallback(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const trackW = track.scrollWidth;
    const containerW = container.clientWidth;
    const max = trackW - containerW;

    // Only update if values changed to avoid unnecessary re‑renders
    setMaxTranslate(max > 0 ? max : 0);
    setSizesReady(true);
  }, []);

  useEffect(() => {
    // Measure after paint
    const raf = requestAnimationFrame(measureSizes);
    return () => cancelAnimationFrame(raf);
  }, [measureSizes]);

  useEffect(() => {
    window.addEventListener("resize", measureSizes);
    return () => window.removeEventListener("resize", measureSizes);
  }, [measureSizes]);

  // Horizontal translation
  const translateX = useTransform(
    smoothProgress,
    [0, 1],
    [0, -maxTranslate]
  );

  // Progress bar
  const progressScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "300vh" }}
    >
      <div
        ref={containerRef}
        className="sticky top-0 h-screen flex flex-col overflow-hidden bg-gradient-to-br from-white via-teal-50/20 to-white"
      >
        <FloatingBackground />

        {/* Header – more space on mobile */}
        <div className="pt-24 sm:pt-20 md:pt-28 pb-4 md:pb-8 px-4 shrink-0 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="block text-teal-600 text-xs sm:text-sm uppercase tracking-[0.3em] mb-3 font-medium"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display',serif] font-extrabold text-gray-800 mb-3 leading-tight"
          >
            What Our Guests Say
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-16 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 mx-auto mb-4 rounded-full origin-center"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 max-w-xl mx-auto text-sm md:text-base font-light"
          >
            Real stories from travellers who experienced Zain's Serenity.
          </motion.p>
        </div>

        {/* Horizontal track – only shown after sizes are ready */}
        <div className="relative flex-1 w-full flex items-center z-10">
          {/* Edge fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-14 bg-gradient-to-r from-white/95 to-transparent pointer-events-none z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-14 bg-gradient-to-l from-white/95 to-transparent pointer-events-none z-20" />

          {sizesReady ? (
            <motion.div
              ref={trackRef}
              className="flex gap-6 md:gap-10 h-full items-center pl-8 md:pl-14 pr-8 md:pr-14"
              style={{ x: translateX, willChange: "transform" }}
            >
              {reviews.map((review, i) => (
                <ReviewCard key={i} review={review} index={i} />
              ))}
            </motion.div>
          ) : (
            // Static placeholder to avoid layout shift
            <div
              ref={trackRef}
              className="flex gap-6 md:gap-10 h-full items-center pl-8 md:pl-14 pr-8 md:pr-14 invisible"
            >
              {reviews.map((review, i) => (
                <div key={i} className="w-[80vw] sm:w-[360px] md:w-[400px] shrink-0" />
              ))}
            </div>
          )}
        </div>

        {/* Bottom hint + progress bar */}
        <div className="relative z-10 text-center pb-6 md:pb-8 shrink-0">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-3"
          >
            <span className="hidden sm:inline">← Scroll to explore more →</span>
            <span className="sm:hidden">← Swipe →</span>
          </motion.div>
          <div className="w-32 mx-auto h-1.5 bg-gray-200/70 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full origin-left"
              style={{ scaleX: progressScaleX }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}