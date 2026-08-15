"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion } from "framer-motion";
import { Anchor } from "lucide-react";

// ──────────────────────────────────────
//  Professional loading screen
// ──────────────────────────────────────
function AdminLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-white to-teal-50/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-80 md:w-96 p-8 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl flex flex-col items-center"
      >
        {/* Floating glow behind icon */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-400/20 via-transparent to-emerald-400/20"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />

        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="relative z-10 mb-6 w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center shadow-lg"
        >
          <Anchor className="w-8 h-8 text-teal-600" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent mb-2 text-center"
        >
          Admin Panel
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500 mb-8 text-center"
        >
          Preparing your dashboard…
        </motion.p>

        {/* Shimmer progress bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-[length:200%_100%]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ backgroundPosition: "0% 50%" }}
          />
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