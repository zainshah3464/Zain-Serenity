"use client";

import React, { useEffect, useState, Children, isValidElement } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface DashboardEntryAnimationProps {
  children: React.ReactNode;
}

/**
 * ADVANCED DASHBOARD ENTRY ANIMATION (White Theme + Ocean Accents)
 * - Overlay stays within the page container but now has fixed viewport height.
 * - Central content aligned to top, so it's immediately visible without scrolling.
 * - Enhanced with wave layers, bubbles, fish, and a water fill progress.
 * - Content reveal uses a true stagger on each direct child.
 */
export default function DashboardEntryAnimation({
  children,
}: DashboardEntryAnimationProps) {
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOverlayVisible(false);
      setContentReady(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // ---------- Overlay Variants ----------
  const overlayVariants: Variants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const overlayContentVariants: Variants = {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 15, delay: 0.2 },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      y: -20,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  // ---------- Content Stagger Container ----------
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
        when: "beforeChildren",
      },
    },
  };

  // ---------- Individual Child Variants for Stagger ----------
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // ---------- Waves Data ----------
  const waves = [
    {
      d: "M0,160 C240,220 480,100 720,160 C960,220 1200,100 1440,160 L1440,320 L0,320 Z",
      fill: "rgba(0,168,204,0.35)",
      height: "h-24 md:h-32",
      duration: 18,
    },
    {
      d: "M0,220 C180,260 360,100 720,220 C1080,340 1260,160 1440,220 L1440,320 L0,320 Z",
      fill: "rgba(2,43,58,0.2)",
      height: "h-16 md:h-24",
      duration: 14,
    },
    {
      d: "M0,280 C300,240 600,320 900,280 C1200,240 1320,300 1440,280 L1440,320 L0,320 Z",
      fill: "rgba(5,102,141,0.15)",
      height: "h-10 md:h-16",
      duration: 22,
    },
  ];

  const bubbles = Array.from({ length: 20 }).map((_, i) => ({
    left: `${(i * 37) % 100}%`,
    size: (i % 4) + 2,
    delay: i * 0.2,
    duration: 5 + (i % 5),
    drift: i % 2 === 0 ? 20 : -20,
    opacity: 0.3 + (i % 3) * 0.08,
  }));

  // Helper to wrap each child with itemVariants
  const renderChildrenWithAnimation = () => {
    return Children.map(children, (child, index) => {
      if (!isValidElement(child)) return child;
      return (
        <motion.div
          key={`entry-child-${index}`}
          variants={itemVariants}
          className="w-full"
        >
          {child}
        </motion.div>
      );
    });
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* ========== PAGE‑CONTAINED OCEAN OVERLAY ========== */}
      <AnimatePresence>
        {overlayVisible && (
          <motion.div
            key="ocean-overlay"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-0 left-0 w-full h-screen z-50 flex items-start justify-center pt-20 sm:pt-28 overflow-hidden bg-gradient-to-b from-[#e0f2fe] via-[#f0f9ff] to-[#dbeafe] rounded-3xl shadow-inner"
          >
            {/* Light caustic overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 40%, rgba(0,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,200,255,0.12) 0%, transparent 55%), radial-gradient(circle at 50% 20%, rgba(255,255,255,0.5) 0%, transparent 40%)",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                scale: [1, 1.1, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* God rays – more visible */}
            <motion.div
              className="absolute top-0 left-[12%] w-4 h-[70vh] bg-gradient-to-b from-cyan-200/80 via-cyan-100/40 to-transparent blur-2xl rotate-12 pointer-events-none"
              animate={{ opacity: [0.5, 0.9, 0.5], x: [-30, 30, -30] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-0 left-[45%] w-5 h-[80vh] bg-gradient-to-b from-teal-200/80 via-teal-100/40 to-transparent blur-2xl rotate-[-10deg] pointer-events-none"
              animate={{ opacity: [0.5, 0.9, 0.5], x: [25, -25, 25] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute top-0 right-[8%] w-3 h-[60vh] bg-gradient-to-b from-sky-200/80 via-sky-100/40 to-transparent blur-2xl rotate-6 pointer-events-none"
              animate={{ opacity: [0.45, 0.8, 0.45], x: [-40, 15, -40] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Animated ocean waves – visible */}
            {waves.map((wave, idx) => (
              <motion.div
                key={`wave-${idx}`}
                className={`absolute bottom-0 left-0 w-[200%] ${wave.height} flex pointer-events-none`}
                animate={{ x: idx % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{ duration: wave.duration, repeat: Infinity, ease: "linear" }}
              >
                {[0, 1].map((i) => (
                  <svg
                    key={i}
                    className="w-1/2 h-full"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                  >
                    <path fill={wave.fill} d={wave.d} />
                  </svg>
                ))}
              </motion.div>
            ))}

            {/* Floating bubbles */}
            {bubbles.map((bubble, i) => (
              <motion.span
                key={`bubble-${i}`}
                className="absolute bottom-10 rounded-full bg-cyan-300/60 pointer-events-none"
                style={{
                  left: bubble.left,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  opacity: bubble.opacity,
                }}
                animate={{
                  y: [0, -300],
                  x: [0, bubble.drift],
                  opacity: [0, 0.8, 0],
                  scale: [0.8, 1.4, 0.8],
                }}
                transition={{
                  duration: bubble.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bubble.delay,
                }}
              />
            ))}

            {/* Swimming fish */}
            {[0, 1, 2].map((i) => (
              <motion.svg
                key={`fish-${i}`}
                className="absolute pointer-events-none"
                style={{ top: `${12 + i * 20}%`, width: 20, height: 10 }}
                viewBox="0 0 24 12"
                fill="none"
                animate={{
                  x: ["-10vw", "110vw"],
                  y: [0, i % 2 === 0 ? 15 : -15, 0],
                }}
                transition={{
                  duration: 14 + i * 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 3,
                }}
              >
                <g fill="rgba(125,211,252,0.7)" stroke="rgba(186,230,253,0.9)" strokeWidth="0.6">
                  <ellipse cx="9" cy="6" rx="6" ry="3.5" />
                  <path d="M15 6 L22 2 L22 10 Z" />
                  <circle cx="7" cy="5.5" r="0.6" fill="white" stroke="none" />
                </g>
              </motion.svg>
            ))}

            {/* Central rotating emblem – now aligned to top */}
            <motion.div
              variants={overlayContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                className="relative w-32 h-32 md:w-40 md:h-40 mb-5"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(0,168,204,0.6)"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="rgba(0,168,204,0.5)"
                    strokeWidth="0.5"
                  />
                  <g transform="translate(50,50)">
                    <circle cx="0" cy="-8" r="3" fill="#0E7490" />
                    <path
                      d="M-5 -5 L5 -5 M0 10 L0 -5 M-8 4 L8 4"
                      stroke="#0E7490"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-12 8 C-10 12 -6 14 0 14 C6 14 10 12 12 8"
                      stroke="#0E7490"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </motion.div>

              <motion.h2
                className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-wide drop-shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Zain’s Serenity
              </motion.h2>
              <motion.p
                className="mt-2 text-xs md:text-sm text-cyan-700 tracking-[0.3em] uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Loading Admin Panel
                <motion.span
                  className="inline-block"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.5, 1] }}
                >
                  ...
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Water fill progress bar */}
            <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== MAIN CONTENT WITH STAGGER REVEAL ========== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={contentReady ? "visible" : "hidden"}
        className="w-full"
      >
        {renderChildrenWithAnimation()}
      </motion.div>
    </div>
  );
}