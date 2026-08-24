"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  DoorOpen,
  CalendarCheck,
  ImageIcon,
  Users,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Anchor,
  Home,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Rooms", icon: DoorOpen },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/rooms/new", label: "Add Room", icon: PlusCircle },
];

export default function AdminSidebar({
  isOpen: parentIsOpen,
  onClose: parentOnClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
} = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const pathname = usePathname();

  const isOpen = parentIsOpen !== undefined ? parentIsOpen : internalOpen;
  const closeSidebar = parentOnClose || (() => setInternalOpen(false));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-white/90 to-sky-50/80 backdrop-blur-xl border-r border-sky-100/40 shadow-xl shadow-sky-100/30 text-slate-700">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-700 via-sky-500 to-sky-400 rounded-b-full" />

      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-sky-100/50">
        <Link href="/admin" className="flex items-center gap-2 group" onClick={closeSidebar}>
          <motion.div
            whileHover={{ rotate: 12 }}
            className="relative text-sky-600"
          >
            <Anchor className="w-6 h-6" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-sky-400 rounded-full animate-ping" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-sky-800 to-sky-500 bg-clip-text text-transparent">
            Zain's Serenity
          </span>
        </Link>
        <button
          className="lg:hidden text-slate-400 hover:text-sky-600 transition"
          onClick={closeSidebar}
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                active
                  ? "bg-gradient-to-r from-sky-600/10 to-sky-400/10 text-sky-800 font-semibold shadow-inner"
                  : "hover:bg-sky-50/60 text-slate-600 hover:text-sky-700"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`p-1 rounded-lg transition-colors ${
                  active ? "bg-sky-100" : "bg-transparent group-hover:bg-sky-50"
                }`}
              >
                <item.icon size={20} />
              </motion.div>
              <span className="text-sm">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="adminActive"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-sky-600 to-sky-400 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sky-100/50 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-all"
        >
          <Home size={18} />
          <span className="text-sm">Go to Site</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900 z-40 lg:hidden backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "tween", duration: 0.25 }}
        className="fixed top-0 left-0 z-50 w-72 h-full lg:hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}