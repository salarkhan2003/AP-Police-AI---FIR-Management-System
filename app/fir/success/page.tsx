'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, QrCode, FileText, Share2, Printer, Home, Copy } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FIRSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const caseNumber = searchParams.get('case') || 'AP-2026-VJA-00001';
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(caseNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    // In production, this would generate the actual PDF
    alert('Downloading FIR PDF...');
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-cyan-500/10" />
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-10"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10"
          animate={{ scale: [1, 1.3, 1], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                x: Math.random() * window.innerWidth
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                ease: 'linear',
                delay: Math.random() * 0.5
              }}
              className={`absolute w-3 h-3 ${
                ['bg-green-500', 'bg-cyan-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]
              }`}
              style={{
                borderRadius: Math.random() > 0.5 ? '50%' : '0%'
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-2xl w-full"
      >
        {/* Success Card */}
        <div className="glass-strong p-10 rounded-3xl text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5, delay: 0.2 }}
            className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <CheckCircle className="w-16 h-16 text-white" />
            </motion.div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-black mb-4">
              <span className="text-gradient">FIR Filed Successfully!</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The FIR has been submitted and officers have been notified.
            </p>
          </motion.div>

          {/* Case Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6 rounded-2xl mb-8"
          >
            <p className="text-sm text-gray-400 mb-2">Case Number</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl font-black text-gradient font-mono">{caseNumber}</p>
              <button
                onClick={handleCopy}
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </motion.div>

          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-6 rounded-2xl mb-8"
          >
            <div className="flex items-center justify-center gap-8">
              <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
                <QrCode className="w-24 h-24 text-[#0A0E27]" />
              </div>
              <div className="text-left">
                <p className="font-bold mb-2">Scan to Track</p>
                <p className="text-sm text-gray-400 mb-3">
                  Complainant can scan this QR code to track the case status online.
                </p>
                <p className="text-xs text-gray-500">
                  Portal: appolice.gov.in/track
                </p>
              </div>
            </div>
          </motion.div>

          {/* Notification Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-6 rounded-2xl mb-8"
          >
            <h3 className="font-bold mb-4">Officers Notified</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <span>SI Rajesh Kumar</span>
                </div>
                <span className="text-xs text-green-400">Push + SMS sent</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <span>CI Priya Sharma</span>
                </div>
                <span className="text-xs text-green-400">Email sent</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <motion.button
              onClick={handleDownloadPDF}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-4 glass text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print FIR
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-4 glass text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Link
            </motion.button>
            <Link href="/fir/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 glass text-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                File Another
              </motion.button>
            </Link>
          </motion.div>

          {/* Return to Dashboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8"
          >
            <Link href="/dashboard">
              <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto">
                <Home className="w-4 h-4" />
                Return to Dashboard
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Time Saved Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full">
            <span className="text-green-400 font-bold">⚡ Time Saved:</span>
            <span className="text-white">2 hours 18 minutes</span>
            <span className="text-gray-400">(compared to traditional method)</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

