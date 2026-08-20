"use client";

import { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Inter, Caveat } from "next/font/google";
import SearchBar from "./SearchBar";
import { useHeroLoading } from "./HeroLoadingContext"; // 👈 import

const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });
const caveat = Caveat({ subsets: ["latin"], display: "swap" });

/* ────────────────────────────────────
   Scenes data – match with new 80s video
   ──────────────────────────────────── */
interface Scene {
  id: number;
  heading: string;
  subtext: string;
  quote?: string;
  startTime: number;
  endTime: number;
  handwriting?: "heading" | "subtext" | "quote" | null;
}

const scenes: Scene[] = [
  {
    id: 1,
    heading: "Aerial Awakening",
    subtext:
      "Drone cameras rise over Crystal Cove — turquoise shallows, volcanic cliffs and a sky that never ends.",
    quote: "“Some places don’t need words. They take your breath first.”",
    startTime: 0,
    endTime: 7,
    handwriting: "quote",
  },
  {
    id: 2,
    heading: "Rush of the Waves",
    subtext:
      "Water bikes carve white arcs across the lagoon — pure adrenaline with a backdrop of paradise.",
    startTime: 7,
    endTime: 13,
  },
  {
    id: 3,
    heading: "Sky Symphony",
    subtext:
      "A choreographed drone show lights up the ocean sky, where technology dances with the sea breeze.",
    quote: "“When the stars come down to play.”",
    startTime: 13,
    endTime: 19,
    handwriting: "quote",
  },
  {
    id: 4,
    heading: "Beneath the Surface",
    subtext:
      "The ocean drone dives low — coral gardens, shimmering schools of fish and crystal-clear water.",
    startTime: 19,
    endTime: 25,
  },
  {
    id: 5,
    heading: "Poolside Stillness",
    subtext:
      "Infinity edges melt into the horizon while palm shadows drift slowly across the water.",
    startTime: 25,
    endTime: 31,
    handwriting: "heading",
  },
  {
    id: 6,
    heading: "A Table by the Sea",
    subtext:
      "Candlelight, sea spray and dishes crafted from local harvest — dinner becomes a slow theatre.",
    quote: "“Every meal here is a love affair between land and sea.”",
    startTime: 31,
    endTime: 37,
    handwriting: "quote",
  },
  {
    id: 7,
    heading: "The Art of the Stay",
    subtext:
      "Sunlit suites and chef’s kitchens reveal a private world of understated luxury.",
    startTime: 37,
    endTime: 43,
  },
  {
    id: 8,
    heading: "The Estate",
    subtext:
      "Water villas, winding pathways and pavilions woven through the landscape with intention.",
    startTime: 43,
    endTime: 49,
  },
  {
    id: 9,
    heading: "Endless Horizon",
    subtext:
      "From cliff-top sunsets to sweeping jungle canopies, the panorama never stops.",
    quote: "“Here, every window frames a postcard.”",
    startTime: 49,
    endTime: 56,
    handwriting: "subtext",
  },
  {
    id: 10,
    heading: "Golden Hour",
    subtext:
      "The last light turns the sky to amber as the resort settles into twilight.",
    quote: "“And the sun said goodbye, but the cove whispered — stay.”",
    startTime: 56,
    endTime: 63,
    handwriting: "quote",
  },
  {
    id: 11,
    heading: "Arrival to Remember",
    subtext:
      "A grand entrance through coral cliffs begins your journey into timeless calm.",
    startTime: 63,
    endTime: 70,
  },
  {
    id: 12,
    heading: "Forever Zain’s Serenity",
    subtext:
      "A legacy of nature, design and hospitality — waiting for your story.",
    quote: "“Welcome to the place that doesn’t just host you; it transforms you.”",
    startTime: 70,
    endTime: 80,
    handwriting: "heading",
  },
];

/* ────────────────────────────────────
   Decorative rings & floating dots
   ──────────────────────────────────── */



