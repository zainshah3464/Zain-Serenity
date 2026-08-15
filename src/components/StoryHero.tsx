"use client";

import { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import SearchBar from "./SearchBar";

/* ────────────────────────────────────
   Scenes data – match with video timeline
   ──────────────────────────────────── */
interface Scene {
  id: number;
  heading: string;
  subtext: string;
  quote?: string;
  startTime: number;
  endTime: number;
}

const scenes: Scene[] = [
  {
    id: 1,
    heading: "The Discovery",
    subtext:
      "A hidden cove where turquoise waves whisper against volcanic rock, untouched by time.",
    quote:
      "“I didn't want to compete with nature. I wanted to become part of it.” — Zain Shah",
    startTime: 0,
    endTime: 6,
  },
  {
    id: 2,
    heading: "The First Stone",
    subtext:
      "A bamboo pavilion under the stars – one room, no electricity, only candles and the sound of waves.",
    quote:
      "“The first guests called it the closest thing to paradise.” — Early Traveler",
    startTime: 6,
    endTime: 12,
  },
  {
    id: 3,
    heading: "Beachside Dining",
    subtext:
      "Cove Rouge – our Mediterranean grill on the sand, where the sea breeze adds flavour to every bite.",
    startTime: 12,
    endTime: 18,
  },
  {
    id: 4,
    heading: "Ocean & Pathways",
    subtext:
      "Water villas perched above coral gardens, linked by winding walkways that float over the lagoon.",
    startTime: 18,
    endTime: 24,
  },
  {
    id: 5,
    heading: "Arrival & Lobby",
    subtext:
      "A grand entrance framed by natural coral cliffs – your journey into timeless luxury begins here.",
    startTime: 24,
    endTime: 30,
  },
  {
    id: 6,
    heading: "Pool & Gardens",
    subtext:
      "Infinity pools blending with the horizon, surrounded by lush tropical gardens and endless sky.",
    startTime: 30,
    endTime: 36,
  },
  {
    id: 7,
    heading: "The Ocean Junior Suite",
    subtext:
      "Wake up to the Indian Ocean from your overwater sanctuary, where every morning feels like a dream.",
    startTime: 36,
    endTime: 42,
  },
];

/* ────────────────────────────────────
   Decorative rings & floating dots
   (wrapped with React.memo for performance)
   ──────────────────────────────────── */
const DecorativeElements = memo(function DecorativeElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Rotating rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] max-w-none aspect-square rounded-full border border-teal-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-none aspect-square rounded-full border border-emerald-400/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      {/* Floating dots */}
      <motion.div
        className="absolute top-[20%] left-[15%] w-2 h-2 bg-teal-400 rounded-full"
        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[25%] right-[10%] w-3 h-3 bg-emerald-400 rounded-full"
        animate={{ scale: [1, 2, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1.2 }}
      />
      <motion.div
        className="absolute top-[40%] right-[20%] w-1.5 h-1.5 bg-amber-300 rounded-full"
        animate={{ scale: [1, 2.2, 1], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      />
    </div>
  );
});

/* ────────────────────────────────────
   Loading Screen – white bg, smooth ring fill
   ──────────────────────────────────── */
const circumference = 2 * Math.PI * 40; // static value

const LoadingScreen = memo(function LoadingScreen({
  progress,
}: {
  progress: number;
}) {
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      {/* Circular progress frame */}
      <div className="relative flex items-center justify-center">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx="60"
            cy="60"
            r="40"
            stroke="#E5E7EB"
            strokeWidth="6"
            fill="none"
          />
          {/* Progress ring with smooth transition */}
          <motion.circle
            cx="60"
            cy="60"
            r="40"
            stroke="#14B8A6"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            initial={false}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </svg>
        {/* Hotel icon inside the ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-teal-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21V7l8-4 8 4v14" />
            <path d="M7 11h2v2H7zM11 11h2v2h-2zM15 11h2v2h-2z" />
            <path d="M7 17h10" />
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <motion.h2
        className="mt-6 text-2xl md:text-3xl font-['Playfair_Display',_serif] text-gray-800 tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Zain’s Serenity
      </motion.h2>

      {/* Percentage number with smooth scale animation */}
      <motion.p
        className="mt-4 text-4xl md:text-5xl font-light text-teal-600 tabular-nums"
        key={Math.round(progress)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        {Math.round(progress)}%
      </motion.p>

      {/* Preparing text */}
      <p className="mt-2 text-sm text-gray-400 tracking-widest uppercase">
        Preparing your escape
      </p>
    </motion.div>
  );
});

/* ────────────────────────────────────
   Error Screen – white bg
   ──────────────────────────────────── */
const ErrorScreen = memo(function ErrorScreen() {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white backdrop-blur-sm"
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
      <h2 className="text-xl md:text-2xl font-['Playfair_Display',_serif] text-gray-800 mb-2">
        A moment of calm
      </h2>
      <p className="text-gray-500 text-sm max-w-xs text-center">
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

  // Smoother loading simulation (higher frequency, smaller steps)
  useEffect(() => {
    if (videoStatus === "loading") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) return 100;
          // Smaller increments (1–3) every 50ms => smooth fill
          const increment = Math.random() * 2 + 1;
          return Math.min(prev + increment, 100);
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      // immediately jump to 100% when video ready
      setLoadingProgress(100);
    }
  }, [videoStatus]);

  // Auto‑scroll to next section when video ends
  const scrollToNext = useCallback(() => {
    const nextSection = document.getElementById("why-choose-us");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  }, []);

  // Video ended handler
  const handleVideoEnded = useCallback(() => {
    setHasEnded(true);
    scrollToNext();
  }, [scrollToNext]);

  // Restart video when hero re‑enters view
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

  // Track active scene from video time
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

  // Video loading / error handling
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

  // Add ended listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener("ended", handleVideoEnded);
    return () => video.removeEventListener("ended", handleVideoEnded);
  }, [handleVideoEnded]);

  return (
    <>
      {/* Hero section */}
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

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />

        {/* Decorative elements */}
        <DecorativeElements />

        {/* Loading / Error overlays */}
        <AnimatePresence>
          {videoStatus === "loading" && (
            <LoadingScreen key="loading" progress={loadingProgress} />
          )}
          {videoStatus === "error" && <ErrorScreen key="error" />}
        </AnimatePresence>

        {/* Text overlay – moved a bit higher with reduced bottom padding */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 sm:pb-20 md:pb-24 lg:pb-28 px-6 md:px-16 lg:px-24 pointer-events-none">
          <AnimatePresence mode="wait">
            {scenes[activeScene] && videoStatus === "ready" && (
              <motion.div
                key={activeScene}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-4xl"
              >
                <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-emerald-300 mb-4 font-sans">
                  Scene {activeScene + 1} of {scenes.length}
                </p>
                <h2 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-['Playfair_Display',_serif] font-extrabold leading-tight text-white mb-3 md:mb-5">
                  {scenes[activeScene].heading}
                  <motion.span
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "40%" }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 font-light mb-4 max-w-2xl">
                  {scenes[activeScene].subtext}
                </p>
                {scenes[activeScene].quote && (
                  <blockquote className="border-l-4 border-emerald-400 pl-5 md:pl-8 italic text-white/70 text-sm md:text-base lg:text-lg">
                    {scenes[activeScene].quote}
                  </blockquote>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* SearchBar – slightly narrower on PC, aligned under text */}
          <div className="pointer-events-auto mt-6 md:mt-8 w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {/* Subtle scroll hint (only if video is playing) */}
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