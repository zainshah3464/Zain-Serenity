"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronDown,
  LogOut,
  Anchor,
  Clock,
  CalendarCheck,
  AlertCircle,
  ChevronRight,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NotificationItem {
  _id: string;
  type: "booking_pending" | "checkin_today";
  guestName: string;
  roomName: string;
  checkIn: string;
}

export default function AdminTopbar({
  user,
  onToggleSidebar,
}: {
  user: any;
  onToggleSidebar?: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/admin/dashboard?range=7d");
        if (!res.ok) return;
        const data = await res.json();

        const items: NotificationItem[] = [];

        if (data.recentBookings) {
          data.recentBookings
            .filter((b: any) => b.status === "pending")
            .forEach((b: any) => {
              items.push({
                _id: b._id,
                type: "booking_pending",
                guestName: b.guestName,
                roomName: b.roomName,
                checkIn: b.checkIn,
              });
            });
        }

        if (data.todayCheckins && data.todayCheckins > 0) {
          items.push({
            _id: "today-checkins",
            type: "checkin_today",
            guestName: `${data.todayCheckins} guest(s)`,
            roomName: "arriving today",
            checkIn: new Date().toISOString(),
          });
        }

        setNotifications(items);
        setUnreadCount(items.length);
      } catch (error) {
        console.error("Notification fetch error:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = currentTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-white/90 via-white/80 to-sky-50/70 backdrop-blur-xl border-b border-sky-100/40 shadow-sm py-3 px-4 md:px-8 flex items-center justify-between">
      {/* Decorative glow left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-700 via-sky-500 to-sky-400 animate-pulse" />

      {/* Left section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-sky-700 hover:bg-sky-50 transition"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative"
        >
          <Anchor className="text-sky-600 w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-sky-400 rounded-full animate-ping" />
        </motion.div>

        <div className="flex flex-col sm:flex-row sm:items-baseline">
          <span className="text-xs sm:text-lg font-bold bg-gradient-to-r from-sky-800 to-sky-500 bg-clip-text text-transparent whitespace-nowrap">
            Zain's Serenity
          </span>
          <span className="text-[10px] sm:text-sm text-slate-400 sm:ml-1">· Admin</span>
        </div>

        <div className="flex items-center gap-1 text-slate-500 border-l border-slate-200 pl-2 sm:pl-3 ml-1">
          <Clock size={13} className="sm:w-4 sm:h-4 text-sky-500" />
          <span className="text-[10px] sm:text-xs font-medium tabular-nums">
            {dateString} · {timeString}
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-slate-600 hover:text-sky-700 p-1.5 sm:p-2 rounded-full bg-white/70 backdrop-blur-sm border border-sky-100/60 transition hover:bg-sky-50"
          >
            <Bell size={18} className="sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-ping" />
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-sky-100/60 rounded-2xl shadow-xl shadow-sky-100/30 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-sky-100/50 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="text-xs text-sky-700 font-medium">{unreadCount} new</span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500">
                      <Bell size={24} className="mx-auto mb-2 text-slate-300" />
                      All caught up! No new notifications.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <Link
                        key={notif._id}
                        href={
                          notif.type === "booking_pending"
                            ? `/admin/bookings`
                            : `/admin`
                        }
                        onClick={() => setNotifOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-sky-50/60 transition border-b border-sky-100/30 last:border-none"
                      >
                        <div className="mt-0.5">
                          {notif.type === "booking_pending" ? (
                            <AlertCircle size={18} className="text-amber-500" />
                          ) : (
                            <CalendarCheck size={18} className="text-sky-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-800">
                            {notif.type === "booking_pending"
                              ? `${notif.guestName} pending booking`
                              : `Today: ${notif.guestName}`}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {notif.type === "booking_pending"
                              ? `${notif.roomName} · check‑in ${new Date(
                                  notif.checkIn
                                ).toLocaleDateString()}`
                              : "Check‑ins today"}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 mt-1" />
                      </Link>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <Link
                    href="/admin/bookings"
                    onClick={() => setNotifOpen(false)}
                    className="block text-center text-xs text-sky-700 font-medium py-2 border-t border-sky-100/50 hover:bg-sky-50/60 transition"
                  >
                    View all bookings
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-1.5 sm:gap-2 bg-white/70 backdrop-blur-sm border border-sky-100/60 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-white/90 transition shadow-sm"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-sky-600 to-sky-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-inner">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
            </div>
            <span className="text-xs sm:text-sm text-slate-700 hidden sm:inline font-medium max-w-[80px] truncate">
              {user?.name || user?.email?.split("@")[0]}
            </span>
            <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 sm:w-56 bg-white/95 backdrop-blur-xl border border-sky-100/60 rounded-2xl shadow-xl shadow-sky-100/30 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-sky-100/50">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <Link
                  href="/admin"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-slate-700 hover:bg-red-50 hover:text-red-500 transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}