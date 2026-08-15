"use client";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Heart,
  Leaf,
  Shield,
  Star,
  PenTool,
  Mountain,
  Waves,
  Sun,
  Anchor,
  Camera,
  Quote,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  UtensilsCrossed,
  Trophy,
  Sparkles,
  BedDouble,
  Globe,
} from "lucide-react";
import Image from "next/image";

/* ────────────────────────────────────
   Content – completely unchanged
   ──────────────────────────────────── */
const heroPhases = [
  {
    id: 1,
    heading: "The Discovery",
    sub: "How a young architect found paradise",
    quote:
      "“The cove had no road, no name – only the rhythm of the ocean. I knew I had found home.”",
    image: "/images/about/discovery.jpg",
  },
  {
    id: 2,
    heading: "The First Stone",
    sub: "From bamboo pavilion to a dream",
    quote:
      "“I didn’t want to compete with nature. I wanted to become part of it.” — Zain Shah",
    image: "/images/about/first-stone.jpg",
  },
  {
    id: 3,
    heading: "Rising from the Shore",
    sub: "A sanctuary carved from volcanic rock",
    quote: "",
    image: "/images/about/rising.jpg",
  },
  {
    id: 4,
    heading: "More Than a Resort",
    sub: "A legacy of community and conservation",
    quote:
      "“Today, our staff is our family. This place is a love letter to the sea.”",
    image: "/images/about/the-soul.jpg",
  },
];

const milestones = [
  { year: "2009", event: "Zain discovers the hidden cove while hiking.", icon: Mountain },
  { year: "2011", event: "First bamboo pavilion – ‘Sunrise Hut’ – built.", icon: Home },
  { year: "2013", event: "Volcanic stone villas constructed.", icon: Building2 },
  { year: "2015", event: "Azure Breeze Turkish restaurant opens.", icon: UtensilsCrossed },
  { year: "2017", event: "Best Eco‑Resort in South Asia award.", icon: Trophy },
  { year: "2019", event: "Serenity Spa & Wellness launched.", icon: Sparkles },
  { year: "2021", event: "Private marina and water‑sports centre added.", icon: Anchor },
  { year: "2023", event: "Ocean Junior Suites debut.", icon: BedDouble },
  { year: "2025", event: "Top 10 Luxury Resorts Worldwide by Global Traveler.", icon: Globe },
];

const values = [
  {
    icon: Shield,
    label: "Uncompromising Cleanliness & Safety",
    desc: "Hospital-grade protocols, 24/7 sanitization, and air purification in every suite.",
  },
  {
    icon: Leaf,
    label: "Sustainable Luxury",
    desc: "Solar energy, zero‑waste kitchen, and reforestation projects that protect Crystal Cove.",
  },
  {
    icon: Heart,
    label: "Locally Inspired Cuisine",
    desc: "Six signature restaurants sourcing from organic farms and local fishermen.",
  },
  {
    icon: Star,
    label: "Around‑the‑Clock Personal Host",
    desc: "Every guest is assigned a dedicated concierge before, during, and after the stay.",
  },
];

const extraHighlights = [
  { icon: Sun, text: "Sunrise yoga sessions on the cliff edge every morning" },
  { icon: Anchor, text: "Private sailing excursions to nearby uninhabited islands" },
  { icon: Camera, text: "Underwater photography workshops with marine biologists" },
];

