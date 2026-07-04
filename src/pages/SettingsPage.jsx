import React from 'react';
import { 
  Settings, 
  Database, 
  Cpu, 
  Bot, 
  Sun, 
  Moon, 
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSecurity } from '../context/SecurityContext';

export default function SettingsPage() {
  const { apiSettings, toggleSetting, theme, toggleTheme } = useSecurity();

  // Toggle Row reusable component
  const ToggleRow = ({ icon: Icon, title, description, checked, onChange, disabled = false }) => (
    <div className="flex items-start justify-between p-4 bg-slate-900/40 border border-slate-850 hover:border-slate-800 transition-colors rounded-xl gap-4">
      <div className="flex gap-3">
        <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800/80 shrink-0 ${checked ? 'text-soc-accent' : 'text-soc-secondary'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
          <p className="text-[11px] text-soc-secondary mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Switch element */}
      <button
        onClick={onChange}
        disabled={disabled}
        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 focus:outline-none flex items-center ${
          checked ? 'bg-soc-primary' : 'bg-slate-800'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <motion.div
          layout
          className="w-4.5 h-4.5 bg-white rounded-full shadow"
          animate={{ x: checked ? 18 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SOC Platform Settings</h1>
        <p className="text-sm text-soc-secondary">Manage microservice connection flags, reasoning engine states, and theme options.</p>
      </div>

      {/* Connection Toggles */}
      <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-soc-primary" />
          Microservice Gateway Connections
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <ToggleRow
            icon={Layers}
            title="Backend SOC API Gateway"
            description="Route threat analysis and real-time logs ingestion requests to the REST backend server (/predict and /dashboard)."
            checked={apiSettings.backendConnected}
            onChange={() => toggleSetting('backendConnected')}
          />
          <ToggleRow
            icon={Bot}
            title="Google Gemini AI Integration"
            description="Interact with Gemini models for descriptive summaries, business impact analytics, and mitigation advice."
            checked={apiSettings.geminiConnected}
            onChange={() => toggleSetting('geminiConnected')}
          />
          <ToggleRow
            icon={Cpu}
            title="Threat Detection Classifier Model"
            description="Activate localized machine learning pipeline inference (/predict ML pickle vector matching)."
            checked={apiSettings.modelReady}
            onChange={() => toggleSetting('modelReady')}
          />
        </div>
      </div>

      {/* Look and Feel */}
      <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <Sun className="w-4 h-4 text-soc-warning" />
          Aesthetics & Theme
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <ToggleRow
            icon={theme === 'dark' ? Moon : Sun}
            title="Force SOC Dark Navy Theme"
            description="Enable high-contrast corporate night-operations layout palette for reduced screen strain in security centers."
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
        </div>
      </div>

      {/* Metadata Version Box */}
      <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-soc-secondary" />
          Metadata & Versioning
        </h2>

        <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 text-[11px] font-semibold text-soc-secondary space-y-2">
          <div className="flex justify-between py-1 border-b border-slate-850/60">
            <span>PLATFORM VERSION</span>
            <span className="text-white font-mono">{apiSettings.version}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-850/60">
            <span>MODEL TARGET</span>
            <span className="text-white font-mono">cyber_threat_model.pkl (Scikit-Learn Random Forest)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-850/60">
            <span>VIRTUAL MACHINE RUNTIME</span>
            <span className="text-white">Node.js v24.16 // React 18.3 // Vite 8.1</span>
          </div>
          <div className="flex justify-between py-1">
            <span>LOCAL WORKSTATION DATE</span>
            <span className="text-white font-mono">2026-07-04 11:32:00 UTC</span>
          </div>
        </div>
      </div>

    </div>
  );
}
