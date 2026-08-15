// src/app/booking/page.tsx
import { Suspense } from "react";
import BookingContent from "./BookingContent";

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">
        Loading booking form...
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}