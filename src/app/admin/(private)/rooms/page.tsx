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
  Eye,
  EyeOff,
  Wrench,
  BedDouble,
  TrendingUp,
  BadgeCheck,
  AlertTriangle,
  Building,
  KeyRound,
  DoorOpen,
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

// ---------- Status config (Ocean themed - bright) ----------
const statusConfig = {
  active: { label: "Active", icon: Eye, bg: "bg-cyan-100", text: "text-cyan-700" },
  inactive: { label: "Inactive", icon: EyeOff, bg: "bg-slate-100", text: "text-slate-600" },
  maintenance: { label: "Maintenance", icon: Wrench, bg: "bg-amber-100", text: "text-amber-700" },
};

// ---------- Stat Card (Bright neutral shadow) ----------
const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    whileHover={{ y: -3, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
    className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 flex items-start justify-between"
  >
    <div className="min-w-0 flex-1">
      <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest">
        {title}
      </p>
      <p className="text-lg sm:text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
    <div className={`p-2 sm:p-2.5 rounded-2xl ${bg} ml-3 flex-shrink-0 shadow-inner`}>
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

  // ---------- Room Management Loader (Bright, white, personalized) ----------
  if (loading) {
    return (
      <div className="relative flex flex-col items-center justify-center py-10 sm:py-16 px-4 overflow-hidden bg-white rounded-3xl shadow-xl min-h-[420px] sm:min-h-[500px] border border-slate-200/60">
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

        {/* Floating bubbles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute bottom-8 rounded-full bg-cyan-100/40 pointer-events-none"
            style={{
              left: `${(i * 53) % 100}%`,
              width: `${(i % 3) + 1}px`,
              height: `${(i % 3) + 1}px`,
            }}
            animate={{
              y: [0, -220],
              x: [0, i % 2 === 0 ? 15 : -15],
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Floating room icons (bed, key, door) with micro-interactions */}
        {[
          { Icon: BedDouble, top: "18%", left: "12%", delay: 0.5, size: "w-6 h-6 sm:w-8 sm:h-8" },
          { Icon: KeyRound, top: "25%", right: "14%", delay: 1.2, size: "w-5 h-5 sm:w-7 sm:h-7" },
          { Icon: DoorOpen, bottom: "22%", left: "8%", delay: 2.0, size: "w-6 h-6 sm:w-8 sm:h-8" },
          { Icon: Building, bottom: "18%", right: "10%", delay: 2.8, size: "w-5 h-5 sm:w-7 sm:h-7" },
        ].map(({ Icon, top, right, bottom, left, delay, size }, i) => (
          <motion.div
            key={i}
            className={`absolute ${size} text-slate-300 pointer-events-none`}
            style={{ top, right, bottom, left }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, i % 2 === 0 ? 10 : -10, 0],
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

        {/* Central loader with bed icon and water circle */}
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
                <clipPath id="roomsLoaderClip">
                  <circle cx="50" cy="50" r="42" />
                </clipPath>
                <linearGradient id="roomsWaterGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#22D3EE" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0E7490" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Water wave inside circle */}
              <g clipPath="url(#roomsLoaderClip)">
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
                    fill="url(#roomsWaterGradLight)"
                  />
                  <path
                    d="M100 65 Q112 60 125 65 T150 65 T175 65 T200 65 L200 100 L100 100 Z"
                    fill="url(#roomsWaterGradLight)"
                  />
                </g>
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

              {/* Outer dashed ring rotating */}
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

              {/* Bed icon with pulse (bright cyan) */}
              <motion.g
                transform="translate(50,50)"
                animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M10 14 L10 -4 M-10 14 L-10 -4" stroke="#00A8CC" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M-14 -4 L14 -4" stroke="#00A8CC" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M-12 -4 L-12 4 M-6 -4 L-6 4 M0 -4 L0 4 M6 -4 L6 4 M12 -4 L12 4" stroke="#00A8CC" strokeWidth="1" strokeLinecap="round" />
                <path d="M-14 10 L14 10" stroke="#00A8CC" strokeWidth="1.5" strokeLinecap="round" />
              </motion.g>
            </svg>
          </div>

          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600 tracking-wide drop-shadow-sm text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Room Management
          </motion.h2>
          <motion.p
            className="mt-2 text-xs sm:text-sm text-slate-500 tracking-[0.2em] uppercase text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Diving into your accommodations
            <motion.span
              className="inline-block ml-1"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.5, 1] }}
            >
              ...
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Skeleton stats + room cards */}
        <div className="relative z-10 w-full max-w-3xl mt-6 sm:mt-8 space-y-3 sm:space-y-4 px-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 sm:h-16 bg-slate-200/60 backdrop-blur-md rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="bg-slate-200/60 backdrop-blur-md rounded-xl h-28 sm:h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Main Content ----------
  return (
    <div className="relative min-h-screen bg-white pb-10 pt-6 px-3 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* ---------- Stats ---------- */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
          >
            <StatCard title="Total Rooms" value={stats.total} icon={Building} color="text-slate-600" bg="bg-slate-50" />
            <StatCard title="Active" value={stats.active} icon={BadgeCheck} color="text-cyan-600" bg="bg-cyan-50" />
            <StatCard title="Inactive" value={stats.inactive} icon={EyeOff} color="text-slate-500" bg="bg-slate-100" />
            <StatCard title="Maintenance" value={stats.maintenance} icon={Wrench} color="text-amber-600" bg="bg-amber-50" />
            <StatCard title="Featured" value={stats.featured} icon={Star} color="text-yellow-600" bg="bg-yellow-50" />
            <StatCard title="New Rooms" value={stats.newRooms} icon={Sparkles} color="text-sky-600" bg="bg-sky-50" />
            <StatCard title="Booked Now" value={stats.booked} icon={BedDouble} color="text-purple-600" bg="bg-purple-50" />
            <StatCard title="Available" value={stats.availableRooms} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-50" />
          </motion.div>
        )}

        {/* ---------- Header ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-sky-600">
              Room Management
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Manage your guesthouse rooms</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/admin/rooms/new")}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-slate-300/50 hover:shadow-xl transition self-start sm:self-auto"
          >
            <PlusCircle size={18} /> Add New Room
          </motion.button>
        </motion.div>

        {/* ---------- Room Cards ---------- */}
        {rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-20 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-lg shadow-slate-200/50"
          >
            <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No rooms yet. Create your first room!</p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {rooms.map((room, index) => {
              const StatusIcon = statusConfig[room.status].icon;
              return (
                <motion.div
                  key={room._id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                  }}
                  whileHover={{ y: -5 }}
                  className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Fade overlay removed for clear image */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {room.isFeatured && (
                        <span className="flex items-center gap-1 bg-sky-500/90 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full backdrop-blur-sm shadow">
                          <Star size={10} className="sm:w-3 sm:h-3" /> Featured
                        </span>
                      )}
                      {room.isNewRoom && (
                        <span className="flex items-center gap-1 bg-cyan-500/90 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full backdrop-blur-sm shadow">
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
                    <h3 className="font-bold text-lg text-slate-800 truncate">
                      {room.name}
                    </h3>
                    <p className="text-sky-600 font-bold text-xl mt-1">
                      ${room.price}
                      <span className="text-sm text-slate-400 font-normal">/night</span>
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <select
                        value={room.status}
                        onChange={(e) =>
                          toggleStatus(room._id, "status", e.target.value)
                        }
                        className="bg-white/80 backdrop-blur border border-slate-200 text-slate-700 text-xs rounded-xl px-2 py-1.5 focus:ring-2 focus:ring-cyan-300 transition"
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
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                          room.isFeatured
                            ? "bg-sky-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                          room.isNewRoom
                            ? "bg-cyan-500 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {room.isNewRoom ? "✨ New" : "Mark New"}
                      </motion.button>
                    </div>

                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-200/50">
                      <button
                        onClick={() =>
                          router.push(`/admin/rooms/${room._id}/edit`)
                        }
                        className="flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium transition"
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-600 font-medium transition"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}