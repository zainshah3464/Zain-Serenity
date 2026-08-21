"use client";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/ga4"; // ← GA4 tracking import

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      if (role === "admin") router.push("/admin");
      else router.push("/");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      setTimeout(() => setError(""), 5000);
    } else if (result?.ok) {
      // GA4: login event for credentials
      trackEvent('login', { method: 'credentials' });
    }
  };

  // Google sign-in with tracking
  const handleGoogleSignIn = () => {
    trackEvent('login', { method: 'google' });
    signIn("google", { callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/20 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome <span className="text-teal-600">Back</span>
        </h1>
        <p className="text-gray-500 mb-6">Sign in to your account</p>

        <AnimatePresence>
          {verified && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm"
            >
              ✅ Email verified! You can now login.
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="relative group">
            <label
              className={`absolute left-10 transition-all duration-200 pointer-events-none ${
                focusedField === "email" || email
                  ? "-top-3 text-xs text-teal-600 bg-white/80 px-1 rounded"
                  : "top-1/2 -translate-y-1/2 text-gray-400"
              }`}
            >
              Email
            </label>
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5" />
            <input
              type="email"
              required
              value={email}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-700"
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <label
              className={`absolute left-10 transition-all duration-200 pointer-events-none ${
                focusedField === "password" || password
                  ? "-top-3 text-xs text-teal-600 bg-white/80 px-1 rounded"
                  : "top-1/2 -translate-y-1/2 text-gray-400"
              }`}
            >
              Password
            </label>
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-700"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </motion.button>
          </div>

          {/* Error Message */}
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

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="mt-5 flex items-center gap-2">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Sign-In */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleGoogleSignIn}
          className="mt-4 w-full bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition font-semibold"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </motion.button>

        <div className="mt-6 text-center text-sm text-gray-500 flex justify-between">
          <a href="/forgot-password" className="hover:text-teal-600 underline transition">
            Forgot Password?
          </a>
          <a href="/register" className="hover:text-teal-600 underline transition">
            Create Account
          </a>
        </div>
      </motion.div>
    </div>
  );
}