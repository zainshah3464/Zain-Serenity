"use client";
import { useState, useRef, useEffect } from "react"; // ← useEffect added
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { trackViewGallery } from "@/lib/ga4"; // ← GA4 tracking import

/* ────────────────────────────────────
   Gallery images
   ──────────────────────────────────── */
const galleryImages = [
  { src: "/images/gallery/gallery-1.jpg", alt: "Overwater villa at sunrise" },
  { src: "/images/gallery/gallery-2.jpg", alt: "Infinity pool overlooking the lagoon" },
  { src: "/images/gallery/gallery-3.jpg", alt: "Beachfront dining under the stars" },
  { src: "/images/gallery/gallery-4.jpg", alt: "Cliff‑edge yoga session" },
  { src: "/images/gallery/gallery-5.jpg", alt: "Sunset from the private deck" },
  { src: "/images/gallery/gallery-6.jpg", alt: "Lush tropical gardens" },
  { src: "/images/gallery/gallery-7.jpg", alt: "Spacious Ocean Junior Suite" },
  { src: "/images/gallery/gallery-8.jpg", alt: "Organic farm‑to‑table breakfast" },
  { src: "/images/gallery/gallery-9.jpg", alt: "Night kayaking under stars" },
];

/* ────────────────────────────────────
   Bento/Mosaic grid spans — Mobile base, Desktop md overrides
   ──────────────────────────────────── */
const spanClassesBase = [
  "col-span-2 row-span-2", // 0: Large feature
  "col-span-1 row-span-1", // 1
  "col-span-1 row-span-1", // 2
  "col-span-1 row-span-2", // 3: Tall (mobile)
  "col-span-1 row-span-1", // 4
  "col-span-1 row-span-1", // 5
  "col-span-2 row-span-1", // 6: Wide (mobile)
  "col-span-1 row-span-1", // 7
  "col-span-1 row-span-1", // 8
];

const spanClassesMd = [
  "md:col-span-2 md:row-span-2", // 0: Large feature
  "md:col-span-1 md:row-span-1", // 1
  "md:col-span-1 md:row-span-1", // 2
  "md:col-span-2 md:row-span-1", // 3: Wide (desktop)
  "md:col-span-1 md:row-span-2", // 4: Tall (desktop)
  "md:col-span-2 md:row-span-1", // 5: Wide (desktop)
  "md:col-span-1 md:row-span-1", // 6: Normal
  "md:col-span-2 md:row-span-1", // 7: Wide (desktop)
  "md:col-span-1 md:row-span-1", // 8: Normal
];

/* ────────────────────────────────────
   Floating decoration
   ──────────────────────────────────── */
function FloatingDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute top-[10%] left-[5%] w-20 h-20 md:w-24 md:h-24 rounded-full bg-teal-400/10 blur-2xl"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[5%] w-24 h-24 md:w-32 md:h-32 rounded-full bg-emerald-300/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ────────────────────────────────────
   Lightbox (unchanged)
   ──────────────────────────────────── */
function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: typeof galleryImages;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) onPrev();
      else onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative max-w-5xl w-full mx-2 md:mx-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>

          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition backdrop-blur"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition backdrop-blur"
          >
            <ChevronRight size={24} />
          </button>

          <button
            onClick={onClose}
            className="absolute top-2 md:top-4 right-2 md:right-4 p-1.5 md:p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition backdrop-blur"
          >
            <X size={22} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 md:p-4">
            <p className="text-white text-xs md:text-sm text-center">
              {images[currentIndex].alt}
            </p>
            <p className="text-white/60 text-[10px] md:text-xs text-center mt-0.5">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────
   Main Gallery Component
   ──────────────────────────────────── */
export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // GA4: view_gallery event on component mount
  useEffect(() => {
    trackViewGallery({ image_count: galleryImages.length });
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 18,
  });
  const opacity = useTransform(smoothProgress, [0, 0.2], [0.6, 1]);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const nextImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % galleryImages.length : 0
    );
  };
  const prevImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null
        ? (prev - 1 + galleryImages.length) % galleryImages.length
        : 0
    );
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-14 md:py-24 overflow-hidden bg-gradient-to-b from-white to-teal-50/20"
      >
        <FloatingDecorations />

        <motion.div style={{ opacity }} className="relative z-10 max-w-6xl mx-auto px-3 md:px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-2xl md:text-5xl font-['Playfair_Display',serif] font-extrabold text-center text-gray-800 mb-2 md:mb-4"
          >
            Our Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-center text-gray-500 max-w-lg mx-auto mb-10 md:mb-16 text-xs md:text-base"
          >
            A visual journey through Zain's Serenity — where every corner tells a story.
          </motion.p>

          {/* Bento / Mosaic Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] md:auto-rows-[200px] gap-2 md:gap-4 grid-flow-dense">
            {galleryImages.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 120, damping: 18 }}
                className={`${spanClassesBase[idx]} ${spanClassesMd[idx]} group relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl hover:shadow-2xl transition-shadow cursor-pointer`}
                onClick={() => openLightbox(idx)}
              >
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 150, damping: 12 }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </motion.div>

                {/* overlay caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 md:p-4">
                  <p className="text-white text-[10px] md:text-sm font-medium leading-tight">
                    {image.alt}
                  </p>
                </div>

                {/* shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundSize: "200% 200%", backgroundPosition: "100% 100%" }}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="absolute bottom-6 right-6 hidden md:block"
            animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="text-teal-400/40 w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedIndex !== null && (
          <ImageLightbox
            images={galleryImages}
            currentIndex={selectedIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </>
  );
}