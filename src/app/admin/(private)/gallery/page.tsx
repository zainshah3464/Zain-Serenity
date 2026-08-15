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
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight"
            >
              Gallery Management
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchImages}
              disabled={refreshing}
              className="p-2 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-teal-600 shadow-sm hover:shadow-md transition disabled:opacity-60 active:bg-gray-100"
              title="Refresh gallery"
            >
              <RefreshCw
                size={18}
                className={`${refreshing ? "animate-spin" : ""}`}
              />
            </motion.button>
          </div>
          <p className="text-sm text-gray-500">
            Upload, organize & showcase your property’s best moments
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-white/80 rounded-xl px-3 sm:px-4 py-2 shadow-sm">
            <ImageIcon size={18} className="text-teal-600" />
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400">Total</p>
              <p className="text-base sm:text-lg font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-white/80 rounded-xl px-3 sm:px-4 py-2 shadow-sm">
            <Star size={18} className="text-yellow-500" />
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400">Featured</p>
              <p className="text-base sm:text-lg font-bold text-gray-800">{stats.featured}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-white/80 rounded-xl px-3 sm:px-4 py-2 shadow-sm">
            <Images size={18} className="text-blue-500" />
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400">Rooms</p>
              <p className="text-base sm:text-lg font-bold text-gray-800">{stats.rooms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 px-5 sm:px-6 py-3 sm:py-4 border-b border-teal-100/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Upload className="text-teal-600" size={20} />
            <h2 className="font-semibold text-gray-800 text-base sm:text-lg">Add New Image</h2>
          </div>
          <span className="text-xs text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
            PNG, JPG or WEBP • Max 10MB
          </span>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Image Upload Area */}
            <div className="flex-1 w-full">
              <label className="block text-gray-600 mb-1.5 text-sm font-medium">
                Choose Image
              </label>
              <label
                htmlFor="file-upload"
                className="relative flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-teal-400 bg-white/50 rounded-xl p-3 sm:p-4 cursor-pointer transition group min-h-[120px]"
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
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-teal-600">
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
                <label className="block text-gray-600 mb-1.5 text-sm font-medium">
                  Caption (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ocean view suite"
                  className="w-full bg-white/80 border border-gray-200 rounded-xl p-2.5 sm:p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1.5 text-sm font-medium">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/80 border border-gray-200 rounded-xl p-2.5 sm:p-3 text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition cursor-pointer"
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
                className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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
                ? "bg-teal-100 text-teal-700 shadow-sm"
                : "bg-white/70 text-gray-500 hover:bg-gray-100 border border-gray-200"
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
                  ? "bg-teal-100 text-teal-700 shadow-sm"
                  : "bg-white/70 text-gray-500 hover:bg-gray-100 border border-gray-200"
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
          className="text-center py-16 sm:py-20 bg-white/50 backdrop-blur rounded-2xl border border-gray-200/60"
        >
          <ImageIcon size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm sm:text-base">No images found in this category.</p>
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
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow active:scale-[0.98]"
              >
                <div className="relative w-full h-40 sm:h-44">
                  <Image
                    src={img.url}
                    alt={img.caption || "Gallery image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span
                    className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full capitalize font-medium shadow-sm ${
                      categoryColors[img.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {img.category}
                  </span>
                  {/* Action buttons – visible on hover and when focused within */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => startEditingCaption(img)}
                      className="bg-white/90 backdrop-blur p-1.5 rounded-full text-gray-600 hover:text-teal-600 active:scale-95 transition shadow-sm"
                      title="Edit caption"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(img._id)}
                      className="bg-white/90 backdrop-blur p-1.5 rounded-full text-gray-600 hover:text-red-500 active:scale-95 transition shadow-sm"
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
                        className="flex-1 bg-white border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-400"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveCaption(img._id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => saveCaption(img._id)}
                        className="text-teal-600 hover:text-teal-800 p-0.5"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 truncate font-medium">
                      {img.caption || "No caption"}
                    </p>
                  )}
                  <select
                    value={img.category}
                    onChange={(e) => handleCategoryChange(img._id, e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white focus:ring-1 focus:ring-teal-400 cursor-pointer hover:bg-gray-50 transition"
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
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Delete Image?</h3>
              </div>
              <p className="text-gray-600 text-sm mb-6">
                This action cannot be undone. The image will be permanently removed.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition"
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
  );
}