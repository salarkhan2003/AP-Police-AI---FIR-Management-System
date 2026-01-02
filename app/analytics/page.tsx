'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  MapPin,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Award,
  Target,
  Zap,
  AlertTriangle,
  ChevronRight,
  Activity,
  PieChart,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

interface StatCard {
  title: string;
  value: number;
  suffix?: string;
  icon: any;
  color: string;
  trend: 'up' | 'down';
  trendValue: string;
  description: string;
}

interface OfficerStats {
  id: string;
  name: string;
  designation: string;
  casesHandled: number;
  avgResponseTime: string;
  approvalRate: number;
  slaCompliance: number;
  rank: number;
  badge: string;
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [animatedStats, setAnimatedStats] = useState<{ [key: string]: number }>({});

  const stats: StatCard[] = [
    {
      title: 'Total FIRs Filed',
      value: 1847,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up',
      trendValue: '+12.5%',
      description: 'This month'
    },
    {
      title: 'Pending Approvals',
      value: 127,
      icon: Clock,
      color: 'from-yellow-500 to-orange-500',
      trend: 'down',
      trendValue: '-8.3%',
      description: 'Across all stations'
    },
    {
      title: 'Avg Response Time',
      value: 1.8,
      suffix: 'hrs',
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      trend: 'down',
      trendValue: '-15.2%',
      description: 'Filing to approval'
    },
    {
      title: 'SLA Compliance',
      value: 94,
      suffix: '%',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      trend: 'up',
      trendValue: '+3.1%',
      description: 'Within deadline'
    }
  ];

  const officerLeaderboard: OfficerStats[] = [
    { id: '1', name: 'SI Rajesh Kumar', designation: 'Sub Inspector', casesHandled: 156, avgResponseTime: '1.2hrs', approvalRate: 98, slaCompliance: 99, rank: 1, badge: '🥇' },
    { id: '2', name: 'CI Priya Sharma', designation: 'Circle Inspector', casesHandled: 142, avgResponseTime: '1.5hrs', approvalRate: 96, slaCompliance: 97, rank: 2, badge: '🥈' },
    { id: '3', name: 'SI Amit Patel', designation: 'Sub Inspector', casesHandled: 138, avgResponseTime: '1.8hrs', approvalRate: 95, slaCompliance: 95, rank: 3, badge: '🥉' },
    { id: '4', name: 'Const. Suresh', designation: 'Constable', casesHandled: 124, avgResponseTime: '2.1hrs', approvalRate: 92, slaCompliance: 91, rank: 4, badge: '⭐' },
    { id: '5', name: 'SI Meera Reddy', designation: 'Sub Inspector', casesHandled: 118, avgResponseTime: '2.3hrs', approvalRate: 90, slaCompliance: 89, rank: 5, badge: '⭐' }
  ];

  const crimeTypeData = [
    { type: 'Theft', count: 412, percentage: 28, color: 'bg-blue-500' },
    { type: 'Assault', count: 286, percentage: 19, color: 'bg-red-500' },
    { type: 'Cyber Crime', count: 234, percentage: 16, color: 'bg-purple-500' },
    { type: 'Domestic Violence', count: 198, percentage: 13, color: 'bg-orange-500' },
    { type: 'Fraud', count: 156, percentage: 11, color: 'bg-yellow-500' },
    { type: 'Others', count: 189, percentage: 13, color: 'bg-gray-500' }
  ];

  const approvalPipeline = [
    { stage: 'Filed', count: 1847, color: 'from-blue-500 to-cyan-500' },
    { stage: 'SI Review', count: 1720, color: 'from-cyan-500 to-teal-500' },
    { stage: 'CI Approval', count: 1580, color: 'from-teal-500 to-green-500' },
    { stage: 'DSP Verification', count: 1420, color: 'from-green-500 to-emerald-500' },
    { stage: 'Completed', count: 1320, color: 'from-emerald-500 to-lime-500' }
  ];

