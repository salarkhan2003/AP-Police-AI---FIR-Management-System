'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  Copy,
  RefreshCw,
  CheckCircle,
  Shield,
  AlertTriangle,
  FileText,
  Brain,
  Zap,
  ArrowLeft,
  Loader2,
  MapPin,
  User,
  Calendar,
  Mic,
  Edit,
  Eye,
  Phone,
  CreditCard,
  Send
} from 'lucide-react';
import { useState, useRef } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

const GEMINI_API_KEY = 'AIzaSyCAuhQwSqprfgRSpPWiSRmv0-lNQ6Y4uRk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeneratedFIR {
  narrative: string;
  suggestedIPCSections: string[];
  suggestedEvidence: string[];
  riskScore: number;
  summary: string;
  missingFields: string[];
}

interface ComplainantDetails {
  name: string;
  fatherName: string;
  age: string;
  phone: string;
  address: string;
  idType: string;
  idNumber: string;
}

export default function AIFIRWriterPage() {
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFIR, setGeneratedFIR] = useState<GeneratedFIR | null>(null);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedNarrative, setEditedNarrative] = useState('');
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [step, setStep] = useState<'prompt' | 'details' | 'result'>('prompt');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Complainant details
  const [complainantDetails, setComplainantDetails] = useState<ComplainantDetails>({
    name: '',
    fatherName: '',
    age: '',
    phone: '',
    address: '',
    idType: 'Aadhaar',
    idNumber: ''
  });

  // Sample NLP prompts
  const samplePrompts = [
    'Write a FIR for bike theft case where my Hero Splendor was stolen from office parking',
    'My mobile phone Samsung Galaxy was snatched near bus stand by two persons on motorcycle',
    'File FIR for cyber fraud - someone transferred Rs 50000 from my bank account',
    'Report domestic violence case - husband beating wife for dowry',
    'Chain snatching incident - gold chain stolen while walking on road',
    'Hit and run accident case - vehicle hit pedestrian and fled'
  ];

  const generateWithGemini = async (prompt: string, details?: ComplainantDetails): Promise<GeneratedFIR> => {
    const systemPrompt = `You are an expert FIR (First Information Report) writer for Andhra Pradesh Police, India. 
    
The user will describe a crime incident in natural language. Your task is to:
1. Generate a complete, professional FIR narrative in formal police language
2. Identify relevant IPC sections
3. Suggest evidence to collect
4. Calculate risk score (1-10)
5. Identify any missing information needed

USER'S DESCRIPTION: ${prompt}

${details ? `
COMPLAINANT DETAILS PROVIDED:
- Name: ${details.name || 'Not provided'}
- Father's Name: ${details.fatherName || 'Not provided'}
- Age: ${details.age || 'Not provided'}
- Phone: ${details.phone || 'Not provided'}
- Address: ${details.address || 'Not provided'}
- ID Type: ${details.idType || 'Not provided'}
- ID Number: ${details.idNumber || 'Not provided'}
` : ''}

Generate a JSON response with this EXACT structure:
{
  "narrative": "Complete FIR narrative in formal police language (200-300 words). Start with 'On [date], the complainant...' Use formal language like 'The complainant stated that...', 'As per the statement recorded...'. Include all details from the description.",
  "suggestedIPCSections": ["Section number - Brief description", "Section number - Brief description"],
  "suggestedEvidence": ["Evidence item 1", "Evidence item 2", "Evidence item 3"],
  "riskScore": 5,
  "summary": "One line summary of the incident",
  "missingFields": ["List of important missing information like exact time, location details, witness info etc."]
}

IMPORTANT: 
- If complainant details are not provided, use placeholders like [COMPLAINANT NAME], [PHONE], etc.
- The narrative should be ready to use in an official FIR
- Be specific about IPC sections relevant to the crime described
- Generate ONLY valid JSON, no extra text`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse JSON from response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          narrative: parsed.narrative || 'Failed to generate narrative',
          suggestedIPCSections: parsed.suggestedIPCSections || [],
          suggestedEvidence: parsed.suggestedEvidence || [],
          riskScore: parsed.riskScore || 5,
          summary: parsed.summary || 'Incident reported',
          missingFields: parsed.missingFields || []
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Gemini API error:', error);
      // Return fallback
      return {
        narrative: `On ${new Date().toLocaleDateString()}, the complainant appeared at the police station and reported the following incident:\n\n${prompt}\n\nBased on the complaint received, appropriate action will be taken as per law.`,
        suggestedIPCSections: ['379 - Theft', '420 - Cheating'],
        suggestedEvidence: ['Written complaint', 'ID proof', 'Relevant documents'],
        riskScore: 5,
        summary: 'Incident reported for investigation',
        missingFields: ['Exact date and time', 'Location details', 'Witness information']
      };
    }
  };

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;

    setIsGenerating(true);
    setGeneratedFIR(null);

    try {
      const result = await generateWithGemini(userPrompt, complainantDetails.name ? complainantDetails : undefined);
      setGeneratedFIR(result);
      setEditedNarrative(result.narrative);
      
      // Check if we need to collect more details
      if (result.missingFields.length > 0 && !complainantDetails.name) {
        setShowDetailsForm(true);
        setStep('details');
      } else {
        setStep('result');
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateWithDetails = async () => {
    setIsGenerating(true);
    try {
      const result = await generateWithGemini(userPrompt, complainantDetails);
      setGeneratedFIR(result);
      setEditedNarrative(result.narrative);
      setStep('result');
      setShowDetailsForm(false);
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
    setUserPrompt(sample);
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

  const resetForm = () => {
    setStep('prompt');
    setGeneratedFIR(null);
    setUserPrompt('');
    setComplainantDetails({
      name: '',
      fatherName: '',
      age: '',
      phone: '',
      address: '',
      idType: 'Aadhaar',
      idNumber: ''
    });
    setShowDetailsForm(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-strong border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <BackButton href="/dashboard" label="Back" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gradient flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                <span className="hidden sm:inline">AI FIR Writer</span>
                <span className="sm:hidden">AI Writer</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Powered by Gemini AI - Just describe the incident</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/fir/create">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="px-3 sm:px-4 py-2 glass rounded-xl text-xs sm:text-sm hover:bg-white/10 flex items-center gap-1 sm:gap-2"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Manual FIR Form</span>
                <span className="sm:hidden">Manual</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-12"
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
            className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          >
            <Brain className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
          </motion.div>
          
          <h2 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-4">
            <span className="text-gradient">Describe Your Case</span>
          </h2>
          <p className="text-sm sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Just tell us what happened. AI will generate a complete FIR with IPC sections.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          {['prompt', 'details', 'result'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
                step === s ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 
                ['prompt', 'details', 'result'].indexOf(step) > i ? 'bg-green-500' : 'glass'
              }`}>
                {['prompt', 'details', 'result'].indexOf(step) > i ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : i + 1}
              </div>
              {i < 2 && <div className={`w-8 sm:w-20 h-1 ${['prompt', 'details', 'result'].indexOf(step) > i ? 'bg-green-500' : 'bg-white/20'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Prompt Input */}
        {step === 'prompt' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong p-4 sm:p-8 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8"
          >
            <div className="mb-4 sm:mb-6">
              <label className="block text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center gap-2">
                <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Describe the Incident
              </label>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                Write in plain language. Example: &quot;My bike was stolen from office parking yesterday evening&quot;
              </p>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Write a FIR for bike theft case. My Hero Splendor Plus (AP39AB1234) was stolen from my office parking at Tech Park, Vijayawada on 1st January 2026 around 6 PM. The bike is black color, 2023 model worth Rs 75,000."
                  rows={5}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-[#0A0E27] border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none text-sm sm:text-lg"
                />
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-2">
                  <button className="p-2 glass rounded-lg hover:bg-white/10">
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Prompts */}
            <div className="mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((sample, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSampleClick(sample)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 glass rounded-full text-xs sm:text-sm hover:bg-purple-500/20 hover:border-purple-500/50 border border-transparent transition-all text-left"
                  >
                    {sample.length > 40 ? sample.substring(0, 40) + '...' : sample}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={isGenerating || !userPrompt.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  <span className="hidden sm:inline">AI is Writing FIR...</span>
                  <span className="sm:hidden">Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Generate FIR with AI</span>
                  <span className="sm:hidden">Generate FIR</span>
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Complainant Details Form */}
        {step === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong p-4 sm:p-8 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">Complainant Details</h3>
                <p className="text-xs sm:text-sm text-gray-400">Please provide the following details</p>
              </div>
            </div>

            {/* Missing Fields Alert */}
            {generatedFIR?.missingFields && generatedFIR.missingFields.length > 0 && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-yellow-400 font-semibold mb-2 text-sm sm:text-base">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Additional Information Needed
                </div>
                <ul className="list-disc list-inside text-xs sm:text-sm text-yellow-300/80">
                  {generatedFIR.missingFields.map((field, i) => (
                    <li key={i}>{field}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={complainantDetails.name}
                  onChange={(e) => setComplainantDetails({...complainantDetails, name: e.target.value})}
                  placeholder="Enter your full name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0A0E27] border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Father&apos;s/Husband&apos;s Name
                </label>
                <input
                  type="text"
                  value={complainantDetails.fatherName}
                  onChange={(e) => setComplainantDetails({...complainantDetails, fatherName: e.target.value})}
                  placeholder="Enter father's or husband's name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0A0E27] border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Age
                </label>
                <input
                  type="number"
                  value={complainantDetails.age}
                  onChange={(e) => setComplainantDetails({...complainantDetails, age: e.target.value})}
                  placeholder="Enter age"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0A0E27] border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={complainantDetails.phone}
                  onChange={(e) => setComplainantDetails({...complainantDetails, phone: e.target.value})}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0A0E27] border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Address *
                </label>
                <textarea
                  value={complainantDetails.address}
                  onChange={(e) => setComplainantDetails({...complainantDetails, address: e.target.value})}
                  placeholder="Enter complete address"
                  rows={2}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0A0E27] border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  ID Proof Type
                </label>
                <select
                  value={complainantDetails.idType}
                  onChange={(e) => setComplainantDetails({...complainantDetails, idType: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0A0E27] border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="Aadhaar">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  ID Number
                </label>
                <input
                  type="text"
                  value={complainantDetails.idNumber}
                  onChange={(e) => setComplainantDetails({...complainantDetails, idNumber: e.target.value})}
                  placeholder="Enter ID number"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0A0E27] border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <motion.button
                onClick={() => setStep('prompt')}
                whileHover={{ scale: 1.02 }}
                className="flex-1 py-3 sm:py-4 glass text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Back to Edit
              </motion.button>

              <motion.button
                onClick={handleGenerateWithDetails}
                disabled={isGenerating || !complainantDetails.name || !complainantDetails.phone}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    Generate FIR
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={() => setStep('result')}
                whileHover={{ scale: 1.02 }}
                className="py-3 sm:py-4 px-4 sm:px-6 glass text-gray-400 font-medium rounded-xl text-sm sm:text-base"
              >
                Skip
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generated Result */}
        {step === 'result' && generatedFIR && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
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
                <p className="text-sm text-gray-400">Suggested sections</p>
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
                <p className="text-sm text-gray-400">To collect</p>
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
                    onClick={resetForm}
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
                  className="w-full h-64 px-4 py-3 bg-[#0A0E27] border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 resize-none font-mono text-sm leading-relaxed"
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
              <Link href={`/fir/create?narrative=${encodeURIComponent(editMode ? editedNarrative : generatedFIR.narrative)}`} className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Use in FIR Form
                </motion.button>
              </Link>
              <motion.button
                onClick={resetForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 glass text-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Write Another FIR
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* How it Works */}
        {step === 'prompt' && !generatedFIR && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-strong p-8 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">How AI FIR Writer Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Describe Incident', desc: 'Write what happened in plain language', icon: Edit },
                { step: 2, title: 'AI Analyzes', desc: 'Gemini AI processes and understands', icon: Brain },
                { step: 3, title: 'Add Details', desc: 'Provide complainant information', icon: User },
                { step: 4, title: 'Get FIR', desc: 'Complete FIR ready to file', icon: FileText }
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

