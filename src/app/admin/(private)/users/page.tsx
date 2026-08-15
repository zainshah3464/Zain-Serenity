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

    // New this month (created in current month)
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-teal-600" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          color="text-gray-600"
          bg="bg-gray-50"
        />
        <StatCard
          title="New This Month"
          value={stats.newThisMonth}
          icon={UserPlus}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          title="Admins"
          value={stats.admins}
          icon={Shield}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <StatCard
          title="Customers"
          value={stats.customers}
          icon={Users}
          color="text-teal-600"
          bg="bg-teal-50"
        />
        <StatCard
          title="Verified"
          value={stats.verified}
          icon={BadgeCheck}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          title="Unverified"
          value={stats.unverified}
          icon={AlertTriangle}
          color="text-red-600"
          bg="bg-red-50"
        />
      </div>

      {/* Header & Refresh - always in one row */}
      <div className="flex items-center justify-between gap-3">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight"
        >
          Users
        </motion.h1>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchUsers}
            disabled={refreshing}
            className="p-2.5 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-teal-600 shadow-sm hover:shadow-md transition disabled:opacity-60 active:bg-gray-100"
            title="Refresh"
          >
            <RefreshCw
              size={18}
              className={`${refreshing ? "animate-spin" : ""}`}
            />
          </motion.button>
        </div>
      </div>

      {/* Filters - Mobile version (shown only on small screens) */}
      <div className="sm:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur border border-gray-200/80 rounded-2xl p-3 shadow-sm space-y-3"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search name or email..."
              className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 2 filter grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Role filter */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-3 min-h-[44px] active:bg-gray-50 transition">
              <Filter size={16} className="text-teal-600 shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Verified filter */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-3 min-h-[44px] active:bg-gray-50 transition">
              <Filter size={16} className="text-teal-600 shrink-0" />
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>

          {/* Clear all filters button */}
          {isFiltersActive && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                  setVerifiedFilter("all");
                }}
                className="text-xs font-medium text-teal-600 hover:underline active:text-teal-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Filters - Desktop version (original style, shown on sm and up) */}
      <div className="hidden sm:block">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row flex-wrap gap-3 bg-white/80 backdrop-blur border border-gray-200/80 rounded-2xl p-4 shadow-sm"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search name or email..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Filter size={16} className="text-teal-600" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Filter size={16} className="text-teal-600" />
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-teal-200 outline-none cursor-pointer"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Clear all filters button */}
          {isFiltersActive && (
            <div className="flex items-center">
              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                  setVerifiedFilter("all");
                }}
                className="text-xs text-teal-600 hover:underline whitespace-nowrap font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="py-4 px-5 text-left">Name</th>
              <th className="py-4 px-5 text-left">Email</th>
              <th className="py-4 px-5 text-left">Role</th>
              <th className="py-4 px-5 text-left">Verified</th>
              <th className="py-4 px-5 text-left">Joined</th>
              <th className="py-4 px-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.02, duration: 0.25 }}
                  className="hover:bg-teal-50/30 active:bg-teal-50/50 transition-colors group"
                >
                  <td className="py-4 px-5 font-medium text-gray-800 whitespace-nowrap text-sm">
                    {user.name}
                  </td>
                  <td className="py-4 px-5 text-gray-600 whitespace-nowrap text-sm">
                    {user.email}
                  </td>
                  <td className="py-4 px-5">
                    <select
                      value={user.role}
                      onChange={(e) => toggleRole(user._id, e.target.value)}
                      className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-teal-200 outline-none cursor-pointer active:bg-gray-50"
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
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {user.isVerified ? (
                        <UserCheck size={14} />
                      ) : (
                        <UserX size={14} />
                      )}
                      {user.isVerified ? "Yes" : "No"}
                    </motion.button>
                  </td>
                  <td className="py-4 px-5 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeleteModal({ user })}
                      className="text-gray-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 active:bg-red-100"
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
          <div className="text-center py-16 text-gray-500">
            No users match your filters.
            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
                setVerifiedFilter("all");
              }}
              className="text-teal-600 underline ml-2 hover:text-teal-700"
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
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This action is permanent. Please type{" "}
                <span className="font-semibold text-gray-800 break-all">
                  {deleteModal.user.email}
                </span>{" "}
                to confirm.
              </p>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Type user email..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-200 outline-none transition mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition active:bg-gray-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={confirmEmail !== deleteModal.user.email || deleteLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
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
  );
}

// Reusable Stat Card (unchanged logic, just added active state)
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
    transition={{ duration: 0.4 }}
    whileHover={{ y: -2, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
    className="bg-white/80 backdrop-blur border border-gray-100/80 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start justify-between active:scale-[0.98] transition-transform"
  >
    <div className="min-w-0 flex-1">
      <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className={`p-2.5 sm:p-3 rounded-xl ${bg} ml-3 flex-shrink-0 shadow-inner`}>
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
    </div>
  </motion.div>
);