/* ────────────────────────────────────
   Loading animation
   ──────────────────────────────────── */

const LoadingScreen = memo(function LoadingScreen({
  progress,
}: {
  progress: number;
}) {
  const waterY = 60 - (progress / 100) * 56;

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#022B3A] via-[#05668D] to-[#00A8CC] backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      aria-label={`Loading ${Math.round(progress)}%`}
    >
      {/* caustic light overlay - ab brighter + moving */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(0,255,255,0.45) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,200,255,0.35) 0%, transparent 55%), radial-gradient(circle at 50% 20%, rgba(255,255,255,0.25) 0%, transparent 40%)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* god rays - ab wide & bright */}
      <motion.div
        className="absolute top-0 left-[12%] w-4 h-[75vh] bg-gradient-to-b from-cyan-200/70 via-cyan-300/20 to-transparent blur-2xl rotate-12 pointer-events-none mix-blend-screen"
        animate={{ opacity: [0.3, 0.8, 0.3], x: [-40, 40, -40] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-0 left-[45%] w-5 h-[85vh] bg-gradient-to-b from-teal-200/70 via-teal-300/20 to-transparent blur-2xl rotate-[-10deg] pointer-events-none mix-blend-screen"
        animate={{ opacity: [0.4, 0.9, 0.4], x: [30, -30, 30] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-0 right-[8%] w-3 h-[65vh] bg-gradient-to-b from-sky-200/70 via-sky-300/20 to-transparent blur-2xl rotate-6 pointer-events-none mix-blend-screen"
        animate={{ opacity: [0.25, 0.7, 0.25], x: [-50, 20, -50] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* bottom ocean waves - layer 1 */}
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-32 md:h-44 flex pointer-events-none"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((i) => (
          <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(103,232,249,0.2)" d="M0,160 C240,220 480,100 720,160 C960,220 1200,100 1440,160 L1440,320 L0,320 Z" />
          </svg>
        ))}
      </motion.div>

      {/* bottom ocean waves - layer 2 */}
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-28 md:h-36 flex pointer-events-none"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((i) => (
          <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(56,189,248,0.15)" d="M0,220 C180,260 360,100 720,220 C1080,340 1260,160 1440,220 L1440,320 L0,320 Z" />
          </svg>
        ))}
      </motion.div>

      {/* bottom ocean waves - layer 3 */}
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-20 md:h-24 flex pointer-events-none"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((i) => (
          <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(14,165,233,0.1)" d="M0,280 C300,240 600,320 900,280 C1200,240 1320,300 1440,280 L1440,320 L0,320 Z" />
          </svg>
        ))}
      </motion.div>

      {/* floating bubbles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute bottom-8 rounded-full bg-cyan-100/50 pointer-events-none"
          style={{
            left: `${(i * 53) % 100}%`,
            width: `${(i % 3) + 1}px`,
            height: `${(i % 3) + 1}px`,
          }}
          animate={{
            y: [0, -300],
            x: [0, i % 2 === 0 ? 25 : -25],
            opacity: [0, 0.9, 0],
            scale: [0.8, 1.5, 0.8],
          }}
          transition={{
            duration: 5 + (i % 7),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}

      {/* swimming fish icons */}
      {[0, 1, 2, 3].map((i) => (
        <motion.svg
          key={i}
          className="absolute pointer-events-none"
          style={{ top: `${10 + i * 18}%`, width: 22, height: 12 }}
          viewBox="0 0 24 12"
          fill="none"
          animate={{
            x: ["-10vw", "110vw"],
            y: [0, i % 2 === 0 ? 20 : -20, 0],
          }}
          transition={{
            duration: 14 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3,
          }}
        >
          <g fill="rgba(125,211,252,0.4)" stroke="rgba(224,242,254,0.8)" strokeWidth="0.6">
            <ellipse cx="9" cy="6" rx="6" ry="3.5" />
            <path d="M15 6 L22 2 L22 10 Z" />
            <circle cx="7" cy="5.5" r="0.6" fill="white" stroke="none" />
          </g>
        </motion.svg>
      ))}

      {/* logo + water fill */}
      <motion.div
        className="relative flex items-center justify-center mb-6"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* glow behind logo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-300/30 blur-xl pointer-events-none"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <svg
          width="170"
          height="170"
          viewBox="0 0 64 64"
          className="w-40 h-40 md:w-52 md:h-52"
          fill="none"
        >
          <defs>
            <clipPath id="logoFillClip">
              <circle cx="32" cy="32" r="28" />
            </clipPath>
            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#22D3EE" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0E7490" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* water fill based on progress */}
          <g clipPath="url(#logoFillClip)">
            <g transform={`translate(0 ${waterY})`}>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 0"
                  to="-64 0"
                  dur="4s"
                  repeatCount="indefinite"
                />
                <path
                  d="M0 0 Q8 5 16 0 T32 0 T48 0 T64 0 L64 64 L0 64 Z"
                  fill="url(#waterGradient)"
                />
                <path
                  d="M64 0 Q72 5 80 0 T96 0 T112 0 T128 0 L128 64 L64 64 Z"
                  fill="url(#waterGradient)"
                />
              </g>
              {/* second slower water surface */}
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 0"
                  to="-32 0"
                  dur="7s"
                  repeatCount="indefinite"
                />
                <path
                  d="M0 0 Q4 3 8 0 T16 0 T24 0 T32 0 L32 64 L0 64 Z"
                  fill="rgba(255,255,255,0.12)"
                />
              </g>
            </g>
          </g>

          {/* outer rotating dashed ring */}
          <circle cx="32" cy="32" r="31" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4 6" fill="none">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 32 32"
              to="360 32 32"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>

          {/* frame */}
          <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="rgba(255,255,255,0.06)" />
          <circle cx="32" cy="32" r="25.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" fill="none" />

          {/* luxury house icon */}
          <g stroke="rgba(255,255,255,0.95)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* roof */}
            <path d="M18 28 L32 18 L46 28" />
            <path d="M22 28 L32 20 L42 28" opacity="0.5" />
            {/* main building */}
            <rect x="20" y="28" width="24" height="18" rx="1.5" />
            {/* columns */}
            <line x1="23" y1="30" x2="23" y2="44" />
            <line x1="27" y1="30" x2="27" y2="44" />
            <line x1="37" y1="30" x2="37" y2="44" />
            <line x1="41" y1="30" x2="41" y2="44" />
            {/* door */}
            <rect x="29" y="36" width="6" height="10" rx="0.5" />
            {/* windows upper */}
            <rect x="24" y="32" width="3" height="3" rx="0.5" />
            <rect x="37" y="32" width="3" height="3" rx="0.5" />
          </g>
        </svg>
      </motion.div>

      {/* brand */}
      <motion.h2
        className={`mt-6 text-2xl md:text-3xl ${playfair.className} text-white tracking-wide drop-shadow-lg`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Zain’s Serenity
      </motion.h2>

      <motion.p
        className={`mt-2 text-xs md:text-sm text-cyan-100 tracking-[0.3em] uppercase ${inter.className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        Resort & Hotel
      </motion.p>

      <motion.p
        className="mt-4 text-sm md:text-base text-cyan-100/90 tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        Preparing your escape
      </motion.p>
    </motion.div>
  );
});
/* ────────────────────────────────────
   Error Screen
   ──────────────────────────────────── */
const ErrorScreen = memo(function ErrorScreen() {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <svg
        className="w-16 h-16 text-teal-400/80 mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className={`text-xl md:text-2xl ${playfair.className} text-gray-800 mb-2`}>
        A moment of calm
      </h2>
      <p className={`text-gray-500 text-sm max-w-xs text-center ${inter.className}`}>
        We’re unable to load the experience right now. Please refresh the page.
      </p>
    </motion.div>
  );
});

/* ────────────────────────────────────
   Main StoryHero Component
   ──────────────────────────────────── */
export default function StoryHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [videoStatus, setVideoStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [hasEnded, setHasEnded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { setIsHeroLoading } = useHeroLoading(); // 👈 context

  // Smoother loading simulation
  useEffect(() => {
    if (videoStatus === "loading") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) return 100;
          const increment = Math.random() * 2 + 1;
          return Math.min(prev + increment, 100);
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [videoStatus]);

  // 👇 Sync hero loading state to context
  useEffect(() => {
    setIsHeroLoading(videoStatus === "loading");
  }, [videoStatus, setIsHeroLoading]);

  const scrollToNext = useCallback(() => {
    const nextSection = document.getElementById("why-choose-us");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  }, []);

  const handleVideoEnded = useCallback(() => {
    setHasEnded(true);
    scrollToNext();
  }, [scrollToNext]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting && videoStatus === "ready") {
          if (hasEnded) {
            video.currentTime = 0;
            setHasEnded(false);
          }
          video.play().catch(() => {});
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [videoStatus, hasEnded]);

  const updateActiveScene = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const time = video.currentTime;
    const idx = scenes.findIndex(
      (s) => time >= s.startTime && time < s.endTime
    );
    if (idx !== -1) setActiveScene(idx);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener("timeupdate", updateActiveScene);
    return () => video.removeEventListener("timeupdate", updateActiveScene);
  }, [updateActiveScene]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedData = () => {
      setVideoStatus("ready");
      video.play().catch(() => {});
    };
    const onError = () => setVideoStatus("error");

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("error", onError);

    if (video.readyState >= 2) {
      setVideoStatus("ready");
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener("ended", handleVideoEnded);
    return () => video.removeEventListener("ended", handleVideoEnded);
  }, [handleVideoEnded]);

  const activeSceneData = scenes[activeScene];

  return (
    <>
      <div
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        {/* Video background */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero-video.mp4"
          muted
          playsInline
          autoPlay
          preload="auto"
          loop={false}
          poster="/images/hero-fallback.jpg"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />


        <AnimatePresence>
          {videoStatus === "loading" && (
            <LoadingScreen key="loading" progress={loadingProgress} />
          )}
          {videoStatus === "error" && <ErrorScreen key="error" />}
        </AnimatePresence>

        {/* Text overlay – reduced sizes for better video visibility */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-5 md:px-10 lg:px-16 pointer-events-none">
          <AnimatePresence mode="wait">
            {activeSceneData && videoStatus === "ready" && (
              <motion.div
                key={activeScene}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-4xl"
              >
                <p className={`${inter.className} text-[10px] md:text-xs uppercase tracking-[0.35em] text-emerald-300 mb-3`}>
                  Scene {activeScene + 1} of {scenes.length}
                </p>
                <h2
                  className={`${caveat.className} relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white mb-3 md:mb-4`}
                >
                  {activeSceneData.heading}
                  <motion.span
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "40%" }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                </h2>
                <p
                  className={`${inter.className} text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-light mb-3 max-w-2xl`}
                >
                  {activeSceneData.subtext}
                </p>
                {activeSceneData.quote && (
                  <blockquote className="border-l-4 border-emerald-400 pl-5 md:pl-8 italic text-white/70 text-sm md:text-base lg:text-lg">
                    {activeSceneData.quote}
                  </blockquote>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* SearchBar – wrapper size slightly reduced, but mobile internal layout needs SearchBar component update */}
          <div className="pointer-events-auto mt-4 md:mt-6 w-full max-w-md md:max-w-xl origin-left scale-[0.95] sm:scale-100">
            <SearchBar />
          </div>
        </div>

        {videoStatus === "ready" && !hasEnded && (
          <motion.div
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-30 flex items-center gap-2 text-white/50 text-xs pointer-events-none"
            animate={{ opacity: [0, 1, 0], y: [0, 4, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="hidden sm:inline">Scroll to explore</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        )}
      </div>
    </>
  );
}