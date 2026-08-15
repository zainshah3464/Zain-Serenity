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

  // Use external state if provided, otherwise fall back to internal
  const isOpen = parentIsOpen !== undefined ? parentIsOpen : internalOpen;
  const closeSidebar = parentOnClose || (() => setInternalOpen(false));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-teal-100/60 shadow-sm text-gray-700">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-teal-50">
        <Link href="/admin" className="flex items-center gap-2 group" onClick={closeSidebar}>
          <motion.div whileHover={{ rotate: 12 }} className="text-teal-600">
            <Anchor className="w-6 h-6" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">
            Zain’s Serenity
          </span>
        </Link>
        <button
          className="lg:hidden text-gray-400 hover:text-teal-600 transition"
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
                  ? "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-700 font-semibold"
                  : "hover:bg-teal-50/50 text-gray-600 hover:text-teal-600"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`p-1 rounded-lg ${active ? "bg-teal-100" : "bg-transparent"}`}
              >
                <item.icon size={20} />
              </motion.div>
              <span className="text-sm">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="adminActive"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-teal-100/50 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all"
        >
          <Home size={18} />
          <span className="text-sm">Go to Site</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all"
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
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 lg:hidden backdrop-blur-sm"
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

      {/* ❌ Removed the floating mobile menu button */}
    </>
  );
}