import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck,
  AlertTriangle, 
  Bug, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Legend,
  CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import { useSecurity } from '../context/SecurityContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { dashboardData, loadingDashboard, handleGenerateReport } = useSecurity();

  // Threat Table local states
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleInspect = (threat) => {
    navigate('/upload');
  };

  const handleCreateReport = (threat) => {
    handleGenerateReport(threat.id);
    navigate('/reports');
  };

  // Sparkline chart component for KPI cards
  const Sparkline = ({ data, color }) => (
    <div className="w-16 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((val, idx) => ({ value: val, id: idx }))}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={1.5} 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  // Memoized filter and sorting operations
  const processedThreats = useMemo(() => {
    if (!dashboardData?.threats) return [];

    let result = [...dashboardData.threats];

    // Search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        t => t.id.toLowerCase().includes(lower) || 
             t.attackType.toLowerCase().includes(lower)
      );
    }

    // Severity filter
    if (severityFilter !== 'All') {
      result = result.filter(t => t.severity === severityFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'confidence') {
        aVal = parseFloat(a.confidence);
        bVal = parseFloat(b.confidence);
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [dashboardData?.threats, searchTerm, severityFilter, statusFilter, sortField, sortOrder]);

  // Paginated data slice
  const paginatedThreats = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedThreats.slice(startIndex, startIndex + itemsPerPage);
  }, [processedThreats, currentPage]);

  const totalPages = Math.ceil(processedThreats.length / itemsPerPage) || 1;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  if (loadingDashboard || !dashboardData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-800 rounded-lg"></div>
        {/* KPI Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-800 rounded-2xl lg:col-span-2"></div>
          <div className="h-80 bg-slate-800 rounded-2xl"></div>
        </div>
        {/* Table skeleton */}
        <div className="h-96 bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  const { metrics, charts } = dashboardData;

  const cardsInfo = [
    { 
      title: 'Total Threats', 
      value: metrics.totalThreats.count, 
      increase: metrics.totalThreats.increase, 
      trend: metrics.totalThreats.trend, 
      icon: Activity, 
      color: '#3B82F6', 
      textClass: 'text-soc-accent',
      bgClass: 'bg-soc-accent/10'
    },
    { 
      title: 'Critical Threats', 
      value: metrics.criticalThreats.count, 
      increase: metrics.criticalThreats.increase, 
      trend: metrics.criticalThreats.trend, 
      icon: ShieldAlert, 
      color: '#EF4444', 
      textClass: 'text-soc-danger',
      bgClass: 'bg-soc-danger/10'
    },
    { 
      title: 'High Severity', 
      value: metrics.highSeverity.count, 
      increase: metrics.highSeverity.increase, 
      trend: metrics.highSeverity.trend, 
      icon: AlertTriangle, 
      color: '#F59E0B', 
      textClass: 'text-soc-warning',
      bgClass: 'bg-soc-warning/10'
    },
    { 
      title: 'Medium Severity', 
      value: metrics.mediumSeverity.count, 
      increase: metrics.mediumSeverity.increase, 
      trend: metrics.mediumSeverity.trend, 
      icon: Bug, 
      color: '#8B5CF6', 
      textClass: 'text-violet-500',
      bgClass: 'bg-violet-500/10'
    },
    { 
      title: 'Low Severity', 
      value: metrics.lowSeverity.count, 
      increase: metrics.lowSeverity.increase, 
      trend: metrics.lowSeverity.trend, 
      icon: Shield, 
      color: '#6B7280', 
      textClass: 'text-soc-secondary',
      bgClass: 'bg-white/5'
    },
    { 
      title: 'Resolved Alerts', 
      value: metrics.resolvedThreats.count, 
      increase: metrics.resolvedThreats.increase, 
      trend: metrics.resolvedThreats.trend, 
      icon: ShieldCheck, 
      color: '#22C55E', 
      textClass: 'text-soc-success',
      bgClass: 'bg-soc-success/10'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security Operations Command</h1>
          <p className="text-sm text-soc-secondary">Real-time indicators, threat telemetry, and machine learning analytics.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-semibold text-soc-secondary">
          <Activity className="w-4 h-4 text-soc-success animate-pulse" />
          SYSTEM telemetry live
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cardsInfo.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.increase >= 0;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-soc-card border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700/80 transition-colors shadow-lg group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-soc-secondary">{card.title}</span>
                <div className={`p-1.5 rounded-lg ${card.bgClass}`}>
                  <Icon className={`w-4 h-4 ${card.textClass}`} />
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold tracking-tight">{card.value}</span>
                <Sparkline data={card.trend} color={card.color} />
              </div>

              <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-soc-secondary">
                {isPositive ? (
                  <span className="flex items-center text-soc-success gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    +{card.increase}%
                  </span>
                ) : (
                  <span className="flex items-center text-soc-danger gap-0.5">
                    <ArrowDownRight className="w-3 h-3" />
                    {card.increase}%
                  </span>
                )}
                <span>vs last hour</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attack Timeline (Line Chart) & Confidence Distribution (Area Chart) */}
        <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-soc-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Attack Severity & Timeline</h2>
            </div>
            <span className="text-[10px] text-soc-secondary font-bold tracking-wider">INTERVAL: 3-HOUR BLOCKS</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.attackTimeline} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '12px' }}
                  labelStyle={{ color: '#94A3B8', fontWeight: 'bold' }}
                />
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <Line type="monotone" dataKey="threats" name="Active Threats" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="critical" name="Critical Severity" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 4 }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution (Pie Chart) */}
        <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider">Threat Distribution</h2>
            <FileSpreadsheet className="w-4 h-4 text-soc-secondary" />
          </div>

          <div className="h-48 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tracking-tight">1.4k</span>
              <span className="text-[10px] text-soc-secondary uppercase tracking-widest font-semibold">Total Logs</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-medium text-soc-secondary">
            {charts.threatDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 px-2 py-1 bg-slate-900/40 rounded-lg border border-slate-800/40">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                <span className="truncate">{entry.name}</span>
                <span className="ml-auto font-bold text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Severity (Bar Chart) */}
        <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider">Weekly Severity Trends</h2>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-soc-secondary font-semibold">7 Days</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.threatSeverity} margin={{ left: -20, right: 0, top: 10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '12px' }} />
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <Bar dataKey="Critical" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="High" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Medium" stackId="a" fill="#2563EB" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Low" stackId="a" fill="#6B7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Score Area Chart */}
        <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider">ML Confidence Distribution</h2>
            <span className="text-[10px] text-soc-success font-bold uppercase">Averaging 89.2%</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.confidenceScores} margin={{ left: -20, right: 10, top: 10, bottom: 5 }}>
                <XAxis dataKey="range" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '12px' }} />
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <defs>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="count" name="Classified Logs" stroke="#2563EB" fillOpacity={1} fill="url(#colorConfidence)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Combined Daily Activity & Top Attack Categories */}
        <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider">Top Attack Categories</h2>
            <span className="text-[10px] text-soc-secondary font-bold">MITRE ATT&CK Mapping</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topCategories} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
                <XAxis type="number" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis dataKey="category" type="category" stroke="#475569" fontSize={9} tickLine={false} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#475569', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Threat Logs Table Panel */}
      <div className="bg-soc-card border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {/* Table Toolbar controls */}
        <div className="p-5 border-b border-slate-800 flex flex-col xl:flex-row gap-4 xl:items-center justify-between bg-slate-900/30">
          <div>
            <h2 className="text-base font-bold">Threat Indicators Logs</h2>
            <p className="text-xs text-soc-secondary">Audit feed of anomalies flagged by the detection classifier.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soc-secondary" />
              <input
                type="text"
                placeholder="Search Attack/ID..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="bg-slate-900 border border-slate-850 rounded-xl py-2 pl-9 pr-4 text-xs text-soc-text placeholder:text-soc-secondary focus:outline-none focus:border-soc-primary focus:ring-1 focus:ring-soc-primary transition-all w-48"
              />
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-soc-secondary" />
              <span className="text-soc-secondary">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-white focus:outline-none font-semibold cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs">
              <span className="text-soc-secondary">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-white focus:outline-none font-semibold cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Investigating">Investigating</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table itself */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-soc-secondary tracking-wider uppercase bg-slate-900/20">
                <th onClick={() => handleSort('id')} className="py-4 px-6 cursor-pointer hover:text-white transition-colors">
                  Threat ID {sortField === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('attackType')} className="py-4 px-6 cursor-pointer hover:text-white transition-colors">
                  Attack Category {sortField === 'attackType' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('severity')} className="py-4 px-6 cursor-pointer hover:text-white transition-colors">
                  Severity {sortField === 'severity' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('confidence')} className="py-4 px-6 cursor-pointer hover:text-white transition-colors">
                  Confidence Score {sortField === 'confidence' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('status')} className="py-4 px-6 cursor-pointer hover:text-white transition-colors">
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('timestamp')} className="py-4 px-6 cursor-pointer hover:text-white transition-colors">
                  Detection Time {sortField === 'timestamp' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {paginatedThreats.length > 0 ? (
                paginatedThreats.map((threat) => {
                  
                  const sevColorMap = {
                    Critical: 'bg-soc-danger/15 text-soc-danger border-soc-danger/25',
                    High: 'bg-soc-warning/15 text-soc-warning border-soc-warning/25',
                    Medium: 'bg-soc-primary/15 text-soc-accent border-soc-primary/25',
                    Low: 'bg-slate-800 text-soc-secondary border-slate-700/50',
                  };

                  const statColorMap = {
                    Active: 'bg-soc-danger/10 text-soc-danger',
                    Investigating: 'bg-soc-warning/10 text-soc-warning',
                    Resolved: 'bg-soc-success/10 text-soc-success',
                  };

                  return (
                    <tr key={threat.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3.5 px-6 font-mono text-xs font-bold text-soc-accent">{threat.id}</td>
                      <td className="py-3.5 px-6 font-semibold">{threat.attackType}</td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${sevColorMap[threat.severity]}`}>
                          {threat.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-soc-primary h-full rounded-full" style={{ width: `${threat.confidence * 100}%` }}></div>
                          </div>
                          <span className="font-mono text-xs font-bold">{(threat.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${statColorMap[threat.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            threat.status === 'Active' ? 'bg-soc-danger animate-ping' : threat.status === 'Investigating' ? 'bg-soc-warning animate-pulse' : 'bg-soc-success'
                          }`}></span>
                          {threat.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-soc-secondary font-mono">{threat.timestamp}</td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleInspect(threat)}
                            className="p-1.5 bg-slate-950/40 hover:bg-soc-primary/20 text-soc-secondary hover:text-white border border-slate-800 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
                            title="Inspect Log"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Inspect
                          </button>
                          <button
                            onClick={() => handleCreateReport(threat)}
                            className="p-1.5 bg-slate-950/40 hover:bg-soc-success/20 text-soc-secondary hover:text-white border border-slate-800 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
                            title="Generate Incident Report"
                          >
                            Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-soc-secondary text-sm font-medium">
                    No active threat logs matching selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {processedThreats.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-soc-secondary font-semibold bg-slate-900/10">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedThreats.length)} of {processedThreats.length} systems
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-800 rounded-lg bg-slate-950/50 hover:bg-white/5 text-soc-secondary disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-white px-2">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-800 rounded-lg bg-slate-950/50 hover:bg-white/5 text-soc-secondary disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
