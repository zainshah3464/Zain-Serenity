"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackGenerateLead } from "@/lib/ga4"; // ← GA4 tracking import
import {
  Mail,
  User,
  MessageSquare,
  Send,
  MapPin,
  Phone,
  Loader2,
  Anchor,
  Star,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

/* ─────────────────────────────────────
   Contact Page – Ocean Escape (no emoji)
   ───────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Safe window height for SSR
  const [windowHeight, setWindowHeight] = useState(800);
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Unchanged submission logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        // GA4: generate_lead event on successful form submission
        trackGenerateLead({
          form_id: 'contact_form',
          form_name: 'Contact Page Form',
          page_path: '/contact',
        });
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  // Pre‑generate stable bubble positions (no Math.random in render)
  const bubbles = useMemo(
    () =>
      Array.from({ length: 15 }).map(() => ({
        left: `${Math.random() * 100}%`,
        size: 6 + Math.random() * 10,
        delay: Math.random() * 10,
        duration: 6 + Math.random() * 6,
        xDrift: (Math.random() - 0.5) * 100,
      })),
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#ecfdf5] via-white to-[#e0f7f6]">
      {/* ========== Animated Background Ocean ========== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft wave shapes */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="rgba(20, 184, 166, 0.1)"
            animate={{
              d: [
                "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,176C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,208C96,224,192,256,288,245.3C384,235,480,181,576,176C672,171,768,213,864,224C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          />
        </svg>

        {/* Floating bubbles (glass-like circles) */}
        {bubbles.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-teal-400/20 backdrop-blur-sm border border-white/40"
            style={{
              left: b.left,
              bottom: "-5%",
              width: b.size,
              height: b.size,
            }}
            animate={{
              y: [0, -windowHeight * 1.2],
              x: [0, b.xDrift],
              opacity: [0.5, 0],
              scale: [0.6, 1.4],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              delay: b.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Drifting bottle icons (custom SVG) */}
        <motion.div
          className="absolute top-1/4 left-[5%]"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0], x: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        >
          <BottleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-teal-500/40" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-[8%]"
          animate={{ y: [0, 25, 0], rotate: [0, -8, 0], x: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
        >
          <BottleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500/40" />
        </motion.div>
      </div>

      {/* ========== Main Content ========== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28 grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* ---------- Left Column: Heading + Info ---------- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col justify-center space-y-6 sm:space-y-8"
        >
          <div className="text-center md:text-left">
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 shadow-xl mb-4 sm:mb-6"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <BottleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-['Playfair_Display',serif] font-extrabold text-gray-800">
              Send Us a{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Message
              </span>
            </h1>
            <p className="text-gray-600 mt-3 sm:mt-4 max-w-md mx-auto md:mx-0 leading-relaxed text-sm sm:text-base">
              Drop your thoughts into our bottle – we'll get back to you faster than the tide.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-3 sm:space-y-4">
            {[
              { icon: MapPin, text: "Coastal Road, Crystal Cove, Grand Gaube, Mauritius" },
              { icon: Phone, text: "+230 5 204 9191" },
              { icon: Mail, text: "reservations@zainsserenity.com" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-md hover:shadow-xl transition-shadow group cursor-default"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors shrink-0">
                  <item.icon className="text-teal-600 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-gray-700 font-medium text-xs sm:text-sm md:text-base">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ---------- Right Column: Form ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(20,184,166,0.3)] transition-shadow">
            <h2 className="text-xl sm:text-2xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
              <MessageSquare className="text-teal-600 w-6 h-6 sm:w-7 sm:h-7" />
              Your Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
                className="relative"
              >
                <motion.label
                  className={`absolute left-11 sm:left-12 transition-all duration-200 pointer-events-none ${
                    focusedField === "name" || form.name
                      ? "-top-3 text-xs text-teal-600 bg-white px-1 rounded"
                      : "top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base"
                  }`}
                >
                  Your Name
                </motion.label>
                <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-teal-500 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 text-gray-700 transition-all text-sm sm:text-base"
                />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.4, ease: "easeOut" }}
                className="relative"
              >
                <motion.label
                  className={`absolute left-11 sm:left-12 transition-all duration-200 pointer-events-none ${
                    focusedField === "email" || form.email
                      ? "-top-3 text-xs text-teal-600 bg-white px-1 rounded"
                      : "top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base"
                  }`}
                >
                  Email Address
                </motion.label>
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-teal-500 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/90 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 text-gray-700 transition-all text-sm sm:text-base"
                />
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
                className="relative"
              >
                <motion.label
                  className={`absolute left-11 sm:left-12 transition-all duration-200 pointer-events-none ${
                    focusedField === "message" || form.message
                      ? "top-1 text-xs text-teal-600 bg-white px-1 rounded"
                      : "top-4 text-gray-400 text-sm sm:text-base"
                  }`}
                >
                  Your Message
                </motion.label>
                <MessageSquare className="absolute left-3 sm:left-4 top-4 text-teal-500 w-4 h-4 sm:w-5 sm:h-5" />
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 min-h-[100px] sm:min-h-[120px] bg-white/90 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 text-gray-700 resize-none transition-all text-sm sm:text-base"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={status === "loading"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full relative overflow-hidden bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </motion.button>

              {/* Status messages (no emoji) */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-green-700 bg-green-100 border border-green-200 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    Message sent successfully! We'll reply within 24 hours.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-700 bg-red-100 border border-red-200 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-center flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    Oops! Something went wrong. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   Custom Bottle Icon (SVG) – clean &
   professional – replaces emoji
   ───────────────────────────────────── */
function BottleIcon({ className }: { className?: string }) {
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
      <path d="M8 22h8" />
      <path d="M10 2h4" />
      <path d="M10 2v2c0 1.5-1 3-1 5v5.5c0 1.5-1 2-1 3.5v2h8v-2c0-1.5-1-2-1-3.5V9c0-2-1-3.5-1-5V2z" />
      <path d="M10 9h4" />
      <path d="M10 13h4" />
    </svg>
  );
}