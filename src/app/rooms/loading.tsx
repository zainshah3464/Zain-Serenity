export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50/20 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="h-10 bg-gradient-to-r from-teal-100/40 via-white/50 to-teal-100/40 animate-shimmer rounded-full w-64 mb-10" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl overflow-hidden shadow animate-pulse">
              <div className="h-64 bg-gradient-to-r from-teal-100/50 via-white/40 to-teal-100/50 animate-shimmer" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gradient-to-r from-gray-200 via-teal-100/60 to-gray-200 animate-shimmer rounded-full w-3/4" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-teal-100/60 to-gray-200 animate-shimmer rounded-full w-1/2" />
                <div className="h-10 bg-gradient-to-r from-teal-100/40 via-teal-200/40 to-teal-100/40 animate-shimmer rounded-xl w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}