'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0A0E27] text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center"
        >
          <AlertTriangle className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-4xl font-black mb-4">
          <span className="text-gradient">Something went wrong!</span>
        </h1>

        <p className="text-gray-400 mb-8">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={reset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </motion.button>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 glass text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

