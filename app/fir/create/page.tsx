'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Edit,
  FileText,
  Camera,
  Upload,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Sparkles,
  X,
  ChevronRight,
  Loader2,
  Shield,
  FileSignature,
  Users,
  ArrowRight,
  Volume2,
  Zap,
  Brain,
  Video,
  Send,
  ArrowLeft,
  Fingerprint
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

type FIRMode = 'manual' | 'voice' | 'template' | null;
type FIRStep = 1 | 2 | 3;
type SignatureMethod = 'aadhaar' | 'pad' | 'pin' | null;

interface Officer {
  id: string;
  name: string;
  designation: string;
  photo: string;
  available: boolean;
  workload: number;
}

interface AIsuggestion {
  type: 'ipc' | 'warning' | 'similar' | 'evidence';
  content: string;
  action?: string;
}

export default function CreateFIRPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FIRStep>(1);
  const [firMode, setFIRMode] = useState<FIRMode>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isZeroFIR, setIsZeroFIR] = useState(false);
  const [autoAssign, setAutoAssign] = useState(false);
  const [selectedOfficers, setSelectedOfficers] = useState<string[]>([]);
  const [approvalFlow, setApprovalFlow] = useState<'parallel' | 'sequence'>('parallel');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constable signature states
  const [signMethod, setSignMethod] = useState<SignatureMethod>(null);
  const [constableSigned, setConstableSigned] = useState(false);
  const [signaturePin, setSignaturePin] = useState(['', '', '', '']);

  const [formData, setFormData] = useState({
    crimeType: '',
    complainantName: '',
    complainantPhone: '',
    location: '',
    dateTime: '',
    incidentDescription: '',
    jurisdiction: '',
    evidence: [] as File[],
    ipcSections: [] as string[]
  });

  const [aiSuggestions, setAiSuggestions] = useState<AIsuggestion[]>([]);
  const [showAIHelp, setShowAIHelp] = useState(false);

  // Mock officers data
  const officers: Officer[] = [
    { id: '1', name: 'Rajesh Kumar', designation: 'Sub Inspector (SI)', photo: '👮‍♂️', available: true, workload: 5 },
    { id: '2', name: 'Priya Sharma', designation: 'Circle Inspector (CI)', photo: '👮‍♀️', available: true, workload: 3 },
    { id: '3', name: 'Amit Patel', designation: 'DSP', photo: '👮‍♂️', available: true, workload: 8 },
    { id: '4', name: 'Sunita Reddy', designation: 'SP', photo: '👮‍♀️', available: false, workload: 12 }
  ];

  // Crime templates
  const templates = [
    { id: 'theft-mobile', name: 'Mobile Theft', icon: '📱', ipc: ['379', '380'] },
    { id: 'theft-vehicle', name: 'Vehicle Theft', icon: '🚗', ipc: ['379', '411'] },
    { id: 'assault', name: 'Assault', icon: '🤜', ipc: ['323', '324', '325'] },
    { id: 'cyber-fraud', name: 'Cyber Fraud', icon: '💻', ipc: ['420', '467', '468'] },
    { id: 'domestic-violence', name: 'Domestic Violence', icon: '🏠', ipc: ['498A', '323', '506'] },
    { id: 'accident', name: 'Road Accident', icon: '🚑', ipc: ['279', '337', '338'] },
    { id: 'missing-person', name: 'Missing Person', icon: '🔍', ipc: ['363', '365'] },
    { id: 'chain-snatching', name: 'Chain Snatching', icon: '⛓️', ipc: ['392', '356'] },
    { id: 'cheating', name: 'Cheating', icon: '🎭', ipc: ['420', '406'] },
    { id: 'dowry', name: 'Dowry Harassment', icon: '💍', ipc: ['498A', '304B', '406'] }
  ];

  // IPC Sections database
  const ipcSections = [
    { code: '302', desc: 'Murder', severity: 'high' },
    { code: '307', desc: 'Attempt to murder', severity: 'high' },
    { code: '323', desc: 'Voluntarily causing hurt', severity: 'medium' },
    { code: '324', desc: 'Causing hurt by dangerous weapons', severity: 'high' },
    { code: '354', desc: 'Assault on woman', severity: 'high' },
    { code: '363', desc: 'Kidnapping', severity: 'high' },
    { code: '379', desc: 'Theft', severity: 'medium' },
    { code: '380', desc: 'Theft in dwelling house', severity: 'medium' },
    { code: '392', desc: 'Robbery', severity: 'high' },
    { code: '420', desc: 'Cheating', severity: 'medium' },
    { code: '467', desc: 'Forgery', severity: 'medium' },
    { code: '498A', desc: 'Cruelty by husband/relatives', severity: 'high' },
    { code: '506', desc: 'Criminal intimidation', severity: 'medium' }
  ];

  // AI suggestions based on input
  useEffect(() => {
    if (formData.crimeType) {
      const suggestions: AIsuggestion[] = [];

      // Suggest IPC sections
      const relevantSections = ipcSections.filter(s =>
        formData.crimeType.toLowerCase().includes(s.desc.toLowerCase().split(' ')[0])
      );
      if (relevantSections.length > 0) {
        suggestions.push({
          type: 'ipc',
          content: `Suggested IPC Sections: ${relevantSections.map(s => s.code).join(', ')}`,
          action: 'Add'
        });
      }

      // Evidence reminder
      if (formData.evidence.length === 0) {
        suggestions.push({
          type: 'evidence',
          content: 'Consider collecting: Photos, Videos, CCTV footage, Witness statements',
          action: 'Add Evidence'
        });
      }

      // Witness reminder
      if (formData.incidentDescription && !formData.incidentDescription.includes('witness')) {
        suggestions.push({
          type: 'warning',
          content: 'Add witness details if available',
          action: 'Add Witness'
        });
      }

      setAiSuggestions(suggestions);
    }
  }, [formData.crimeType, formData.evidence.length, formData.incidentDescription]);

  const handleVoiceRecord = async () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording (in production, use Web Speech API)
      setTimeout(async () => {
        const sampleTranscript = 'mobile theft market yesterday evening Rs 25000 Samsung Galaxy S23 thief red shirt motorcycle fled Vijayawada Central';
        setTranscript(sampleTranscript);
        setIsProcessing(true);

        // Simulate AI processing and fill form
        setFormData({
          ...formData,
          crimeType: 'Theft - Mobile Phone',
          location: 'Vijayawada Central Market',
          dateTime: '2026-01-02T18:00',
          incidentDescription: `On 02-01-2026 at approximately 18:00 hours, the complainant reported the following incident:\n\n${sampleTranscript}\n\nBased on the complaint received, appropriate action will be taken.`,
          ipcSections: ['379', '380']
        });
        setIsProcessing(false);
        setShowAIHelp(true);
      }, 3000);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setFormData({
        ...formData,
        crimeType: template.name,
        ipcSections: template.ipc
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData({
        ...formData,
        evidence: [...formData.evidence, ...newFiles]
      });
    }
  };

  const handleOfficerSelect = (officerId: string) => {
    if (selectedOfficers.includes(officerId)) {
      setSelectedOfficers(selectedOfficers.filter(id => id !== officerId));
    } else {
      setSelectedOfficers([...selectedOfficers, officerId]);
    }
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    // Simulate submission
    setTimeout(() => {
      const caseNumber = `AP-2026-VJA-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;
      router.push(`/fir/success?case=${caseNumber}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full glass-strong z-50 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton href="/dashboard" label="Back" />
            <div>
              <h1 className="text-xl font-bold text-gradient">File New FIR</h1>
              <p className="text-xs text-gray-400">Ultra-Fast 2-Step Process • ~40 seconds</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${currentStep === 1 ? 'bg-gradient-blue text-white' : currentStep > 1 ? 'bg-green-500/20 text-green-400' : 'glass text-gray-400'}`}>
              <span className="text-sm font-bold">{currentStep > 1 ? '✓' : '1'}</span>
              <span className="text-sm">Case Input</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${currentStep === 2 ? 'bg-gradient-blue text-white' : currentStep > 2 ? 'bg-green-500/20 text-green-400' : 'glass text-gray-400'}`}>
              <span className="text-sm font-bold">{currentStep > 2 ? '✓' : '2'}</span>
              <span className="text-sm">Your Sign</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${currentStep === 3 ? 'bg-gradient-blue text-white' : 'glass text-gray-400'}`}>
              <span className="text-sm font-bold">3</span>
              <span className="text-sm">Assignment</span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: Quick Case Input */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {!firMode ? (
                // Mode Selector
                <div className="space-y-8">
                  <div className="text-center mb-12">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-black mb-4"
                    >
                      <span className="text-gradient">Choose Filing Method</span>
                    </motion.h2>
                    <p className="text-xl text-gray-400">Select how you want to file this FIR</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Voice Mode */}
                    <motion.button
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => setFIRMode('voice')}
                      className="group glass-strong p-8 rounded-3xl hover-lift cursor-pointer relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Mic className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition-colors">
                          🎤 AI Voice Assistant
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-4">
                          Speak naturally in any language. AI transcribes and fills all fields automatically.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                          <Sparkles className="w-4 h-4" />
                          <span className="font-semibold">Fastest Method • 20 seconds</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                          <span className="px-2 py-1 bg-white/5 rounded text-xs">Telugu</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-xs">Hindi</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-xs">English</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-xs">Urdu</span>
                        </div>
                      </div>
                    </motion.button>

                    {/* Manual Mode */}
                    <motion.button
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => setFIRMode('manual')}
                      className="group glass-strong p-8 rounded-3xl hover-lift cursor-pointer relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Edit className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition-colors">
                          📝 Manual Entry
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-4">
                          Smart form with AI assistance. Only relevant fields shown based on crime type.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-400">
                          <Brain className="w-4 h-4" />
                          <span className="font-semibold">AI-Assisted • 30 seconds</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                          <span className="px-2 py-1 bg-white/5 rounded text-xs">Auto-suggest</span>
                          <span className="px-2 py-1 bg-white/5 rounded text-xs">Smart fields</span>
                        </div>
                      </div>
                    </motion.button>

                    {/* Template Mode */}
                    <motion.button
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      onClick={() => setFIRMode('template')}
                      className="group glass-strong p-8 rounded-3xl hover-lift cursor-pointer relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition-colors">
                          📄 Use Template
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-4">
                          Pre-built templates for common crimes. Fill only 5-6 fields and submit.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-purple-400">
                          <Zap className="w-4 h-4" />
                          <span className="font-semibold">Pre-filled • 25 seconds</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                          <span className="px-2 py-1 bg-white/5 rounded text-xs">50+ templates</span>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              ) : firMode === 'voice' ? (
                // Voice Mode Interface
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-4xl mx-auto"
                >
                  <button
                    onClick={() => setFIRMode(null)}
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to mode selection
                  </button>

                  <div className="glass-strong p-12 rounded-3xl text-center">
                    <h2 className="text-3xl font-bold text-gradient mb-4">AI Voice Assistant</h2>
                    <p className="text-gray-400 mb-8">Speak naturally about the incident. AI will structure it into proper FIR format.</p>

                    {/* Voice Animation */}
                    <div className="relative mb-8">
                      <motion.div
                        animate={{
                          scale: isRecording ? [1, 1.2, 1] : 1,
                          opacity: isRecording ? [1, 0.8, 1] : 1
                        }}
                        transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
                        className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center cursor-pointer ${
                          isRecording 
                            ? 'bg-gradient-to-br from-red-500 to-rose-500' 
                            : 'bg-gradient-to-br from-green-500 to-emerald-500'
                        }`}
                        onClick={handleVoiceRecord}
                      >
                        {isRecording ? <Volume2 className="w-20 h-20 text-white" /> : <Mic className="w-20 h-20 text-white" />}
                      </motion.div>

                      {isRecording && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="absolute w-48 h-48 border-4 border-red-500/30 rounded-full animate-ping" />
                          <div className="absolute w-56 h-56 border-4 border-red-500/20 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
                        </motion.div>
                      )}
                    </div>

                    <motion.button
                      onClick={handleVoiceRecord}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-12 py-4 rounded-xl font-bold text-lg ${
                        isRecording
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gradient-blue'
                      } text-white mb-6`}
                    >
                      {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </motion.button>

                    {/* Language Selection */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                      <span className="text-sm text-gray-500">Language:</span>
                      {['Telugu', 'Hindi', 'English', 'Urdu'].map((lang) => (
                        <button
                          key={lang}
                          className="px-4 py-2 glass rounded-lg text-sm hover:bg-white/10"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>

                    {/* Transcript */}
                    {transcript && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-6 rounded-2xl text-left mb-6"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Volume2 className="w-5 h-5 text-green-400" />
                          <span className="font-semibold">Live Transcription:</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{transcript}</p>
                      </motion.div>
                    )}

                    {/* Processing */}
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass p-6 rounded-2xl"
                      >
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                          <span className="font-semibold">AI Processing...</span>
                        </div>
                        <p className="text-sm text-gray-400">Analyzing statement, extracting details, suggesting IPC sections...</p>
                      </motion.div>
                    )}

                    {/* AI Help */}
                    {showAIHelp && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-6 rounded-2xl border-2 border-green-500/30"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                          <span className="font-bold text-green-400">AI Processing Complete!</span>
                        </div>
                        <div className="text-left space-y-2 text-sm">
                          <p>✓ Crime Type: {formData.crimeType}</p>
                          <p>✓ Location: {formData.location}</p>
                          <p>✓ Date/Time: January 2, 2026, 6:00 PM</p>
                          <p>✓ IPC Sections: {formData.ipcSections.join(', ')}</p>
                        </div>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="w-full mt-6 py-3 bg-gradient-blue text-white font-bold rounded-xl flex items-center justify-center gap-2"
                        >
                          Continue to Assignment
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}

                    <div className="mt-6 text-sm text-gray-500">
                      💡 Tip: Speak clearly and mention date, time, location, and what happened
                    </div>
                  </div>
                </motion.div>
              ) : firMode === 'template' ? (
                // Template Selection
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <button
                    onClick={() => setFIRMode(null)}
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to mode selection
                  </button>

                  <div className="glass-strong p-8 rounded-3xl mb-6">
                    <h2 className="text-3xl font-bold text-gradient mb-4">Select Crime Template</h2>
                    <p className="text-gray-400 mb-6">Choose a pre-built template. Most fields are already filled.</p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {templates.map((template, index) => (
                        <motion.button
                          key={template.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleTemplateSelect(template.id)}
                          className={`p-6 rounded-2xl text-center transition-all ${
                            selectedTemplate === template.id
                              ? 'bg-gradient-blue text-white scale-105'
                              : 'glass hover:bg-white/10'
                          }`}
                        >
                          <div className="text-4xl mb-3">{template.icon}</div>
                          <p className="text-sm font-semibold mb-2">{template.name}</p>
                          <p className="text-xs text-gray-400">IPC: {template.ipc.join(', ')}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {selectedTemplate && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-strong p-8 rounded-3xl"
                    >
                      <h3 className="text-2xl font-bold mb-6">Fill Variable Fields</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Complainant Name *</label>
                          <input
                            type="text"
                            placeholder="Enter full name"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            onChange={(e) => setFormData({...formData, complainantName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            placeholder="Enter phone number"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            onChange={(e) => setFormData({...formData, complainantPhone: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Enter location"
                              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                              onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time *</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="datetime-local"
                              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                              onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Additional Details</label>
                        <textarea
                          rows={4}
                          placeholder="Any specific details for this case..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                          onChange={(e) => setFormData({...formData, incidentDescription: e.target.value})}
                        />
                      </div>

                      <button
                        onClick={() => setCurrentStep(2)}
                        className="w-full mt-6 py-4 bg-gradient-blue text-white font-bold rounded-xl flex items-center justify-center gap-2"
                      >
                        Continue to Assignment
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                // Manual Entry Form
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-6xl mx-auto"
                >
                  <button
                    onClick={() => setFIRMode(null)}
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to mode selection
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Quick Details */}
                      <div className="glass-strong p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-blue-400" />
                          Quick Details
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Crime Type *</label>
                            <select
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                              onChange={(e) => setFormData({...formData, crimeType: e.target.value})}
                            >
                              <option value="">Select crime type</option>
                              {templates.map(t => (
                                <option key={t.id} value={t.name}>{t.icon} {t.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Complainant Name *</label>
                              <input
                                type="text"
                                placeholder="Full name"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                onChange={(e) => setFormData({...formData, complainantName: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                              <input
                                type="tel"
                                placeholder="Mobile number"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                onChange={(e) => setFormData({...formData, complainantPhone: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                              <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Incident location"
                                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Date & Time *</label>
                              <input
                                type="datetime-local"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Brief Description *</label>
                            <textarea
                              rows={3}
                              placeholder="Describe the incident in 2-3 lines..."
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                              onChange={(e) => setFormData({...formData, incidentDescription: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Evidence Upload */}
                      <div className="glass-strong p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Camera className="w-5 h-5 text-purple-400" />
                          Evidence Quick Add
                        </h3>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="glass p-4 rounded-xl hover:bg-white/10 flex flex-col items-center gap-2"
                          >
                            <Camera className="w-8 h-8 text-blue-400" />
                            <span className="text-sm">Photo</span>
                          </button>
                          <button className="glass p-4 rounded-xl hover:bg-white/10 flex flex-col items-center gap-2">
                            <Video className="w-8 h-8 text-red-400" />
                            <span className="text-sm">Video</span>
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="glass p-4 rounded-xl hover:bg-white/10 flex flex-col items-center gap-2"
                          >
                            <Upload className="w-8 h-8 text-green-400" />
                            <span className="text-sm">Document</span>
                          </button>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,video/*,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />

                        {formData.evidence.length > 0 && (
                          <div className="space-y-2">
                            {formData.evidence.map((file, index) => (
                              <div key={index} className="glass p-3 rounded-xl flex items-center justify-between">
                                <span className="text-sm">{file.name}</span>
                                <button className="text-red-400 hover:text-red-300">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Zero FIR Option */}
                      <div className="glass-strong p-6 rounded-2xl">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isZeroFIR}
                            onChange={(e) => setIsZeroFIR(e.target.checked)}
                            className="w-5 h-5 rounded border-white/20"
                          />
                          <div>
                            <p className="font-semibold">This crime occurred in different jurisdiction</p>
                            <p className="text-sm text-gray-400">Register as Zero FIR and auto-transfer to correct station</p>
                          </div>
                        </label>

                        {isZeroFIR && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-4"
                          >
                            <label className="block text-sm font-medium text-gray-300 mb-2">Select Correct Jurisdiction</label>
                            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500">
                              <option>Vijayawada Central</option>
                              <option>Vijayawada East</option>
                              <option>Vijayawada West</option>
                              <option>Guntur City</option>
                              <option>Rajahmundry</option>
                            </select>
                          </motion.div>
                        )}
                      </div>

                      <button
                        onClick={() => setCurrentStep(2)}
                        disabled={!formData.crimeType || !formData.complainantName}
                        className="w-full py-4 bg-gradient-blue text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Assignment
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* AI Assistance Sidebar */}
                    <div className="space-y-6">
                      <div className="glass-strong p-6 rounded-2xl sticky top-24">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-400" />
                          AI Assistance
                        </h3>

                        {aiSuggestions.length > 0 ? (
                          <div className="space-y-3">
                            {aiSuggestions.map((suggestion, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-4 rounded-xl border ${
                                  suggestion.type === 'warning' ? 'border-yellow-500/30 bg-yellow-500/10' :
                                  suggestion.type === 'ipc' ? 'border-blue-500/30 bg-blue-500/10' :
                                  'border-purple-500/30 bg-purple-500/10'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {suggestion.type === 'warning' ? <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" /> :
                                   suggestion.type === 'ipc' ? <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" /> :
                                   <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />}
                                  <div className="flex-1">
                                    <p className="text-sm mb-2">{suggestion.content}</p>
                                    {suggestion.action && (
                                      <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                                        {suggestion.action} →
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">Start filling the form to get AI suggestions...</p>
                        )}

                        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                          <p className="text-sm text-blue-300">💡 Tip: Fill crime type first to get relevant suggestions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Constable Digital Signature */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto"
            >
              <button
                onClick={() => setCurrentStep(1)}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to case details
              </button>

              <div className="glass-strong p-8 rounded-3xl mb-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FileSignature className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gradient mb-2">Your Digital Signature Required</h2>
                  <p className="text-gray-400">As the filing constable, you must sign this FIR before submission</p>
                </div>

                {/* Officer Info */}
                <div className="glass p-6 rounded-2xl mb-6">
                  <h3 className="font-semibold mb-4">Filing Officer Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Name</p>
                      <p className="font-medium">Const. K. Suresh Kumar</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Badge Number</p>
                      <p className="font-medium">PC-1234</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Station</p>
                      <p className="font-medium">Vijayawada Central PS</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Timestamp</p>
                      <p className="font-medium">{new Date().toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {!constableSigned ? (
                  <>
                    <h3 className="font-semibold mb-4 text-center">Choose Signature Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <motion.button
                        onClick={() => setSignMethod('aadhaar')}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-2xl text-center transition-all ${
                          signMethod === 'aadhaar' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' : 'glass hover:bg-white/10'
                        }`}
                      >
                        <Shield className="w-10 h-10 mx-auto mb-3 text-blue-400" />
                        <p className="font-bold mb-1">Aadhaar eSign</p>
                        <p className="text-xs opacity-80">OTP verification</p>
                      </motion.button>

                      <motion.button
                        onClick={() => setSignMethod('pad')}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-2xl text-center transition-all ${
                          signMethod === 'pad' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'glass hover:bg-white/10'
                        }`}
                      >
                        <Edit className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                        <p className="font-bold mb-1">Signature Pad</p>
                        <p className="text-xs opacity-80">Draw signature</p>
                      </motion.button>

                      <motion.button
                        onClick={() => setSignMethod('pin')}
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-2xl text-center transition-all ${
                          signMethod === 'pin' ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' : 'glass hover:bg-white/10'
                        }`}
                      >
                        <Fingerprint className="w-10 h-10 mx-auto mb-3 text-green-400" />
                        <p className="font-bold mb-1">Quick PIN</p>
                        <p className="text-xs opacity-80">4-digit approval</p>
                      </motion.button>
                    </div>

                    {/* Signature Input Based on Method */}
                    {signMethod && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-6 rounded-2xl"
                      >
                        {signMethod === 'aadhaar' && (
                          <div className="text-center">
                            <h4 className="font-semibold mb-4">Enter Aadhaar OTP</h4>
                            <p className="text-sm text-gray-400 mb-4">OTP sent to XXXXXX7890</p>
                            <div className="flex justify-center gap-3 mb-6">
                              {[0, 1, 2, 3, 4, 5].map((i) => (
                                <input
                                  key={i}
                                  type="text"
                                  maxLength={1}
                                  className="w-12 h-12 text-center text-xl font-bold bg-[#0A0E27] border border-white/20 rounded-xl focus:outline-none focus:border-blue-500"
                                />
                              ))}
                            </div>
                            <button
                              onClick={() => setConstableSigned(true)}
                              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl"
                            >
                              Verify & Sign
                            </button>
                          </div>
                        )}

                        {signMethod === 'pad' && (
                          <div className="text-center">
                            <h4 className="font-semibold mb-4">Draw Your Signature</h4>
                            <div className="w-full h-40 bg-white rounded-xl mb-4 flex items-center justify-center">
                              <p className="text-gray-400">Signature pad area</p>
                            </div>
                            <div className="flex gap-3 justify-center">
                              <button className="px-6 py-2 glass rounded-xl hover:bg-white/10">Clear</button>
                              <button
                                onClick={() => setConstableSigned(true)}
                                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl"
                              >
                                Accept Signature
                              </button>
                            </div>
                          </div>
                        )}

                        {signMethod === 'pin' && (
                          <div className="text-center">
                            <h4 className="font-semibold mb-4">Enter Your 4-Digit PIN</h4>
                            <div className="flex justify-center gap-3 mb-6">
                              {[0, 1, 2, 3].map((i) => (
                                <input
                                  key={i}
                                  type="password"
                                  maxLength={1}
                                  value={signaturePin[i]}
                                  onChange={(e) => {
                                    const newPin = [...signaturePin];
                                    newPin[i] = e.target.value;
                                    setSignaturePin(newPin);
                                    // Auto-focus next
                                    if (e.target.value && i < 3) {
                                      const next = e.target.nextElementSibling as HTMLInputElement;
                                      next?.focus();
                                    }
                                  }}
                                  className="w-14 h-14 text-center text-2xl font-bold bg-[#0A0E27] border border-white/20 rounded-xl focus:outline-none focus:border-green-500"
                                />
                              ))}
                            </div>
                            <button
                              onClick={() => setConstableSigned(true)}
                              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl"
                            >
                              Confirm & Sign
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Signature Verified!</h3>
                    <p className="text-gray-400 mb-6">Your digital signature has been recorded</p>

                    <div className="glass p-4 rounded-xl inline-block mb-6">
                      <p className="text-sm text-gray-400">Signature ID</p>
                      <p className="font-mono font-bold">DSC-AP-2026-{Math.floor(Math.random() * 100000)}</p>
                    </div>

                    <motion.button
                      onClick={() => setCurrentStep(3)}
                      whileHover={{ scale: 1.02 }}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      Continue to Officer Assignment
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Smart Assignment */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto"
            >
              <button
                onClick={() => setCurrentStep(2)}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to signature
              </button>

              <div className="glass-strong p-8 rounded-3xl mb-6">
                <h2 className="text-3xl font-bold text-gradient mb-6">Assign for Approval</h2>

                {/* Auto-assign Toggle */}
                <div className="mb-8 p-6 glass rounded-2xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoAssign}
                      onChange={(e) => setAutoAssign(e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Auto-assign based on AI rules
                      </p>
                      <p className="text-sm text-gray-400">System assigns to appropriate officers based on crime severity, workload, and jurisdiction</p>
                    </div>
                  </label>
                </div>

                {!autoAssign && (
                  <>
                    {/* Approval Flow Type */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-3">Approval Flow</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setApprovalFlow('parallel')}
                          className={`p-4 rounded-xl text-left transition-all ${
                            approvalFlow === 'parallel' ? 'bg-gradient-blue text-white' : 'glass hover:bg-white/10'
                          }`}
                        >
                          <Users className="w-6 h-6 mb-2" />
                          <p className="font-semibold mb-1">Parallel Approval</p>
                          <p className="text-xs opacity-80">All officers sign simultaneously</p>
                        </button>
                        <button
                          onClick={() => setApprovalFlow('sequence')}
                          className={`p-4 rounded-xl text-left transition-all ${
                            approvalFlow === 'sequence' ? 'bg-gradient-blue text-white' : 'glass hover:bg-white/10'
                          }`}
                        >
                          <FileSignature className="w-6 h-6 mb-2" />
                          <p className="font-semibold mb-1">Sequential Approval</p>
                          <p className="text-xs opacity-80">One after another (SI → CI → DSP)</p>
                        </button>
                      </div>
                    </div>

                    {/* Officer Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-3">Select Officers</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {officers.map((officer) => (
                          <motion.button
                            key={officer.id}
                            onClick={() => handleOfficerSelect(officer.id)}
                            className={`p-5 rounded-2xl text-left transition-all ${
                              selectedOfficers.includes(officer.id)
                                ? 'bg-gradient-blue text-white'
                                : officer.available
                                ? 'glass hover:bg-white/10'
                                : 'glass opacity-50 cursor-not-allowed'
                            }`}
                            disabled={!officer.available}
                            whileHover={officer.available ? { scale: 1.02 } : {}}
                          >
                            <div className="flex items-start gap-4">
                              <div className="text-4xl">{officer.photo}</div>
                              <div className="flex-1">
                                <p className="font-bold mb-1">{officer.name}</p>
                                <p className="text-sm opacity-80 mb-2">{officer.designation}</p>
                                <div className="flex items-center gap-2 text-xs">
                                  {officer.available ? (
                                    <>
                                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Available</span>
                                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">{officer.workload} cases</span>
                                    </>
                                  ) : (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">Unavailable</span>
                                  )}
                                </div>
                              </div>
                              {selectedOfficers.includes(officer.id) && (
                                <CheckCircle className="w-6 h-6 text-white" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Approval Flow Diagram */}
                    {selectedOfficers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-6 rounded-2xl"
                      >
                        <h3 className="font-semibold mb-4">Approval Flow Preview</h3>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                          {selectedOfficers.map((officerId, index) => {
                            const officer = officers.find(o => o.id === officerId);
                            return (
                              <div key={officerId} className="flex items-center gap-4">
                                <div className="text-center">
                                  <div className="w-16 h-16 rounded-full bg-gradient-blue flex items-center justify-center text-2xl mb-2">
                                    {officer?.photo}
                                  </div>
                                  <p className="text-xs font-medium">{officer?.designation.split(' ')[0]}</p>
                                </div>
                                {index < selectedOfficers.length - 1 && (
                                  <ArrowRight className={`w-6 h-6 ${approvalFlow === 'parallel' ? 'opacity-30' : 'text-blue-400'}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {approvalFlow === 'parallel' && (
                          <p className="text-center text-sm text-gray-400 mt-4">All officers will be notified simultaneously</p>
                        )}
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!autoAssign && selectedOfficers.length === 0 || isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-green-500/50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Submitting FIR...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    Submit & Notify Officers
                  </>
                )}
              </motion.button>

              <p className="text-center text-sm text-gray-400 mt-4">
                ⚡ Case number will be auto-generated • Officers will receive instant notification
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

