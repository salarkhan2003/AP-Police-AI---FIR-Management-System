'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Eye,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  SlidersHorizontal,
  X,
  Phone,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import PDFDownloadModal from '@/components/PDFDownloadModal';

interface FIRCase {
  id: string;
  caseNumber: string;
  title: string;
  complainant: string;
  complainantPhone: string;
  crimeType: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'draft' | 'pending' | 'approved' | 'investigating' | 'closed' | 'rejected';
  location: string;
  dateTime: string;
  filedBy: string;
  assignedTo: string;
  ipcSections: string[];
  evidence: number;
  isZeroFIR: boolean;
}

export default function FIRCasesPage() {
  const [cases, setCases] = useState<FIRCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<FIRCase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCase, setSelectedCase] = useState<FIRCase | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedCaseForPDF, setSelectedCaseForPDF] = useState<string>('');

  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCrimeType, setFilterCrimeType] = useState('all');

  // Mock data
  useEffect(() => {
    const mockCases: FIRCase[] = [
      {
        id: '1',
        caseNumber: 'AP-2026-VJA-00234',
        title: 'Armed Robbery at Jewelry Shop',
        complainant: 'Rajesh Kumar',
        complainantPhone: '9876543210',
        crimeType: 'Robbery',
        priority: 'URGENT',
        status: 'investigating',
        location: 'Vijayawada Central',
        dateTime: '2026-01-02T10:30:00',
        filedBy: 'Const. Suresh',
        assignedTo: 'SI Sharma',
        ipcSections: ['392', '397', '34'],
        evidence: 5,
        isZeroFIR: false
      },
      {
        id: '2',
        caseNumber: 'AP-2026-VJA-00235',
        title: 'Cyber Fraud - Banking Scam',
        complainant: 'Priya Reddy',
        complainantPhone: '9876543211',
        crimeType: 'Cyber Crime',
        priority: 'HIGH',
        status: 'pending',
        location: 'Vijayawada East',
        dateTime: '2026-01-02T08:15:00',
        filedBy: 'Const. Ramesh',
        assignedTo: 'CI Patel',
        ipcSections: ['420', '467', '468'],
        evidence: 8,
        isZeroFIR: false
      },
      {
        id: '3',
        caseNumber: 'AP-2026-VJA-00236',
        title: 'Domestic Violence Report',
        complainant: 'Anonymous',
        complainantPhone: 'Hidden',
        crimeType: 'Domestic Violence',
        priority: 'HIGH',
        status: 'approved',
        location: 'Vijayawada West',
        dateTime: '2026-01-02T06:00:00',
        filedBy: 'Const. Vijay',
        assignedTo: 'SI Gupta',
        ipcSections: ['498A', '323', '506'],
        evidence: 3,
        isZeroFIR: false
      },
      {
        id: '4',
        caseNumber: 'AP-2026-VJA-00237',
        title: 'Mobile Phone Theft',
        complainant: 'Sunil Patel',
        complainantPhone: '9876543212',
        crimeType: 'Theft',
        priority: 'MEDIUM',
        status: 'closed',
        location: 'Vijayawada Central',
        dateTime: '2026-01-01T18:30:00',
        filedBy: 'Const. Krishna',
        assignedTo: 'SI Kumar',
        ipcSections: ['379', '380'],
        evidence: 2,
        isZeroFIR: false
      },
      {
        id: '5',
        caseNumber: '0-2026-VJA-00238',
        title: 'Vehicle Theft (Zero FIR)',
        complainant: 'Amit Shah',
        complainantPhone: '9876543213',
        crimeType: 'Theft',
        priority: 'MEDIUM',
        status: 'pending',
        location: 'Guntur',
        dateTime: '2026-01-01T14:00:00',
        filedBy: 'Const. Rao',
        assignedTo: 'SI Reddy',
        ipcSections: ['379', '411'],
        evidence: 4,
        isZeroFIR: true
      },
      {
        id: '6',
        caseNumber: 'AP-2026-VJA-00239',
        title: 'Chain Snatching Incident',
        complainant: 'Lakshmi Devi',
        complainantPhone: '9876543214',
        crimeType: 'Robbery',
        priority: 'HIGH',
        status: 'investigating',
        location: 'Vijayawada Central',
        dateTime: '2026-01-01T11:45:00',
        filedBy: 'Const. Suresh',
        assignedTo: 'SI Sharma',
        ipcSections: ['392', '356'],
        evidence: 6,
        isZeroFIR: false
      }
    ];

    setCases(mockCases);
    setFilteredCases(mockCases);
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...cases];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.complainant.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(c => c.status === activeTab);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(c => c.priority === filterPriority);
    }

    // Crime type filter
    if (filterCrimeType !== 'all') {
      filtered = filtered.filter(c => c.crimeType === filterCrimeType);
    }

    setFilteredCases(filtered);
  }, [searchQuery, activeTab, filterStatus, filterPriority, filterCrimeType, cases]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'MEDIUM': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'LOW': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'investigating': return 'bg-blue-500/20 text-blue-400';
      case 'closed': return 'bg-purple-500/20 text-purple-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'all', label: 'All Cases', count: cases.length },
    { id: 'pending', label: 'Pending', count: cases.filter(c => c.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: cases.filter(c => c.status === 'approved').length },
    { id: 'investigating', label: 'Investigating', count: cases.filter(c => c.status === 'investigating').length },
    { id: 'closed', label: 'Closed', count: cases.filter(c => c.status === 'closed').length }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-strong border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-gradient">FIR Cases</h1>
              <p className="text-gray-400">Manage and track all filed cases</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-3 glass rounded-xl hover:bg-white/10">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="px-4 py-3 glass rounded-xl hover:bg-white/10 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export
              </button>
              <Link href="/fir/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl"
                >
                  + New FIR
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by case number, title, or complainant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 ${
                showFilters ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'glass hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {(filterStatus !== 'all' || filterPriority !== 'all' || filterCrimeType !== 'all') && (
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
              )}
            </button>
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
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="investigating">Investigating</option>
                      <option value="closed">Closed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Priorities</option>
                      <option value="URGENT">Urgent</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Crime Type</label>
                    <select
                      value={filterCrimeType}
                      onChange={(e) => setFilterCrimeType(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="Theft">Theft</option>
                      <option value="Robbery">Robbery</option>
                      <option value="Assault">Assault</option>
                      <option value="Cyber Crime">Cyber Crime</option>
                      <option value="Domestic Violence">Domestic Violence</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterPriority('all');
                        setFilterCrimeType('all');
                      }}
                      className="w-full px-4 py-2 glass rounded-lg hover:bg-white/10"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'glass text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Cases List */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {filteredCases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FileText className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">No cases found</h2>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
                setFilterStatus('all');
                setFilterPriority('all');
                setFilterCrimeType('all');
              }}
              className="px-6 py-3 glass rounded-xl hover:bg-white/10"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((firCase, index) => (
              <motion.div
                key={firCase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="glass-strong p-6 rounded-2xl cursor-pointer group"
                onClick={() => setSelectedCase(firCase)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Priority Badge */}
                    <motion.span
                      animate={firCase.priority === 'URGENT' ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getPriorityColor(firCase.priority)}`}
                    >
                      {firCase.priority === 'URGENT' && '🔴 '}{firCase.priority}
                    </motion.span>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(firCase.status)}`}>
                      {getStatusIcon(firCase.status)}
                      {firCase.status.charAt(0).toUpperCase() + firCase.status.slice(1)}
                    </span>

                    {/* Zero FIR Badge */}
                    {firCase.isZeroFIR && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                        Zero FIR
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 glass rounded-lg hover:bg-white/10">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 glass rounded-lg hover:bg-white/10">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 glass rounded-lg hover:bg-white/10">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Case Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-colors font-mono">
                    {firCase.caseNumber}
                  </h3>
                  <p className="text-lg text-gray-300">{firCase.title}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Complainant</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      {firCase.complainant}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Crime Type</p>
                    <p className="text-white font-medium">{firCase.crimeType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Location</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {firCase.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Filed</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(firCase.dateTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* IPC Sections & Meta */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">IPC Sections:</span>
                    {firCase.ipcSections.map((section) => (
                      <span key={section} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {section}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Filed by: {firCase.filedBy}</span>
                    <span>•</span>
                    <span>Assigned: {firCase.assignedTo}</span>
                    <span>•</span>
                    <span>{firCase.evidence} evidence files</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {filteredCases.length > 0 && (
          <div className="mt-6 text-center text-gray-400 text-sm">
            Showing {filteredCases.length} of {cases.length} cases
          </div>
        )}
      </main>

      {/* Case Detail Modal */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong p-8 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gradient font-mono mb-2">{selectedCase.caseNumber}</h2>
                  <p className="text-gray-400">{selectedCase.title}</p>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-2 glass rounded-xl hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Case Details */}
                <div className="space-y-6">
                  <div className="glass p-4 rounded-xl">
                    <h3 className="font-bold mb-3">Case Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCase.status)}`}>
                          {selectedCase.status.charAt(0).toUpperCase() + selectedCase.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Priority</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedCase.priority)}`}>
                          {selectedCase.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Crime Type</span>
                        <span className="text-white">{selectedCase.crimeType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">IPC Sections</span>
                        <div className="flex gap-1">
                          {selectedCase.ipcSections.map(s => (
                            <span key={s} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-4 rounded-xl">
                    <h3 className="font-bold mb-3">Complainant Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Name</span>
                        <span className="text-white">{selectedCase.complainant}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Phone</span>
                        <span className="text-white">{selectedCase.complainantPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Officers */}
                <div className="space-y-6">
                  <div className="glass p-4 rounded-xl">
                    <h3 className="font-bold mb-3">Location & Time</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Location</span>
                        <span className="text-white">{selectedCase.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Date & Time</span>
                        <span className="text-white">{new Date(selectedCase.dateTime).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-4 rounded-xl">
                    <h3 className="font-bold mb-3">Officers</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Filed By</span>
                        <span className="text-white">{selectedCase.filedBy}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Assigned To</span>
                        <span className="text-white">{selectedCase.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button className="flex-1 py-3 glass text-white font-semibold rounded-xl flex items-center justify-center gap-2">
                  <Eye className="w-5 h-5" />
                  View Full Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Download Modal */}
      <AnimatePresence>
        {showPDFModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowPDFModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong p-8 rounded-3xl max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gradient">Download FIR Case PDF</h2>
                <button
                  onClick={() => setShowPDFModal(false)}
                  className="p-2 glass rounded-xl hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Select the format and options for the PDF download:</p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeEvidence"
                      className="w-5 h-5 text-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeEvidence" className="text-sm text-white">
                      Include Evidence Files
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="emailPDF"
                      className="w-5 h-5 text-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emailPDF" className="text-sm text-white">
                      Email PDF to Complainant
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowPDFModal(false);
                  // Add PDF generation and download logic here
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Generate PDF
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
