'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Copy,
  Download,
  RefreshCw,
  CheckCircle,
  Shield,
  AlertTriangle,
  FileText,
  Brain,
  Zap,
  ArrowRight,
  X,
  Loader2,
  Clock,
  MapPin,
  User,
  Calendar,
  ChevronDown,
  Mic,
  Edit,
  Save,
  Eye
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { quickGenerateFIR, generateFIRNarrative, GeneratedFIR, FIRGenerationInput } from '@/lib/ai-fir-writer';
import Link from 'next/link';

export default function AIFIRWriterPage() {
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFIR, setGeneratedFIR] = useState<GeneratedFIR | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedNarrative, setEditedNarrative] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Advanced form fields
  const [advancedInput, setAdvancedInput] = useState<FIRGenerationInput>({
    keywords: [],
    crimeType: '',
    location: '',
    date: '',
    time: '',
    complainantName: '',
    language: 'english'
  });

  // Sample prompts
  const samplePrompts = [
    'mobile theft market yesterday evening Rs 25000',
    'cyber fraud bank account hacked 50000 rupees transferred',
    'domestic violence husband beating wife regularly',
    'vehicle theft car stolen from parking Vijayawada',
    'chain snatching gold necklace motorcycle two persons',
    'accident hit and run pedestrian injured hospital'
  ];

  const handleGenerate = async () => {
    if (!keywords.trim() && !showAdvanced) return;

    setIsGenerating(true);
    setGeneratedFIR(null);

    try {
      let result: GeneratedFIR;

      if (showAdvanced) {
        const input: FIRGenerationInput = {
          ...advancedInput,
          keywords: advancedInput.keywords.length > 0 ? advancedInput.keywords : keywords.split(/[,\s]+/).filter(k => k.trim())
        };
        result = await generateFIRNarrative(input);
      } else {
        result = await quickGenerateFIR(keywords);
      }

      setGeneratedFIR(result);
      setEditedNarrative(result.narrative);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = editMode ? editedNarrative : generatedFIR?.narrative;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSampleClick = (sample: string) => {
    setKeywords(sample);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'from-red-500 to-rose-500';
    if (score >= 5) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 8) return 'High Priority';
    if (score >= 5) return 'Medium Priority';
    return 'Low Priority';
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-strong border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 glass rounded-xl hover:bg-white/10">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                AI FIR Writer
              </h1>
              <p className="text-sm text-gray-400">Powered by Gemini AI</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/fir/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="px-4 py-2 glass rounded-xl text-sm hover:bg-white/10 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Full FIR Form
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(139, 92, 246, 0.3)',
                '0 0 60px rgba(139, 92, 246, 0.5)',
                '0 0 20px rgba(139, 92, 246, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          >
            <Brain className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-4xl font-black mb-4">
            <span className="text-gradient">Generate FIR from Keywords</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Enter any keywords or brief description. AI will generate a complete,
            legally formatted FIR narrative with suggested IPC sections.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong p-8 rounded-3xl mb-8"
        >
          {/* Quick Input */}
          <div className="mb-6">
            <label className="block text-lg font-bold mb-3">
              Enter Keywords / Brief Description
            </label>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Example: mobile theft market yesterday 6pm Samsung phone Rs 25000 value two persons motorcycle"
                rows={4}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none text-lg"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button className="p-2 glass rounded-lg hover:bg-white/10">
                  <Mic className="w-5 h-5 text-purple-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Sample Prompts */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sample, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSampleClick(sample)}
                  className="px-4 py-2 glass rounded-full text-sm hover:bg-purple-500/20 hover:border-purple-500/50 border border-transparent transition-all"
                >
                  {sample}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 mb-6"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>

          {/* Advanced Options */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="glass p-6 rounded-2xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Complainant Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter name"
                        value={advancedInput.complainantName}
                        onChange={(e) => setAdvancedInput({...advancedInput, complainantName: e.target.value})}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Enter location"
                        value={advancedInput.location}
                        onChange={(e) => setAdvancedInput({...advancedInput, location: e.target.value})}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Crime Type
                      </label>
                      <select
                        value={advancedInput.crimeType}
                        onChange={(e) => setAdvancedInput({...advancedInput, crimeType: e.target.value})}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="">Auto-detect</option>
                        <option value="Theft">Theft</option>
                        <option value="Robbery">Robbery</option>
                        <option value="Assault">Assault</option>
                        <option value="Cyber Crime">Cyber Crime</option>
                        <option value="Domestic Violence">Domestic Violence</option>
                        <option value="Fraud">Fraud</option>
                        <option value="Road Accident">Road Accident</option>
                        <option value="Missing Person">Missing Person</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Date of Incident
                      </label>
                      <input
                        type="date"
                        value={advancedInput.date}
                        onChange={(e) => setAdvancedInput({...advancedInput, date: e.target.value})}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Time of Incident
                      </label>
                      <input
                        type="time"
                        value={advancedInput.time}
                        onChange={(e) => setAdvancedInput({...advancedInput, time: e.target.value})}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={advancedInput.language}
                        onChange={(e) => setAdvancedInput({...advancedInput, language: e.target.value as 'english' | 'hindi' | 'telugu'})}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="telugu">Telugu</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            disabled={isGenerating || (!keywords.trim() && !showAdvanced)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate FIR Narrative
                <Zap className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Generated Output */}
        <AnimatePresence>
          {generatedFIR && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="glass-strong p-6 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRiskColor(generatedFIR.riskScore)} flex items-center justify-center`}>
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Risk Score</p>
                      <p className="text-2xl font-bold">{generatedFIR.riskScore}/10</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{getRiskLabel(generatedFIR.riskScore)}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glass-strong p-6 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">IPC Sections</p>
                      <p className="text-2xl font-bold">{generatedFIR.suggestedIPCSections.length}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Suggested sections identified</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="glass-strong p-6 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Evidence Items</p>
                      <p className="text-2xl font-bold">{generatedFIR.suggestedEvidence.length}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Recommended to collect</p>
                </motion.div>
              </div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-4 rounded-2xl border-l-4 border-purple-500"
              >
                <p className="text-sm text-purple-400 font-medium mb-1">AI Summary</p>
                <p className="text-white">{generatedFIR.summary}</p>
              </motion.div>

              {/* Main Narrative */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-strong p-8 rounded-3xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-400" />
                    Generated FIR Narrative
                  </h3>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => setEditMode(!editMode)}
                      whileHover={{ scale: 1.05 }}
                      className={`p-2 rounded-lg transition-colors ${editMode ? 'bg-blue-500/20 text-blue-400' : 'glass hover:bg-white/10'}`}
                    >
                      {editMode ? <Eye className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                      onClick={handleCopy}
                      whileHover={{ scale: 1.05 }}
                      className="p-2 glass rounded-lg hover:bg-white/10"
                    >
                      {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                      onClick={handleGenerate}
                      whileHover={{ scale: 1.05 }}
                      className="p-2 glass rounded-lg hover:bg-white/10"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {editMode ? (
                  <textarea
                    value={editedNarrative}
                    onChange={(e) => setEditedNarrative(e.target.value)}
                    className="w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 resize-none font-mono text-sm leading-relaxed"
                  />
                ) : (
                  <div className="glass p-6 rounded-2xl">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {editMode ? editedNarrative : generatedFIR.narrative}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* IPC Sections */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-strong p-8 rounded-3xl"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Suggested IPC Sections
                </h3>
                <div className="flex flex-wrap gap-3">
                  {generatedFIR.suggestedIPCSections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium border border-blue-500/30"
                    >
                      {section}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Evidence Checklist */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-strong p-8 rounded-3xl"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Evidence Collection Checklist
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {generatedFIR.suggestedEvidence.map((evidence, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="flex items-center gap-3 p-3 glass rounded-xl"
                    >
                      <div className="w-6 h-6 rounded-md border border-green-500/50 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-gray-300">{evidence}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/fir/create" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Use in FIR Form
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 glass text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download as PDF
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it Works */}
        {!generatedFIR && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-strong p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">How AI FIR Writer Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Enter Keywords', desc: 'Type any keywords about the incident', icon: Edit },
                { step: 2, title: 'AI Analyzes', desc: 'Gemini AI processes and understands context', icon: Brain },
                { step: 3, title: 'Generate FIR', desc: 'Complete narrative with IPC sections', icon: FileText },
                { step: 4, title: 'Review & Use', desc: 'Edit if needed and use in FIR form', icon: CheckCircle }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-sm text-purple-400 font-medium mb-1">Step {item.step}</div>
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

