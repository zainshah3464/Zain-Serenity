"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  PieChart as PieIcon,
  LineChart,
  TrendingUp,
} from "lucide-react";

const DashboardLoader = () => (
  <div className="relative flex flex-col items-center justify-center py-10 sm:py-16 px-4 overflow-hidden bg-white rounded-3xl shadow-xl min-h-[420px] sm:min-h-[500px] border border-slate-200/60 select-none">
    {/* Subtle caustic light overlay (light) */}
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 30% 40%, rgba(0,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,200,255,0.05) 0%, transparent 55%), radial-gradient(circle at 50% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)",
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        scale: [1, 1.1, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* God rays – very light */}
    <motion.div
      className="absolute top-0 left-[12%] w-4 h-[70vh] bg-gradient-to-b from-cyan-100/60 via-cyan-50/30 to-transparent blur-2xl rotate-12 pointer-events-none"
      animate={{ opacity: [0.4, 0.7, 0.4], x: [-30, 30, -30] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-0 left-[45%] w-5 h-[80vh] bg-gradient-to-b from-teal-100/60 via-teal-50/30 to-transparent blur-2xl rotate-[-10deg] pointer-events-none"
      animate={{ opacity: [0.4, 0.8, 0.4], x: [25, -25, 25] }}
      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    <motion.div
      className="absolute top-0 right-[8%] w-3 h-[60vh] bg-gradient-to-b from-sky-100/60 via-sky-50/30 to-transparent blur-2xl rotate-6 pointer-events-none"
      animate={{ opacity: [0.35, 0.6, 0.35], x: [-40, 15, -40] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />

    {/* Bottom ocean waves – layer 1 */}
    <motion.div
      className="absolute bottom-0 left-0 w-[200%] h-24 sm:h-32 md:h-40 flex pointer-events-none"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
    >
      {[0, 1].map((i) => (
        <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(0,168,204,0.08)" d="M0,160 C240,220 480,100 720,160 C960,220 1200,100 1440,160 L1440,320 L0,320 Z" />
        </svg>
      ))}
    </motion.div>

    {/* Bottom ocean waves – layer 2 */}
    <motion.div
      className="absolute bottom-0 left-0 w-[200%] h-16 sm:h-24 md:h-32 flex pointer-events-none"
      animate={{ x: ["-50%", "0%"] }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    >
      {[0, 1].map((i) => (
        <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(56,189,248,0.05)" d="M0,220 C180,260 360,100 720,220 C1080,340 1260,160 1440,220 L1440,320 L0,320 Z" />
        </svg>
      ))}
    </motion.div>

    {/* Bottom ocean waves – layer 3 */}
    <motion.div
      className="absolute bottom-0 left-0 w-[200%] h-10 sm:h-16 md:h-24 flex pointer-events-none"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {[0, 1].map((i) => (
        <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(14,165,233,0.03)" d="M0,280 C300,240 600,320 900,280 C1200,240 1320,300 1440,280 L1440,320 L0,320 Z" />
        </svg>
      ))}
    </motion.div>

    {/* Floating dashboard icons with micro-interactions */}
    {[
      { Icon: BarChart3, top: "18%", left: "10%", delay: 0.4, size: "w-6 h-6 sm:w-8 sm:h-8", rotate: [0, 10, 0] },
      { Icon: PieIcon, top: "22%", right: "12%", delay: 1.1, size: "w-5 h-5 sm:w-7 sm:h-7", rotate: [0, -8, 0] },
      { Icon: LineChart, bottom: "25%", left: "8%", delay: 1.8, size: "w-6 h-6 sm:w-8 sm:h-8", rotate: [0, 6, 0] },
      { Icon: TrendingUp, bottom: "20%", right: "10%", delay: 2.5, size: "w-5 h-5 sm:w-7 sm:h-7", rotate: [0, -10, 0] },
    ].map(({ Icon, top, right, bottom, left, delay, size, rotate }, i) => (
      <motion.div
        key={i}
        className={`absolute ${size} text-slate-300 pointer-events-none`}
        style={{ top, right, bottom, left }}
        animate={{
          y: [0, -15, 0],
          rotate: rotate,
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 4 + i,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        <Icon className="w-full h-full" />
      </motion.div>
    ))}

    {/* Central loader with analytics icon */}
    <motion.div
      className="relative z-10 flex flex-col items-center"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 mb-4 sm:mb-6">
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-slate-100/80 blur-xl pointer-events-none"
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          className="relative z-10"
        >
          <defs>
            <clipPath id="dashboardLoaderClip">
              <circle cx="50" cy="50" r="42" />
            </clipPath>
            <linearGradient id="dashboardWaterGradLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#22D3EE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0E7490" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Animated water fill inside circle */}
          <g clipPath="url(#dashboardLoaderClip)">
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="-100 0"
                dur="4s"
                repeatCount="indefinite"
              />
              <path
                d="M0 65 Q 12 60 25 65 T50 65 T75 65 T100 65 L100 100 L0 100 Z"
                fill="url(#dashboardWaterGradLight)"
              />
              <path
                d="M100 65 Q112 60 125 65 T150 65 T175 65 T200 65 L200 100 L100 100 Z"
                fill="url(#dashboardWaterGradLight)"
              />
            </g>
            {/* Second slower water surface */}
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="-50 0"
                dur="7s"
                repeatCount="indefinite"
              />
              <path
                d="M0 70 Q 6 67 12 70 T24 70 T36 70 T48 70 T60 70 L60 100 L0 100 Z"
                fill="rgba(255,255,255,0.2)"
              />
            </g>
          </g>

          {/* Outer rotating dashed ring */}
          <circle
            cx="50"
            cy="50"
            r="47"
            stroke="rgba(0,168,204,0.25)"
            strokeWidth="1"
            strokeDasharray="4 6"
            fill="none"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Frame */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="rgba(0,168,204,0.5)"
            strokeWidth="1.5"
            fill="rgba(255,255,255,0.8)"
          />
          <circle
            cx="50"
            cy="50"
            r="39"
            stroke="rgba(0,168,204,0.12)"
            strokeWidth="0.5"
            fill="none"
          />

          {/* Analytics icon with pulse */}
          <motion.g
            transform="translate(50,50)"
            animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M-10 10 L-10 -6 M2 10 L2 -10 M14 10 L14 0"
              stroke="#0E7490"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M-16 -6 L-4 -6 M-4 -10 L8 -10 M8 0 L20 0"
              stroke="#0E7490"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.g>
        </svg>
      </div>

      {/* Loading text */}
      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-wide drop-shadow-sm text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Loading Dashboard
      </motion.h2>
      <motion.p
        className="mt-2 text-xs sm:text-sm text-slate-500 tracking-[0.2em] uppercase text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        Preparing insights
        <motion.span
          className="inline-block ml-1"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.5, 1] }}
        >
          ...
        </motion.span>
      </motion.p>
    </motion.div>

    {/* Underwater skeleton progress bars */}
    <div className="relative z-10 mt-6 sm:mt-8 w-64 space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-1">
          <div className="h-1.5 rounded-full bg-slate-200/50 overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-300/60 via-teal-300/70 to-cyan-300/60 rounded-full relative"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear", delay: i * 0.2 }}
              />
            </motion.div>
          </div>
          <motion.div
            className="flex gap-1"
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
          >
            {[0, 1, 2, 3, 4].map((d) => (
              <span key={d} className="w-1 h-1 rounded-full bg-slate-300/50" />
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardLoader;