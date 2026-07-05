import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { securityService } from '../services/api';
import { useNotifications } from './NotificationContext';

const SecurityContext = createContext(null);

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider = ({ children }) => {
  const { addNotification } = useNotifications();

  // App States
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Prediction result card state
  const [predictionResult, setPredictionResult] = useState(null);
  // AI threat explanation state
  const [geminiExplanation, setGeminiExplanation] = useState(null);
  const [loadingGemini, setLoadingGemini] = useState(false);

  // Chatbot State
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: 'Hello, I am your Security Copilot. I can analyze uploaded logs, generate incident reports, and explain active attack signatures. Ask me anything about today\'s security posture.',
      model: 'System'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Incident Report state
  const [activeReport, setActiveReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // API Status Settings (Backend Status, Gemini Status, Model Status, Version Information)
  const [apiSettings, setApiSettings] = useState({
    backendConnected: true,
    geminiConnected: true,
    modelReady: true,
    version: 'v1.4.2-hackathon'
  });

  // Load dashboard data on mount
  const loadDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      const data = await securityService.getDashboardData();
      setDashboardData(data);
      if (apiSettings.backendConnected) {
        addNotification('Connected to Cyber Threat Intelligence API Gateway', 'success', 3000);
      }
    } catch (error) {
      addNotification('API connection failed. Operating in offline emulation mode.', 'warning', 4000);
    } finally {
      setLoadingDashboard(false);
    }
  }, [addNotification, apiSettings.backendConnected]);

  useEffect(() => {
    loadDashboard();
  }, []);

  // Set API Connection triggers (updates notification when user toggles in Settings)
  const toggleSetting = useCallback((key) => {
    setApiSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      const statusWord = updated[key] ? 'CONNECTED' : 'DISCONNECTED';
      const statusType = updated[key] ? 'success' : 'error';
      
      let label = 'API';
      if (key === 'backendConnected') label = 'Backend Server';
      if (key === 'geminiConnected') label = 'Google Gemini LLM Engine';
      if (key === 'modelReady') label = 'Security Detection Classifier ML Model';
      
      addNotification(`${label} has been toggled to ${statusWord}`, statusType, 3000);
      return updated;
    });
  }, [addNotification]);

  // Log upload simulation
  const handleUploadFile = useCallback(async (file) => {
    setUploadedFile(file.name);
    setSelectedFileObj(file);
    setUploadProgress(0);
    setPredictionResult(null);
    setGeminiExplanation(null);

    // Simulate upload progress bar
    for (let i = 1; i <= 100; i += 20) {
      setUploadProgress(i);
      await new Promise(r => setTimeout(r, 100));
    }
    setUploadProgress(100);
    addNotification(`File "${file.name}" uploaded successfully.`, 'success', 3000);
  }, [addNotification]);

  // Analyze log triggering /predict and /gemini-analysis
  const handleAnalyzeLog = useCallback(async (logContent = '') => {
    if (!uploadedFile) {
      addNotification('Please upload a security log file first.', 'warning', 3000);
      return;
    }

    setIsAnalyzing(true);
    setPredictionResult(null);
    setGeminiExplanation(null);
    
    addNotification('Running ML classification model inference...', 'info', 2000);

    try {
      // 1. Get model prediction
      const prediction = await securityService.predictLog(selectedFileObj || uploadedFile, logContent);
      setPredictionResult(prediction);
      addNotification('ML Prediction Complete: Threat detected.', 'warning', 3000);

      // 2. Fetch Gemini Explanation
      setLoadingGemini(true);
      if (apiSettings.geminiConnected) {
        addNotification('Querying Gemini model for reasoning & response metrics...', 'info', 2500);
      }
      
      const analysis = await securityService.getGeminiAnalysis(prediction, uploadedFile);
      setGeminiExplanation(analysis);
      
      if (apiSettings.geminiConnected) {
        addNotification('Gemini analysis compiled successfully.', 'success', 3000);
      }

      // Add prediction threat to mock threat table to show updates on dashboard
      setDashboardData(prev => {
        if (!prev) return prev;
        const newId = `TR-${Math.floor(8912 + Math.random() * 1000)}`;
        const newThreat = {
          id: newId,
          attackType: prediction.attackCategory,
          severity: prediction.threatLevel,
          confidence: prediction.confidenceScore,
          status: 'Active',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        
        // Update metric counts
        const updatedMetrics = { ...prev.metrics };
        updatedMetrics.totalThreats.count += 1;
        if (prediction.threatLevel === 'Critical') updatedMetrics.criticalThreats.count += 1;
        if (prediction.threatLevel === 'High') updatedMetrics.highSeverity.count += 1;
        if (prediction.threatLevel === 'Medium') updatedMetrics.mediumSeverity.count += 1;

        return {
          ...prev,
          metrics: updatedMetrics,
          threats: [newThreat, ...prev.threats]
        };
      });

    } catch (err) {
      addNotification('Failed to execute complete log diagnostic.', 'error', 3000);
    } finally {
      setIsAnalyzing(false);
      setLoadingGemini(false);
    }
  }, [uploadedFile, selectedFileObj, addNotification, apiSettings.geminiConnected]);

  // Chat message sender
  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const response = await securityService.sendChatMessage(text, chatHistory);
      
      setChatHistory((prev) => [...prev, {
        role: 'assistant',
        content: response.response,
        model: response.model
      }]);
    } catch (err) {
      addNotification('Chat error occurred.', 'error', 3000);
    } finally {
      setChatLoading(false);
    }
  }, [chatHistory, addNotification]);

  // Generate Incident Report
  const handleGenerateReport = useCallback(async (incidentId) => {
    setLoadingReport(true);
    try {
      const matchedThreat = dashboardData?.threats?.find(t => t.id === incidentId);
      const report = await securityService.getIncidentReport(incidentId, matchedThreat);
      setActiveReport(report);
      addNotification(`Incident Report for ${incidentId} compiled successfully.`, 'success', 3000);
    } catch (err) {
      addNotification('Failed to generate incident report document.', 'error', 3000);
    } finally {
      setLoadingReport(false);
    }
  }, [addNotification, dashboardData]);

  // Theme support stub (Vite Dark Theme by default)
  const [theme, setTheme] = useState('dark');
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    addNotification('Theme changes require corporate configuration. Staying in Dark SOC mode.', 'info', 3000);
  }, [addNotification]);

  return (
    <SecurityContext.Provider
      value={{
        dashboardData,
        loadingDashboard,
        uploadedFile,
        uploadProgress,
        isAnalyzing,
        predictionResult,
        geminiExplanation,
        loadingGemini,
        chatHistory,
        chatLoading,
        activeReport,
        loadingReport,
        apiSettings,
        theme,
        toggleTheme,
        loadDashboard,
        toggleSetting,
        handleUploadFile,
        handleAnalyzeLog,
        handleSendMessage,
        handleGenerateReport
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};
