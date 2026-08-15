"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

// Password strength checker
const getStrength = (pwd: string) => {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.match(/[a-z]+/)) score++;
  if (pwd.match(/[A-Z]+/)) score++;
  if (pwd.match(/[0-9]+/)) score++;
  if (pwd.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)) score++;
  return score;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const strength = getStrength(form.password);
  const strengthText = strength <= 2 ? "Weak" : strength === 3 ? "Fair" : "Strong";
  const strengthColor =
    strength <= 2 ? "bg-red-400" : strength === 3 ? "bg-yellow-400" : "bg-green-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login?verified=email_sent");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setTimeout(() => setError(""), 5000);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create <span className="text-teal-600">Account</span>
        </h1>
        <p className="text-gray-500 mb-6">Join our community today</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative group">
            <label
              className={`absolute left-10 transition-all duration-200 pointer-events-none ${
                focusedField === "name" || form.name
                  ? "-top-3 text-xs text-teal-600 bg-white/80 px-1 rounded"
                  : "top-1/2 -translate-y-1/2 text-gray-400"
              }`}
            >
              Full Name
            </label>
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5" />
            <input
              type="text"
              required
              value={form.name}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-10 pr-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-700"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <label
              className={`absolute left-10 transition-all duration-200 pointer-events-none ${
                focusedField === "email" || form.email
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
              value={form.email}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3.5 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-700"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <label
              className={`absolute left-10 transition-all duration-200 pointer-events-none ${
                focusedField === "password" || form.password
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
              value={form.password}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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

          {/* Password Strength Meter */}
          {form.password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-1"
            >
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${strengthColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(strength / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-500">
                Strength: <span className={`font-medium ${strengthColor.replace("bg-", "text-")}`}>{strengthText}</span>
              </p>
            </motion.div>
          )}

          {/* Error */}
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

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
            {loading ? "Creating Account..." : "Register"}
          </motion.button>
        </form>

        {/* Divider + Google */}
        <div className="mt-5 flex items-center gap-2">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="mt-4 w-full bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition font-semibold"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </motion.button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-teal-600 hover:underline font-medium transition">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}