'use client';

import { motion } from 'framer-motion';
import { Loader2, Shield } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0E27] text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
        >
          <Shield className="w-10 h-10 text-white" />
        </motion.div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center justify-center gap-3"
        >
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <span className="text-lg font-medium text-gray-300">Loading...</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

