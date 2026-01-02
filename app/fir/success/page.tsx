'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, QrCode, FileText, Share2, Printer, Home, Copy, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import PDFDownloadModal from '@/components/PDFDownloadModal';
import BackButton from '@/components/BackButton';

function FIRSuccessContent() {
  const searchParams = useSearchParams();
  const caseNumber = searchParams.get('case') || 'AP-2026-VJA-00234';
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(caseNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'FIR Filed Successfully',
      text: `FIR ${caseNumber} has been filed successfully. Track status at appolice.gov.in`,
      url: `https://appolice.gov.in/track/${caseNumber}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Share failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-40">
        <BackButton href="/dashboard" label="Dashboard" />
      </div>

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
                y: -20,
                x: Math.random() * window.innerWidth,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: Math.random() * 720 - 360,
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5,
                ease: 'linear'
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: ['#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 6)]
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong p-10 rounded-3xl max-w-2xl w-full text-center relative z-10"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black mb-4"
        >
          <span className="text-gradient">FIR Filed Successfully!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-8"
        >
          Your FIR has been registered and assigned to the investigating officer.
        </motion.p>

        {/* Case Number Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-2xl mb-8"
        >
          <p className="text-sm text-gray-400 mb-2">Case Number</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-mono font-bold text-gradient">{caseNumber}</span>
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 glass rounded-lg hover:bg-white/10"
            >
              {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* QR Code Placeholder */}
          <div className="mt-6 flex justify-center">
            <div className="p-4 bg-white rounded-xl">
              <QrCode className="w-24 h-24 text-[#0A0E27]" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Scan to track case status</p>
        </motion.div>

        {/* Time Saved Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full mb-8"
        >
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Time Saved: ~2 hours compared to traditional filing</span>
        </motion.div>

        {/* Officer Notification Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass p-4 rounded-xl mb-8"
        >
          <h3 className="text-sm font-semibold mb-3">Officers Notified</h3>
          <div className="flex justify-center gap-4">
            {['SI Rajesh Kumar', 'CI Priya Sharma'].map((officer, index) => (
              <div key={officer} className="flex items-center gap-2 text-sm">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: 0.8 + index * 0.2, repeat: 2 }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                <span className="text-gray-300">{officer}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <motion.button
            onClick={() => setShowPDFModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </motion.button>

          <motion.button
            onClick={() => window.print()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 glass text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print
          </motion.button>
        </motion.div>

        {/* Secondary Actions */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 glass rounded-lg hover:bg-white/10 flex items-center gap-2 text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
          <Link href={`/public?case=${caseNumber}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 glass rounded-lg hover:bg-white/10 flex items-center gap-2 text-sm"
            >
              <FileText className="w-4 h-4" />
              Track Status
            </motion.button>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Link href="/fir/create" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full py-3 glass rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              File Another FIR
            </motion.button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full py-3 glass rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* PDF Download Modal */}
      <PDFDownloadModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        caseNumber={caseNumber}
      />
    </div>
  );
}

export default function FIRSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <FIRSuccessContent />
    </Suspense>
  );
}

