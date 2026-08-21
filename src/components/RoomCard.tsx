"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { trackSelectItem } from "@/lib/ga4"; // ← GA4 tracking import

interface RoomProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  status?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  rating?: number;
  index?: number;
}

export default function RoomCard({ room, index = 0 }: { room: RoomProps; index?: number }) {
  const isMaintenance = room.status === "maintenance";

  // GA4: select_item event handler
  const handleSelect = () => {
    trackSelectItem({
      item_id: room._id,
      item_name: room.name,
      price: room.price,
      item_category: (room as any).roomType || "room",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      whileHover={!isMaintenance ? { y: -8, scale: 1.02 } : {}}
      className={`group relative flex flex-col bg-white/80 backdrop-blur-xl border rounded-3xl overflow-hidden shadow-lg transition-all duration-300 ${
        isMaintenance ? "border-amber-300/60 hover:shadow-xl" : "border-white/70 hover:shadow-2xl"
      }`}
      style={{ perspective: 1000 }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-1.5 z-10 flex-wrap">
        {room.isNew && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg"
          >
            NEW
          </motion.span>
        )}
        {room.isFeatured && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg"
          >
            FEATURED
          </motion.span>
        )}
        {isMaintenance && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
            className="bg-amber-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse"
          >
            MAINTENANCE
          </motion.span>
        )}
      </div>

      {/* Image container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={room.image}
          alt={room.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ${
            isMaintenance ? "grayscale-[30%]" : "group-hover:scale-110"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Shimmer overlay (only for active rooms) */}
        {!isMaintenance && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
          </div>
        )}
        {isMaintenance && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-black/60 text-white text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
              Under Maintenance
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-teal-700 transition-colors">
              {room.name}
            </h3>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-teal-600 font-extrabold mt-1 text-lg md:text-xl"
            >
              ${room.price}
              <span className="text-xs text-gray-500 font-normal ml-1">/night</span>
            </motion.p>
          </div>
          {room.rating !== undefined && room.rating > 0 && (
            <motion.span
              whileHover={!isMaintenance ? { scale: 1.1 } : {}}
              className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-full shrink-0 shadow-sm"
            >
              <span className="text-sm">★</span> {room.rating}
            </motion.span>
          )}
        </div>

        {/* Conditionally render Link or maintenance note */}
        {isMaintenance ? (
          <div className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-center bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed select-none">
            Currently Unavailable
          </div>
        ) : (
          <Link
            href={`/rooms/${room._id}`}
            onClick={handleSelect}
            className="mt-4 inline-flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white transition-all shadow-md hover:shadow-lg"
          >
            View Details
            <motion.span
              className="ml-1 inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              →
            </motion.span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}