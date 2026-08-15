"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, DollarSign, Users, List, FileText, Star,
  Sparkles, ArrowLeft, Save, Image as ImageIcon,
  X, Loader2, Plus, Info, BedDouble, Wifi, Tv, Wind,
  Bath, Coffee, Mountain, Car, Camera, Trash2, Eye
} from "lucide-react";

const AMENITIES_LIST = [
  "WiFi", "TV", "Mini Bar", "Air Conditioning", "Mountain View",
  "Balcony", "Bathtub", "Coffee Maker", "Free Parking", "Room Service",
];

const VIEW_OPTIONS = [
  "Balcony", "Terrace", "City view", "Mountain view", "Garden", "Pool", "Custom...",
];

export default function NewRoom() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "2",
    amenities: [] as string[],
    status: "active",
    isFeatured: false,
    isNewRoom: true,
    roomType: "standard",
    bedType: "queen",
    size: "",
    discount: "",
    view: "" as string,
    customView: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [searchAmenity, setSearchAmenity] = useState("");

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.description || !form.price) {
      setError("Name, description and price are required.");
      setStep(1);
      return;
    }
    if (files.length === 0) {
      setError("Please add at least one room image.");
      setStep(1);
      return;
    }

    setUploading(true);
    let imageUrls: string[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json();
        imageUrls.push(data.url);
      }

      const finalView = form.view === "Custom..." ? form.customView : form.view;

      const roomData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        capacity: Number(form.capacity),
        amenities: form.amenities,
        image: imageUrls[0],
        images: imageUrls,
        status: form.status,
        isFeatured: form.isFeatured,
        isNewRoom: form.isNewRoom,
        roomType: form.roomType,
        bedType: form.bedType,
        size: form.size,
        discount: form.discount ? Number(form.discount) : undefined,
        view: finalView,
      };

      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      });

      if (res.ok) {
        router.push("/admin/rooms?success=room_created");
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to create room");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const filteredAmenities = AMENITIES_LIST.filter((a) =>
    a.toLowerCase().includes(searchAmenity.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="text-gray-500 hover:text-teal-600 p-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 transition"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add New Room</h1>
          <p className="text-gray-500 text-sm mt-0.5">Fill in the details to create a new room listing</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-2">
        {[1, 2, 3].map((s) => (
          <motion.button
            key={s}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep(s)}
            className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
              step >= s
                ? "bg-teal-500 text-white shadow-md"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {s}
          </motion.button>
        ))}
        <span className="text-sm text-gray-500 ml-2">
          {step === 1 ? "Basic Info" : step === 2 ? "Images & Amenities" : "Settings"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
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

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-md space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText size={22} className="text-teal-600" /> Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5">
                  <BedDouble size={16} className="text-teal-500" /> Room Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Deluxe Mountain Suite"
                  className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5">
                  <DollarSign size={16} className="text-teal-500" /> Price per Night ($) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="199"
                  className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5">
                <FileText size={16} className="text-teal-500" /> Description <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the room, view, and unique features..."
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 resize-none transition-all"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* View field */}
            <div className="space-y-1.5">
              <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5">
                <Eye size={16} className="text-teal-500" /> View
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
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
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
                    className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5">
                  <Users size={16} className="text-teal-500" /> Capacity
                </label>
                <select
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n > 1 ? "Guests" : "Guest"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5">
                  Room Type
                </label>
                <select
                  value={form.roomType}
                  onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                  className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                >
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5">
                  Bed Type
                </label>
                <select
                  value={form.bedType}
                  onChange={(e) => setForm({ ...form, bedType: e.target.value })}
                  className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="queen">Queen</option>
                  <option value="king">King</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5">
                  Room Size (sq. ft.)
                </label>
                <input
                  type="text"
                  placeholder="350"
                  className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5">
                Discount (% off)
              </label>
              <input
                type="number"
                placeholder="10"
                min="0"
                max="100"
                className="w-full md:w-48 bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
              >
                Next Step →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Images & Amenities */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-md space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ImageIcon size={22} className="text-teal-600" /> Images & Amenities
            </h2>

            {/* Image Upload */}
            <div>
              <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5 mb-2">
                Room Images <span className="text-red-400">*</span>
                <span className="text-gray-400 font-normal">(first image is main)</span>
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  dragOver
                    ? "border-teal-500 bg-teal-50/50"
                    : "border-gray-300 bg-white/50 hover:border-teal-400"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e.target.files)}
                />
                <Upload
                  className={`mb-1 ${dragOver ? "text-teal-600" : "text-gray-400"}`}
                  size={24}
                />
                <p className="text-sm text-gray-500">
                  <span className="text-teal-600 font-medium">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB each)</p>
              </div>
            </div>

            {/* Previews */}
            <AnimatePresence>
              {previews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-3 sm:grid-cols-4 gap-3"
                >
                  {previews.map((url, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="relative rounded-xl overflow-hidden bg-gray-100 group shadow-sm"
                    >
                      <img src={url} alt="Preview" className="w-full h-28 object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-white bg-red-500/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-teal-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                          Main
                        </span>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Amenities */}
            <div>
              <label className="text-gray-600 text-sm font-medium flex items-center gap-1.5 mb-2">
                <List size={16} className="text-teal-500" /> Amenities
              </label>
              <input
                type="text"
                placeholder="Search amenities..."
                value={searchAmenity}
                onChange={(e) => setSearchAmenity(e.target.value)}
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 mb-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
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
                        ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"
                    }`}
                  >
                    {form.amenities.includes(amenity) ? "✓ " : "+ "}
                    {amenity}
                  </motion.button>
                ))}
                {filteredAmenities.length === 0 && (
                  <p className="text-sm text-gray-400 py-2">
                    No matching amenities. You can still type custom ones below.
                  </p>
                )}
              </div>
              {/* Custom amenity input */}
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Add custom amenity..."
                  className="flex-1 bg-white/80 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val && !form.amenities.includes(val)) {
                        setForm((prev) => ({
                          ...prev,
                          amenities: [...prev.amenities, val],
                        }));
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector<HTMLInputElement>(
                      'input[placeholder="Add custom amenity..."]'
                    );
                    if (input) {
                      const val = input.value.trim();
                      if (val && !form.amenities.includes(val)) {
                        setForm((prev) => ({
                          ...prev,
                          amenities: [...prev.amenities, val],
                        }));
                        input.value = "";
                      }
                    }
                  }}
                  className="bg-teal-100 text-teal-700 px-3 py-2 rounded-xl hover:bg-teal-200 transition text-sm font-medium"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                ← Back
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(3)}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
              >
                Next Step →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Settings & Submit */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 md:p-8 shadow-md space-y-6"
          >
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Info size={22} className="text-teal-600" /> Room Settings & Publish
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-gray-600 text-sm font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                >
                  <option value="active">Active – visible to guests</option>
                  <option value="inactive">Inactive – hidden</option>
                  <option value="maintenance">
                    Maintenance – visible but not bookable
                  </option>
                </select>
              </div>

              {/* Quick toggles */}
              <div className="space-y-3">
                <label className="text-gray-600 text-sm font-medium block">
                  Quick Flags
                </label>
                <div className="flex flex-wrap gap-4">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition ${
                      form.isFeatured
                        ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                        : "bg-white border-gray-200 text-gray-500 hover:border-yellow-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm({ ...form, isFeatured: e.target.checked })
                      }
                      className="sr-only"
                    />
                    <Star
                      size={16}
                      className={
                        form.isFeatured
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-400"
                      }
                    />
                    Featured
                  </motion.label>
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition ${
                      form.isNewRoom
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-gray-200 text-gray-500 hover:border-blue-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.isNewRoom}
                      onChange={(e) =>
                        setForm({ ...form, isNewRoom: e.target.checked })
                      }
                      className="sr-only"
                    />
                    <Sparkles
                      size={16}
                      className={form.isNewRoom ? "text-blue-500" : "text-gray-400"}
                    />
                    Mark as New
                  </motion.label>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-teal-50/50 rounded-xl p-5 space-y-2 border border-teal-100">
              <h3 className="font-semibold text-gray-800 text-sm">Room Summary</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <span className="font-medium">Name:</span> {form.name || "—"}
                </li>
                <li>
                  <span className="font-medium">Type:</span> {form.roomType} |{" "}
                  {form.bedType}
                </li>
                <li>
                  <span className="font-medium">Price:</span> ${form.price || 0}/night
                </li>
                <li>
                  <span className="font-medium">View:</span>{" "}
                  {form.view === "Custom..." ? form.customView || "—" : form.view || "—"}
                </li>
                <li>
                  <span className="font-medium">Images:</span> {previews.length} selected
                </li>
                <li>
                  <span className="font-medium">Amenities:</span>{" "}
                  {form.amenities.length > 0
                    ? form.amenities.join(", ")
                    : "None"}
                </li>
              </ul>
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                ← Back
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={uploading}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {uploading ? "Creating Room..." : "Create Room"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}