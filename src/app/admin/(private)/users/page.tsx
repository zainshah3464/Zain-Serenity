"use client";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  UserCheck,
  UserX,
  Loader2,
  Users,
  UserPlus,
  Shield,
  BadgeCheck,
  AlertTriangle,
  RefreshCw,
  Filter,
} from "lucide-react";

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  isVerified: boolean;
  createdAt: string;
}

// Reusable Stat Card (neutral shadows)
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  bg,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  bg: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -2, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
    className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-4 sm:p-5 shadow-md shadow-slate-200/50 flex items-start justify-between active:scale-[0.98] transition-transform"
  >
    <div className="min-w-0 flex-1">
      <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">
        {title}
      </p>
      <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
    <div className={`p-2.5 sm:p-3 rounded-2xl ${bg} ml-3 flex-shrink-0 shadow-inner`}>
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
    </div>
  </motion.div>
);

export default function AdminUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{ user: UserType } | null>(null);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Stats computed from users
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const customers = users.filter((u) => u.role === "customer").length;
    const verified = users.filter((u) => u.isVerified).length;
    const unverified = users.filter((u) => !u.isVerified).length;

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = users.filter(
      (u) => new Date(u.createdAt) >= thisMonthStart
    ).length;

    return { total, admins, customers, verified, unverified, newThisMonth };
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchVerified =
        verifiedFilter === "all" ||
        (verifiedFilter === "verified" ? u.isVerified : !u.isVerified);
      return matchSearch && matchRole && matchVerified;
    });
  }, [users, search, roleFilter, verifiedFilter]);

  // Role toggle
  const toggleRole = async (id: string, newRole: string) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, role: newRole as any } : u))
    );
  };

  // Verify toggle
  const toggleVerify = async (id: string, verified: boolean) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: !verified }),
    });
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, isVerified: !verified } : u
      )
    );
  };

  // Delete user (after modal confirmation)
  const handleDelete = async () => {
    if (!deleteModal) return;
    if (confirmEmail !== deleteModal.user.email) {
      alert("Emails do not match.");
      return;
    }
    setDeleteLoading(true);
    await fetch(`/api/admin/users/${deleteModal.user._id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u._id !== deleteModal.user._id));
    setDeleteModal(null);
    setConfirmEmail("");
    setDeleteLoading(false);
  };

  const isFiltersActive =
    search !== "" || roleFilter !== "all" || verifiedFilter !== "all";

  // ---------- White Personalized Loader for Users ----------
  if (loading) {
    return (
      <div className="relative flex flex-col items-center justify-center py-10 sm:py-16 px-4 overflow-hidden bg-white rounded-3xl shadow-xl min-h-[420px] sm:min-h-[500px] border border-slate-200/60 select-none">
        {/* Subtle caustic light overlay for white bg */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, rgba(0,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(0,200,255,0.05) 0%, transparent 55%), radial-gradient(circle at 50% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* God rays – very light */}
        <motion.div
          className="absolute top-0 left-[12%] w-4 h-[70vh] bg-gradient-to-b from-cyan-100/60 via-cyan-50/30 to-transparent blur-2xl rotate-12 pointer-events-none"
          animate={{ opacity: [0.4, 0.7, 0.4], x: [-30, 30, -30] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 left-[45%] w-5 h-[80vh] bg-gradient-to-b from-teal-100/60 via-teal-50/30 to-transparent blur-2xl rotate-[-10deg] pointer-events-none"
          animate={{ opacity: [0.4, 0.8, 0.4], x: [25, -25, 25] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-0 right-[8%] w-3 h-[60vh] bg-gradient-to-b from-sky-100/60 via-sky-50/30 to-transparent blur-2xl rotate-6 pointer-events-none"
          animate={{ opacity: [0.35, 0.6, 0.35], x: [-40, 15, -40] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Bottom ocean waves – layer 1 */}
        <motion.div
          className="absolute bottom-0 left-0 w-[200%] h-24 sm:h-32 md:h-40 flex pointer-events-none"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((i) => (
            <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="rgba(0,168,204,0.08)" d="M0,160 C240,220 480,100 720,160 C960,220 1200,100 1440,160 L1440,320 L0,320 Z" />
            </svg>
          ))}
        </motion.div>

        {/* Bottom ocean waves – layer 2 */}
        <motion.div
          className="absolute bottom-0 left-0 w-[200%] h-16 sm:h-24 md:h-32 flex pointer-events-none"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((i) => (
            <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="rgba(56,189,248,0.05)" d="M0,220 C180,260 360,100 720,220 C1080,340 1260,160 1440,220 L1440,320 L0,320 Z" />
            </svg>
          ))}
        </motion.div>

        {/* Bottom ocean waves – layer 3 */}
        <motion.div
          className="absolute bottom-0 left-0 w-[200%] h-10 sm:h-16 md:h-24 flex pointer-events-none"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((i) => (
            <svg key={i} className="w-1/2 h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="rgba(14,165,233,0.03)" d="M0,280 C300,240 600,320 900,280 C1200,240 1320,300 1440,280 L1440,320 L0,320 Z" />
            </svg>
          ))}
        </motion.div>

        {/* Floating user-related icons with micro-interactions */}
        {[
          { Icon: Users, top: "18%", left: "10%", delay: 0.4, size: "w-6 h-6 sm:w-8 sm:h-8", rotate: [0, 10, 0] },
          { Icon: UserPlus, top: "22%", right: "12%", delay: 1.1, size: "w-5 h-5 sm:w-7 sm:h-7", rotate: [0, -8, 0] },
          { Icon: Shield, bottom: "25%", left: "8%", delay: 1.8, size: "w-6 h-6 sm:w-8 sm:h-8", rotate: [0, 6, 0] },
          { Icon: BadgeCheck, bottom: "20%", right: "10%", delay: 2.5, size: "w-5 h-5 sm:w-7 sm:h-7", rotate: [0, -10, 0] },
        ].map(({ Icon, top, right, bottom, left, delay, size, rotate }, i) => (
          <motion.div
            key={i}
            className={`absolute ${size} text-slate-300 pointer-events-none`}
            style={{ top, right, bottom, left }}
            animate={{
              y: [0, -15, 0],
              rotate: rotate,
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          >
            <Icon className="w-full h-full" />
          </motion.div>
        ))}

        {/* Central loader with users icon and water circle */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 mb-4 sm:mb-6">
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-slate-100/80 blur-xl pointer-events-none"
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              fill="none"
              className="relative z-10"
            >
              <defs>
                <clipPath id="usersLoaderClip">
                  <circle cx="50" cy="50" r="42" />
                </clipPath>
                <linearGradient id="usersWaterGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#22D3EE" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0E7490" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Animated water fill inside circle */}
              <g clipPath="url(#usersLoaderClip)">
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="-100 0"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                  <path
                    d="M0 65 Q 12 60 25 65 T50 65 T75 65 T100 65 L100 100 L0 100 Z"
                    fill="url(#usersWaterGradLight)"
                  />
                  <path
                    d="M100 65 Q112 60 125 65 T150 65 T175 65 T200 65 L200 100 L100 100 Z"
                    fill="url(#usersWaterGradLight)"
                  />
                </g>
                {/* Second slower water surface */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="-50 0"
                    dur="7s"
                    repeatCount="indefinite"
                  />
                  <path
                    d="M0 70 Q 6 67 12 70 T24 70 T36 70 T48 70 T60 70 L60 100 L0 100 Z"
                    fill="rgba(255,255,255,0.2)"
                  />
                </g>
              </g>

              {/* Outer rotating dashed ring */}
              <circle
                cx="50"
                cy="50"
                r="47"
                stroke="rgba(0,168,204,0.25)"
                strokeWidth="1"
                strokeDasharray="4 6"
                fill="none"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Frame */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="rgba(0,168,204,0.5)"
                strokeWidth="1.5"
                fill="rgba(255,255,255,0.8)"
              />
              <circle
                cx="50"
                cy="50"
                r="39"
                stroke="rgba(0,168,204,0.12)"
                strokeWidth="0.5"
                fill="none"
              />

              {/* Users icon with pulse - bright cyan */}
              <motion.g
                transform="translate(50,50)"
                animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <circle cx="-7" cy="-6" r="4" fill="#00A8CC" />
                <path d="M-13 6 Q-10 -2 -7 -2 Q-4 -2 -1 6" stroke="#00A8CC" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <circle cx="7" cy="-6" r="4" fill="#00A8CC" />
                <path d="M1 6 Q4 -2 7 -2 Q10 -2 13 6" stroke="#00A8CC" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </motion.g>
            </svg>
          </div>

          {/* Loading text */}
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600 tracking-wide drop-shadow-sm text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading Users
          </motion.h2>
          <motion.p
            className="mt-2 text-xs sm:text-sm text-slate-500 tracking-[0.2em] uppercase text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Diving into your community
            <motion.span
              className="inline-block ml-1"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.5, 1] }}
            >
              ...
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Skeleton stat cards */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 w-full max-w-3xl mt-6 sm:mt-8 px-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="bg-slate-200/60 backdrop-blur-md rounded-xl h-16 sm:h-20 relative overflow-hidden"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: i * 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="p-2 sm:p-3">
                <div className="h-1.5 bg-slate-300/60 rounded w-2/3 mb-2" />
                <div className="h-3 bg-slate-300/60 rounded w-1/3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ---------- Main Content (white background, neutral shadows) ----------
  return (
    <div className="relative min-h-screen bg-white pb-10 pt-6 px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle decorative blobs (very light) */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-100/30 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          <StatCard title="Total Users" value={stats.total} icon={Users} color="text-slate-600" bg="bg-slate-50" />
          <StatCard title="New This Month" value={stats.newThisMonth} icon={UserPlus} color="text-sky-600" bg="bg-sky-50" />
          <StatCard title="Admins" value={stats.admins} icon={Shield} color="text-purple-600" bg="bg-purple-50" />
          <StatCard title="Customers" value={stats.customers} icon={Users} color="text-cyan-600" bg="bg-cyan-50" />
          <StatCard title="Verified" value={stats.verified} icon={BadgeCheck} color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard title="Unverified" value={stats.unverified} icon={AlertTriangle} color="text-rose-600" bg="bg-rose-50" />
        </div>

        {/* Header & Refresh */}
        <div className="flex items-center justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-sky-600">
              Users
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Manage your community</p>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchUsers}
              disabled={refreshing}
              className="p-2.5 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl text-cyan-700 shadow-sm hover:shadow-md transition disabled:opacity-60 active:bg-cyan-50"
              title="Refresh"
            >
              <RefreshCw size={18} className={`${refreshing ? "animate-spin" : ""}`} />
            </motion.button>
          </div>
        </div>

        {/* Filters - Mobile version */}
        <div className="sm:hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-3 shadow-md shadow-slate-200/50 space-y-3"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search name or email..."
                className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-3 min-h-[44px] active:bg-cyan-50 transition">
                <Filter size={16} className="text-cyan-600 shrink-0" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer w-full min-w-0"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-3 min-h-[44px] active:bg-cyan-50 transition">
                <Filter size={16} className="text-cyan-600 shrink-0" />
                <select
                  value={verifiedFilter}
                  onChange={(e) => setVerifiedFilter(e.target.value)}
                  className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer w-full min-w-0"
                >
                  <option value="all">All Verification</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>

            {isFiltersActive && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("all");
                    setVerifiedFilter("all");
                  }}
                  className="text-xs font-medium text-cyan-700 hover:underline active:text-cyan-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Filters - Desktop version */}
        <div className="hidden sm:block">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-4 shadow-md shadow-slate-200/50"
          >
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search name or email..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Filter size={16} className="text-cyan-600" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 px-3 py-2.5 rounded-2xl focus:ring-2 focus:ring-cyan-200 outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Filter size={16} className="text-cyan-600" />
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 px-3 py-2.5 rounded-2xl focus:ring-2 focus:ring-cyan-200 outline-none cursor-pointer"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            {isFiltersActive && (
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("all");
                    setVerifiedFilter("all");
                  }}
                  className="text-xs text-cyan-700 hover:underline whitespace-nowrap font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-md shadow-slate-200/50">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-cyan-50 to-sky-50 text-slate-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="py-4 px-5 text-left font-semibold">Name</th>
                <th className="py-4 px-5 text-left font-semibold">Email</th>
                <th className="py-4 px-5 text-left font-semibold">Role</th>
                <th className="py-4 px-5 text-left font-semibold">Verified</th>
                <th className="py-4 px-5 text-left font-semibold">Joined</th>
                <th className="py-4 px-5 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.02, duration: 0.25 }}
                    className="hover:bg-cyan-50/30 active:bg-cyan-50/50 transition-colors group"
                  >
                    <td className="py-4 px-5 font-medium text-slate-800 whitespace-nowrap text-sm">
                      {user.name}
                    </td>
                    <td className="py-4 px-5 text-slate-600 whitespace-nowrap text-sm">
                      {user.email}
                    </td>
                    <td className="py-4 px-5">
                      <select
                        value={user.role}
                        onChange={(e) => toggleRole(user._id, e.target.value)}
                        className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-2 py-1.5 focus:ring-2 focus:ring-cyan-200 outline-none cursor-pointer active:bg-cyan-50"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-5">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleVerify(user._id, user.isVerified)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition active:scale-95 ${
                          user.isVerified
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {user.isVerified ? <UserCheck size={14} /> : <UserX size={14} />}
                        {user.isVerified ? "Yes" : "No"}
                      </motion.button>
                    </td>
                    <td className="py-4 px-5 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteModal({ user })}
                        className="text-slate-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-rose-50 active:bg-rose-100"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              No users match your filters.
              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                  setVerifiedFilter("all");
                }}
                className="text-cyan-700 underline ml-2 hover:text-cyan-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setDeleteModal(null)}
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 z-10 border border-slate-200/60"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  This action is permanent. Please type{" "}
                  <span className="font-semibold text-slate-800 break-all">
                    {deleteModal.user.email}
                  </span>{" "}
                  to confirm.
                </p>
                <input
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="Type user email..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-cyan-200 outline-none transition mb-4"
                  autoFocus
                />
                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition active:bg-slate-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    disabled={confirmEmail !== deleteModal.user.email || deleteLoading}
                    className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition ${
                      confirmEmail === deleteModal.user.email
                        ? "bg-red-500 hover:bg-red-600 active:bg-red-700"
                        : "bg-red-300 cursor-not-allowed"
                    }`}
                  >
                    {deleteLoading ? (
                      <Loader2 size={16} className="animate-spin inline" />
                    ) : (
                      "Delete User"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}