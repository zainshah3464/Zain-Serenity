"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!token || !email) router.push("/login");
  }, [token, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, newPassword: password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setError("");
      setTimeout(() => router.push("/login"), 2500);
    } else {
      setError(data.error);
      setMessage("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/20 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-xl"
      >
        <Link href="/login" className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 mb-4 transition">
          <ArrowLeft size={16} /> Back to login
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
        <p className="text-gray-500 mb-6">Enter your new password.</p>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4"
            >
               {message}
            </motion.div>
          )}
        </AnimatePresence>

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <label
                className={`absolute left-10 transition-all duration-200 pointer-events-none ${
                  focused || password
                    ? "-top-3 text-xs text-teal-600 bg-white/80 px-1 rounded"
                    : "top-1/2 -translate-y-1/2 text-gray-400"
                }`}
              >
                New Password
              </label>
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-700"
              />
            </div>
            <p className="text-xs text-gray-500">
              Min 6 chars, include uppercase, lowercase, number
            </p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <KeyRound size={18} />}
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}