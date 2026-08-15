"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";

interface GalleryImage {
  _id: string;
  url: string;
  caption?: string;
  category: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("featured"); // default Featured
  const limit = 12;

  const fetchImages = (category: string) => {
    setLoading(true);
    const url = category === "all" ? "/api/gallery" : `/api/gallery?category=${category}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // If viewing all, sort featured first
          const sorted = category === "all"
            ? [...data].sort((a, b) => (a.category === "featured" ? -1 : 1))
            : data;
          setImages(sorted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchImages("featured"); // default to Featured
    setPage(1);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveCategory(tab);
    setPage(1);
    fetchImages(tab);
  };

  const totalPages = Math.ceil(images.length / limit);
  const paginatedImages = images.slice((page - 1) * limit, page * limit);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/20 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
        >
          Our <span className="text-teal-600">Gallery</span>
        </motion.h1>

        {/* Category Tabs – now includes "All" right after Featured */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["featured", "all", "rooms", "bathroom", "exterior", "amenities", "pool", "other"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === tab
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-white/70 text-gray-600 hover:bg-teal-50 border border-gray-200"
              }`}
            >
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl h-48 animate-pulse"
              >
                <div className="h-full bg-gradient-to-r from-teal-100/50 via-white/50 to-teal-100/50 animate-shimmer" />
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/50 backdrop-blur-lg rounded-3xl border border-white/80"
          >
            <ImageIcon className="w-12 h-12 text-teal-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No images yet in this category.</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              <AnimatePresence mode="wait">
                {paginatedImages.map((img) => (
                  <motion.div
                    key={img._id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      visible: { opacity: 1, scale: 1 }
                    }}
                    whileHover={{ scale: 1.03 }}
                    className="relative w-full h-48 md:h-56 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-lg border border-white/80 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setSelectedImage(img.url)}
                  >
                    <Image
                      src={img.url}
                      alt={img.caption || "Gallery image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                        <p className="text-white text-sm font-medium truncate">
                          {img.caption}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-16">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-white/70 backdrop-blur-lg border border-white/80 text-gray-700 hover:text-teal-600 px-5 py-3 rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <span className="bg-white/60 backdrop-blur-lg px-5 py-2 rounded-full text-sm font-medium text-gray-600 shadow">
                  {page} / {totalPages}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="bg-white/70 backdrop-blur-lg border border-white/80 text-gray-700 hover:text-teal-600 px-5 py-3 rounded-full font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Gallery preview"
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 text-white transition"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}