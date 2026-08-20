"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  animate,
  MotionValue,
} from "framer-motion";
import {
  Leaf,
  ChefHat,
  HeartHandshake,
  Star,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import { Playfair_Display, Inter, Caveat, Poppins } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });
const caveat = Caveat({
  subsets: ["latin"],
  weight: "700", // handwriting + bold
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/* ────────────────────────────────────
   Content phases – same 4 phases
   ──────────────────────────────────── */
const phases = [
  {
    id: 1,
    title: "A Dream by the Sea",
    subtitle: "The Discovery",
    description:
      "In 2009, Zain Shah stumbled upon a hidden cove on the Crystal Coast — a crescent of untouched sand kissed by turquoise waters. He sketched the first plans on the beach, dreaming of a sanctuary where luxury and nature could breathe as one. Today, that vision stands as Zain’s Serenity.",
    image: "/images/why-us/discovery.jpg",
    stats: [{ label: "Year Founded", value: 2011, suffix: "" }],
    icon: Star,
  },
  {
    id: 2,
    title: "Sustainable Luxury",
    subtitle: "Eco‑Conscious Design",
    description:
      "Our villas are built with volcanic stone and reclaimed teak; solar panels power the kitchens, greywater nourishes the gardens, and every palm tree remains untouched. Zain’s Serenity is a zero‑waste haven that treads lightly on the Earth.",
    image: "/images/why-us/eco.jpg",
    stats: [
      { label: "Solar Energy", value: 100, suffix: "%" },
      { label: "Organic Farm", value: "On‑site", suffix: "" },
    ],
    icon: Leaf,
  },
  {
    id: 3,
    title: "A World of Flavours",
    subtitle: "Six Signature Restaurants",
    description:
      "From clifftop Peruvian‑Argentinian fusion at Sol Kitchen to the beachfront Cove Rouge, our culinary journey spans Turkey, Italy, Japan, and the authentic island grill Ember & Salt. Every ingredient is sourced from our organic farm and local fishermen.",
    image: "/images/why-us/dining.jpg",
    stats: [
      { label: "Restaurants", value: 6, suffix: "" },
      { label: "Chef's Table", value: "Daily", suffix: "" },
    ],
    icon: ChefHat,
  },
  {
    id: 4,
    title: "Wellness & Unmatched Care",
    subtitle: "Spa, Yoga & Personal Host",
    description:
      "Float above the lagoon in our overwater spa, greet the sunrise with cliff‑edge yoga, or unwind in the adults‑only infinity pool. Every guest is assigned a dedicated personal host who crafts your stay before, during, and after your visit.",
    image: "/images/why-us/spa.jpg",
    stats: [
      { label: "Spa Rooms", value: 8, suffix: "" },
      { label: "Personal Host", value: "24/7", suffix: "" },
    ],
    icon: HeartHandshake,
  },
];

/* ────────────────────────────────────
   Animated Counter (smooth spring)
   ──────────────────────────────────── */
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number | string;
  suffix?: string;
}) {
  if (typeof value !== "number") {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {value}
        {suffix}
      </motion.span>
    );
  }

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      delay: 0.25,
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {displayValue}
      {suffix}
    </motion.span>
  );
}

/* ────────────────────────────────────
   Floating decorations – opacity reduced back to original
   ──────────────────────────────────── */
function FloatingDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute top-[8%] left-[4%] w-20 h-20 md:w-28 md:h-28 rounded-full bg-teal-500/30 blur-3xl"
        animate={{ scale: [1, 1.4, 1], x: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[5%] w-24 h-24 md:w-36 md:h-36 rounded-full bg-emerald-400/30 blur-3xl"
        animate={{ scale: [1, 1.3, 1], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] right-[20%] w-14 h-14 md:w-20 md:h-20 rounded-full bg-amber-300/30 blur-2xl"
        animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] border border-teal-400/25 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-[18%] right-[12%] w-1.5 h-1.5 bg-teal-500/50 rounded-full"
        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[10%] w-2 h-2 bg-emerald-500/50 rounded-full"
        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
}

/* ────────────────────────────────────
   Progress bar – enhanced with glowing dot
   ──────────────────────────────────── */
function ProgressBar({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.3,
  });

  const dotLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-30 w-[80%] max-w-md">
      <div className="relative h-[4px] bg-gray-200/60 backdrop-blur-sm rounded-full overflow-visible shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full origin-left shadow-[0_0_10px_rgba(20,184,166,0.5)]"
          style={{ scaleX }}
        />
        {/* Glowing dot at leading edge */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-600 shadow-[0_0_12px_rgba(20,184,166,0.8)] z-10"
          style={{ left: dotLeft }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────
   Phase Indicators – responsive modern nav
   ──────────────────────────────────── */
function PhaseIndicators({
  active,
  total,
  onSelect,
}: {
  active: number;
  total: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-row items-center gap-2 md:right-8 md:top-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:-translate-y-1/2 md:flex-col md:gap-0">
      {/* Vertical line only on md+ */}
      <div className="hidden md:block absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-teal-100 via-gray-200 to-teal-100" />
      {/* Active fill line only on md+ */}
      <motion.div
        className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-teal-500 to-emerald-500"
        style={{ height: `${((active + 0.5) / total) * 100}%` }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />

      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          aria-label={`Go to phase ${idx + 1}`}
          className="relative z-10 flex items-center justify-center mx-1 md:mx-0 md:my-2 lg:my-3 w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-300 group"
        >
          <span
            className={`absolute inset-0 rounded-full transition-all duration-300 ${
              idx === active
                ? "bg-gradient-to-br from-teal-500 to-emerald-500 border border-teal-400 shadow-xl shadow-teal-500/40 scale-110"
                : "bg-white/90 border border-gray-200/80 hover:border-teal-300 hover:bg-teal-50 hover:scale-105 shadow-sm"
            }`}
          />
          <span
            className={`relative z-10 text-[10px] md:text-xs font-semibold transition-colors duration-300 ${
              idx === active ? "text-white" : "text-gray-500 group-hover:text-teal-600"
            }`}
          >
            {String(idx + 1).padStart(2, "0")}
          </span>
          {idx === active && (
            <motion.span
              className="absolute -right-1 -top-1 w-2 h-2 bg-amber-400 rounded-full"
              layoutId="activeDot"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────────────────
   Main Why Choose Us – background images removed
   ──────────────────────────────────── */
export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 22,
    mass: 0.4,
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const total = phases.length;
      const idx = Math.min(Math.floor(latest * total), total - 1);
      setActivePhase(idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const phaseLocalProgress = useTransform(
    smoothProgress,
    [activePhase / phases.length, (activePhase + 1) / phases.length],
    [0, 1]
  );

  const currentPhase = phases[activePhase];
  const IconComponent = currentPhase.icon;

  const goToPhase = (idx: number) => {
    if (sectionRef.current) {
      const targetY = (idx / phases.length) * sectionRef.current.offsetHeight;
      window.scrollTo({ top: sectionRef.current.offsetTop + targetY, behavior: "smooth" });
    }
  };

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="relative"
      style={{ height: `${phases.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-br from-white via-teal-50/40 to-white">
        <FloatingDecorations />

        <PhaseIndicators
          active={activePhase}
          total={phases.length}
          onSelect={goToPhase}
        />

        {/* Main content */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-6 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 18,
                  mass: 0.4,
                }}
                className="grid md:grid-cols-2 gap-6 md:gap-14 items-center"
              >
                {/* ─── Text Column ─── */}
                <div className="order-2 md:order-1 relative">
                  {/* Ghost number */}
                  <div
                    className={`${playfair.className} absolute -top-10 -left-2 md:-top-16 md:-left-6 text-5xl md:text-8xl lg:text-9xl font-bold text-teal-900/5 select-none leading-none pointer-events-none`}
                  >
                    0{activePhase + 1}
                  </div>

                  <motion.div
                    className="inline-flex items-center gap-2 mb-3 md:mb-5 bg-white/60 backdrop-blur-md rounded-full px-3 py-1 md:px-4 md:py-1.5 border border-teal-100/70 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                  >
                    <motion.span
                      className="w-6 h-6 md:w-8 md:h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-md"
                      whileHover={{ rotate: 12, scale: 1.1 }}
                    >
                      <IconComponent size={14} className="md:w-[18px] md:h-[18px]" />
                    </motion.span>
                    <span className={`${inter.className} text-[9px] md:text-xs uppercase tracking-[0.3em] text-teal-800 font-semibold`}>
                      {currentPhase.subtitle}
                    </span>
                  </motion.div>

                  {/* Heading font changed to Caveat (handwriting + bold) */}
                  <motion.h2
                    className={`${caveat.className} text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-3 md:mb-5 tracking-wide`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 18 }}
                  >
                    {currentPhase.title}
                  </motion.h2>

                  <motion.p
                    className={`${inter.className} text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed mb-4 md:mb-8 max-w-xl`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                  >
                    {currentPhase.description}
                  </motion.p>

                  {/* Stats grid */}
                  <motion.div
                    className="flex gap-2 md:gap-5 flex-wrap"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.18 } },
                    }}
                  >
                    {currentPhase.stats.map((stat, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          hidden: { opacity: 0, y: 25, scale: 0.95 },
                          visible: { opacity: 1, y: 0, scale: 1 },
                        }}
                        whileHover={{ y: -4, boxShadow: "0 12px 25px rgba(0,0,0,0.08)" }}
                        className="bg-white/70 backdrop-blur-md border border-white/80 shadow-sm rounded-xl md:rounded-2xl px-3 py-2 md:px-6 md:py-5 flex flex-col items-center min-w-[80px] md:min-w-[110px]"
                      >
                        <span className={`${playfair.className} text-xl md:text-3xl font-bold text-teal-700`}>
                          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                        </span>
                        <span className={`${inter.className} text-[8px] md:text-[11px] uppercase tracking-wider text-gray-500 mt-0.5 md:mt-1`}>
                          {stat.label}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* ─── Image Column ─── */}
                <motion.div
                  className="order-1 md:order-2 relative"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="relative w-full aspect-[4/3] sm:aspect-[4/5] max-w-[55vw] sm:max-w-[60vw] md:max-w-md mx-auto rounded-xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-white/60 group"
                    whileHover={{ scale: 1.02, rotate: -0.5 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Image
                      src={currentPhase.image}
                      alt={currentPhase.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 flex items-center justify-between pointer-events-none">
                      <span className={`${inter.className} text-[10px] md:text-sm font-semibold text-white drop-shadow-lg`}>
                        {currentPhase.subtitle}
                      </span>
                      <span className="text-white drop-shadow-lg">
                        <ArrowUpRight size={14} className="md:w-[18px] md:h-[18px]" />
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -top-2 -right-1 md:-top-5 md:-right-4 w-8 h-8 md:w-14 md:h-14 bg-white rounded-lg md:rounded-2xl shadow-lg flex items-center justify-center text-teal-600 border border-teal-100"
                    animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles size={16} className="md:w-6 md:h-6" />
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-2 -left-2 md:-bottom-8 md:-left-8 w-20 h-20 md:w-40 md:h-40 rounded-full border-2 border-dashed border-teal-300/40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <ProgressBar scrollYProgress={smoothProgress} />
      </div>
    </section>
  );
}