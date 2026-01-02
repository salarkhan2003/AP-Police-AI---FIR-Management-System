'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Bell,
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  MapPin,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Download,
  ChevronRight,
  AlertTriangle,
  User,
  RefreshCw,
  Globe,
  Menu,
  X,
  Home,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatCard {
  title: string;
  value: number;
  suffix?: string;
  icon: any;
  color: string;
  trend: 'up' | 'down';
  trendValue: string;
}

interface RecentFIR {
  id: string;
  caseNumber: string;
  title: string;
  complainant: string;
  crimeType: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'pending' | 'approved' | 'investigating' | 'closed';
  location: string;
  filedAt: string;
  assignedTo: string;
}

interface ActivityItem {
  id: string;
  action: string;
  caseNumber: string;
  officer: string;
  time: string;
  type: 'approval' | 'filing' | 'update' | 'alert';
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('Officer');
  const [userRole, setUserRole] = useState('constable');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<{ [key: string]: number }>({});
  const [notificationCount] = useState(5);

  const stats: StatCard[] = [
    { title: 'Pending Approvals', value: 12, icon: Clock, color: 'from-yellow-500 to-orange-500', trend: 'up', trendValue: '+3 today' },
    { title: 'Cases Handled', value: 847, icon: FileText, color: 'from-blue-500 to-cyan-500', trend: 'up', trendValue: '+23 this week' },
    { title: 'Avg Response', value: 1.8, suffix: 'hrs', icon: Zap, color: 'from-green-500 to-emerald-500', trend: 'down', trendValue: '-0.3hrs' },
    { title: 'SLA Compliance', value: 94, suffix: '%', icon: CheckCircle, color: 'from-purple-500 to-pink-500', trend: 'up', trendValue: '+2%' }
  ];

  const recentFIRs: RecentFIR[] = [
    {
      id: '1',
      caseNumber: 'AP-2026-VJA-00234',
      title: 'Armed Robbery at Jewelry Shop',
      complainant: 'Rajesh Kumar',
      crimeType: 'Robbery',
      priority: 'URGENT',
      status: 'pending',
      location: 'Vijayawada Central',
      filedAt: '2 hours ago',
      assignedTo: 'SI Sharma'
    },
    {
      id: '2',
      caseNumber: 'AP-2026-VJA-00235',
      title: 'Cyber Fraud - Banking Scam',
      complainant: 'Priya Reddy',
      crimeType: 'Cyber Crime',
      priority: 'HIGH',
      status: 'pending',
      location: 'Vijayawada East',
      filedAt: '4 hours ago',
      assignedTo: 'CI Patel'
    },
    {
      id: '3',
      caseNumber: 'AP-2026-VJA-00236',
      title: 'Domestic Violence Report',
      complainant: 'Anonymous',
      crimeType: 'Domestic Violence',
      priority: 'HIGH',
      status: 'investigating',
      location: 'Vijayawada West',
      filedAt: '6 hours ago',
      assignedTo: 'SI Gupta'
    },
    {
      id: '4',
      caseNumber: 'AP-2026-VJA-00237',
      title: 'Mobile Phone Theft',
      complainant: 'Sunil Patel',
      crimeType: 'Theft',
      priority: 'MEDIUM',
      status: 'approved',
      location: 'Vijayawada Central',
      filedAt: '8 hours ago',
      assignedTo: 'Const. Krishna'
    }
  ];

