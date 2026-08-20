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
//  Professional loading screen
// ──────────────────────────────────────
function AdminLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-white to-teal-50 relative overflow-hidden">
      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #0f766e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating background particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-teal-400/40 pointer-events-none"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
          }}
          animate={{
            y: [0, -30],
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}

      {/* Main card with animated conic border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative p-[1.5px] rounded-3xl overflow-hidden"
      >
        {/* Rotating conic gradient border */}
        <motion.div
          className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,#14b8a6_15%,#22d3ee_30%,#10b981_45%,transparent_60%,transparent_100%)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />

        {/* Inner card */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-[calc(1.5rem-1.5px)] p-8 w-80 md:w-96 flex flex-col items-center">
          {/* Icon container with multiple layers */}
          <div className="relative w-20 h-20 mb-6">
            {/* Outer conic ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#14b8a6,#22d3ee,#10b981,#14b8a6)]"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <div className="absolute inset-[3px] rounded-full bg-white" />
            </motion.div>

            {/* Inner dashed ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-dashed border-teal-300/70"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            />

            {/* Orbiting dots */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute top-0 left-1/2 w-1.5 h-1.5 -ml-0.75 rounded-full bg-teal-500"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + i * 0.7,
                  ease: "linear",
                  delay: i * 0.4,
                }}
                style={{ transformOrigin: "50% 40px" }}
              />
            ))}

            {/* Core icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-200/50">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent mb-2 text-center"
          >
            Admin Panel
          </motion.h2>

          {/* Subtitle with animated dots */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-500 mb-8 text-center flex items-center gap-1"
          >
            Preparing your dashboard
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.5, 1] }}
            >
              ...
            </motion.span>
          </motion.p>

          {/* Shimmer progress bar */}
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-[length:200%_100%] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            />
          </div>

          {/* Small loading steps */}
          <div className="flex gap-2 mt-4">
            {["Auth", "DB", "Modules"].map((label, i) => (
              <motion.span
                key={label}
                className="text-[10px] font-medium uppercase tracking-wider text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-2 py-0.5"
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