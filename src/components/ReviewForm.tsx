"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, LogIn, Loader2, UserRound, PenLine } from "lucide-react";

/* ─────────────────────────────────────
   ReviewForm – Enhanced UI/UX
   (logic untouched)
   ───────────────────────────────────── */
export default function ReviewForm({ roomId }: { roomId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // ─── Login prompt (same logic, better UI) ───
  if (!session?.user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6 p-5 sm:p-6 bg-white/60 backdrop-blur-lg border border-white/80 rounded-2xl shadow-md text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-teal-100 rounded-full mb-3">
          <LogIn className="text-teal-600" size={22} />
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Please{" "}
          <Link
            href={`/login?callbackUrl=/rooms/${roomId}`}
            className="text-teal-600 font-semibold hover:underline"
          >
            login
          </Link>{" "}
          to leave a review.
        </p>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setMessage("Please select a rating.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setSubmitting(true);
    setMessage("");
    setMessageType("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, rating, comment }),
      });
      if (res.ok) {
        setMessage("Review submitted! Thank you.");
        setMessageType("success");
        setComment("");
        setRating(0);
        router.refresh();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to submit review");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  // Rating label helper (UI only)
  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const activeLabel = ratingLabels[hoverRating || rating] || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="mt-6 relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Decorative gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500 opacity-80" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-400" size={18} />
            Leave a Review
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Share your thoughts about this room
          </p>
        </div>

        {/* User badge (if name/email available) */}
        {session.user?.name && (
          <div className="hidden sm:flex items-center gap-2 bg-white/80 border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
            <UserRound size={14} className="text-teal-600" />
            <span className="text-xs font-medium text-gray-600 truncate max-w-[120px]">
              {session.user.name}
            </span>
          </div>
        )}
      </div>

      {/* Message */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-xs sm:text-sm mb-4 px-3 py-2 rounded-xl flex items-center gap-2 ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Rating Stars */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-medium text-gray-700 w-16 sm:w-auto">
            Rating:
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.25, rotate: [0, -10, 10, 0] }}
                whileTap={{ scale: 0.8 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`text-2xl sm:text-3xl transition-all ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
                    : "text-gray-300 hover:text-yellow-200"
                }`}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                ★
              </motion.button>
            ))}
          </div>

          {/* Rating label / count */}
          <AnimatePresence mode="wait">
            {activeLabel && (
              <motion.span
                key={activeLabel}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="text-xs sm:text-sm text-gray-500 font-medium bg-gray-100/80 px-2 py-1 rounded-full"
              >
                {activeLabel}
                {rating > 0 && hoverRating === 0 && ` · ${rating}/5`}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Textarea with subtle icon and character count */}
        <div className="relative">
          <PenLine
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />
          <textarea
            rows={3}
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full pl-9 pr-12 py-3 text-sm sm:text-base bg-white/80 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 resize-none transition-all"
            required
          />
          {/* Character count (UI only, no max enforced) */}
          <span className="absolute bottom-2 right-3 text-[10px] sm:text-xs text-gray-400 pointer-events-none">
            {comment.length}
          </span>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all disabled:opacity-60 shadow-md hover:shadow-lg"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {submitting ? "Submitting..." : "Submit Review"}
        </motion.button>
      </form>
    </motion.div>
  );
}