  const activityFeed: ActivityItem[] = [
    { id: '1', action: 'FIR Approved', caseNumber: 'AP-2026-VJA-00230', officer: 'CI Patel', time: '5 mins ago', type: 'approval' },
    { id: '2', action: 'New FIR Filed', caseNumber: 'AP-2026-VJA-00234', officer: 'Const. Suresh', time: '2 hours ago', type: 'filing' },
    { id: '3', action: 'Evidence Added', caseNumber: 'AP-2026-VJA-00228', officer: 'SI Sharma', time: '3 hours ago', type: 'update' },
    { id: '4', action: 'OVERDUE ALERT', caseNumber: 'AP-2026-VJA-00220', officer: 'SI Kumar', time: '4 hours ago', type: 'alert' },
    { id: '5', action: 'Case Closed', caseNumber: 'AP-2026-VJA-00215', officer: 'CI Reddy', time: '5 hours ago', type: 'approval' }
  ];

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Officer';
    const role = localStorage.getItem('userRole') || 'constable';
    setUserName(name);
    setUserRole(role);

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
            setAnimatedStats(prev => ({ ...prev, [stat.title]: Math.floor(start) }));
          }
        }, 16);
      }, index * 100);
    });
  }, []);

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
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'investigating': return 'bg-blue-500/20 text-blue-400';
      case 'closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'filing': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'update': return <RefreshCw className="w-4 h-4 text-purple-400" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: Plus, label: 'File New FIR', href: '/fir/create' },
    { icon: Sparkles, label: 'AI FIR Writer', href: '/ai-writer' },
    { icon: Clock, label: 'Pending Approvals', href: '/fir/approvals', badge: 12 },
    { icon: ClipboardList, label: 'My Cases', href: '/fir/cases' },
    { icon: Search, label: 'Search FIRs', href: '/fir/search' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Globe, label: 'Public Portal', href: '/public' },
    { icon: Users, label: 'Team', href: '/team' },
    { icon: Settings, label: 'Settings', href: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white flex">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0, width: sidebarCollapsed ? 80 : 280 }}
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full glass-strong border-r border-white/10 z-40 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="w-7 h-7 text-white" />
            </motion.div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h1 className="text-lg font-bold text-gradient">AP Police</h1>
                <p className="text-xs text-gray-400">FIR Management</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <Link key={item.label} href={item.href}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                    : 'hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? 'text-blue-400' : 'text-gray-400'}`} />
                {!sidebarCollapsed && (
                  <>
                    <span className={`flex-1 ${item.active ? 'text-white font-medium' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full p-2 glass rounded-xl hover:bg-white/10 flex items-center justify-center"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </motion.aside>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-full glass-strong border-r border-white/10"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-10 h-10 text-blue-400" />
                  <div>
                    <h1 className="text-lg font-bold text-gradient">AP Police</h1>
                    <p className="text-xs text-gray-400">FIR Management</p>
                  </div>
                </div>
                <button onClick={() => setShowMobileMenu(false)} className="p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                      item.active ? 'bg-blue-500/20 border border-blue-500/30' : 'hover:bg-white/5'
                    }`}>
                      <item.icon className={`w-5 h-5 ${item.active ? 'text-blue-400' : 'text-gray-400'}`} />
                      <span className={item.active ? 'text-white font-medium' : 'text-gray-400'}>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'} transition-all duration-300`}>
        {/* Top Bar */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 glass-strong border-b border-white/10 z-30"
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden p-2 glass rounded-xl hover:bg-white/10"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cases, complainants..."
                  className="w-96 pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <Link href="/fir/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50"
                >
                  <Plus className="w-5 h-5" />
                  New FIR
                </motion.button>
              </Link>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="relative p-3 glass rounded-xl hover:bg-white/10"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-gray-400">{userRole.toUpperCase()}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-lg font-bold">
                  {userName.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
            <div className="relative z-10">
              <h1 className="text-3xl font-black mb-2">
                Welcome back, <span className="text-gradient">{userName}</span> 👋
              </h1>
              <p className="text-gray-400 mb-6">
                You have <span className="text-yellow-400 font-semibold">12 pending approvals</span> and{' '}
                <span className="text-red-400 font-semibold">2 overdue cases</span> requiring attention.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/fir/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    File New FIR
                  </motion.button>
                </Link>
                <Link href="/fir/approvals">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 glass text-white font-bold rounded-xl flex items-center gap-2"
                  >
                    <Clock className="w-5 h-5 text-yellow-400" />
                    View Pending
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                className="glass-strong p-6 rounded-2xl cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{stat.trendValue}</span>
                  </div>
                </div>
                <div className="text-3xl font-black mb-1">
                  {animatedStats[stat.title] ?? 0}
                  {stat.suffix && <span className="text-xl text-gray-400">{stat.suffix}</span>}
                </div>
                <div className="text-sm text-gray-400">{stat.title}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Pending Cases - 2 columns */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recent FIRs</h2>
                <Link href="/fir/cases" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentFIRs.map((fir, index) => (
                  <motion.div
                    key={fir.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="glass-strong p-5 rounded-2xl cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <motion.span
                          animate={fir.priority === 'URGENT' ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(fir.priority)}`}
                        >
                          {fir.priority === 'URGENT' && '🔴 '}{fir.priority}
                        </motion.span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(fir.status)}`}>
                          {fir.status.charAt(0).toUpperCase() + fir.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{fir.filedAt}</span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-gradient transition-colors">
                      {fir.caseNumber}
                    </h3>
                    <p className="text-gray-300 mb-3">{fir.title}</p>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {fir.complainant}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {fir.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 glass rounded-lg hover:bg-white/10">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 glass rounded-lg hover:bg-white/10">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Feed - 1 column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Activity Feed</h2>
                <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="glass-strong rounded-2xl p-4 space-y-4">
                {activityFeed.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl ${
                      activity.type === 'alert' ? 'bg-red-500/10 border border-red-500/30' : 'glass'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'alert' ? 'bg-red-500/20' : 'bg-white/10'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${activity.type === 'alert' ? 'text-red-400' : 'text-white'}`}>
                          {activity.action}
                        </p>
                        <p className="text-sm text-blue-400 truncate">{activity.caseNumber}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{activity.officer}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="font-bold mb-4">Today&apos;s Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">FIRs Filed</span>
                    <span className="font-bold text-green-400">+15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Approved</span>
                    <span className="font-bold text-blue-400">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rejected</span>
                    <span className="font-bold text-red-400">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Pending</span>
                    <span className="font-bold text-yellow-400">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-white/10 z-40"
      >
        <div className="flex items-center justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 px-4 py-2">
            <Home className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-blue-400">Home</span>
          </Link>
          <Link href="/fir/create" className="flex flex-col items-center gap-1 px-4 py-2">
            <Plus className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">New FIR</span>
          </Link>
          <Link href="/fir/approvals" className="flex flex-col items-center gap-1 px-4 py-2 relative">
            <Clock className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Pending</span>
            <span className="absolute -top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              12
            </span>
          </Link>
          <Link href="/fir/search" className="flex flex-col items-center gap-1 px-4 py-2">
            <Search className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Search</span>
          </Link>
          <button onClick={() => setShowMobileMenu(true)} className="flex flex-col items-center gap-1 px-4 py-2">
            <Menu className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">More</span>
          </button>
        </div>
      </motion.nav>
    </div>
  );
}

