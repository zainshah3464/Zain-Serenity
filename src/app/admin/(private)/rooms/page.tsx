"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  Star,
  Sparkles,
  PlusCircle,
  Loader2,
  Eye,
  EyeOff,
  Wrench,
  BedDouble,
  TrendingUp,
  BadgeCheck,
  AlertTriangle,
  Building,
} from "lucide-react";

// ---------- Types ----------
interface Room {
  _id: string;
  name: string;
  price: number;
  image: string;
  status: "active" | "inactive" | "maintenance";
  isFeatured: boolean;
  isNewRoom: boolean;
}

// ✅ Removed roomRevenue from RoomStats
interface RoomStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  featured: number;
  newRooms: number;
  booked: number;
  availableRooms: number;
}

// ---------- Status config ----------
const statusConfig = {
  active: { label: "Active", icon: Eye, bg: "bg-emerald-100", text: "text-emerald-700" },
  inactive: { label: "Inactive", icon: EyeOff, bg: "bg-gray-100", text: "text-gray-600" },
  maintenance: { label: "Maintenance", icon: Wrench, bg: "bg-amber-100", text: "text-amber-700" },
};

// ---------- Stat Card (improved spacing & hover) ----------
const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -3, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
    className="bg-white/80 backdrop-blur border border-gray-100/80 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start justify-between"
  >
    <div className="min-w-0 flex-1">
      <p className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest">
        {title}
      </p>
      <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div
      className={`p-2 sm:p-2.5 rounded-xl ${bg} ml-3 flex-shrink-0 shadow-inner`}
    >
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
    </div>
  </motion.div>
);

// ---------- Component ----------
export default function AdminRooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<RoomStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, statsRes] = await Promise.all([
        fetch("/api/admin/rooms"),
        fetch("/api/admin/rooms/stats"),
      ]);
      const roomsData = await roomsRes.json();
      const statsData = await statsRes.json();
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch rooms data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this room permanently?")) return;
    await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
    fetchData();
  };

  const toggleStatus = async (id: string, field: string, value: any) => {
    const res = await fetch(`/api/admin/rooms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      setRooms((prev) =>
        prev.map((r) => (r._id === id ? { ...r, [field]: value } : r))
      );
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <Loader2 className="text-teal-600" size={40} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 pb-10">
      {/* ---------- Stats ---------- */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            title="Total Rooms"
            value={stats.total}
            icon={Building}
            color="text-gray-600"
            bg="bg-gray-50"
          />
          <StatCard
            title="Active"
            value={stats.active}
            icon={BadgeCheck}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            title="Inactive"
            value={stats.inactive}
            icon={EyeOff}
            color="text-gray-500"
            bg="bg-gray-100"
          />
          <StatCard
            title="Maintenance"
            value={stats.maintenance}
            icon={Wrench}
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <StatCard
            title="Featured"
            value={stats.featured}
            icon={Star}
            color="text-yellow-600"
            bg="bg-yellow-50"
          />
          <StatCard
            title="New Rooms"
            value={stats.newRooms}
            icon={Sparkles}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            title="Booked Now"
            value={stats.booked}
            icon={BedDouble}
            color="text-purple-600"
            bg="bg-purple-50"
          />
          <StatCard
            title="Available"
            value={stats.availableRooms}
            icon={TrendingUp}
            color="text-teal-600"
            bg="bg-teal-50"
          />
        </div>
      )}

      {/* ---------- Header ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight"
          >
            Room Management
          </motion.h1>
          <p className="text-gray-500 text-sm mt-1">Manage your guesthouse rooms</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/admin/rooms/new")}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition self-start sm:self-auto"
        >
          <PlusCircle size={18} /> Add New Room
        </motion.button>
      </div>

      {/* ---------- Room Cards ---------- */}
      {rooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-md"
        >
          <BedDouble className="w-12 h-12 text-teal-300 mx-auto mb-4" />
          <p className="text-gray-500">No rooms yet. Create your first room!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map((room, index) => {
            const StatusIcon = statusConfig[room.status].icon;
            return (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {room.isFeatured && (
                      <span className="flex items-center gap-1 bg-teal-500/90 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full backdrop-blur-sm shadow">
                        <Star size={10} className="sm:w-3 sm:h-3" /> Featured
                      </span>
                    )}
                    {room.isNewRoom && (
                      <span className="flex items-center gap-1 bg-blue-500/90 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full backdrop-blur-sm shadow">
                        <Sparkles size={10} className="sm:w-3 sm:h-3" /> New
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm shadow ${statusConfig[room.status].bg} ${statusConfig[room.status].text}`}
                    >
                      <StatusIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                      {statusConfig[room.status].label}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-lg text-gray-800 truncate">
                    {room.name}
                  </h3>
                  <p className="text-teal-600 font-bold text-xl mt-1">
                    ${room.price}
                    <span className="text-sm text-gray-400 font-normal">/night</span>
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <select
                      value={room.status}
                      onChange={(e) =>
                        toggleStatus(room._id, "status", e.target.value)
                      }
                      className="bg-white/80 border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-teal-200 transition"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        toggleStatus(room._id, "isFeatured", !room.isFeatured)
                      }
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                        room.isFeatured
                          ? "bg-teal-500 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {room.isFeatured ? "★ Featured" : "Feature"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        toggleStatus(room._id, "isNewRoom", !room.isNewRoom)
                      }
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                        room.isNewRoom
                          ? "bg-blue-500 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {room.isNewRoom ? "✨ New" : "Mark New"}
                    </motion.button>
                  </div>

                  <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                    <button
                      onClick={() =>
                        router.push(`/admin/rooms/${room._id}/edit`)
                      }
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}