const storyChapters = [
  {
    icon: PenTool,
    chapterImage: "/images/about/discovery.jpg",
    title: "The Discovery",
    paragraphs: [
      `It was the summer of 2009. <strong>Zain Shah</strong>, fresh out of university with a degree in architecture and a heart full of wanderlust, set out on a solo backpacking trip along the unexplored coastline of what is now called <strong>Crystal Cove</strong>. Armed with a sketchbook and an old compass, he trekked through dense mangroves, crossed hidden waterfalls, and finally emerged onto a crescent‑shaped beach that seemed untouched by time. Turquoise waves whispered against volcanic rock; palm trees swayed as if guarding a secret. In that instant, Zain felt a calling – not just to build a hotel, but to create a sanctuary where nature, culture, and luxury could coexist.`,
      `For three days he camped under the stars, sketching plans on the sand. The cove had no road, no electricity, no name – only the rhythm of the ocean. But Zain saw what others couldn’t: an entrance framed by natural coral cliffs, a shallow lagoon perfect for snorkeling, and a gentle slope where the sun set directly over the horizon. He promised himself that one day he would return and build a home that honoured the land.`,
    ],
  },
  {
    icon: Mountain,
    chapterImage: "/images/about/first-stone.jpg",
    title: "The First Stone",
    paragraphs: [
      `Returning to the city, Zain sold his startup – a small web design firm he had built during college – and poured every rupee into the dream. With the help of local fishermen and artisans from the nearby village, he spent two years carving a narrow road through the cliffs. The first structure they raised was a simple bamboo pavilion named <strong>“Sunrise Hut”</strong> – a single room with woven palm‑leaf walls and a bed that faced the sea. There was no electricity; candles lit the dinners, and rainwater was collected in ceramic jars. Yet the first guests, who stumbled upon the place by word of mouth, described it as “the closest thing to paradise.”`,
      `“I didn’t want to compete with nature. I wanted to become part of it.” — Zain Shah, Founder`,
      `Word spread quickly among eco‑tourists and honeymooners. Soon, Zain was hosting storytellers, marine biologists, and yoga retreats. Each guest left a small stone on the beach, which eventually became the foundation for the second villa.`,
    ],
  },
  {
    icon: Waves,
    chapterImage: "/images/about/rising.jpg",
    title: "Rising from the Shore",
    paragraphs: [
      `By 2015, Zain’s Serenity had grown into a collection of twelve villas, each designed by Zain himself using a blend of traditional coastal stonework and modernist glass. He insisted on leaving every existing palm tree untouched, so the buildings seemed to grow organically from the jungle. The resort became a living laboratory of sustainable luxury: greywater was recycled for the gardens, solar panels powered the kitchens, and the menu was sourced from the resort’s own organic farm.`,
      `The culinary programme was perhaps the most audacious. Zain recruited chefs from Turkey, Peru, Japan, and Italy, convinced that a great resort should be a journey for the palate. The result was six extraordinary restaurants, including <strong>Cove Rouge</strong> on the sand, the Turkish‑inspired <strong> Azure Breeze</strong>, the cliff‑top Peruvian‑Argentinian fusion house <strong>Sol Kitchen</strong>, and the authentic island grill <strong>Ember & Salt</strong>. Each meal became a celebration of global flavours, yet rooted in local ingredients.`,
    ],
  },
  {
    icon: Heart,
    chapterImage: "/images/about/the-soul.jpg",
    title: "More Than a Resort",
    paragraphs: [
      `Zain’s vision extended far beyond architecture and gastronomy. He believed that true luxury meant nurturing the spirit. The <strong>Serenity Spa & Wellness</strong> was built over the water, with glass panels in the floor so you could watch fish while enjoying a massage. He established a cinema under the stars, a library curated by travellers, and a kids’ club that taught marine conservation through play. A private marina offered sailing, kayaking, and snorkeling trips to the reef, while the cliff‑top yoga deck welcomed the sunrise with daily sessions.`,
      `Today, Zain’s Serenity employs over 200 staff from the surrounding villages, many of whom have been with the resort since the bamboo pavilion days. The resort sponsors a local school, protects the adjacent coral reef, and has been recognised by the World Tourism Organisation for its community engagement. In 2025 it was named one of the <strong>Top 10 Luxury Resorts Worldwide</strong> by Global Traveler, a testament to the enduring power of a dream.`,
    ],
  },
];

/* ────────────────────────────────────
   Ambient orbs & particles (continuous)
   ──────────────────────────────────── */
