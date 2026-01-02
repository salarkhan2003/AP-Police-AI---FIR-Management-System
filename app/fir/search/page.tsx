'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  MapPin,
  Calendar,
  User,
  Phone,
  Clock,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Mic,
  History,
  Star,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  caseNumber: string;
  title: string;
  complainant: string;
  crimeType: string;
  status: string;
  location: string;
  date: string;
  matchScore: number;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
  results: number;
}

export default function FIRSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'case' | 'name' | 'location'>('all');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([
    { id: '1', query: 'AP-2026-VJA', timestamp: '2 hours ago', results: 15 },
    { id: '2', query: 'Vijayawada Central robbery', timestamp: '5 hours ago', results: 8 },
    { id: '3', query: 'cyber fraud January', timestamp: 'Yesterday', results: 23 }
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showVoice, setShowVoice] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  // AI-powered suggestions
  useEffect(() => {
    if (searchQuery.length > 2) {
      const mockSuggestions = [
        `${searchQuery} in Vijayawada`,
        `${searchQuery} theft case`,
        `${searchQuery} 2026`,
        `FIR number containing ${searchQuery}`,
        `Complainant ${searchQuery}`
      ];
      setSuggestions(mockSuggestions.slice(0, 4));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setSuggestions([]);

    // Simulate search
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          caseNumber: 'AP-2026-VJA-00234',
          title: 'Armed Robbery at Jewelry Shop',
          complainant: 'Rajesh Kumar',
          crimeType: 'Robbery',
          status: 'investigating',
          location: 'Vijayawada Central',
          date: '2026-01-02',
          matchScore: 98
        },
        {
          id: '2',
          caseNumber: 'AP-2026-VJA-00235',
          title: 'Cyber Fraud - Banking Scam',
          complainant: 'Priya Reddy',
          crimeType: 'Cyber Crime',
          status: 'pending',
          location: 'Vijayawada East',
          date: '2026-01-02',
          matchScore: 85
        },
        {
          id: '3',
          caseNumber: 'AP-2026-VJA-00230',
          title: 'Mobile Phone Theft',
          complainant: 'Sunil Patel',
          crimeType: 'Theft',
          status: 'closed',
          location: 'Vijayawada Central',
          date: '2026-01-01',
          matchScore: 72
        }
      ];

      setResults(mockResults);
      setIsSearching(false);

      // Add to recent searches
      if (searchTerm.length > 3) {
        setRecentSearches(prev => [
          { id: Date.now().toString(), query: searchTerm, timestamp: 'Just now', results: mockResults.length },
          ...prev.slice(0, 4)
        ]);
      }
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'investigating': return 'bg-blue-500/20 text-blue-400';
      case 'closed': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-strong border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-gradient mb-2"
            >
              Search FIRs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400"
            >
              Find any FIR by case number, complainant name, location, or keywords
            </motion.p>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
              <div className="relative glass-strong rounded-2xl p-2">
                <div className="flex items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by case number, name, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-14 pr-4 py-4 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pr-2">
                    <button
                      onClick={() => setShowVoice(true)}
                      className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <Mic className="w-5 h-5 text-purple-400" />
                    </button>

                    <motion.button
                      onClick={() => handleSearch()}
                      disabled={isSearching}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl disabled:opacity-50"
                    >
                      {isSearching ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        'Search'
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Search Type Tabs */}
                <div className="flex items-center gap-2 px-4 pb-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'case', label: 'Case Number' },
                    { id: 'name', label: 'Name' },
                    { id: 'location', label: 'Location' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSearchType(type.id as typeof searchType)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        searchType === type.id
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="ml-auto px-3 py-1 text-sm text-gray-500 hover:text-gray-300 flex items-center gap-1"
                  >
                    <Filter className="w-4 h-4" />
                    Advanced
                  </button>
                </div>
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden z-50"
                  >
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          handleSearch(suggestion);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>{suggestion}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Results or Empty State */}
        {results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Found <span className="text-gradient">{results.length}</span> results
                </h2>
                <p className="text-sm text-gray-400">for &quot;{searchQuery}&quot;</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select className="px-3 py-1 glass rounded-lg text-sm bg-transparent">
                  <option>Relevance</option>
                  <option>Date (Newest)</option>
                  <option>Date (Oldest)</option>
                </select>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedResult(result)}
                  className="glass-strong p-6 rounded-2xl cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Match Score */}
                      <div className="text-center">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${
                          result.matchScore >= 90 ? 'bg-green-500/20 text-green-400' :
                          result.matchScore >= 70 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {result.matchScore}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Match</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold font-mono group-hover:text-gradient transition-colors">
                          {result.caseNumber}
                        </h3>
                        <p className="text-gray-300">{result.title}</p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{result.complainant}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FileText className="w-4 h-4" />
                      <span>{result.crimeType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{result.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{result.date}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 flex items-center gap-2 text-sm">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Clear Results */}
            <button
              onClick={() => {
                setResults([]);
                setSearchQuery('');
              }}
              className="mx-auto block text-gray-400 hover:text-white transition-colors"
            >
              Clear Results
            </button>
          </motion.div>
        ) : (
          /* Empty State / Recent Searches */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-400" />
                  Recent Searches
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={search.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setSearchQuery(search.query);
                        handleSearch(search.query);
                      }}
                      className="glass p-4 rounded-xl text-left hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">{search.timestamp}</span>
                      </div>
                      <p className="font-medium group-hover:text-gradient transition-colors">{search.query}</p>
                      <p className="text-sm text-gray-400">{search.results} results</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Search Shortcuts */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Quick Searches
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Today\'s FIRs', query: 'date:today' },
                  { label: 'Pending Approvals', query: 'status:pending' },
                  { label: 'High Priority', query: 'priority:high' },
                  { label: 'My Assigned Cases', query: 'assigned:me' }
                ].map((shortcut, index) => (
                  <motion.button
                    key={shortcut.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    onClick={() => {
                      setSearchQuery(shortcut.query);
                      handleSearch(shortcut.query);
                    }}
                    className="glass p-4 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium">{shortcut.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Search Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Use case number for exact match: <code className="text-blue-400">AP-2026-VJA-00234</code></span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Search by crime type: <code className="text-blue-400">theft cyber robbery</code></span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Filter by status: <code className="text-blue-400">status:pending</code></span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Use voice search for natural language queries</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Voice Search Modal */}
      <AnimatePresence>
        {showVoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowVoice(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong p-12 rounded-3xl text-center max-w-md w-full"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
              >
                <Mic className="w-16 h-16 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Listening...</h3>
              <p className="text-gray-400 mb-6">Speak your search query</p>
              <button
                onClick={() => setShowVoice(false)}
                className="px-6 py-3 glass rounded-xl hover:bg-white/10"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

