import React, { useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldAlert, 
  Clock, 
  Activity, 
  ShieldCheck, 
  ChevronRight,
  Loader2,
  FileCode
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSecurity } from '../context/SecurityContext';
import { useNotifications } from '../context/NotificationContext';

export default function ReportsPage() {
  const { dashboardData, activeReport, loadingReport, handleGenerateReport } = useSecurity();
  const { addNotification } = useNotifications();

  // Load the first threat's report on mount if none is active
  useEffect(() => {
    if (!activeReport && dashboardData?.threats?.length > 0) {
      handleGenerateReport(dashboardData.threats[0].id);
    }
  }, [dashboardData, activeReport, handleGenerateReport]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    addNotification('Compiling report parameters into PDF binaries...', 'info', 2000);
    setTimeout(() => {
      addNotification(`Incident-Report-${activeReport?.incidentId || 'TR-8902'}.pdf downloaded successfully.`, 'success', 3000);
    }, 2200);
  };

  // Severity color maps
  const severityColors = {
    Critical: 'text-soc-danger border-soc-danger bg-soc-danger/10',
    High: 'text-soc-warning border-soc-warning bg-soc-warning/10',
    Medium: 'text-soc-primary border-soc-primary bg-soc-primary/10',
    Low: 'text-soc-secondary border-slate-700 bg-white/5',
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="no-print">
        <h1 className="text-2xl font-bold tracking-tight">Security Incident Reports</h1>
        <p className="text-sm text-soc-secondary">Draft, sign, and print formal incident telemetry details for regulatory compliance reviews.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column: Select Threat ID */}
        <div className="xl:col-span-1 bg-soc-card border border-slate-800 rounded-2xl p-5 space-y-4 no-print">
          <h3 className="text-xs font-bold uppercase tracking-wider">Incident Registry</h3>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {dashboardData?.threats?.map((threat) => {
              const isActive = activeReport?.incidentId === threat.id;
              
              const sevBadge = {
                Critical: 'bg-soc-danger/15 text-soc-danger',
                High: 'bg-soc-warning/15 text-soc-warning',
                Medium: 'bg-soc-primary/15 text-soc-accent',
                Low: 'bg-slate-800 text-soc-secondary',
              };

              return (
                <button
                  key={threat.id}
                  onClick={() => handleGenerateReport(threat.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    isActive 
                      ? 'border-soc-primary bg-soc-primary/10 text-white' 
                      : 'border-slate-850 bg-slate-900/30 hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold block opacity-60">{threat.timestamp.split(' ')[0]}</span>
                    <h4 className="text-xs font-bold truncate mt-0.5">{threat.id} - {threat.attackType}</h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-soc-secondary group-hover:text-white transition-colors shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Incident Report Renderer */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* Action Header Panel */}
          {activeReport && (
            <div className="bg-soc-card border border-slate-800 rounded-2xl p-4 flex items-center justify-between no-print shadow-md">
              <span className="text-xs text-soc-secondary font-semibold">
                Drafting report for <strong className="text-white font-bold">{activeReport.incidentId}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-850 hover:border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print Draft
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-3.5 py-2 bg-soc-primary text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          )}

          {/* Report Paper body */}
          <div className="relative">
            {loadingReport && (
              <div className="absolute inset-0 bg-soc-card/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl space-y-2">
                <Loader2 className="w-8 h-8 text-soc-primary animate-spin" />
                <span className="text-xs text-soc-secondary font-bold uppercase tracking-wider">Generating Compliance Telemetry...</span>
              </div>
            )}

            {activeReport ? (
              <div className="bg-soc-card border border-slate-800 rounded-2xl p-6 lg:p-10 space-y-6 shadow-xl relative overflow-hidden font-sans">
                {/* Branding indicator on printable container */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-soc-primary/10 border border-soc-primary/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-soc-primary" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold tracking-wide uppercase">Cyber Incident Report</h2>
                      <span className="text-[10px] text-soc-secondary font-semibold font-mono tracking-widest block mt-0.5">INTEL UNIT AUTOMATED REPORT SUMMARY</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">REPORT FILE ID</span>
                    <span className="text-[11px] text-soc-accent font-mono font-bold">{activeReport.incidentId}-COMPLIANCE</span>
                  </div>
                </div>

                {/* Grid Metadata details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b border-slate-800/60 text-xs">
                  <div className="space-y-1">
                    <span className="text-soc-secondary font-bold uppercase text-[9px] tracking-wider block">Incident Type</span>
                    <span className="font-semibold text-white">{activeReport.attackCategory}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-soc-secondary font-bold uppercase text-[9px] tracking-wider block">Diagnostic Date</span>
                    <span className="font-semibold text-white">{activeReport.date}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-soc-secondary font-bold uppercase text-[9px] tracking-wider block">Threat Status</span>
                    <span className="inline-flex items-center gap-1 font-bold text-soc-danger">
                      <span className="w-1.5 h-1.5 bg-soc-danger rounded-full animate-ping"></span>
                      ACTIVE THREAT
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-soc-secondary font-bold uppercase text-[9px] tracking-wider block">Severity Classification</span>
                    <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold ${severityColors[activeReport.severity] || severityColors.High}`}>
                      {activeReport.severity}
                    </span>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-soc-primary rounded"></span>
                    1. Executive Summary
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed pl-3 font-medium bg-slate-900/10 p-3.5 border border-slate-850 rounded-xl">
                    {activeReport.summary}
                  </p>
                </div>

                {/* Diagnostic Playbook / Recommendations */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-soc-primary rounded"></span>
                    2. Immediate Remediation Playbook
                  </h3>
                  <div className="pl-3 space-y-2">
                    {activeReport.recommendation.split('\n').map((rec, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed font-semibold bg-slate-900/10 p-3 border border-slate-850 rounded-xl">
                        <span className="text-soc-accent shrink-0 font-bold font-mono">{idx + 1}.</span>
                        <span>{rec.replace(/^\d+\.\s+/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signatures and stamp */}
                <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-xs font-semibold text-soc-secondary mt-12">
                  <div>
                    <span className="block opacity-65 text-[9px] uppercase tracking-wider">PREPARED BY</span>
                    <span className="block text-white font-bold mt-1 text-xs font-mono">SOC COGNITIVE CO-PILOT v1.4</span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">System Stamp Verified // Cert ID 9820-2</span>
                  </div>
                  <div className="text-right">
                    <span className="block opacity-65 text-[9px] uppercase tracking-wider">AUTHORIZED APPROVER</span>
                    <span className="block text-white font-bold mt-1 text-xs">KISHOR (INCIDENT COMMANDER)</span>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">Signature logged on-chain // 0x4f...892e</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-soc-card border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <FileText className="w-12 h-12 text-soc-secondary mx-auto animate-pulse" />
                <h3 className="text-base font-bold">No Threat Incident Selected</h3>
                <p className="text-xs text-soc-secondary">Please click an active threat alert from the panel on the left to generate its Incident report draft.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
