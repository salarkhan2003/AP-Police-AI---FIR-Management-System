'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  X,
  FileText,
  Shield,
  Eye,
  Printer,
  Mail,
  Link2,
  Lock,
  CheckCircle,
  Loader2,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import { generateFIRPDF, downloadPDF, getSampleFIRData, FIRData, PDFCopyType } from '@/lib/pdf-generator';

interface PDFDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  firData?: FIRData;
  caseNumber?: string;
}

export default function PDFDownloadModal({
  isOpen,
  onClose,
  firData,
  caseNumber = 'AP-2026-VJA-00234'
}: PDFDownloadModalProps) {
  const [selectedType, setSelectedType] = useState<PDFCopyType>('original');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const copyTypes = [
    {
      id: 'original' as PDFCopyType,
      name: 'Original Copy',
      description: 'Full FIR with all details',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'certified' as PDFCopyType,
      name: 'Certified Copy',
      description: 'With "CERTIFIED TRUE COPY" watermark',
      icon: Shield,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'public' as PDFCopyType,
      name: 'Public Copy',
      description: 'Sensitive details masked',
      icon: Eye,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'draft' as PDFCopyType,
      name: 'Draft Copy',
      description: 'NOT FOR LEGAL USE watermark',
      icon: AlertTriangle,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const data = firData || getSampleFIRData();
      const blob = await generateFIRPDF(data, selectedType);
      setPdfBlob(blob);
      setIsGenerated(true);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfBlob) {
      const filename = `FIR_${caseNumber}_${selectedType}_${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(pdfBlob, filename);
    }
  };

  const handlePrint = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  const handleEmail = () => {
    // In production, this would open email client or send via backend
    alert('Email functionality would send the PDF to the registered email address.');
  };

  const handleCopyLink = () => {
    const verifyUrl = `https://appolice.gov.in/verify/${caseNumber}`;
    navigator.clipboard.writeText(verifyUrl);
    alert('Verification link copied to clipboard!');
  };

  const resetModal = () => {
    setIsGenerated(false);
    setPdfBlob(null);
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gradient">Download FIR PDF</h2>
                <p className="text-gray-400 text-sm">Case: {caseNumber}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 glass rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!isGenerated ? (
              <>
                {/* Copy Type Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Select Copy Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {copyTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl text-left transition-all ${
                          selectedType === type.id
                            ? 'bg-gradient-to-br ' + type.color + ' shadow-lg'
                            : 'glass hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <type.icon className="w-5 h-5" />
                          <span className="font-semibold">{type.name}</span>
                        </div>
                        <p className="text-xs opacity-80">{type.description}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* PDF Preview Info */}
                <div className="glass p-4 rounded-xl mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    PDF Contents
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Official AP Police letterhead & emblem
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      QR code for online verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      All FIR details in structured format
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Digital signatures with timestamps
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Security watermarks & document hash
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400" />
                      A4 print-ready format
                    </li>
                  </ul>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
                    {error}
                  </div>
                )}

                {/* Generate Button */}
                <motion.button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="w-6 h-6" />
                      Generate PDF
                    </>
                  )}
                </motion.button>
              </>
            ) : (
              <>
                {/* Success State */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center mb-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">PDF Generated Successfully!</h3>
                  <p className="text-gray-400 text-sm">
                    Your {selectedType} copy is ready for download
                  </p>
                </motion.div>

                {/* Download Options */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <motion.button
                    onClick={handleDownload}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl flex flex-col items-center gap-2"
                  >
                    <Download className="w-6 h-6" />
                    <span>Download PDF</span>
                  </motion.button>

                  <motion.button
                    onClick={handlePrint}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 glass text-white font-semibold rounded-xl flex flex-col items-center gap-2 hover:bg-white/10"
                  >
                    <Printer className="w-6 h-6" />
                    <span>Print</span>
                  </motion.button>

                  <motion.button
                    onClick={handleEmail}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 glass text-white font-semibold rounded-xl flex flex-col items-center gap-2 hover:bg-white/10"
                  >
                    <Mail className="w-6 h-6" />
                    <span>Email</span>
                  </motion.button>

                  <motion.button
                    onClick={handleCopyLink}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 glass text-white font-semibold rounded-xl flex flex-col items-center gap-2 hover:bg-white/10"
                  >
                    <Link2 className="w-6 h-6" />
                    <span>Copy Link</span>
                  </motion.button>
                </div>

                {/* Document Info */}
                <div className="glass p-4 rounded-xl mb-6">
                  <h4 className="font-semibold mb-2 text-sm">Document Information</h4>
                  <div className="space-y-1 text-xs text-gray-400">
                    <p>Generated: {new Date().toLocaleString()}</p>
                    <p>Copy Type: {copyTypes.find(t => t.id === selectedType)?.name}</p>
                    <p>Format: PDF (A4, Print-Ready)</p>
                  </div>
                </div>

                {/* Generate Another */}
                <button
                  onClick={resetModal}
                  className="w-full py-3 glass text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-colors"
                >
                  Generate Different Copy Type
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