  useEffect(() => {
    // Animate stats counting up
    stats.forEach((stat, index) => {
      let start = 0;
      const end = stat.value;
      const duration = 1500;
      const increment = end / (duration / 16);

      setTimeout(() => {
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setAnimatedStats(prev => ({ ...prev, [stat.title]: end }));
            clearInterval(timer);
          } else {
            setAnimatedStats(prev => ({ ...prev, [stat.title]: Math.floor(start * 10) / 10 }));
          }
        }, 16);
      }, index * 100);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-strong border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gradient">Analytics Dashboard</h1>
              <p className="text-gray-400">Real-time insights and performance metrics</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Period Selector */}
              <div className="flex items-center gap-2 glass rounded-xl p-1">
                {['day', 'week', 'month', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedPeriod === period
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>

              <button className="p-3 glass rounded-xl hover:bg-white/10">
                <RefreshCw className="w-5 h-5" />
              </button>

              <button className="px-4 py-3 glass rounded-xl hover:bg-white/10 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              className="glass-strong p-6 rounded-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' 
                    ? stat.title === 'Pending Approvals' ? 'text-red-400' : 'text-green-400'
                    : stat.title === 'Avg Response Time' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{stat.trendValue}</span>
                </div>
              </div>
              <div className="text-4xl font-black mb-1">
                {animatedStats[stat.title] ?? 0}
                {stat.suffix && <span className="text-xl text-gray-400">{stat.suffix}</span>}
              </div>
              <div className="text-sm text-gray-400">{stat.title}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Approval Pipeline Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-strong p-8 rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-6">Approval Pipeline</h2>
            <div className="space-y-4">
              {approvalPipeline.map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-gray-400">{stage.count} cases</span>
                  </div>
                  <div className="h-12 bg-white/5 rounded-xl overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stage.count / approvalPipeline[0].count) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${stage.color} rounded-xl flex items-center justify-end pr-4`}
                    >
                      <span className="text-sm font-bold text-white">
                        {Math.round((stage.count / approvalPipeline[0].count) * 100)}%
                      </span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>

            {/* Conversion Rate */}
            <div className="mt-8 p-6 glass rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Overall Completion Rate</p>
                  <p className="text-3xl font-black text-gradient">
                    {Math.round((approvalPipeline[approvalPipeline.length - 1].count / approvalPipeline[0].count) * 100)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Drop-off</p>
                  <p className="text-2xl font-bold text-red-400">
                    {approvalPipeline[0].count - approvalPipeline[approvalPipeline.length - 1].count}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Crime Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-strong p-8 rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-6">Crime Distribution</h2>
            <div className="space-y-4">
              {crimeTypeData.map((crime, index) => (
                <motion.div
                  key={crime.type}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{crime.type}</span>
                    <span className="text-sm text-gray-400">{crime.count}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${crime.percentage}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                      className={`h-full ${crime.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Cases</span>
                <span className="text-2xl font-bold text-gradient">
                  {crimeTypeData.reduce((sum, c) => sum + c.count, 0)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Officer Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-strong p-8 rounded-3xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Officer Leaderboard</h2>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Based on performance metrics</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                  <th className="pb-4 pr-4">Rank</th>
                  <th className="pb-4 pr-4">Officer</th>
                  <th className="pb-4 pr-4">Cases Handled</th>
                  <th className="pb-4 pr-4">Avg Response</th>
                  <th className="pb-4 pr-4">Approval Rate</th>
                  <th className="pb-4">SLA Compliance</th>
                </tr>
              </thead>
              <tbody>
                {officerLeaderboard.map((officer, index) => (
                  <motion.tr
                    key={officer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <span className="text-2xl">{officer.badge}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-medium">{officer.name}</p>
                        <p className="text-sm text-gray-400">{officer.designation}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="font-bold text-lg">{officer.casesHandled}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`font-medium ${
                        parseFloat(officer.avgResponseTime) < 2 ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {officer.avgResponseTime}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                            style={{ width: `${officer.approvalRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{officer.approvalRate}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              officer.slaCompliance >= 95
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : officer.slaCompliance >= 90
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                : 'bg-gradient-to-r from-red-500 to-rose-500'
                            }`}
                            style={{ width: `${officer.slaCompliance}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{officer.slaCompliance}%</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* SLA Compliance Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'SI Approval (6 hrs)', value: 96, target: 95, color: 'from-green-500 to-emerald-500' },
            { title: 'CI Approval (12 hrs)', value: 92, target: 90, color: 'from-blue-500 to-cyan-500' },
            { title: 'DSP Verification (24 hrs)', value: 88, target: 85, color: 'from-purple-500 to-pink-500' }
          ].map((sla, index) => (
            <motion.div
              key={sla.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="glass-strong p-6 rounded-2xl"
            >
              <h3 className="font-bold mb-4">{sla.title}</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 352' }}
                    animate={{ strokeDasharray: `${(sla.value / 100) * 352} 352` }}
                    transition={{ delay: 1, duration: 1.5 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black">{sla.value}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Target: <span className={sla.value >= sla.target ? 'text-green-400' : 'text-red-400'}>{sla.target}%</span>
                </p>
                <p className={`text-sm font-medium ${sla.value >= sla.target ? 'text-green-400' : 'text-red-400'}`}>
                  {sla.value >= sla.target ? '✓ Meeting SLA' : '⚠ Below Target'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/fir/cases">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              className="w-full p-6 glass-strong rounded-2xl text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">View All Cases</h3>
                    <p className="text-sm text-gray-400">Browse complete case list</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.button>
          </Link>

          <Link href="/fir/approvals">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              className="w-full p-6 glass-strong rounded-2xl text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Pending Approvals</h3>
                    <p className="text-sm text-gray-400">127 awaiting action</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            className="w-full p-6 glass-strong rounded-2xl text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Overdue Cases</h3>
                  <p className="text-sm text-gray-400">23 require escalation</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </motion.button>
        </div>
      </main>
    </div>
  );
}

