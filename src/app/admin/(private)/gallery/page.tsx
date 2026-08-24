"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Loader2,
  Trash2,
  Edit3,
  Check,
  AlertTriangle,
  ImageIcon,
  Star,
  BarChart3,
  Images,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

interface GalleryImage {
  _id: string;
  url: string;
  caption?: string;
  category: string;
  createdAt: string;
}

const CATEGORIES = [
  "featured",
  "rooms",
  "bathroom",
  "exterior",
  "amenities",
  "pool",
  "other",
] as const;

const categoryColors: Record<string, string> = {
  featured: "bg-yellow-100 text-yellow-700",
  rooms: "bg-blue-100 text-blue-700",
  bathroom: "bg-purple-100 text-purple-700",
  exterior: "bg-green-100 text-green-700",
  amenities: "bg-pink-100 text-pink-700",
  pool: "bg-cyan-100 text-cyan-700",
  other: "bg-gray-100 text-gray-700",
};

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<string>("other");
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Stats
  const stats = useMemo(() => {
    const total = images.length;
    const featured = images.filter((i) => i.category === "featured").length;
    const rooms = images.filter((i) => i.category === "rooms").length;
    return { total, featured, rooms };
  }, [images]);

  const filteredImages = useMemo(() => {
    if (!filterCategory) return images;
    return images.filter((i) => i.category === filterCategory);
  }, [images, filterCategory]);

  const fetchImages = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setImages(data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFilePreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("category", category);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setFile(null);
        setFilePreview(null);
        setCaption("");
        setCategory("other");
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        fetchImages();
      } else {
        alert("Upload failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/gallery/${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    fetchImages();
  };

  const handleCategoryChange = async (id: string, newCategory: string) => {
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: newCategory }),
    });
    if (res.ok) fetchImages();
    else alert("Update failed");
  };

  const startEditingCaption = (img: GalleryImage) => {
    setEditingId(img._id);
    setEditCaption(img.caption || "");
  };

  const saveCaption = async (id: string) => {
    if (editCaption.trim() === "") return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: editCaption }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchImages();
      } else {
        alert("Update failed");
      }
    } catch {
      alert("Network error");
    }
  };

  // Show custom loading screen while initially loading (or refreshing with no images)
  if (images.length === 0 && refreshing) {
    return (
      <div className="relative flex flex-col items-center justify-center py-10 sm:py-16 px-4 overflow-hidden bg-white rounded-3xl shadow-xl min-h-[420px] sm:min-h-[500px] border border-cyan-100/60 select-none">
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

        {/* Floating gallery icons with micro-interactions */}
        {[
          { Icon: ImageIcon, top: "18%", left: "10%", delay: 0.4, size: "w-6 h-6 sm:w-8 sm:h-8", rotate: [0, 10, 0] },
          { Icon: Images, top: "22%", right: "12%", delay: 1.1, size: "w-5 h-5 sm:w-7 sm:h-7", rotate: [0, -8, 0] },
          { Icon: Star, bottom: "25%", left: "8%", delay: 1.8, size: "w-6 h-6 sm:w-8 sm:h-8", rotate: [0, 6, 0] },
          { Icon: BarChart3, bottom: "20%", right: "10%", delay: 2.5, size: "w-5 h-5 sm:w-7 sm:h-7", rotate: [0, -10, 0] },
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

        {/* Central loader with gallery icon and water circle */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 mb-4 sm:mb-6">
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
                <clipPath id="galleryLoaderClip">
                  <circle cx="50" cy="50" r="42" />
                </clipPath>
                <linearGradient id="galleryWaterGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#22D3EE" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0E7490" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              <g clipPath="url(#galleryLoaderClip)">
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
                    fill="url(#galleryWaterGradLight)"
                  />
                  <path
                    d="M100 65 Q112 60 125 65 T150 65 T175 65 T200 65 L200 100 L100 100 Z"
                    fill="url(#galleryWaterGradLight)"
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

              {/* Gallery icon with bright cyan stroke */}
              <motion.g
                transform="translate(50,50)"
                animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <rect
                  x="-14"
                  y="-11"
                  width="28"
                  height="22"
                  rx="3"
                  stroke="#00A8CC"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="-5" cy="-4" r="2.5" fill="#00A8CC" />
                <path
                  d="M-14 7 L-5 -2 L2 5 L6 1 L14 7"
                  stroke="#00A8CC"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinejoin="round"
                />
              </motion.g>
            </svg>
          </div>

          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-sky-600 tracking-wide drop-shadow-sm text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading Gallery
          </motion.h2>
          <motion.p
            className="mt-2 text-xs sm:text-sm text-slate-500 tracking-[0.2em] uppercase text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Diving into your moments
            <motion.span
              className="inline-block ml-1"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, times: [0, 0.5, 1] }}
            >
              ...
            </motion.span>
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white pb-10 pt-6 px-3 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative light blobs (subtle cyan) */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-100/30 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-sky-600"
              >
                Gallery Management
              </motion.h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchImages}
                disabled={refreshing}
                className="p-2 bg-white/80 backdrop-blur border border-cyan-100/60 rounded-2xl text-cyan-700 shadow-sm hover:shadow-md transition disabled:opacity-60 active:bg-cyan-50"
                title="Refresh gallery"
              >
                <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              </motion.button>
            </div>
            <p className="text-sm text-slate-500">
              Upload, organize & showcase your property’s best moments
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-cyan-100/60 rounded-2xl px-3 sm:px-4 py-2 shadow-lg shadow-cyan-100/40">
              <ImageIcon size={18} className="text-cyan-600" />
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400">Total</p>
                <p className="text-base sm:text-lg font-bold text-slate-800">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-cyan-100/60 rounded-2xl px-3 sm:px-4 py-2 shadow-lg shadow-cyan-100/40">
              <Star size={18} className="text-yellow-500" />
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400">Featured</p>
                <p className="text-base sm:text-lg font-bold text-slate-800">{stats.featured}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-cyan-100/60 rounded-2xl px-3 sm:px-4 py-2 shadow-lg shadow-cyan-100/40">
              <Images size={18} className="text-sky-500" />
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400">Rooms</p>
                <p className="text-base sm:text-lg font-bold text-slate-800">{stats.rooms}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-xl border border-cyan-100/60 rounded-3xl shadow-lg shadow-cyan-100/40 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 to-sky-500/10 px-5 sm:px-6 py-3 sm:py-4 border-b border-cyan-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Upload className="text-cyan-600" size={20} />
              <h2 className="font-semibold text-slate-800 text-base sm:text-lg">Add New Image</h2>
            </div>
            <span className="text-xs text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
              PNG, JPG or WEBP • Max 10MB
            </span>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Image Upload Area */}
              <div className="flex-1 w-full">
                <label className="block text-slate-600 mb-1.5 text-sm font-medium">
                  Choose Image
                </label>
                <label
                  htmlFor="file-upload"
                  className="relative flex items-center justify-center border-2 border-dashed border-cyan-200 hover:border-cyan-400 bg-white/50 rounded-2xl p-3 sm:p-4 cursor-pointer transition group min-h-[120px]"
                >
                  {filePreview ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={filePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                          setFilePreview(null);
                          const input = document.getElementById("file-upload") as HTMLInputElement;
                          if (input) input.value = "";
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 active:scale-95 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-cyan-600">
                      <Upload size={28} className="mb-2" />
                      <span className="text-sm font-medium">Click to browse</span>
                      <span className="text-xs mt-1">or drag and drop</span>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>

              {/* Caption & Category */}
              <div className="flex-1 w-full space-y-3">
                <div>
                  <label className="block text-slate-600 mb-1.5 text-sm font-medium">
                    Caption (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ocean view suite"
                    className="w-full bg-white/80 border border-cyan-100 rounded-2xl p-2.5 sm:p-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1.5 text-sm font-medium">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/80 border border-cyan-100 rounded-2xl p-2.5 sm:p-3 text-slate-700 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Button */}
              <div className="w-full lg:w-auto flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full lg:w-auto flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-cyan-200/50 hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Upload Image
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="overflow-x-auto -mx-1 px-1">
          <div className="flex gap-2 pb-1">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap active:scale-95 ${
                !filterCategory
                  ? "bg-cyan-100 text-cyan-700 shadow-sm"
                  : "bg-white/70 text-slate-500 hover:bg-cyan-50 border border-cyan-100/60"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition whitespace-nowrap active:scale-95 ${
                  filterCategory === cat
                    ? "bg-cyan-100 text-cyan-700 shadow-sm"
                    : "bg-white/70 text-slate-500 hover:bg-cyan-50 border border-cyan-100/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        {filteredImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20 bg-white/50 backdrop-blur rounded-3xl border border-cyan-100/60"
          >
            <ImageIcon size={48} className="mx-auto mb-3 text-cyan-200" />
            <p className="text-slate-500 text-sm sm:text-base">No images found in this category.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img) => (
                <motion.div
                  key={img._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-md shadow-cyan-100/30 border border-cyan-100/60 hover:shadow-xl hover:shadow-cyan-100/50 transition-shadow active:scale-[0.98]"
                >
                  <div className="relative w-full h-40 sm:h-44">
                    <Image
                      src={img.url}
                      alt={img.caption || "Gallery image"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-600/20 to-transparent" />
                    <span
                      className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full capitalize font-medium shadow-sm ${
                        categoryColors[img.category] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {img.category}
                    </span>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => startEditingCaption(img)}
                        className="bg-white/90 backdrop-blur p-1.5 rounded-full text-slate-600 hover:text-cyan-600 active:scale-95 transition shadow-sm"
                        title="Edit caption"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(img._id)}
                        className="bg-white/90 backdrop-blur p-1.5 rounded-full text-slate-600 hover:text-red-500 active:scale-95 transition shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 space-y-2">
                    {editingId === img._id ? (
                      <div className="flex items-center gap-1">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          className="flex-1 bg-white border border-cyan-100 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveCaption(img._id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                        <button
                          onClick={() => saveCaption(img._id)}
                          className="text-cyan-600 hover:text-cyan-800 p-0.5"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 truncate font-medium">
                        {img.caption || "No caption"}
                      </p>
                    )}
                    <select
                      value={img.category}
                      onChange={(e) => handleCategoryChange(img._id, e.target.value)}
                      className="w-full text-xs border border-cyan-100 rounded-md px-2 py-1.5 bg-white focus:ring-1 focus:ring-cyan-400 cursor-pointer hover:bg-cyan-50 transition"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setDeleteTarget(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border border-cyan-100/60"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="text-red-600" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Delete Image?</h3>
                </div>
                <p className="text-slate-600 text-sm mb-6">
                  This action cannot be undone. The image will be permanently removed.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 rounded-xl border border-cyan-100 text-slate-600 hover:bg-cyan-50 active:bg-cyan-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}