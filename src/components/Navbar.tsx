"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Menu, X, ChevronDown, User, LogOut, Calendar,
  Home, BedDouble, Camera, Phone, BookOpen, Star, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHeroLoading } from "./HeroLoadingContext";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], display: "swap" });

const MotionLink = motion(Link);

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rooms", label: "Rooms", icon: BedDouble },
  { href: "/gallery", label: "Gallery", icon: Camera },
  { href: "/about", label: "About", icon: Star },
  { href: "/contact", label: "Contact", icon: Phone },
];

function PalmTreeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2c-2.5 0-5 1-6.5 3C4 7 3 9 3 12c0 2 1 4 2.5 5.5C7 19 9 20 12 20s5-1 6.5-2.5C20 16 21 14 21 12c0-3-1-5-2.5-7C17 3 14.5 2 12 2z" />
      <path d="M12 6c-1.5 0-3 .6-4.2 1.8C6.6 9 6 12 6 12s.6 3 1.8 4.2C9 17.4 10.5 18 12 18" />
    </svg>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isHeroLoading } = useHeroLoading();

  const isHomePage = pathname === "/";
  const [isHero, setIsHero] = useState(true);

  const handleScroll = useCallback(() => {
    if (!isHomePage) return;
    const heroThreshold = window.innerHeight * 0.8;
    setIsHero(window.scrollY < heroThreshold);
  }, [isHomePage]);

  useEffect(() => {
    if (isHomePage) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsHero(false);
    }
  }, [isHomePage, handleScroll]);

  useEffect(() => {
    const onResize = () => setMobileMenuOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getUserInitial = () => {
    if (session?.user?.name) return session.user.name.charAt(0).toUpperCase();
    if (session?.user?.email) return session.user.email.charAt(0).toUpperCase();
    return "U";
  };

  const positionClass = isHero ? "absolute" : "fixed";
  const headerClasses = `${positionClass} top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
    isHero
      ? "bg-transparent border-b border-transparent pt-2 md:pt-8 pb-3 md:pb-5"
      : "bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-sm py-2 md:py-2.5 min-h-[56px]"
  }`;

  if (isHomePage && isHeroLoading) {
    return null;
  }

  return (
    <header className={headerClasses}>
      <style jsx>{`
        .hero-glow-text {
          text-shadow: 0 2px 8px rgba(0,0,0,0.7), 0 0 12px rgba(0,0,0,0.5);
        }
      `}</style>

      <div className="px-4 md:px-10 lg:px-16 flex items-start justify-between h-full">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-1.5 group shrink-0 pt-1">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            className="flex items-center gap-1"
          >
            <PalmTreeIcon
              className={`transition-colors duration-300 ${
                isHero
                  ? "w-6 h-6 md:w-7 md:h-7 text-emerald-300"
                  : "w-6 h-6 text-teal-600"
              }`}
            />
            <span
              className={`${greatVibes.className} font-bold tracking-tight transition-colors duration-300 ${
                isHero
                  ? "text-2xl md:text-3xl text-white drop-shadow-lg"
                  : "text-xl md:text-2xl text-gray-800"
              }`}
            >
              Serenity
            </span>
          </motion.div>
        </Link>

        {/* DESKTOP CENTER LINKS (only when NOT hero) */}
        {!isHero && (
          <div className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            {navLinks.slice(1, 5).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-gray-700 hover:text-teal-600 transition font-medium text-xs uppercase tracking-wider ${
                    isActive ? "text-teal-600" : ""
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-500 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-start gap-2">
          {isHero ? (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-end gap-6"
            >
              {session?.user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 group"
                  >
                    <motion.div
                      className="relative w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(255,255,255,0.4)",
                          "0 0 0 6px rgba(255,255,255,0)",
                        ],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 ring-2 ring-white/40 ring-offset-2 ring-offset-transparent" />
                      <span className="relative z-10 text-base font-semibold">
                        {getUserInitial()}
                      </span>
                    </motion.div>
                    <span className="text-sm font-medium text-white/90 hidden lg:inline tracking-wide hero-glow-text">
                      {session.user.email || session.user.name}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-black/5 ring-1 ring-black/5 overflow-hidden z-50"
                      >
                        <div className="px-5 py-4 bg-gradient-to-br from-teal-50 to-white border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/my-bookings"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          >
                            <Calendar size={16} className="text-teal-600" /> My Bookings
                          </Link>
                          {session.user.role === "admin" && (
                            <Link
                              href="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                            >
                              <Star size={16} className="text-teal-600" /> Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              signOut({ callbackUrl: "/" });
                              setProfileOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <LogOut size={16} className="text-red-500" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <MotionLink
                    href="/login"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white/90 text-sm font-semibold tracking-wider hover:text-white transition-all duration-300 hero-glow-text"
                  >
                    Login
                  </MotionLink>
                  <MotionLink
                    href="/register"
                    whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(45,212,191,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 rounded-full text-sm font-bold tracking-wider bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20 transition-all duration-300 hero-glow-text"
                  >
                    Register
                  </MotionLink>
                </div>
              )}

              {/* Vertical nav links (old style) */}
              <div className="flex flex-col items-end gap-5">
                {navLinks.slice(1, 5).map((link) => (
                  <MotionLink
                    key={link.href}
                    href={link.href}
                    whileHover={{ x: -4 }}
                    whileTap={{ x: 0 }}
                    className="group relative text-white/90 text-sm font-semibold uppercase tracking-[0.2em] hover:text-white transition-colors duration-300 hero-glow-text"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
                  </MotionLink>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              {session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/30 text-gray-700 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-semibold">
                      {getUserInitial()}
                    </div>
                    <span className="text-sm hidden lg:inline font-medium">
                      {session.user.name || session.user.email?.split("@")[0]}
                    </span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-black/5 ring-1 ring-black/5 overflow-hidden z-50"
                      >
                        <div className="px-5 py-4 bg-gradient-to-br from-teal-50 to-white border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/my-bookings"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          >
                            <Calendar size={16} className="text-teal-600" /> My Bookings
                          </Link>
                          {session.user.role === "admin" && (
                            <Link
                              href="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                            >
                              <Star size={16} className="text-teal-600" /> Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              signOut({ callbackUrl: "/" });
                              setProfileOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <LogOut size={16} className="text-red-500" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-teal-600 font-medium text-sm transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 shadow-md transition-all"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* MOBILE RIGHT */}
        <div className="flex md:hidden items-center gap-1.5">
          {isHero ? (
            <div className="flex items-center gap-2">
              {session?.user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="relative w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 ring-2 ring-white/40 ring-offset-2 ring-offset-transparent"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(255,255,255,0.4)",
                          "0 0 0 6px rgba(255,255,255,0)",
                        ],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="relative z-10 text-base font-semibold">
                      {getUserInitial()}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-black/5 ring-1 ring-black/5 overflow-hidden z-50"
                      >
                        <div className="px-5 py-4 bg-gradient-to-br from-teal-50 to-white border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {session.user.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/my-bookings"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          >
                            <Calendar size={16} className="text-teal-600" /> My Bookings
                          </Link>
                          {session.user.role === "admin" && (
                            <Link
                              href="/admin"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                            >
                              <Star size={16} className="text-teal-600" /> Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              signOut({ callbackUrl: "/" });
                              setProfileOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <LogOut size={16} className="text-red-500" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-white/90 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
                  aria-label="Login"
                >
                  <User size={20} />
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-9 h-9 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X size={20} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/"
                className="p-1.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Home size={18} />
              </Link>
              <Link
                href="/rooms"
                className="p-1.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <BedDouble size={18} />
              </Link>
              <Link
                href="/my-bookings"
                className="p-1.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Calendar size={18} />
              </Link>
              {session?.user ? (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-semibold hover:bg-teal-200 transition-colors"
                >
                  {getUserInitial()}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="p-1.5 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={18} />
                </Link>
              )}
              <AnimatePresence>
                {profileOpen && session?.user && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-4 top-16 w-64 bg-white rounded-2xl shadow-2xl shadow-black/5 ring-1 ring-black/5 overflow-hidden z-50"
                  >
                    <div className="px-5 py-4 bg-gradient-to-br from-teal-50 to-white border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {session.user.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/my-bookings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        <Calendar size={16} className="text-teal-600" /> My Bookings
                      </Link>
                      {session.user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                          <Star size={16} className="text-teal-600" /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          setProfileOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut size={16} className="text-red-500" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-9 h-9 flex items-center justify-center rounded-full border border-white/20 text-gray-700 hover:bg-white/10 transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X size={18} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu size={18} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </>
          )}
        </div>
      </div>

      {/* MOBILE FULLSCREEN MENU (only non‑hero) */}
      <AnimatePresence>
        {mobileMenuOpen && !isHero && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/5 rounded-b-3xl border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                  }`}
                >
                  <link.icon size={20} className={pathname === link.href ? "text-teal-600" : "text-gray-400"} />
                  {link.label}
                </Link>
              ))}
              <div className="my-2 border-t border-gray-100" />
              {session?.user ? (
                <>
                  <Link
                    href="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                  >
                    <BookOpen size={20} className="text-gray-400" /> My Bookings
                  </Link>
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                    >
                      <Shield size={20} className="text-gray-400" /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={20} className="text-red-400" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center border border-teal-600 text-teal-600 py-3 rounded-full font-semibold hover:bg-teal-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center bg-teal-600 text-white py-3 rounded-full font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE HERO MENU (transparent, right side, icons only) */}
      <AnimatePresence>
        {mobileMenuOpen && isHero && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-20 z-50 flex flex-col items-end gap-5 bg-transparent"
          >
            {navLinks.slice(1, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
                aria-label={link.label}
              >
                <link.icon size={22} />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}