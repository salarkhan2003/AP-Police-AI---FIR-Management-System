'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Edit,
  Phone,
  Eye,
  Download,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  ChevronDown,
  User,
  MapPin,
  Calendar,
  FileText,
  Send,
  Fingerprint,
  Shield,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import PDFDownloadModal from '@/components/PDFDownloadModal';

interface PendingFIR {
  id: string;
  caseNumber: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  crimeType: string;
  complainantName: string;
  location: string;
  filedAgo: string;
  filedTimestamp: Date;
  isOverdue: boolean;
  overdueBy?: string;
  ipcSections: string[];
  assignedBy: string;
  briefDescription: string;
  evidence: number;
}

type SignatureMethod = 'aadhaar' | 'pad' | 'pin' | 'biometric' | null;

export default function ApprovalQueuePage() {
  const [pendingFIRs, setPendingFIRs] = useState<PendingFIR[]>([]);
  const [filteredFIRs, setFilteredFIRs] = useState<PendingFIR[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCrimeType, setFilterCrimeType] = useState('all');
  const [sortBy, setSortBy] = useState('urgent');
  const [selectedFIR, setSelectedFIR] = useState<PendingFIR | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signMethod, setSignMethod] = useState<SignatureMethod>(null);
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [swipedCard, setSwipedCard] = useState<string | null>(null);

  // Mock data
  useEffect(() => {
    const mockFIRs: PendingFIR[] = [
      {
        id: '1',
        caseNumber: 'AP-2026-VJA-00234',
        priority: 'URGENT',
        title: 'Armed Robbery at Jewelry Shop',
        crimeType: 'Robbery',
        complainantName: 'Rajesh Kumar',
        location: 'Vijayawada Central',
        filedAgo: '2 hours ago',
        filedTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOverdue: false,
        ipcSections: ['392', '397', '34'],
        assignedBy: 'Const. Suresh',
        briefDescription: 'Three armed individuals robbed jewelry shop at gunpoint',
        evidence: 5
      },
      {
        id: '2',
        caseNumber: 'AP-2026-VJA-00235',
        priority: 'HIGH',
        title: 'Domestic Violence - Urgent',
        crimeType: 'Domestic Violence',
        complainantName: 'Priya Sharma',
        location: 'Vijayawada West',
        filedAgo: '5 hours ago',
        filedTimestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isOverdue: false,
        ipcSections: ['498A', '323', '506'],
        assignedBy: 'Const. Ramesh',
        briefDescription: 'Victim sustained injuries, immediate protection required',
        evidence: 3
      },
      {
        id: '3',
        caseNumber: 'AP-2026-VJA-00230',
        priority: 'HIGH',
        title: 'Cyber Fraud - Banking',
        crimeType: 'Cyber Crime',
        complainantName: 'Amit Reddy',
        location: 'Vijayawada East',
        filedAgo: '26 hours ago',
        filedTimestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
        isOverdue: true,
        overdueBy: '2 hours',
        ipcSections: ['420', '467', '468', '471'],
        assignedBy: 'Const. Vijay',
        briefDescription: 'Rs 2.5L fraudulent transaction via phishing link',
        evidence: 8
      },
      {
        id: '4',
        caseNumber: 'AP-2026-VJA-00236',
        priority: 'MEDIUM',
        title: 'Mobile Phone Theft',
        crimeType: 'Theft',
        complainantName: 'Sunil Patel',
        location: 'Vijayawada Central',
        filedAgo: '4 hours ago',
        filedTimestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isOverdue: false,
        ipcSections: ['379', '380'],
        assignedBy: 'Const. Krishna',
        briefDescription: 'Samsung Galaxy S23 stolen at market area',
        evidence: 2
      }
    ];

    setPendingFIRs(mockFIRs);
    setFilteredFIRs(mockFIRs);
  }, []);

  // Filter and sort
  useEffect(() => {
    let filtered = [...pendingFIRs];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(fir =>
        fir.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fir.complainantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fir.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(fir => fir.priority === filterPriority);
    }

    // Crime type filter
    if (filterCrimeType !== 'all') {
      filtered = filtered.filter(fir => fir.crimeType === filterCrimeType);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'urgent') {
        const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'overdue') {
        return (b.isOverdue ? 1 : 0) - (a.isOverdue ? 1 : 0);
      } else if (sortBy === 'date') {
        return b.filedTimestamp.getTime() - a.filedTimestamp.getTime();
      }
      return 0;
    });

    setFilteredFIRs(filtered);
  }, [searchQuery, filterPriority, filterCrimeType, sortBy, pendingFIRs]);

  const handleApprove = (firId: string) => {
    setSelectedFIR(filteredFIRs.find(f => f.id === firId) || null);
    setShowSignModal(true);
  };

  const handleReject = (firId: string) => {
    // Show reject modal
    alert('Reject functionality - would show reason modal');
  };

  const handleBulkSelect = (firId: string) => {
    if (selectedForBulk.includes(firId)) {
      setSelectedForBulk(selectedForBulk.filter(id => id !== firId));
    } else {
      setSelectedForBulk([...selectedForBulk, firId]);
    }
  };

  const handleBulkApprove = () => {
    alert(`Bulk approving ${selectedForBulk.length} FIRs`);
    setSelectedForBulk([]);
  };

  const handleSign = () => {
    if (!signMethod) return;
    // Process signature
    setTimeout(() => {
      setPendingFIRs(pendingFIRs.filter(f => f.id !== selectedFIR?.id));
      setShowSignModal(false);
      setSelectedFIR(null);
      setSignMethod(null);
    }, 1500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'from-red-500 to-rose-500';
      case 'HIGH': return 'from-orange-500 to-amber-500';
      case 'MEDIUM': return 'from-blue-500 to-cyan-500';
      case 'LOW': return 'from-gray-500 to-slate-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'MEDIUM': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'LOW': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full glass-strong z-50 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Pending My Signature</h1>
              <p className="text-sm text-gray-400">Lightning-fast approval queue</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-400">{filteredFIRs.filter(f => f.isOverdue).length}</p>
                  <p className="text-xs text-gray-400">Overdue</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-400">{filteredFIRs.filter(f => f.priority === 'URGENT').length}</p>
                  <p className="text-xs text-gray-400">Urgent</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">{filteredFIRs.length}</p>
                  <p className="text-xs text-gray-400">Total Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by case number, name, or crime type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 glass rounded-xl hover:bg-white/10 flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 glass rounded-xl hover:bg-white/10 focus:outline-none focus:border-blue-500"
            >
              <option value="urgent">Sort: Urgent First</option>
              <option value="overdue">Sort: Overdue First</option>
              <option value="date">Sort: Newest First</option>
            </select>

            {selectedForBulk.length > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={handleBulkApprove}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Bulk Approve ({selectedForBulk.length})
              </motion.button>
            )}
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 glass p-4 rounded-xl overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Priorities</option>
                      <option value="URGENT">Urgent Only</option>
                      <option value="HIGH">High Only</option>
                      <option value="MEDIUM">Medium Only</option>
                      <option value="LOW">Low Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Crime Type</label>
                    <select
                      value={filterCrimeType}
                      onChange={(e) => setFilterCrimeType(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="Theft">Theft</option>
                      <option value="Assault">Assault</option>
                      <option value="Robbery">Robbery</option>
                      <option value="Cyber Crime">Cyber Crime</option>
                      <option value="Domestic Violence">Domestic Violence</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilterPriority('all');
                        setFilterCrimeType('all');
                        setSearchQuery('');
                      }}
                      className="w-full px-4 py-2 glass rounded-lg hover:bg-white/10"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-64 px-6 max-w-7xl mx-auto">
        {filteredFIRs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">All Caught Up! 🎉</h2>
            <p className="text-xl text-gray-400">No pending FIRs requiring your signature</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredFIRs.map((fir, index) => (
              <motion.div
                key={fir.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-strong rounded-2xl overflow-hidden border ${
                  fir.isOverdue ? 'border-red-500/50' : 'border-white/10'
                } ${swipedCard === fir.id ? 'opacity-50' : ''}`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Checkbox for bulk selection */}
                      <input
                        type="checkbox"
                        checked={selectedForBulk.includes(fir.id)}
                        onChange={() => handleBulkSelect(fir.id)}
                        className="mt-1 w-5 h-5 rounded border-white/20"
                      />

                      <div className="flex-1">
                        {/* Priority Badge */}
                        <div className="flex items-center gap-3 mb-3">
                          <motion.span
                            animate={fir.priority === 'URGENT' ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 ${getPriorityBadgeColor(fir.priority)}`}
                          >
                            {fir.priority === 'URGENT' && '🔴'} {fir.priority}
                          </motion.span>

                          {fir.isOverdue && (
                            <motion.span
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/50"
                            >
                              ⚠️ OVERDUE {fir.overdueBy}
                            </motion.span>
                          )}

                          <span className="text-sm text-gray-400">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {fir.filedAgo}
                          </span>
                        </div>

                        {/* Case Info */}
                        <h3 className="text-2xl font-bold text-white mb-2">{fir.caseNumber}</h3>
                        <p className="text-xl text-gray-300 mb-3">{fir.title}</p>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Complainant</p>
                            <p className="text-white font-medium flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {fir.complainantName}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Crime Type</p>
                            <p className="text-white font-medium">{fir.crimeType}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Location</p>
                            <p className="text-white font-medium flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {fir.location}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">IPC Sections</p>
                            <div className="flex flex-wrap gap-1">
                              {fir.ipcSections.map(section => (
                                <span key={section} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                                  {section}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Brief Description */}
                        <p className="mt-4 text-gray-400 text-sm">{fir.briefDescription}</p>

                        {/* Meta Info */}
                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                          <span>Filed by: {fir.assignedBy}</span>
                          <span>•</span>
                          <span>{fir.evidence} evidence files</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions - Right Side */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedFIR(fir);
                        }}
                        className="p-2 glass rounded-lg hover:bg-white/10 group"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      </button>
                      <button
                        className="p-2 glass rounded-lg hover:bg-white/10 group"
                        title="Call Complainant"
                      >
                        <Phone className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                      </button>
                      <button
                        className="p-2 glass rounded-lg hover:bg-white/10 group"
                        title="Download PDF"
                      >
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-green-400" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <motion.button
                      onClick={() => handleApprove(fir.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/50"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </motion.button>

                    <motion.button
                      onClick={() => handleReject(fir.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="py-3 px-6 glass text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-white/10"
                    >
                      <Edit className="w-5 h-5" />
                      Request Changes
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Signature Modal */}
      <AnimatePresence>
        {showSignModal && selectedFIR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => {
              setShowSignModal(false);
              setSignMethod(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong p-8 rounded-3xl max-w-2xl w-full"
            >
              <h2 className="text-3xl font-bold text-gradient mb-6">Digital Signature</h2>
              <p className="text-gray-400 mb-6">Approving FIR: {selectedFIR.caseNumber}</p>

              {!signMethod ? (
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => setSignMethod('aadhaar')}
                    whileHover={{ scale: 1.02 }}
                    className="glass p-6 rounded-2xl hover:bg-white/10 text-left"
                  >
                    <Shield className="w-10 h-10 text-blue-400 mb-4" />
                    <h3 className="text-lg font-bold mb-2">Aadhaar eSign</h3>
                    <p className="text-sm text-gray-400">Verify with Aadhaar OTP</p>
                  </motion.button>

                  <motion.button
                    onClick={() => setSignMethod('pad')}
                    whileHover={{ scale: 1.02 }}
                    className="glass p-6 rounded-2xl hover:bg-white/10 text-left"
                  >
                    <Edit className="w-10 h-10 text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold mb-2">Signature Pad</h3>
                    <p className="text-sm text-gray-400">Draw your signature</p>
                  </motion.button>

                  <motion.button
                    onClick={() => setSignMethod('pin')}
                    whileHover={{ scale: 1.02 }}
                    className="glass p-6 rounded-2xl hover:bg-white/10 text-left"
                  >
                    <Zap className="w-10 h-10 text-green-400 mb-4" />
                    <h3 className="text-lg font-bold mb-2">Quick PIN</h3>
                    <p className="text-sm text-gray-400">4-digit PIN approval</p>
                  </motion.button>

                  <motion.button
                    onClick={() => setSignMethod('biometric')}
                    whileHover={{ scale: 1.02 }}
                    className="glass p-6 rounded-2xl hover:bg-white/10 text-left"
                  >
                    <Fingerprint className="w-10 h-10 text-orange-400 mb-4" />
                    <h3 className="text-lg font-bold mb-2">Biometric</h3>
                    <p className="text-sm text-gray-400">Fingerprint scan</p>
                  </motion.button>
                </div>
              ) : (
                <div className="text-center py-8">
                  {signMethod === 'aadhaar' && (
                    <>
                      <Shield className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-4">Enter Aadhaar OTP</h3>
                      <div className="flex justify-center gap-3 mb-6">
                        {[1,2,3,4,5,6].map((i) => (
                          <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className="w-14 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {signMethod === 'pin' && (
                    <>
                      <Zap className="w-20 h-20 text-green-400 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-4">Enter Your PIN</h3>
                      <div className="flex justify-center gap-3 mb-6">
                        {[1,2,3,4].map((i) => (
                          <input
                            key={i}
                            type="password"
                            maxLength={1}
                            className="w-14 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500"
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <button
                    onClick={handleSign}
                    className="px-8 py-3 bg-gradient-blue text-white font-bold rounded-xl"
                  >
                    Confirm & Sign
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

