"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion } from "framer-motion";
import { Anchor } from "lucide-react";
import { ShieldCheck } from "lucide-react"; 
// ──────────────────────────────────────
//  Ocean-themed Admin Loading Screen
// ──────────────────────────────────────
function AdminLoadingScreen() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden bg-gradient-to-b from-[#022B3A] via-[#05668D] to-[#00A8CC] select-none">
      {/* Caustic light overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 30% 40%, rgba(0,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,200,255,0.35) 0%, transparent 55%), radial-gradient(circle at 50% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* God rays */}
      <motion.div
        className="absolute top-0 left-[12%] w-4 h-[70vh] bg-gradient-to-b from-cyan-200/60 via-cyan-300/20 to-transparent blur-2xl rotate-12 pointer-events-none mix-blend-screen"
        animate={{ opacity: [0.3, 0.7, 0.3], x: [-30, 30, -30] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-0 left-[45%] w-5 h-[80vh] bg-gradient-to-b from-teal-200/60 via-teal-300/20 to-transparent blur-2xl rotate-[-10deg] pointer-events-none mix-blend-screen"
        animate={{ opacity: [0.35, 0.8, 0.35], x: [25, -25, 25] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-0 right-[8%] w-3 h-[60vh] bg-gradient-to-b from-sky-200/60 via-sky-300/20 to-transparent blur-2xl rotate-6 pointer-events-none mix-blend-screen"
        animate={{ opacity: [0.25, 0.6, 0.25], x: [-40, 15, -40] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Bottom ocean waves - layer 1 */}
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-32 md:h-40 flex pointer-events-none"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((i) => (
          <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(103,232,249,0.2)" d="M0,160 C240,220 480,100 720,160 C960,220 1200,100 1440,160 L1440,320 L0,320 Z" />
          </svg>
        ))}
      </motion.div>

      {/* Bottom ocean waves - layer 2 */}
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-24 md:h-32 flex pointer-events-none"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((i) => (
          <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(56,189,248,0.15)" d="M0,220 C180,260 360,100 720,220 C1080,340 1260,160 1440,220 L1440,320 L0,320 Z" />
          </svg>
        ))}
      </motion.div>

      {/* Bottom ocean waves - layer 3 */}
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-16 md:h-24 flex pointer-events-none"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((i) => (
          <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(14,165,233,0.1)" d="M0,280 C300,240 600,320 900,280 C1200,240 1320,300 1440,280 L1440,320 L0,320 Z" />
          </svg>
        ))}
      </motion.div>

      {/* Floating bubbles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute bottom-8 rounded-full bg-cyan-100/50 pointer-events-none"
          style={{
            left: `${(i * 53) % 100}%`,
            width: `${(i % 3) + 1}px`,
            height: `${(i % 3) + 1}px`,
          }}
          animate={{
            y: [0, -260],
            x: [0, i % 2 === 0 ? 18 : -18],
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: 5 + (i % 6),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}

      {/* Swimming fish */}
      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          className="absolute pointer-events-none"
          style={{ top: `${12 + i * 20}%`, width: 18, height: 9 }}
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
          <g fill="rgba(125,211,252,0.4)" stroke="rgba(224,242,254,0.8)" strokeWidth="0.6">
            <ellipse cx="9" cy="6" rx="6" ry="3.5" />
            <path d="M15 6 L22 2 L22 10 Z" />
            <circle cx="7" cy="5.5" r="0.6" fill="white" stroke="none" />
          </g>
        </motion.svg>
      ))}

      {/* Central loader with shield icon */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative w-36 h-36 md:w-44 md:h-44 mb-5">
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-300/30 blur-xl pointer-events-none"
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" className="relative z-10">
            <defs>
              <clipPath id="adminLoaderClip">
                <circle cx="50" cy="50" r="42" />
              </clipPath>
              <linearGradient id="adminWaterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#22D3EE" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0E7490" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            <g clipPath="url(#adminLoaderClip)">
              <g>
                <animateTransform attributeName="transform" type="translate" from="0 0" to="-100 0" dur="4s" repeatCount="indefinite" />
                <path d="M0 65 Q 12 60 25 65 T50 65 T75 65 T100 65 L100 100 L0 100 Z" fill="url(#adminWaterGrad)" />
                <path d="M100 65 Q112 60 125 65 T150 65 T175 65 T200 65 L200 100 L100 100 Z" fill="url(#adminWaterGrad)" />
              </g>
              <g>
                <animateTransform attributeName="transform" type="translate" from="0 0" to="-50 0" dur="7s" repeatCount="indefinite" />
                <path d="M0 70 Q 6 67 12 70 T24 70 T36 70 T48 70 T60 70 L60 100 L0 100 Z" fill="rgba(255,255,255,0.12)" />
              </g>
            </g>

            <circle cx="50" cy="50" r="47" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4 6" fill="none">
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" fill="rgba(255,255,255,0.06)" />
            <circle cx="50" cy="50" r="39" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />

            <motion.g
              transform="translate(50,50)"
              animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShieldCheck className="w-14 h-14 text-white" strokeWidth={1.5} />
            </motion.g>
          </svg>
        </div>

        <motion.h2
          className="text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Admin Panel
        </motion.h2>
        <motion.p
          className="mt-2 text-xs md:text-sm text-cyan-100 tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          Preparing your dashboard
          <motion.span
            className="inline-block"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.5, 1] }}
          >
            ...
          </motion.span>
        </motion.p>

        <div className="flex gap-2 mt-4">
          {["Auth", "DB", "Modules"].map((label, i) => (
            <motion.span
              key={label}
              className="text-[10px] font-medium uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2 py-0.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 0.5], y: 0 }}
              transition={{
                repeat: Infinity,
                duration: 3,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            >
              {label}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
// ──────────────────────────────────────
//  Main layout – with custom metadata for admin
// ──────────────────────────────────────
export default function PrivateAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (isDesktop) setSidebarOpen(true);
    else setSidebarOpen(false);
  }, [isDesktop]);

  if (status === "loading") {
    return <AdminLoadingScreen />;
  }

  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <>
      {/* ───── Custom metadata for Admin Panel ───── */}
      <title>Admin Panel | Zain's Serenity</title>
      <meta
        name="description"
        content="Admin dashboard for Zain's Serenity – manage bookings, users, gallery and more."
      />

      <div className="flex h-screen bg-gradient-to-br from-stone-50 via-white to-teal-50/20">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminTopbar
            user={session.user}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </>
  );
}