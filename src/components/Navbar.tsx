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

/* ── Motion link for animations with Next.js Link ── */
const MotionLink = motion(Link);

/* ────────────────────────────────────
   Navigation links
   ──────────────────────────────────── */
const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rooms", label: "Rooms", icon: BedDouble },
  { href: "/gallery", label: "Gallery", icon: Camera },
  { href: "/about", label: "About", icon: Star },
  { href: "/contact", label: "Contact", icon: Phone },
];

/* ────────────────────────────────────
   Palm tree icon
   ──────────────────────────────────── */
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
      <path d="M12 6c-1.5 0-3 .6-4.2 1.8C6.6 9 6 11 6 12s.6 3 1.8 4.2C9 17.4 10.5 18 12 18" />
    </svg>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* ─── Scroll detection ─── */
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

  /* ─── Navbar position: absolute (hero) / fixed (normal) ─── */
  const positionClass = isHero ? "absolute" : "fixed";
  const headerClasses = `${positionClass} top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
    isHero
      ? "bg-transparent border-b border-transparent py-4 md:py-5"
      : "bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-sm py-2.5 md:py-3 min-h-[60px]"
  }`;

  return (
    <header className={headerClasses}>
      {/* Custom text shadow for hero readability (dust-style, no box) */}
      <style jsx>{`
        .hero-glow-text {
          text-shadow: 0 2px 8px rgba(0,0,0,0.7), 0 0 12px rgba(0,0,0,0.5);
        }
      `}</style>

      <div className="px-6 md:px-16 lg:px-24 flex items-center justify-between h-full">
        {/* ───── LOGO ───── */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            className="flex items-center gap-1.5"
          >
            <PalmTreeIcon
              className={`transition-colors duration-300 ${
                isHero
                  ? "w-7 h-7 text-emerald-300"
                  : "w-6 h-6 text-teal-600"
              }`}
            />
            <span
              className={`font-black tracking-tight transition-colors duration-300 ${
                isHero
                  ? "text-3xl md:text-4xl text-white drop-shadow-lg"
                  : "text-2xl md:text-3xl text-gray-800"
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Serenity
            </span>
          </motion.div>
        </Link>

        {/* ───── DESKTOP CENTER LINKS (only when NOT hero) ───── */}
        {!isHero && (
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.slice(1, 5).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-gray-700 hover:text-teal-600 transition font-medium text-sm uppercase tracking-wider ${
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

        {/* ───── DESKTOP RIGHT ───── */}
        <div className="hidden md:flex items-center gap-3">
          {isHero ? (
            /* ── HERO RIGHT (desktop) ── */
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
                    className="flex items-center gap-3 group"
                  >
                    <motion.div
                      className="relative w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(255,255,255,0.4)",
                          "0 0 0 8px rgba(255,255,255,0)",
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
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href="/my-bookings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition"
                        >
                          <Calendar size={18} /> My Bookings
                        </Link>
                        {session.user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition"
                          >
                            <Star size={18} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: "/" });
                            setProfileOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <MotionLink
                    href="/login"
                    whileHover={{ scale: 1.05, textShadow: "0 0 8px rgba(255,255,255,0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white/90 text-sm font-semibold tracking-wider hover:text-white transition-all duration-300 hero-glow-text"
                  >
                    Login
                  </MotionLink>
                  <MotionLink
                    href="/register"
                    whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(45,212,191,0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 rounded-full text-sm font-bold tracking-wider bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20 transition-all duration-300 hero-glow-text"
                  >
                    Register
                  </MotionLink>
                </div>
              )}

              <div className="flex flex-col items-end gap-5">
                {navLinks.slice(1, 5).map((link, index) => (
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
            /* ---- Non‑hero desktop auth buttons ---- */
            <>
              {session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/30 text-gray-700 hover:bg-white/10 transition-colors"
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
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href="/my-bookings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition"
                        >
                          <Calendar size={18} /> My Bookings
                        </Link>
                        {session.user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition"
                          >
                            <Star size={18} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: "/" });
                            setProfileOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition"
                        >
                          <LogOut size={18} /> Logout
                        </button>
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
                    className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 shadow-md transition-all"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* ───── MOBILE RIGHT (enhanced hero avatar with glow) ───── */}
        <div className="flex md:hidden items-center gap-2">
          {isHero ? (
            <div className="flex flex-col items-end gap-2">
              {session?.user ? (
                <div className="relative">
                  {/* ✨ Mobile hero avatar with glow + pulse ✨ */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="relative w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 ring-2 ring-white/40 ring-offset-2 ring-offset-transparent"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(255,255,255,0.4)",
                          "0 0 0 8px rgba(255,255,255,0)",
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
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href="/my-bookings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition"
                        >
                          <Calendar size={18} /> My Bookings
                        </Link>
                        {session.user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition"
                          >
                            <Star size={18} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: "/" });
                            setProfileOpen(false);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="text-white/90 hover:text-white p-1" aria-label="Login">
                  <User size={20} />
                </Link>
              )}

              {navLinks.slice(1, 5).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                  <link.icon size={20} />
                </Link>
              ))}
            </div>
          ) : (
            /* Non‑hero mobile (unchanged) */
            <>
              <Link
                href="/"
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Home size={20} />
              </Link>
              <Link
                href="/rooms"
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <BedDouble size={20} />
              </Link>
              <Link
                href="/my-bookings"
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Calendar size={20} />
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
                  className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={20} />
                </Link>
              )}
              <AnimatePresence>
                {profileOpen && session?.user && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-4 top-16 w-56 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href="/my-bookings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition"
                    >
                      <Calendar size={18} /> My Bookings
                    </Link>
                    {session.user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition"
                      >
                        <Star size={18} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 transition"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-gray-700 hover:bg-white/10 transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X size={22} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu size={22} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ───── MOBILE FULLSCREEN MENU (only non‑hero) ───── */}
      <AnimatePresence>
        {mobileMenuOpen && !isHero && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/30 bg-white/80 backdrop-blur-xl"
          >
            <div className="px-6 py-6 space-y-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 text-lg font-medium transition-colors ${
                    pathname === link.href ? "text-teal-600" : "text-gray-700 hover:text-teal-600"
                  }`}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/20" />
              {session?.user ? (
                <>
                  <Link
                    href="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-gray-700"
                  >
                    <BookOpen size={20} /> My Bookings
                  </Link>
                  {session.user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium text-gray-700"
                    >
                      <Shield size={20} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-lg font-medium text-red-400"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center border border-teal-600 text-teal-600 py-3 rounded-full font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center bg-teal-600 text-white py-3 rounded-full font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}