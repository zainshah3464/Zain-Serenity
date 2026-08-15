"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, LogIn, Loader2 } from "lucide-react";

export default function ReviewForm({ roomId }: { roomId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  if (!session?.user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 bg-white/60 backdrop-blur-lg border border-white/80 rounded-2xl shadow-md text-center"
      >
        <LogIn className="mx-auto text-teal-600 mb-2" size={24} />
        <p className="text-gray-600">
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mt-8 bg-white/60 backdrop-blur-lg border border-white/80 rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Star className="text-yellow-500 fill-yellow-400" size={20} />
        Leave a Review
      </h3>

      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-sm mb-4 px-4 py-2 rounded-xl ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          <span className="text-gray-700 font-medium mr-2">Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`text-3xl transition-all ${
                star <= (hoverRating || rating)
                  ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            >
              ★
            </motion.button>
          ))}
          {rating > 0 && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-gray-500 ml-2 font-medium"
            >
              {rating} / 5
            </motion.span>
          )}
        </div>

        <div>
          <textarea
            rows={3}
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 resize-none transition-all"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-60 shadow-md hover:shadow-lg"
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          {submitting ? "Submitting..." : "Submit Review"}
        </motion.button>
      </form>
    </motion.div>
  );
}