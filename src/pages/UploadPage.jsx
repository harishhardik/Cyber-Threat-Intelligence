import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Cpu, 
  Copy, 
  Check, 
  RefreshCw,
  Loader2,
  FileCode,
  Lock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecurity } from '../context/SecurityContext';
import { useNotifications } from '../context/NotificationContext';

export default function UploadPage() {
  const { 
    uploadedFile, 
    uploadProgress, 
    isAnalyzing, 
    predictionResult, 
    geminiExplanation, 
    loadingGemini,
    handleUploadFile, 
    handleAnalyzeLog 
  } = useSecurity();

  const { addNotification } = useNotifications();
  const [dragActive, setDragActive] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = ['text/csv', 'application/json', 'text/plain'];
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (validTypes.includes(file.type) || ['csv', 'json', 'log'].includes(fileExt)) {
        handleUploadFile(file);
      } else {
        addNotification('Unsupported file type. Please upload a CSV, JSON or plain LOG file.', 'error');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const loadSampleFile = (type) => {
    const mockFile = type === 'sql' 
      ? { name: 'web_application_sql_injection_log.json' }
      : { name: 'corporate_exchange_phishing_campaign_log.csv' };
    handleUploadFile(mockFile);
  };

  const triggerCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    addNotification('Details copied to clipboard.', 'success', 2000);
    setTimeout(() => setCopiedSection(null), 3000);
  };

  // Status mapping
  const severityColors = {
    Critical: 'bg-soc-danger/15 text-soc-danger border-soc-danger/30',
    High: 'bg-soc-warning/15 text-soc-warning border-soc-warning/30',
    Medium: 'bg-soc-primary/15 text-soc-accent border-soc-primary/30',
    Low: 'bg-white/5 text-soc-secondary border-slate-700/50',
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Intelligence Classifier</h1>
        <p className="text-sm text-soc-secondary">Injest server log records to predict vector classifications using Gemini LLM reasoning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider">Log Ingestion</h2>
            
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
                dragActive 
                  ? 'border-soc-primary bg-soc-primary/5 scale-[0.99]' 
                  : 'border-slate-800 hover:border-slate-700/80 hover:bg-white/[0.01]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt,.log"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-soc-secondary mb-3 group-hover:text-soc-primary transition-colors" />
              <h3 className="text-sm font-semibold mb-1">Drag security log files here</h3>
              <p className="text-[11px] text-soc-secondary max-w-[180px] leading-relaxed">Supports CSV, JSON or Raw text log formats</p>
            </div>

            {/* Load Sample Logs */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-soc-secondary tracking-wider block uppercase">Quick Load Mock Templates:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  onClick={() => loadSampleFile('sql')}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-750 text-soc-accent rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  SQL Injection Log
                </button>
                <button
                  onClick={() => loadSampleFile('phishing')}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-750 text-soc-warning rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Phishing Email Log
                </button>
              </div>
            </div>

            {/* Active Ingest File Progress */}
            {uploadedFile && (
              <div className="border border-slate-800/80 bg-slate-900/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-soc-primary/10 flex items-center justify-center text-soc-primary border border-soc-primary/20 shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{uploadedFile}</h4>
                    <span className="text-[10px] text-soc-secondary">Pending model classification</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-soc-secondary">
                    <span>UPLOAD STATE</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-soc-success h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>

                {/* Analyze Trigger Button */}
                {uploadProgress === 100 && (
                  <button
                    onClick={() => handleAnalyzeLog()}
                    disabled={isAnalyzing}
                    className="w-full bg-soc-primary hover:bg-blue-600 disabled:bg-soc-primary/40 text-white rounded-xl py-2.5 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 mt-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Analyzing signatures...
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3.5 h-3.5" />
                        Execute Cyber Diagnostics
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Prediction Results Column */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!predictionResult && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-soc-card border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center text-soc-secondary mb-4">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold mb-1">Awaiting Log Classification</h3>
                <p className="text-xs text-soc-secondary max-w-[280px]">
                  Please drag and drop a security audit log or load one of the quick mock templates to begin prediction analysis.
                </p>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-soc-card border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px] space-y-4"
              >
                <div className="relative">
                  {/* Rotating loader */}
                  <Loader2 className="w-16 h-16 text-soc-primary animate-spin" />
                  <Cpu className="w-6 h-6 text-soc-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Threat Classifier Processing</h3>
                  <p className="text-xs text-soc-secondary mt-1">Interpreting network telemetry patterns against threat databases...</p>
                </div>
              </motion.div>
            )}

            {predictionResult && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Prediction Result Card */}
                <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-soc-primary/5 rounded-full blur-2xl"></div>
                  
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-soc-secondary tracking-widest block uppercase">CLASSIFICATION REPORT</span>
                      <h2 className="text-base font-bold flex items-center gap-1.5 mt-0.5">
                        Threat: <span className="text-soc-accent">{predictionResult.attackCategory}</span>
                      </h2>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${severityColors[predictionResult.threatLevel]}`}>
                      {predictionResult.threatLevel} Severity
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-850">
                      <span className="text-[9px] text-soc-secondary font-bold uppercase tracking-wider block">CONFIDENCE RATING</span>
                      <span className="text-xl font-black text-white mt-1 block">{(predictionResult.confidenceScore * 100).toFixed(0)}%</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-850">
                      <span className="text-[9px] text-soc-secondary font-bold uppercase tracking-wider block">INFERENCE SPEED</span>
                      <span className="text-xl font-black text-white mt-1 block">{predictionResult.predictionTime}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-850">
                      <span className="text-[9px] text-soc-secondary font-bold uppercase tracking-wider block">INCIDENT STATE</span>
                      <span className="text-xl font-black text-soc-danger mt-1 block">{predictionResult.status}</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-850">
                      <span className="text-[9px] text-soc-secondary font-bold uppercase tracking-wider block">DIAGNOSTIC TIME</span>
                      <span className="text-[11px] font-bold text-white mt-2.5 block font-mono">11:32:00 UTC</span>
                    </div>
                  </div>

                  {/* Progress bar confidence */}
                  <div className="space-y-1 bg-slate-900/20 p-3 rounded-xl border border-slate-850">
                    <div className="flex justify-between text-[10px] font-bold text-soc-secondary">
                      <span>CLASSIFIER CONFIDENCE BAR</span>
                      <span>{(predictionResult.confidenceScore * 100).toFixed(0)}% Match</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                      <div className="bg-soc-primary h-full rounded-full transition-all duration-500" style={{ width: `${predictionResult.confidenceScore * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Gemini Explanation Panel */}
                <div className="bg-soc-card border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-soc-primary animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Gemini Threat Diagnosis</h3>
                    </div>
                    <button
                      onClick={() => triggerCopy(JSON.stringify(geminiExplanation, null, 2), 'analysis')}
                      className="p-1 text-soc-secondary hover:text-white rounded-lg hover:bg-white/5 transition-all flex items-center gap-1 text-[11px] font-semibold"
                    >
                      {copiedSection === 'analysis' ? <Check className="w-3.5 h-3.5 text-soc-success" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy JSON
                    </button>
                  </div>

                  {loadingGemini || !geminiExplanation ? (
                    <div className="p-8 text-center space-y-3">
                      <Loader2 className="w-8 h-8 text-soc-primary animate-spin mx-auto" />
                      <p className="text-xs text-soc-secondary">Querying Gemini model parameter paths for structural reasoning...</p>
                    </div>
                  ) : (
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-800/80">
                      
                      {/* Description */}
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] font-bold text-soc-accent uppercase tracking-wider flex items-center gap-1">
                          <Info className="w-3 h-3" /> Description
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{geminiExplanation.description}</p>
                      </div>

                      {/* Technical Details */}
                      <div className="p-4 space-y-2 bg-slate-900/10">
                        <span className="text-[10px] font-bold text-soc-warning uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Technical Signature
                        </span>
                        <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-lg border border-slate-850 text-emerald-400 overflow-x-auto">
                          {geminiExplanation.technicalDetails}
                        </pre>
                      </div>

                      {/* Business Impact */}
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] font-bold text-soc-danger uppercase tracking-wider flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Business Impact
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{geminiExplanation.businessImpact}</p>
                      </div>

                      {/* Risk Assessment */}
                      <div className="p-4 space-y-1 bg-slate-900/10">
                        <span className="text-[10px] font-bold text-soc-secondary uppercase tracking-wider block">Risk Assessment</span>
                        <p className="text-xs text-slate-300 font-semibold">{geminiExplanation.riskAssessment}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Recommendations Panel */}
                {geminiExplanation && (
                  <div className="bg-soc-card border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider">Remediation Action Playbook</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      
                      {/* Immediate Actions */}
                      <div className="space-y-2.5 p-3.5 bg-soc-danger/5 rounded-xl border border-soc-danger/20">
                        <span className="text-[10px] font-bold text-soc-danger uppercase tracking-wider block">IMMEDIATE STEPS</span>
                        <ul className="space-y-1.5 text-slate-300">
                          {geminiExplanation.recommendedActions.immediate.map((item, idx) => (
                            <li key={idx} className="flex gap-2 leading-relaxed">
                              <ArrowRight className="w-3 h-3 shrink-0 text-soc-danger mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Long-Term Recommendations */}
                      <div className="space-y-2.5 p-3.5 bg-soc-primary/5 rounded-xl border border-soc-primary/20">
                        <span className="text-[10px] font-bold text-soc-accent uppercase tracking-wider block">LONG-TERM ROADMAP</span>
                        <ul className="space-y-1.5 text-slate-300">
                          {geminiExplanation.recommendedActions.longTerm.map((item, idx) => (
                            <li key={idx} className="flex gap-2 leading-relaxed">
                              <ArrowRight className="w-3 h-3 shrink-0 text-soc-accent mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Best Practices */}
                      <div className="space-y-2.5 p-3.5 bg-slate-900/40 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-bold text-soc-secondary uppercase tracking-wider block">BEST PRACTICES</span>
                        <ul className="space-y-1.5 text-slate-300">
                          {geminiExplanation.recommendedActions.bestPractices.map((item, idx) => (
                            <li key={idx} className="flex gap-2 leading-relaxed">
                              <ShieldCheck className="w-3 h-3 shrink-0 text-soc-success mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
