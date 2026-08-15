"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { MapPin, Anchor, Compass, Waves } from "lucide-react";

export default function LocationMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Create ripple effect at click position
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple(null), 600);

    // Open maps link
    window.open("https://www.google.com/maps/place/19%C2%B059'00.0%22S+57%C2%B036'00.0%22E/@-19.9833333,57.5974197,798m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d-19.9833333!4d57.6?authuser=0&entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D", "_blank");
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-teal-50/30 to-white"
    >
      {/* Background decorative shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-teal-100/30 blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-5 w-80 h-80 rounded-full bg-emerald-100/20 blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Additional floating dots */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-2 h-2 bg-teal-400/40 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-emerald-400/40 rounded-full"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-['Playfair_Display',serif] font-extrabold text-center text-gray-800 mb-4"
        >
          Find Us in Paradise
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-500 max-w-2xl mx-auto mb-16 text-sm md:text-base"
        >
          A hidden gem on the Crystal Coast — secluded, yet within reach of your dreams.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Map visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-72 md:h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-white/50 group cursor-pointer"
            onClick={handleMapClick}
          >
            {/* Parallax background image */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ y: bgY, scale: bgScale }}
            >
              <Image
                src="/images/location/aerial-beach.jpg"
                alt="Crystal Cove coastline"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 to-emerald-900/10" />
            </motion.div>

            {/* Floating map pin with double pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <MapPin className="w-12 h-12 text-teal-500 drop-shadow-lg fill-teal-400" />
              </motion.div>
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-8 h-8 rounded-full bg-teal-400/30 blur-sm" />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              >
                <div className="w-6 h-6 rounded-full bg-teal-300/20 blur-sm" />
              </motion.div>
              {/* Coordinates label floating below pin */}
              <motion.div
                className="mt-2 text-center"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                
              </motion.div>
            </div>

            {/* Ripple effect on click */}
            <AnimatePresence>
              {ripple && (
                <motion.div
                  className="absolute rounded-full bg-white/30 pointer-events-none"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                    width: 20,
                    height: 20,
                  }}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 10, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            {/* Glass info bar at bottom – now includes coordinates */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md p-4 md:p-5 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-teal-700" />
                <span className="text-sm md:text-base font-semibold text-gray-800">
                  Crystal Cove, Mauritius
                </span>
              </div>
              <span className="text-xs font-mono text-teal-700/80">
                19°59'S 57°36'E
              </span>
            </div>
          </motion.div>

          {/* Right: Address & info card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <motion.h3
              className="text-2xl font-['Playfair_Display',serif] font-bold text-gray-800 mb-6 flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                whileHover={{ rotate: 20, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Compass className="w-8 h-8 text-teal-600" />
              </motion.div>
              Zain’s Serenity
            </motion.h3>

            <div className="space-y-6 text-gray-700">
              {/* Address row */}
              <motion.div
                className="flex items-start gap-4 p-2 -mx-2 rounded-xl transition-colors hover:bg-white/50"
                whileHover={{ x: 5 }}
              >
                <MapPin className="w-6 h-6 text-teal-600 mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-sm">Coastal Road, Crystal Cove</p>
                  <p className="text-sm">Grand Gaube, Mauritius</p>
                </div>
              </motion.div>

              {/* Getting Here row */}
              <motion.div
                className="flex items-start gap-4 p-2 -mx-2 rounded-xl transition-colors hover:bg-white/50"
                whileHover={{ x: 5 }}
              >
                <Waves className="w-6 h-6 text-teal-600 mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Getting Here</p>
                  <p className="text-sm">
                    20‑minute drive from Grand Baie.
                    <br />
                    Private helicopter transfers available upon request.
                  </p>
                </div>
              </motion.div>

              {/* Coordinates row */}
              <motion.div
                className="flex items-start gap-4 p-2 -mx-2 rounded-xl transition-colors hover:bg-white/50"
                whileHover={{ x: 5 }}
              >
                <Anchor className="w-6 h-6 text-teal-600 mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Coordinates</p>
                  <p className="text-sm font-mono text-teal-700">
                    19°59'S 57°36'E
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.a
              href="https://www.google.com/maps/place/19%C2%B059'00.0%22S+57%C2%B036'00.0%22E/@-19.9833333,57.5974197,798m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d-19.9833333!4d57.6?authuser=0&entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              className="inline-flex items-center justify-center mt-8 w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-teal-700 hover:to-emerald-700 transition-all gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: 12 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <MapPin className="w-5 h-5" />
              </motion.div>
              Open in Maps
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}