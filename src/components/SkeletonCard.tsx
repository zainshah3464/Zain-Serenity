export default function SkeletonCard() {
  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl overflow-hidden shadow-md">
      <div className="h-56 bg-gradient-to-r from-teal-100/50 via-white/40 to-teal-100/50 animate-shimmer bg-[length:200%_100%]" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-teal-100/60 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-full w-3/4" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-teal-100/60 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded-full w-1/2" />
        <div className="h-10 bg-gradient-to-r from-teal-100/40 via-teal-200/40 to-teal-100/40 animate-shimmer bg-[length:200%_100%] rounded-xl w-full mt-4" />
      </div>
    </div>
  );
}