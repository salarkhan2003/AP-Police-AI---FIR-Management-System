'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowLeft, User, Phone, Mail, BadgeCheck, Users, Zap, Building, UserCircle, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type UserType = 'police' | 'citizen' | null;
type PoliceRole = 'constable' | 'si' | 'ci' | 'admin' | null;

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>(null);
  const [policeRole, setPoliceRole] = useState<PoliceRole>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    empId: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Mock authentication - accepts anything
    setTimeout(() => {
      const role = userType === 'citizen' ? 'public' : policeRole;
      localStorage.setItem('userRole', role || 'public');
      localStorage.setItem('userName', formData.name || 'Guest User');
      router.push('/dashboard');
    }, 1500);
  };

  const handleSkip = () => {
    setIsLoading(true);
    setTimeout(() => {
      const role = userType === 'citizen' ? 'public' : (policeRole || 'public');
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', 'Guest User');
      router.push('/dashboard');
    }, 800);
  };

  const handleSendOTP = () => {
    setShowOTP(true);
  };

  const policeRoles = [
    { id: 'constable', label: 'Constable', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'si', label: 'Sub Inspector (SI)', icon: BadgeCheck, color: 'from-purple-500 to-pink-500' },
    { id: 'ci', label: 'Circle Inspector (CI)', icon: Shield, color: 'from-green-500 to-emerald-500' },
    { id: 'admin', label: 'Admin', icon: Building, color: 'from-red-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-navy-500 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-600 via-navy-500 to-black"></div>
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20"
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Header */}
        <motion.div className="text-center mb-8">
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 20px rgba(59,130,246,0.3)', '0 0 40px rgba(59,130,246,0.6)', '0 0 20px rgba(59,130,246,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">AP Police FIR System</h1>
          <p className="text-gray-400">Secure login to access the portal</p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="glass-strong p-8 rounded-3xl border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Select User Type */}
            {!userType && (
              <motion.div
                key="user-type"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white text-center mb-6">Select Your Role</h2>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => setUserType('police')}
                    className="glass p-6 rounded-2xl text-center hover-lift group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Police Officer</h3>
                    <p className="text-sm text-gray-400 mt-1">Login with credentials</p>
                  </motion.button>

                  <motion.button
                    onClick={() => setUserType('citizen')}
                    className="glass p-6 rounded-2xl text-center hover-lift group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Citizen</h3>
                    <p className="text-sm text-gray-400 mt-1">Track FIR status</p>
                  </motion.button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-navy-500 text-gray-400">or</span>
                  </div>
                </div>

                <motion.button
                  onClick={() => { setUserType('citizen'); handleSkip(); }}
                  className="w-full py-3 glass text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01 }}
                >
                  <Zap className="w-4 h-4" />
                  Skip & Continue as Guest
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Police Role Selection */}
            {userType === 'police' && !policeRole && (
              <motion.div
                key="police-role"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setUserType(null)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <h2 className="text-xl font-semibold text-white text-center mb-6">Select Your Designation</h2>

                <div className="grid grid-cols-2 gap-4">
                  {policeRoles.map((role) => (
                    <motion.button
                      key={role.id}
                      onClick={() => setPoliceRole(role.id as PoliceRole)}
                      className="glass p-4 rounded-2xl text-center hover-lift group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <role.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-white">{role.label}</h3>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={handleSkip}
                  className="w-full py-3 glass text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 mt-4"
                  whileHover={{ scale: 1.01 }}
                >
                  <Zap className="w-4 h-4" />
                  Skip Login
                </motion.button>
              </motion.div>
            )}

            {/* Step 3: Login Form */}
            {((userType === 'police' && policeRole) || userType === 'citizen') && (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                <button
                  onClick={() => userType === 'police' ? setPoliceRole(null) : setUserType(null)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center mb-6">
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${userType === 'police' ? 'from-blue-500 to-cyan-500' : 'from-green-500 to-emerald-500'} flex items-center justify-center`}>
                    {userType === 'police' ? <Shield className="w-7 h-7 text-white" /> : <UserCircle className="w-7 h-7 text-white" />}
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    {userType === 'police' ? `Login as ${policeRoles.find(r => r.id === policeRole)?.label}` : 'Citizen Login'}
                  </h2>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {userType === 'police' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Employee ID</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter employee ID"
                          value={formData.empId}
                          onChange={(e) => setFormData({...formData, empId: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Enter mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {showOTP && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">Enter OTP</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5,6].map((_, i) => (
                          <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center bg-white/5 border border-white/10 rounded-xl text-white text-xl font-bold focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">OTP sent to your mobile number</p>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  {!showOTP ? (
                    <motion.button
                      onClick={handleSendOTP}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Send OTP
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {isLoading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>Verify & Login</>
                      )}
                    </motion.button>
                  )}

                  <motion.button
                    onClick={handleSkip}
                    disabled={isLoading}
                    className="w-full py-3 glass text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                  >
                    <Zap className="w-4 h-4" />
                    Skip & Continue
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Back to Home */}
        <motion.button
          onClick={() => router.push('/')}
          className="mt-6 mx-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}

