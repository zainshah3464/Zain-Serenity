"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface RoomProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  status?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  rating?: number;
}

export default function RoomCard({ room }: { room: RoomProps }) {
  return (
    <motion.div
      whileHover={{ y: -8, rotateX: 2, rotateY: -2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow relative"
      style={{ perspective: 1000 }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-2 z-10">
        {room.isNew && (
          <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            NEW
          </span>
        )}
        {room.isFeatured && (
          <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            FEATURED
          </span>
        )}
        {room.status && room.status !== "active" && (
          <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full capitalize shadow-md">
            {room.status}
          </span>
        )}
      </div>

      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={room.image}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
            <p className="text-teal-600 font-bold mt-1">
              ${room.price}<span className="text-sm text-gray-400 font-normal">/night</span>
            </p>
          </div>
          {room.rating !== undefined && room.rating > 0 && (
            <span className="text-yellow-500 flex items-center text-sm font-medium bg-yellow-50 px-2 py-1 rounded-full">
              ★ {room.rating}
            </span>
          )}
        </div>
        <Link
          href={`/rooms/${room._id}`}
          className="mt-4 inline-flex items-center justify-center w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
        >
          View Details
          <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </motion.div>
  );
}