function AmbientOrbs() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const orbs = useMemo(() => {
    if (!ready) return [];
    return Array.from({ length: 6 }).map(() => ({
      size: 80 + Math.random() * 120,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 10,
      color:
        Math.random() > 0.5
          ? "bg-teal-400/10"   // back to original
          : "bg-emerald-400/8", // back to original
    }));
  }, [ready]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${o.color}`}
          style={{ width: o.size, height: o.size, left: o.left, top: o.top }}
          animate={{ scale: [1, 1.4, 1], x: [0, 30, -20, 0], y: [0, -20, 30, 0], rotate: [0, 15, -10, 0] }}
          transition={{ duration: o.duration, repeat: Infinity, delay: o.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function FloatingParticles() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const particles = useMemo(() => {
    if (!ready) return [];
    return Array.from({ length: 25 }).map(() => ({
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 6,
      duration: 6 + Math.random() * 12,
      delay: Math.random() * 15,
      yDrift: -(window.innerHeight * (0.5 + Math.random())),
    }));
  }, [ready]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-teal-300/50"  // increased opacity from /30 to /50
          style={{ left: p.left, bottom: "-5%", width: p.size, height: p.size }}
          animate={{ y: [0, p.yDrift], opacity: [0.8, 0.3], scale: [0.8, 1.6] }} // increased starting opacity
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────
   1) Hero – split layout + micro‑interactions
   ──────────────────────────────────── */
function HeroCarousel() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setActive((prev) => (prev + 1) % heroPhases.length), 6000);
  }, []);
  useEffect(() => {
    startAutoplay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoplay]);

  const phase = heroPhases[active];
  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-teal-50/50 py-10 md:py-20 overflow-hidden">
      <AmbientOrbs />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6 md:gap-10 items-center">
        {/* Text column */}
        <motion.div
          key={active}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 md:space-y-5"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "2rem" }}
            transition={{ duration: 0.5 }}
            className="h-0.5 bg-teal-500"
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-teal-600 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold"
          >
            Chapter {active + 1}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Playfair_Display',serif] font-bold text-gray-800 leading-tight"
          >
            {phase.heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-gray-600 font-light"
          >
            {phase.sub}
          </motion.p>
          {phase.quote && (
            <motion.blockquote
              initial={{ opacity: 0, borderColor: "transparent" }}
              animate={{ opacity: 1, borderColor: "#2DD4BF" }}
              transition={{ delay: 0.4 }}
              className="border-l-4 border-teal-400 pl-3 md:pl-4 italic text-gray-500 text-sm md:text-base"
            >
              {phase.quote}
            </motion.blockquote>
          )}
          {/* Controls */}
          <div className="flex items-center gap-3 md:gap-4 pt-2">
            <button
              onClick={() => { setActive((prev) => (prev - 1 + heroPhases.length) % heroPhases.length); startAutoplay(); }}
              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-teal-100 hover:text-teal-700 active:scale-95 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5">
              {heroPhases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActive(i); startAutoplay(); }}
                  className={`w-6 h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? "bg-teal-500 w-8" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => { setActive((prev) => (prev + 1) % heroPhases.length); startAutoplay(); }}
              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-teal-100 hover:text-teal-700 active:scale-95 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Image card with micro‑interaction */}
        <motion.div
          key={`img-${active}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          whileHover={{ scale: 1.02, rotate: 0.5 }}
          className="relative aspect-[4/5] md:aspect-auto md:h-[450px] rounded-3xl overflow-hidden shadow-2xl group"
        >
          <Image
            src={phase.image}
            alt={phase.heading}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-xs font-medium tracking-wider opacity-80">Phase {active + 1}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────
   2) Milestones – modern horizontal scroll + hidden scrollbar + stylish
   ──────────────────────────────────── */
function VerticalTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-white to-teal-50/30 py-12 md:py-20 overflow-hidden">
      {/* Hide scrollbar for all browsers */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <AmbientOrbs />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <RevealSection className="text-center mb-8 md:mb-12">
          <p className="text-teal-600 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium">Our Journey</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-['Playfair_Display',serif] font-bold text-gray-800 mt-1 md:mt-2">
            Milestones
          </h2>
        </RevealSection>

        {/* Scroll buttons + container */}
        <div className="relative">
          {/* Background line for timeline effect */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-teal-200 to-transparent transform -translate-y-1/2 hidden md:block" />

          {/* Left button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-teal-50 active:scale-90 transition-all duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="text-teal-600 w-6 h-6" />
          </button>

          <div
            ref={containerRef}
            className="flex overflow-x-auto overflow-y-hidden gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide scroll-smooth pb-6 md:pb-8 px-4 md:px-12"
          >
            {milestones.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  className="relative flex-shrink-0 snap-center w-[220px] md:w-[240px] bg-white/90 backdrop-blur-sm border border-white/80 rounded-2xl p-4 md:p-5 shadow-md group cursor-default transition-all"
                >
                  {/* Decorative on timeline */}
                  
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-teal-200 transition-colors">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-teal-700" />
                  </div>
                  <span className="text-2xl md:text-3xl font-black text-teal-700 mb-1 block">{m.year}</span>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{m.event}</p>
                  <div className="mt-3 w-10 h-0.5 bg-teal-400 group-hover:w-full transition-all duration-500" />
                </motion.div>
              );
            })}
          </div>

          {/* Right button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-teal-50 active:scale-90 transition-all duration-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="text-teal-600 w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────
   3) Story Chapters – big images instead of icons
   ──────────────────────────────────── */
function StoryChapters() {
  return (
    <div className="relative bg-gradient-to-b from-teal-50/30 to-white py-16 md:py-24 overflow-hidden">
      <AmbientOrbs />
      <div className="relative z-10 max-w-6xl mx-auto px-4 space-y-20 md:space-y-28">
        {storyChapters.map((chapter, idx) => (
          <RevealSection key={chapter.title}>
            <div
              className={`flex flex-col md:flex-row gap-8 md:gap-12 items-center ${
                idx % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Large image */}
              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                className="w-full md:w-2/5 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-teal-100/50"
              >
                <Image
                  src={chapter.chapterImage}
                  alt={chapter.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent" />
              </motion.div>

              {/* Text column */}
              <div className="w-full md:w-3/5 space-y-4 md:space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <chapter.icon className="w-5 h-5 md:w-6 md:h-6 text-teal-700" />
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-['Playfair_Display',serif] font-bold text-gray-800">
                    {chapter.title}
                  </h2>
                </div>
                {chapter.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className={`text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed ${
                      i === 0
                        ? "first-letter:text-4xl md:first-letter:text-5xl first-letter:font-bold first-letter:text-teal-600 first-letter:mr-1 first-letter:float-left"
                        : ""
                    } ${para.startsWith("“") ? "italic border-l-4 border-teal-500 pl-3 md:pl-4 text-gray-600 text-sm md:text-lg" : ""}`}
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────
   4) Values – back to original icons, image visible on mobile
   ──────────────────────────────────── */
function ValuesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-28 overflow-hidden bg-white">
      <AmbientOrbs />
      <div className="relative z-10 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="space-y-6 md:space-y-8">
          <RevealSection>
            <p className="text-teal-600 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium">Our Promise</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-['Playfair_Display',serif] font-bold text-gray-800 mt-1 md:mt-2">
              What We Stand For
            </h2>
          </RevealSection>
          {values.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 6, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
              className="flex gap-4 p-3 md:p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm transition-all group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                <v.icon className="w-5 h-5 md:w-6 md:h-6 text-teal-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1">{v.label}</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Side image – now visible on mobile too */}
        <motion.div style={{ y: yImage }} className="mt-8 md:mt-0">
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
            <Image src="/images/about/values-bg.jpg" alt="Our values" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <Star className="w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2" />
              <p className="text-lg md:text-2xl font-['Playfair_Display',serif] font-semibold">Crafted with Love</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────
   5) Highlights – mobile horizontal, desktop grid
   ──────────────────────────────────── */
function HighlightsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -250 : 250, behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-white to-teal-50/20 py-16 md:py-24 overflow-hidden">
      <FloatingParticles />
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <RevealSection className="text-center mb-10 md:mb-14">
          <p className="text-teal-600 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium">Experiences</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-['Playfair_Display',serif] font-bold text-gray-800 mt-1 md:mt-2">
            Moments That Inspire
          </h2>
        </RevealSection>

        {/* Mobile horizontal scroll with arrows */}
        <div className="md:hidden relative">
          <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur p-2 rounded-full shadow-md">
            <ChevronLeft className="text-teal-600 w-4 h-4" />
          </button>
          <div ref={scrollRef} className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide py-4 px-8">
            {extraHighlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex-shrink-0 snap-center w-[240px] bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-md border border-white/60"
              >
                <div className="w-12 h-12 mx-auto bg-teal-100 rounded-xl flex items-center justify-center mb-3">
                  <item.icon className="w-6 h-6 text-teal-700" />
                </div>
                <p className="text-gray-700 text-xs leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
          <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur p-2 rounded-full shadow-md">
            <ChevronRight className="text-teal-600 w-4 h-4" />
          </button>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {extraHighlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04, rotate: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all border border-white/60 group"
            >
              <div className="w-14 h-14 mx-auto bg-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <item.icon className="w-7 h-7 text-teal-700" />
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────
   6) Final Quote – image bg + blobs/particles back
   ──────────────────────────────────── */
function FinalQuote() {
  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/images/about/quote-bg.jpg" alt="Background" fill className="object-cover" />
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
      </div>
      {/* Floating blobs/particles – now more visible */}
      <AmbientOrbs />
      <FloatingParticles />
      <RevealSection className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <Quote className="inline w-10 h-10 md:w-12 md:h-12 mb-6 text-teal-600 opacity-80" />
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-snug italic text-gray-800">
          “This place is not just my life’s work; it’s a love letter to the sea, the mountains, and every
          traveller who dares to dream. Welcome to our home.”
        </p>
        <p className="mt-6 md:mt-8 text-teal-700 text-base md:text-lg font-medium tracking-wide">— Zain Shah</p>
      </RevealSection>
    </div>
  );
}

/* ────────────────────────────────────
   Main About Page – unchanged
   ──────────────────────────────────── */
export default function AboutContent() {
  return (
    <main className="bg-white overflow-x-hidden">
      <HeroCarousel />
      <VerticalTimeline />
      <StoryChapters />
      <ValuesSection />
      <HighlightsSection />
      <FinalQuote />
    </main>
  );
}