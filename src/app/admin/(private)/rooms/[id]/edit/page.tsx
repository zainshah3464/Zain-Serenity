"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, DollarSign, Users, List, FileText, Star,
  Sparkles, ArrowLeft, Save, Image as ImageIcon,
  X, Loader2, Plus, Info, BedDouble, Trash2, Eye,
} from "lucide-react";

const AMENITIES_LIST = [
  "WiFi", "TV", "Mini Bar", "Air Conditioning", "Mountain View",
  "Balcony", "Bathtub", "Coffee Maker", "Free Parking", "Room Service",
];

const VIEW_OPTIONS = [
  "Balcony", "Terrace", "City view", "Mountain view", "Garden", "Pool", "Custom...",
];

interface RoomData {
  _id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  image: string;
  images?: string[];
  status: "active" | "inactive" | "maintenance";
  isFeatured: boolean;
  isNewRoom?: boolean;      // ✅ renamed
  view?: string;            // ✅ new field
  roomType?: string;
  bedType?: string;
  size?: string;
  discount?: number;
}

export default function EditRoom() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "2",
    amenities: [] as string[],
    status: "active",
    isFeatured: false,
    isNewRoom: true,              // ✅ renamed
    roomType: "standard",
    bedType: "queen",
    size: "",
    discount: "",
    view: "" as string,          // ✅ new field
    customView: "",              // ✅ for custom view
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [searchAmenity, setSearchAmenity] = useState("");

  useEffect(() => {
    fetch(`/api/admin/rooms/${roomId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Room not found");
        return res.json();
      })
      .then((room: RoomData) => {
        setForm({
          name: room.name || "",
          description: room.description || "",
          price: room.price?.toString() || "",
          capacity: room.capacity?.toString() || "2",
          amenities: room.amenities || [],
          status: room.status || "active",
          isFeatured: room.isFeatured || false,
          isNewRoom: room.isNewRoom !== undefined ? room.isNewRoom : true,   // ✅ renamed
          roomType: room.roomType || "standard",
          bedType: room.bedType || "queen",
          size: room.size?.toString() || "",
          discount: room.discount?.toString() || "",
          view: room.view || "",            // ✅ new
          customView: "",
        });
        setExistingImages(room.images || (room.image ? [room.image] : []));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [roomId]);

  const handleNewFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const filesArr = Array.from(selectedFiles);
    setNewFiles((prev) => [...prev, ...filesArr]);
    const previewsArr = filesArr.map((f) => URL.createObjectURL(f));
    setNewPreviews((prev) => [...prev, ...previewsArr]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleNewFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    let finalImages = [...existingImages];

    if (newFiles.length > 0) {
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (res.ok) finalImages.push(data.url);
        } catch (err) {
          setError("Failed to upload some images");
          setUploading(false);
          return;
        }
      }
    }

    const finalView = form.view === "Custom..." ? form.customView : form.view;  // ✅

    const roomData = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      capacity: Number(form.capacity),
      amenities: form.amenities,
      image: finalImages[0] || "",
      images: finalImages,
      status: form.status,
      isFeatured: form.isFeatured,
      isNewRoom: form.isNewRoom,               // ✅ renamed
      view: finalView,                          // ✅ new
      roomType: form.roomType,
      bedType: form.bedType,
      size: form.size,
      discount: form.discount ? Number(form.discount) : undefined,
    };

    try {
      const res = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      });

      if (res.ok) {
        setSuccess("Room updated successfully!");
        setTimeout(() => router.push("/admin/rooms"), 1000);
      } else {
        const errData = await res.json().catch(() => null);
        setError(errData?.error || "Failed to update room");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const filteredAmenities = AMENITIES_LIST.filter((a) =>
    a.toLowerCase().includes(searchAmenity.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-sky-600" size={40} />
      </div>
    );
  if (error && !form.name)
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <button onClick={() => router.back()} className="mt-4 text-sky-600 hover:underline">
          Go back
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="text-slate-500 hover:text-sky-600 p-2 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200 transition"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Edit Room</h1>
          <p className="text-slate-500 text-sm mt-0.5">Update room details and images</p>
        </div>
      </div>

      {/* Success/Error Toasts */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm shadow-sm"
          >
            ✓ {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm shadow-sm"
          >
            <Info size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md shadow-slate-200/50 space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText size={22} className="text-cyan-600" /> Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-slate-600 text-sm font-medium flex items-center gap-1.5">
                <BedDouble size={16} className="text-cyan-500" /> Room Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-600 text-sm font-medium flex items-center gap-1.5">
                <DollarSign size={16} className="text-cyan-500" /> Price per Night ($)
              </label>
              <input
                type="number"
                required
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-600 text-sm font-medium">Description</label>
            <textarea
              required
              rows={4}
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 resize-none transition-all"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* View Select – New field */}
          <div className="space-y-1.5">
            <label className="text-slate-600 text-sm font-medium flex items-center gap-1.5">
              <Eye size={16} className="text-cyan-500" /> View
            </label>
            <select
              value={form.view}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== "Custom...") {
                  setForm({ ...form, view: val, customView: "" });
                } else {
                  setForm({ ...form, view: val });
                }
              }}
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
            >
              <option value="">None</option>
              {VIEW_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {form.view === "Custom..." && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter custom view"
                  value={form.customView}
                  onChange={(e) => setForm({ ...form, customView: e.target.value })}
                  className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-600 text-sm font-medium">Capacity</label>
              <select
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
              >
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n} {n > 1 ? 'Guests' : 'Guest'}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-600 text-sm font-medium">Room Type</label>
              <select
                value={form.roomType}
                onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                {/* penthouse removed */}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-600 text-sm font-medium">Bed Type</label>
              <select
                value={form.bedType}
                onChange={(e) => setForm({ ...form, bedType: e.target.value })}
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="queen">Queen</option>
                <option value="king">King</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-600 text-sm font-medium">Room Size (sq. ft.)</label>
              <input
                type="text"
                placeholder="350"
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-600 text-sm font-medium">Discount (% off)</label>
            <input
              type="number"
              placeholder="10"
              min="0"
              max="100"
              className="w-full md:w-48 bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md shadow-slate-200/50 space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Info size={22} className="text-cyan-600" /> Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-slate-600 text-sm font-medium">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-slate-600 text-sm font-medium block">Quick Flags</label>
              <div className="flex flex-wrap gap-4">
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition ${
                    form.isFeatured
                      ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-yellow-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="sr-only"
                  />
                  <Star size={16} className={form.isFeatured ? "text-yellow-500 fill-yellow-500" : "text-slate-400"} />
                  Featured
                </motion.label>
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition ${
                    form.isNewRoom
                      ? "bg-sky-50 border-sky-300 text-sky-700"
                      : "bg-white border-slate-200 text-slate-500 hover:border-sky-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.isNewRoom}
                    onChange={(e) => setForm({ ...form, isNewRoom: e.target.checked })}
                    className="sr-only"
                  />
                  <Sparkles size={16} className={form.isNewRoom ? "text-sky-500" : "text-slate-400"} />
                  Mark as New
                </motion.label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Images Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md shadow-slate-200/50 space-y-6"
        >
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon size={22} className="text-cyan-600" /> Images
          </h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="text-slate-600 text-sm font-medium mb-2 block">Current Images</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {existingImages.map((url, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-xl overflow-hidden bg-slate-100 group shadow-sm"
                  >
                    <img src={url} alt="Existing" className="w-full h-28 object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="text-white bg-red-500/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-sky-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        Main
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Upload */}
          <div>
            <label className="text-slate-600 text-sm font-medium mb-2 block">Add New Images</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                dragOver ? "border-sky-500 bg-sky-50/50" : "border-slate-300 bg-white/50 hover:border-sky-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleNewFiles(e.target.files)}
              />
              <Upload className={`mb-1 ${dragOver ? "text-sky-600" : "text-slate-400"}`} size={24} />
              <p className="text-sm text-slate-500">
                <span className="text-sky-600 font-medium">Click to upload</span> or drag and drop
              </p>
            </div>
            {newPreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {newPreviews.map((url, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="relative rounded-xl overflow-hidden bg-slate-100 group shadow-sm"
                  >
                    <img src={url} alt="New" className="w-full h-28 object-cover" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute top-1 right-1 text-white bg-red-500/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <X size={14} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Amenities */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md shadow-slate-200/50 space-y-4"
        >
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <List size={22} className="text-cyan-600" /> Amenities
          </h2>
          <input
            type="text"
            placeholder="Search amenities..."
            value={searchAmenity}
            onChange={(e) => setSearchAmenity(e.target.value)}
            className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
          />
          <div className="flex flex-wrap gap-2">
            {filteredAmenities.map((amenity) => (
              <motion.button
                key={amenity}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                  form.amenities.includes(amenity)
                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-sky-300"
                }`}
              >
                {form.amenities.includes(amenity) ? "✓ " : "+ "}{amenity}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Add custom amenity..."
              className="flex-1 bg-white/80 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val && !form.amenities.includes(val)) {
                    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, val] }));
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>('input[placeholder="Add custom amenity..."]');
                if (input) {
                  const val = input.value.trim();
                  if (val && !form.amenities.includes(val)) {
                    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, val] }));
                    input.value = "";
                  }
                }
              }}
              className="bg-cyan-100 text-cyan-700 px-3 py-2 rounded-xl hover:bg-cyan-200 transition text-sm font-medium"
            >
              <Plus size={16} />
            </button>
          </div>
        </motion.div>

        {/* Room Summary (added for consistency) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-sky-50/50 rounded-xl p-5 space-y-2 border border-sky-100"
        >
          <h3 className="font-semibold text-slate-800 text-sm">Room Summary</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li><span className="font-medium">Name:</span> {form.name || "—"}</li>
            <li><span className="font-medium">Type:</span> {form.roomType} | {form.bedType}</li>
            <li><span className="font-medium">Price:</span> ${form.price || 0}/night</li>
            <li><span className="font-medium">View:</span> {form.view === "Custom..." ? form.customView || "—" : form.view || "—"}</li>
            <li><span className="font-medium">Images:</span> {existingImages.length} current + {newPreviews.length} new</li>
            <li><span className="font-medium">Amenities:</span> {form.amenities.length > 0 ? form.amenities.join(", ") : "None"}</li>
          </ul>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            type="submit"
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-300/50 hover:shadow-xl transition disabled:opacity-50"
          >
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {uploading ? "Updating Room..." : "Update Room"}
          </button>
        </motion.div>
      </form>
    </div>
  );
}