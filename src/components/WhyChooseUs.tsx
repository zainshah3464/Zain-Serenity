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
} from "lucide-react";
import Image from "next/image";

/* ────────────────────────────────────
   Content phases – story + real details
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
      delay: 0.2,
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
   Floating decorations (unchanged)
   ──────────────────────────────────── */
function FloatingDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-[10%] left-[5%] w-24 h-24 rounded-full bg-teal-400/10 blur-2xl"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[8%] w-32 h-32 rounded-full bg-emerald-300/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] right-[20%] w-16 h-16 rounded-full bg-amber-300/10 blur-xl"
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-teal-400/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-[15%] right-[15%] w-1.5 h-1.5 bg-teal-400 rounded-full"
        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[30%] left-[12%] w-1.5 h-1.5 bg-emerald-400 rounded-full"
        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
      />
    </div>
  );
}

/* ────────────────────────────────────
   New progress bar – sleek, spring‑animated
   ──────────────────────────────────── */
function ProgressBar({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  // Smooth spring for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
  });

  return (
    <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 w-[70%] max-w-sm">
      <div className="h-1.5 bg-white/40 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full origin-left"
          style={{ scaleX }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────
   Parallax Background (unchanged)
   ──────────────────────────────────── */
function ParallaxBackground({
  image,
  phaseProgress,
}: {
  image: string;
  phaseProgress: MotionValue<number>;
}) {
  const y = useTransform(phaseProgress, [0, 1], ["0%", "-5%"]);

  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.25 }}
      exit={{ opacity: 0 }}
      style={{ y }}
    >
      <Image
        src={image}
        alt=""
        fill
        className="object-cover transition-all duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/60 to-white/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-white/30" />
    </motion.div>
  );
}

/* ────────────────────────────────────
   Main Why Choose Us
   ──────────────────────────────────── */
export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring for overall scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const total = phases.length;
      const idx = Math.min(Math.floor(latest * total), total - 1);
      setActivePhase(idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Local progress within the active phase (0→1)
  const phaseLocalProgress = useTransform(
    smoothProgress,
    [activePhase / phases.length, (activePhase + 1) / phases.length],
    [0, 1]
  );

  const currentPhase = phases[activePhase];
  const IconComponent = currentPhase.icon;

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="relative"
      style={{ height: `${phases.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-[#FAFAFA] via-teal-50/30 to-white">
        {/* Parallax background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <ParallaxBackground
              image={currentPhase.image}
              phaseProgress={phaseLocalProgress}
            />
          </motion.div>
        </AnimatePresence>

        <FloatingDecorations />

        {/* Main content - mobile spacing reduced */}
        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 md:px-16 lg:px-24">
          <div className="max-w-5xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 0.5,
                }}
                className="grid md:grid-cols-2 gap-5 sm:gap-8 md:gap-10 items-center"
              >
                {/* Text column */}
                <div className="order-2 md:order-1">
                  <motion.div
                    className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 bg-white/50 backdrop-blur-sm rounded-full px-3 py-0.5 sm:px-4 sm:py-1 border border-teal-200/30 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.span
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                    >
                      <IconComponent size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </motion.span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-teal-700 font-semibold">
                      {currentPhase.subtitle}
                    </span>
                  </motion.div>

                  <motion.h2
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Playfair_Display',serif] font-extrabold text-gray-800 leading-tight mb-3 sm:mb-5 drop-shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 18 }}
                  >
                    {currentPhase.title}
                  </motion.h2>

                  <motion.p
                    className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6 md:mb-8 max-w-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {currentPhase.description}
                  </motion.p>

                  <motion.div
                    className="flex gap-5 sm:gap-8 flex-wrap"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.15 } },
                    }}
                  >
                    {currentPhase.stats.map((stat, i) => (
                      <motion.div
                        key={i}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="text-center"
                      >
                        <span className="block text-2xl sm:text-3xl md:text-4xl font-bold text-teal-600">
                          <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                        </span>
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
                          {stat.label}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Image column */}
                <motion.div
                  className="order-1 md:order-2 relative"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="relative w-full aspect-[3/4] sm:aspect-[4/5] max-w-[75vw] sm:max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/50 group"
                    whileHover={{ scale: 1.02, rotate: -0.5 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Image
                      src={currentPhase.image}
                      alt={currentPhase.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/60 backdrop-blur-md p-2 sm:p-4 text-xs sm:text-sm text-gray-700">
                      <span className="font-semibold">
                        {currentPhase.subtitle}
                      </span>{" "}
                      —{" "}
                      {currentPhase.stats
                        .map((s) => `${s.value}${s.suffix}`)
                        .join(" / ")}
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-teal-500"
                    animate={{ y: [0, -6, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles size={16} className="sm:w-5 sm:h-5" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* New progress bar */}
        <ProgressBar scrollYProgress={smoothProgress} />
      </div>
    </section>
  );
}