import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const ModalWrapper = ({ isOpen, onClose, children, title = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
      {/* Background glow effects */}
      <div className="absolute top-12 left-12 w-64 h-64 bg-purple-600 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-64 h-64 bg-indigo-500 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-tr from-[#0f172a] to-[#1e293b] rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-8 text-white"
      >
        {/* Close button at top-left */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 btn btn-sm btn-circle btn-ghost hover:bg-white/20 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title (optional) */}
        {title && (
          <div className="mb-6 text-center">
            <h3 className="text-3xl font-extrabold tracking-tight">{title}</h3>
          </div>
        )}

        {children}
      </motion.div>
    </div>
  );
};

export default ModalWrapper;
