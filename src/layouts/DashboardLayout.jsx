import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Upload,
  Bot,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  User,
  Activity,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecurity } from '../context/SecurityContext';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { apiSettings } = useSecurity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Threat Analysis', path: '/upload', icon: Upload },
    { name: 'AI Assistant', path: '/chat', icon: Bot },
    { name: 'Incident Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-soc-bg text-soc-text flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-soc-sidebar border-r border-slate-800 shrink-0">
        {/* Brand / Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <Shield className="w-8 h-8 text-soc-primary fill-soc-primary/10" />
          <div>
            <h1 className="font-bold text-sm leading-tight tracking-wider">CYBER THREAT</h1>
            <p className="text-[10px] text-soc-secondary font-medium tracking-widest uppercase">Intelligence Unit</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-soc-primary text-white shadow-lg shadow-soc-primary/20'
                    : 'text-soc-secondary hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          {/* Connection Indicators */}
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800/80 text-[11px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-soc-secondary">SOC Core Gate</span>
              <span className={`inline-flex items-center gap-1 font-semibold ${apiSettings.backendConnected ? 'text-soc-success' : 'text-soc-danger'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${apiSettings.backendConnected ? 'bg-soc-success animate-pulse' : 'bg-soc-danger'}`}></span>
                {apiSettings.backendConnected ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-soc-secondary">Gemini Engine</span>
              <span className={`inline-flex items-center gap-1 font-semibold ${apiSettings.geminiConnected ? 'text-soc-success' : 'text-soc-danger'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${apiSettings.geminiConnected ? 'bg-soc-success animate-pulse' : 'bg-soc-danger'}`}></span>
                {apiSettings.geminiConnected ? 'READY' : 'OFFLINE'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-soc-danger hover:bg-soc-danger/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-soc-sidebar/60 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-soc-secondary hover:text-white p-1 rounded-lg hover:bg-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soc-secondary" />
              <input
                type="text"
                placeholder="Search logs, incidents, CVEs, or IPs..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-soc-text placeholder:text-soc-secondary focus:outline-none focus:border-soc-primary focus:ring-1 focus:ring-soc-primary transition-all"
              />
            </div>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-soc-secondary hover:text-white hover:bg-white/5 transition-all"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-soc-danger rounded-full ring-2 ring-soc-sidebar"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Backdrop cover for clicking away */}
                    <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)}></div>

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-2 w-80 bg-soc-card border border-slate-700/80 rounded-2xl shadow-xl shadow-black/40 p-4 z-30"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h4 className="font-semibold text-sm">Security Alerts</h4>
                        <span className="text-[10px] bg-soc-danger/25 text-soc-danger font-bold px-2 py-0.5 rounded-full">3 Active</span>
                      </div>
                      <div className="divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
                        <div className="py-3 text-xs space-y-1 hover:bg-white/5 cursor-pointer rounded-lg px-1 transition-colors">
                          <div className="flex justify-between font-medium">
                            <span className="text-soc-danger font-semibold">Critical Threat Classified</span>
                            <span className="text-[9px] text-soc-secondary">2 mins ago</span>
                          </div>
                          <p className="text-soc-secondary">SQL Injection detected on Authentication endpoint.</p>
                        </div>
                        <div className="py-3 text-xs space-y-1 hover:bg-white/5 cursor-pointer rounded-lg px-1 transition-colors">
                          <div className="flex justify-between font-medium">
                            <span className="text-soc-warning font-semibold">Large Scale Phishing Campaign</span>
                            <span className="text-[9px] text-soc-secondary">15 mins ago</span>
                          </div>
                          <p className="text-soc-secondary">Employees redirected to accounts-secur-google.com.</p>
                        </div>
                        <div className="py-3 text-xs space-y-1 hover:bg-white/5 cursor-pointer rounded-lg px-1 transition-colors">
                          <div className="flex justify-between font-medium">
                            <span className="text-soc-success font-semibold">Automatic WAF Patch Deployed</span>
                            <span className="text-[9px] text-soc-secondary">1 hr ago</span>
                          </div>
                          <p className="text-soc-secondary">DDoS blocklist updated. SYN Flood mitigated.</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800/80">
              <div className="w-9 h-9 rounded-xl bg-soc-primary/10 border border-soc-primary/30 flex items-center justify-center">
                <User className="w-5 h-5 text-soc-primary" />
              </div>
              <div className="hidden xl:block text-left">
                <h3 className="text-xs font-semibold">Admin</h3>
                <span className="text-[10px] text-soc-secondary">Incident Response Command</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Menu - Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />

            {/* Sidebar drawer panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-soc-sidebar border-r border-slate-800 flex flex-col z-50 lg:hidden"
            >
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Shield className="w-7 h-7 text-soc-primary fill-soc-primary/10" />
                  <h1 className="font-bold text-sm tracking-wider">CYBER THREAT</h1>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-soc-secondary hover:text-white p-1 rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Menu */}
              <nav className="flex-1 py-6 px-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                          ? 'bg-soc-primary text-white shadow-lg shadow-soc-primary/20'
                          : 'text-soc-secondary hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-slate-800 space-y-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-soc-danger hover:bg-soc-danger/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
