"use client";
import Link from "next/link";
import { MapPin, Phone, Mail, Send, Terminal } from "lucide-react";
import { useState } from "react";
import { motion, useInView, Variants } from "framer-motion"; // ✅ Variants import karo
import { useRef } from "react";

// ---------- Custom SVG Icons (unchanged) ----------
function FacebookIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function TwitterIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail("");
  };

  // ✅ Staggered fade‑in for columns – ab type-safe hai
  const columnVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <motion.footer
      ref={footerRef}
      className="relative bg-white/30 backdrop-blur-xl border-t border-white/60 mt-auto overflow-hidden"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Decorative wave with moving gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 opacity-50">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-300 opacity-50"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <motion.div custom={0} variants={columnVariants}>
          <h4 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent mb-3">
            Zain’s Serenity
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            A luxury coastal sanctuary on the Crystal Coast. Unwind, explore, and create memories that last a lifetime.
          </p>
          <p className="text-gray-500 text-xs mt-3 italic">
            Where the ocean meets timeless elegance.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div custom={1} variants={columnVariants}>
          <h5 className="font-semibold text-gray-800 mb-3">Explore</h5>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/rooms", label: "Rooms & Suites" },
              { href: "/gallery", label: "Gallery" },
              { href: "/about", label: "Our Story" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative inline-block text-gray-600 hover:text-teal-600 transition group"
                >
                  {link.label}
                  <motion.span
                    className="absolute left-0 bottom-0 h-[1px] bg-teal-500 w-0 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div custom={2} variants={columnVariants}>
          <h5 className="font-semibold text-gray-800 mb-3">Reach Us</h5>
          <div className="space-y-3 text-sm text-gray-600">
            <motion.p
              className="flex items-center gap-2 hover:text-teal-700 transition cursor-default"
              whileHover={{ x: 4 }}
            >
              <MapPin size={16} className="text-teal-600" /> Coastal Road, Crystal Cove
            </motion.p>
            <motion.p
              className="flex items-center gap-2 hover:text-teal-700 transition cursor-default"
              whileHover={{ x: 4 }}
            >
              <MapPin size={16} className="text-teal-600 invisible" /> Grand Gaube, Mauritius
            </motion.p>
            <motion.p
              className="flex items-center gap-2 hover:text-teal-700 transition cursor-default"
              whileHover={{ x: 4 }}
            >
              <Phone size={16} className="text-teal-600" /> +230 5 204 9191
            </motion.p>
            <motion.p
              className="flex items-center gap-2 hover:text-teal-700 transition cursor-default"
              whileHover={{ x: 4 }}
            >
              <Mail size={16} className="text-teal-600" /> reservations@zainsserenity.com
            </motion.p>
          </div>
        </motion.div>

        {/* Newsletter & Social */}
        <motion.div custom={3} variants={columnVariants}>
          <h5 className="font-semibold text-gray-800 mb-3">Stay Updated</h5>
          <form onSubmit={handleNewsletter} className="flex gap-2 mb-4">
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/60 backdrop-blur-sm border border-white/80 rounded-xl px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-xl transition shadow relative overflow-hidden"
            >
              <Send size={16} />
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-xl"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 2, opacity: 0.3 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          </form>
          {subscribed && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-teal-600 mb-2"
            >
              🎉 Subscribed!
            </motion.p>
          )}

          <h5 className="font-semibold text-gray-800 mb-2 mt-4">Follow Us</h5>
          <div className="flex gap-3 text-teal-600">
            {[
              { icon: FacebookIcon, href: "#", label: "Facebook" },
              { icon: InstagramIcon, href: "#", label: "Instagram" },
              { icon: TwitterIcon, href: "#", label: "Twitter" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                className="hover:text-teal-800 transition bg-white/50 p-2 rounded-full"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                title={label}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Copyright + Developer Credit */}
      <motion.div
        className="border-t border-white/60 py-6 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Zain’s Serenity. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-gray-500">
            <Terminal size={16} className="text-teal-600" />
            <span>Developed by</span>
            <a
              href="https://zain-main-web.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-600 hover:text-teal-700 transition relative group"
            >
              Zain Shah
              <motion.span
                className="absolute left-0 bottom-0 h-[1px] bg-teal-500 w-0 group-hover:w-full transition-all duration-300"
              />
            </a>
            <div className="flex items-center gap-2 ml-2">
              {[
                { icon: GitHubIcon, href: "https://github.com/zainshah3464", label: "GitHub" },
                { icon: InstagramIcon, href: "https://www.instagram.com/zainshah3464", label: "Instagram" },
                { icon: Mail, href: "mailto:zainshahzs110@gmail.com", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={label !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-teal-600 transition p-1"
                  whileHover={{ scale: 1.2, y: -1 }}
                  whileTap={{ scale: 0.9 }}
                  title={label}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
}