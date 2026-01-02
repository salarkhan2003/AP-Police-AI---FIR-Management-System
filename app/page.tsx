'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Zap,
  Lock,
  Bell,
  Smartphone,
  FileText,
  Search,
  BarChart3,
  Globe,
  Mic,
  Brain,
  Eye,
  Target,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  Users,
  MapPin,
  Fingerprint,
  Download,
  MessageSquare,
  Star,
  Play,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [typedText, setTypedText] = useState('');

  const aiTexts = [
    'Analyzing complaint...',
    'Suggesting IPC 379, 380...',
    'Detecting similar cases...',
    'Risk score: 7/10...',
    'Evidence checklist ready...'
  ];

  useEffect(() => {
    let index = 0;
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < aiTexts[index].length) {
        setTypedText(aiTexts[index].substring(0, charIndex + 1));
        charIndex++;
      } else {
        setTimeout(() => {
          index = (index + 1) % aiTexts.length;
          charIndex = 0;
          setTypedText('');
        }, 1500);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, []);


  const features = [
    {
      icon: Mic,
      title: 'AI Voice Filing',
      description: 'Speak naturally in Telugu, Hindi, English, or Urdu. AI transcribes and auto-fills all fields in real-time.',
      color: 'from-green-500 to-emerald-500',
      time: '20 seconds'
    },
    {
      icon: FileText,
      title: 'Smart Templates',
      description: '50+ pre-built templates for all crime types. Fill only 5-6 fields and submit instantly.',
      color: 'from-purple-500 to-pink-500',
      time: '25 seconds'
    },
    {
      icon: Fingerprint,
      title: 'Digital Signatures',
      description: 'Sign with Aadhaar eSign, signature pad, PIN, or biometrics. Timestamp and GPS captured automatically.',
      color: 'from-blue-500 to-cyan-500',
      time: '5 seconds'
    },
    {
      icon: Bell,
      title: 'Real-Time Alerts',
      description: 'Instant push, SMS, and email notifications. Auto-escalation if officers miss deadlines.',
      color: 'from-yellow-500 to-orange-500',
      time: 'Instant'
    },
    {
      icon: Globe,
      title: 'Zero FIR Support',
      description: 'File FIR at any station for any jurisdiction. Auto-transfers to correct station instantly.',
      color: 'from-red-500 to-rose-500',
      time: 'No delays'
    },
    {
      icon: Eye,
      title: 'Public Tracking',
      description: 'Citizens track FIR status with case number and OTP. Download PDF, upload evidence, chat with IO.',
      color: 'from-indigo-500 to-violet-500',
      time: '24/7 access'
    }
  ];

  const aiFeatures = [
    { icon: Brain, title: 'IPC Auto-Suggest', desc: 'AI suggests relevant sections while typing' },
    { icon: Target, title: 'Risk Scoring', desc: 'Automatic 1-10 risk assessment' },
    { icon: Search, title: 'Similar Cases', desc: 'Find related past cases instantly' },
    { icon: CheckCircle, title: 'Evidence Checklist', desc: 'Smart recommendations based on crime type' },
    { icon: MessageSquare, title: 'Policy Chatbot', desc: 'Get answers to procedure questions' },
    { icon: Sparkles, title: 'FIR Writer', desc: 'Generate legal narrative from keywords' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />

        {/* Floating orbs - hidden on mobile for performance */}
        <motion.div
          className="hidden sm:block absolute w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] opacity-10"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: '10%', left: '5%' }}
        />
        <motion.div
          className="hidden sm:block absolute w-[300px] h-[300px] bg-cyan-500 rounded-full blur-[150px] opacity-10"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{ top: '40%', right: '15%' }}
        />
        <motion.div
          className="hidden sm:block absolute w-[250px] h-[250px] bg-purple-500 rounded-full blur-[120px] opacity-10"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 18, repeat: Infinity }}
          style={{ bottom: '10%', left: '30%' }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full glass-strong z-50 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
            >
              <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-gradient">AP Police</h1>
              <p className="text-xs text-gray-400 hidden sm:block">FIR Management System</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#ai" className="text-sm text-gray-400 hover:text-white transition-colors">AI Powered</a>
            <Link href="/ai-writer" className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              AI Writer
            </Link>
            <Link href="/public" className="text-sm text-gray-400 hover:text-white transition-colors">Public Portal</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-5 py-2 sm:py-2.5 glass text-white text-sm font-semibold rounded-lg sm:rounded-xl"
              >
                Login
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-blue-500/50"
              >
                <span className="hidden sm:inline">Start Now</span>
                <span className="sm:hidden">Start</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                <span className="text-xs sm:text-sm font-medium">Revolutionary 2-Step FIR Filing</span>
                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              </motion.div>

              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                <span className="text-white">File FIR in</span>
                <br />
                <span className="text-gradient">40 Seconds</span>
                <br />
                <span className="text-white">Not Hours</span>
              </h1>

              <p className="text-sm sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-xl">
                The most advanced AI-powered FIR management system. Voice-to-text filing,
                instant digital signatures, real-time tracking.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-base sm:text-lg font-bold rounded-xl flex items-center justify-center gap-2 sm:gap-3 shadow-2xl"
                  >
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                    Start Filing Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </Link>
                <Link href="/ai-writer">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base sm:text-lg font-semibold rounded-xl flex items-center justify-center gap-2 sm:gap-3 shadow-2xl"
                  >
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    AI FIR Writer
                  </motion.button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                {[
                  { label: 'Filing', value: '40s', icon: Clock },
                  { label: 'Approval', value: '5s', icon: CheckCircle },
                  { label: 'Languages', value: '4+', icon: Globe }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-xl sm:text-3xl font-black text-gradient mb-0.5 sm:mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-1">
                      <stat.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* AI Assistant Visual */}
              <div className="relative">
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 60px rgba(59, 130, 246, 0.3)',
                      '0 0 100px rgba(59, 130, 246, 0.5)',
                      '0 0 60px rgba(59, 130, 246, 0.3)',
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="glass-strong p-8 rounded-3xl border border-white/20"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                    >
                      <Brain className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold">AI Assistant</h3>
                      <p className="text-sm text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Processing...
                      </p>
                    </div>
                  </div>

                  <div className="glass p-4 rounded-xl mb-4">
                    <p className="text-purple-400 font-mono text-sm mb-2">AI Analysis:</p>
                    <p className="text-white">{typedText}<motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-0.5 h-4 bg-blue-400 ml-1"
                    /></p>
                  </div>

                  {/* Mini Form Preview */}
                  <div className="space-y-3">
                    <div className="glass p-3 rounded-lg flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm">Crime Type: Theft</span>
                    </div>
                    <div className="glass p-3 rounded-lg flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-sm">IPC Sections: 379, 380</span>
                    </div>
                    <div className="glass p-3 rounded-lg flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Clock className="w-5 h-5 text-blue-400" />
                      </motion.div>
                      <span className="text-sm">Analyzing evidence requirements...</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-6 glass p-4 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium">Voice Active</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 glass p-4 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium">End-to-End Encrypted</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              <span className="text-gradient">Revolutionary Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Every feature designed to save time and eliminate paperwork
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                className="glass-strong p-8 rounded-3xl group cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">{feature.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="ai" className="py-20 px-6 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold">Powered by Advanced AI</span>
            </div>
            <h2 className="text-5xl font-black mb-4">
              <span className="text-gradient">AI That Actually Helps</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Intelligent assistance at every step of the FIR filing process
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass p-6 rounded-2xl text-center group cursor-pointer"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/40 transition-colors">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-bold text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong p-12 rounded-3xl text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-8"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-4xl font-black mb-4">
                <span className="text-gradient">Ready to Transform Your Department?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the most advanced police force in India with our next-generation FIR management system
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg font-bold rounded-xl flex items-center gap-3 shadow-2xl"
                  >
                    <Zap className="w-6 h-6" />
                    Start Now
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/public">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 glass text-white text-lg font-semibold rounded-xl flex items-center gap-3"
                  >
                    <Globe className="w-6 h-6" />
                    Public Portal
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h4 className="text-lg font-bold text-gradient">AP Police FIR System</h4>
                <p className="text-sm text-gray-500">Digital India Initiative</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact Support</a>
            </div>

            <div className="text-sm text-gray-500">
              © 2026 AP Police. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

