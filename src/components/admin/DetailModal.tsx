"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  columns: { key: string; label: string }[];
  data: Record<string, any>[];
  renderCell?: (item: any, columnKey: string) => React.ReactNode;
}

export default function DetailModal({
  isOpen,
  onClose,
  title,
  columns,
  data,
  renderCell,
}: DetailModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop - lighter neutral */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden border border-sky-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - BRIGHT sky/cyan gradient */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg">
              <h2 className="text-lg font-bold tracking-tight truncate pr-2">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-xl hover:bg-white/20 transition-colors active:scale-90"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-6">
              {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <p className="text-lg font-medium">No data available.</p>
                </div>
              ) : (
                /* Horizontal scroll wrapper */
                <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm">
                  {/* Table with min-width for mobile horizontal scroll */}
                  <table className="min-w-[600px] w-full text-sm">
                    <thead className="bg-gradient-to-r from-sky-50 to-cyan-50 sticky top-0 z-10">
                      <tr className="border-b border-sky-100">
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            className="text-left px-4 sm:px-5 py-3 font-semibold text-slate-600 whitespace-nowrap"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, idx) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          key={idx}
                          className="border-t border-sky-100 even:bg-sky-50/40 hover:bg-sky-50/60 transition-colors"
                        >
                          {columns.map((col) => (
                            <td
                              key={col.key}
                              className="px-4 sm:px-5 py-3 text-slate-700 whitespace-nowrap"
                            >
                              {renderCell ? renderCell(item, col.key) : item[col.key]}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}