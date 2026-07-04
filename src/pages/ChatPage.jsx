import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Sparkles, Terminal, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSecurity } from '../context/SecurityContext';

export default function ChatPage() {
  const { chatHistory, chatLoading, handleSendMessage } = useSecurity();
  const [inputText, setInputText] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const bottomRef = useRef(null);

  const presets = [
    { label: "Explain today's attacks", query: "Explain today's attacks." },
    { label: "Why is SQL Injection dangerous?", query: "Why is this attack dangerous?" },
    { label: "Generate Incident Report", query: "Generate Incident Report." },
    { label: "How do I prevent phishing?", query: "How do I prevent phishing?" }
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;
    handleSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // Copy helper for code blocks
  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  // Custom Markdown & Code Block Renderer
  const renderMessageContent = (content) => {
    // Split message into sections of code block and normal text
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Code Block
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : 'code';
        const codeText = match ? match[2].trim() : part.slice(3, -3).trim();

        return (
          <div key={index} className="my-3 border border-slate-800 rounded-xl overflow-hidden shadow-md">
            <div className="bg-slate-900 px-4 py-1.5 flex items-center justify-between border-b border-slate-850">
              <span className="text-[10px] font-bold text-soc-secondary tracking-widest uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-soc-accent" />
                {language || 'bash'}
              </span>
              <button
                onClick={() => copyCode(codeText, index)}
                className="text-soc-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors flex items-center gap-1 text-[10px]"
              >
                {copiedIndex === index ? <Check className="w-3 h-3 text-soc-success" /> : <Copy className="w-3 h-3" />}
                Copy Code
              </button>
            </div>
            <pre className="p-4 bg-slate-950/80 overflow-x-auto text-[11px] font-mono text-emerald-400">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Format headers, bold text, bullet points
      let lines = part.split('\n').map((line, idx) => {
        let formatted = line;

        // Headers ###
        if (formatted.startsWith('### ')) {
          return <h3 key={idx} className="text-sm font-bold text-white mt-4 mb-2 first:mt-0">{formatted.substring(4)}</h3>;
        }
        if (formatted.startsWith('#### ')) {
          return <h4 key={idx} className="text-xs font-bold text-white mt-3 mb-1">{formatted.substring(5)}</h4>;
        }

        // Bullets * or -
        if (formatted.startsWith('* ') || formatted.startsWith('- ')) {
          return (
            <li key={idx} className="list-disc list-inside text-xs text-slate-300 ml-4 py-0.5 leading-relaxed">
              {parseInlineMarkdown(formatted.substring(2))}
            </li>
          );
        }

        // Ordered list numbers
        if (/^\d+\.\s/.test(formatted)) {
          const match = formatted.match(/^(\d+)\.\s(.*)/);
          return (
            <li key={idx} className="list-decimal list-inside text-xs text-slate-300 ml-4 py-0.5 leading-relaxed">
              {parseInlineMarkdown(match[2])}
            </li>
          );
        }

        // Regular paragraphs
        return formatted.trim() ? (
          <p key={idx} className="text-xs text-slate-300 py-1 leading-relaxed">
            {parseInlineMarkdown(formatted)}
          </p>
        ) : null;
      });

      return <div key={index}>{lines}</div>;
    });
  };

  // Parse bold ** and inline `code`
  const parseInlineMarkdown = (text) => {
    let parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-soc-accent">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      
      {/* Examples & Presets panel */}
      <div className="w-full md:w-64 shrink-0 flex flex-col justify-between p-5 bg-soc-card border border-slate-800 rounded-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-soc-accent animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider">SOC Security Assistant</h2>
          </div>
          <p className="text-xs text-soc-secondary leading-relaxed">
            Leverage Google Gemini-tuned LLM reasoning path models to query live anomalies, retrieve playbooks, or output reports.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-bold text-soc-secondary tracking-wider uppercase block">Example Prompts:</span>
            <div className="flex flex-col gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleSendMessage(preset.query)}
                  className="text-left text-xs font-semibold p-3 bg-slate-900/60 hover:bg-soc-primary/10 border border-slate-850 hover:border-soc-primary/30 rounded-xl transition-all text-slate-300 hover:text-white"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/85 text-[10px] text-soc-secondary space-y-1">
          <div className="flex justify-between">
            <span>ENGINE CONFIG</span>
            <span className="text-white font-bold">Gemini 1.5 Pro</span>
          </div>
          <div className="flex justify-between">
            <span>LATENCY RANGE</span>
            <span className="text-white font-bold">~1.2s avg</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Panel */}
      <div className="flex-1 flex flex-col bg-soc-card border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-soc-primary/10 border border-soc-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-soc-primary" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider">AI Copilot Chatfeed</h3>
              <span className="text-[10px] text-soc-success font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-soc-success animate-pulse"></span>
                Security model online
              </span>
            </div>
          </div>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, index) => {
            const isAI = msg.role === 'assistant';
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3.5 max-w-[85%] ${isAI ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
              >
                <div className={`w-8 h-8 rounded-lg border shrink-0 flex items-center justify-center ${
                  isAI 
                    ? 'bg-soc-primary/10 border-soc-primary/25 text-soc-primary shadow-md shadow-soc-primary/5' 
                    : 'bg-slate-900 border-slate-800 text-soc-secondary'
                }`}>
                  {isAI ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                <div className="space-y-1">
                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl text-xs border ${
                    isAI 
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-300 rounded-tl-sm' 
                      : 'bg-soc-primary text-white border-soc-primary/20 rounded-tr-sm'
                  }`}>
                    {isAI ? renderMessageContent(msg.content) : <p className="leading-relaxed font-semibold">{msg.content}</p>}
                  </div>
                  
                  {/* Model watermark info */}
                  {isAI && (
                    <span className="text-[9px] text-soc-secondary block ml-1 font-mono uppercase tracking-wider">
                      AGENT: {msg.model || 'Gemini 1.5 Pro'}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Chat Loading (typing animation) */}
          {chatLoading && (
            <div className="flex gap-3.5 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-soc-primary/10 border border-soc-primary/25 flex items-center justify-center text-soc-primary shrink-0">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl rounded-tl-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-soc-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-soc-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-soc-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/10">
          <div className="relative flex items-center">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Copilot about vulnerability vectors, log patterns, or mitigation playbooks..."
              rows={1}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3.5 pl-4 pr-12 text-xs text-soc-text placeholder:text-soc-secondary focus:outline-none focus:border-soc-primary focus:ring-1 focus:ring-soc-primary transition-all resize-none max-h-20"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || chatLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-soc-primary hover:bg-blue-600 disabled:bg-soc-primary/20 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
