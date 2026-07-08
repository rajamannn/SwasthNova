import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  FileText, 
  Download, 
  HelpCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Layers,
  FileCheck
} from "lucide-react";
import Markdown from "react-markdown";
import { HealthCentre, Language, UserRole } from "../types";
import { translations } from "../data/translations";

interface AiAssistantProps {
  language: Language;
  role: UserRole;
  isLargeText: boolean;
  centres: HealthCentre[];
  speechEnabled: boolean;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

const suggestedPrompts = [
  "Predict active dengue outbreak risks in district",
  "Generate stock redistribution instructions for Paracetamol",
  "Audit available ICU and emergency beds",
  "What centers have understaffing issues today?"
];

export default function AiAssistant({
  language,
  role,
  isLargeText,
  centres,
  speechEnabled
}: AiAssistantProps) {
  const t = translations[language];

  // Chat States
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "m-0",
      sender: "ai",
      text: "Hello! I am JanSeva, your public healthcare operations officer. Ask me any diagnostic questions about district stocks, patient surges, vaccination milestones, or bed allocations.",
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Voice Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Document/Report States
  const [selectedReportType, setSelectedReportType] = useState("Daily Operations Summary");
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // Web Speech API: Initialize SpeechRecognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === "hi" ? "hi-IN" : "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setChatInput(transcript);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Speech Recognition Error:", err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  // Speak response if speech is enabled
  const speakText = (text: string) => {
    if (!speechEnabled) return;
    try {
      window.speechSynthesis.cancel();
      // Remove markdown chars to speak cleanly
      const cleanText = text.replace(/[*#_\-`]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === "hi" ? "hi-IN" : "en-US";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Text to speech failed:", e);
    }
  };

  // Toggle Voice listening
  const handleVoiceListening = () => {
    if (!recognitionRef.current) {
      // Browser doesn't support recognition or iframe lacks permissions, simulate dictation text
      const mockPrompts = [
        "Audit critical vaccine counts in CHCs",
        "Give me a list of underperforming hospitals",
        "How is bed occupancy at Alibag General Hospital?",
        "What is the status of Oxygen Cylinder stocks?"
      ];
      const randomPrompt = mockPrompts[Math.floor(Math.random() * mockPrompts.length)];
      setChatInput(randomPrompt);
      alert("Microphone simulated dictionary input: Injected prompt.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Submit Chat Message
  const handleChatSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || chatInput;
    if (!query.trim() || isChatLoading) return;

    // Add User Message
    const userMsg: ChatMessage = {
      id: `m-u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    // Add a blank AI message that we will stream into in real-time
    const aiMsgId = `m-ai-${Date.now()}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: "ai",
      text: "",
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg, initialAiMsg]);
    if (!customQuery) setChatInput("");
    setIsChatLoading(true);

    try {
      // Make POST request to server-side proxy
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: chatMessages.map(m => ({ sender: m.sender === "user" ? "user" : "model", text: m.text })),
          centersData: centres,
          language: language === "hi" ? "Hindi" : "English",
          role
        })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Server responded with error code");
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("Response body is not readable for streaming");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Save the last element as it might be an incomplete line
        buffer = lines.pop() || "";

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine) continue;

          if (cleanLine.startsWith("data: ")) {
            const dataStr = cleanLine.substring(6);
            if (dataStr === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text !== undefined) {
                accumulatedText += parsed.text;
                setChatMessages(prev =>
                  prev.map(m => m.id === aiMsgId ? { ...m, text: accumulatedText } : m)
                );
              }
            } catch (e) {
              // Ignore partial or invalid JSON lines
            }
          }
        }
      }

      // Auto speech synthesis read-out
      if (accumulatedText) {
        speakText(accumulatedText);
      }

    } catch (err: any) {
      console.error("AI Chat error:", err);
      const errorMsg = `\n\n**Service Warning:** ${err.message || "Error connecting to AI server."}\n\n*Fallback Telemetry:* Average patient telemetry score is ${Math.round(centres.reduce((sum, c) => sum + c.totalPatientsToday, 0) / (centres.length || 1))}% nominal.`;
      
      setChatMessages(prev =>
        prev.map(m => {
          if (m.id === aiMsgId) {
            return {
              ...m,
              text: m.text ? m.text + errorMsg : errorMsg.trim()
            };
          }
          return m;
        })
      );
    } finally {
      setIsChatLoading(false);
    }
  };

  // Generate Document Report
  const handleGenerateReport = async () => {
    if (isReportLoading) return;
    setIsReportLoading(true);
    setGeneratedReport(null);

    try {
      const res = await fetch("/api/ai/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: selectedReportType,
          centersData: centres,
          language: language === "hi" ? "Hindi" : "English"
        })
      });

      if (!res.ok) throw new Error("Report failed to generate");
      const data = await res.json();

      setGeneratedReport(data.reportMarkdown || "Report empty.");
    } catch (e) {
      console.error("Report generator error:", e);
      setGeneratedReport(`# JanSeva Error
Failed to compile report. Ensure backend server is connected and your GEMINI_API_KEY is active.`);
    } finally {
      setIsReportLoading(false);
    }
  };

  // Download markdown file
  const handleDownloadReport = () => {
    if (!generatedReport) return;
    const blob = new Blob([generatedReport], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `JanSeva_${selectedReportType.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="ai-assistant-tab">
      
      {/* Left Chat Copilot panel */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col justify-between shadow-lg h-[580px]" id="ai-chat-panel">
        <div className="space-y-4 flex-1 flex flex-col justify-between min-h-0">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-tight">{t.aiAssistant}</h3>
                <span className="text-[10px] text-emerald-300 font-bold block">Gemini 3.5 Copilot Connected</span>
              </div>
            </div>

            <span className="text-[10px] bg-white/5 border border-white/10 text-slate-300 font-bold uppercase px-2.5 py-1 rounded-md">
              Operations Assistant
            </span>
          </div>

          {/* Chat history list */}
          <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1 custom-scrollbar" id="chat-messages-history">
            {chatMessages.map(msg => {
              const isAi = msg.sender === "ai";
              return (
                <div 
                  key={msg.id}
                  className={`flex space-x-3 max-w-[85%] ${isAi ? "self-start" : "ml-auto flex-row-reverse space-x-reverse"}`}
                  id={`chat-msg-${msg.id}`}
                >
                  {isAi && (
                    <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`p-3.5 rounded-2xl border ${
                    isAi 
                      ? "bg-white/5 border-white/10 text-slate-200 rounded-tl-sm" 
                      : "bg-emerald-600 border-emerald-700 text-white rounded-tr-sm shadow-md"
                  }`}>
                    <div className="markdown-body text-xs leading-relaxed font-semibold">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                    <span className={`text-[9px] block mt-1.5 ${isAi ? "text-slate-400 text-left" : "text-emerald-200 text-right"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isChatLoading && (
              <div className="flex space-x-3 max-w-[80%]" id="chat-loading-bubble">
                <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Suggested Prompts */}
          {chatMessages.length <= 1 && (
            <div className="space-y-1.5 flex-shrink-0" id="suggested-prompts-block">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Suggested Queries:</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleChatSubmit(undefined, prompt)}
                    className="bg-white/5 border border-white/5 hover:bg-white/10 px-2.5 py-1.5 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg cursor-pointer transition-colors duration-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Form Chat Inputs */}
        <form onSubmit={handleChatSubmit} className="flex items-center space-x-2 mt-4 pt-4 border-t border-white/10 flex-shrink-0" id="chat-form-input">
          
          {/* Web Speech microphone button */}
          <button
            type="button"
            onClick={handleVoiceListening}
            className={`p-2.5 rounded-xl border-0 transition-all cursor-pointer ${
              isListening 
                ? "bg-rose-500/20 text-rose-300 animate-pulse" 
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
            title="Dictate message (Web Speech API)"
            id="chat-mic-btn"
          >
            {isListening ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
          </button>

          <input
            type="text"
            placeholder={t.askAnything}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isChatLoading}
            className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs outline-hidden focus:border-emerald-500/50 disabled:opacity-50"
            id="chat-text-input"
          />

          <button
            type="submit"
            disabled={!chatInput.trim() || isChatLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 shrink-0 shadow-md shadow-emerald-600/20"
            id="chat-submit-btn"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

      {/* Right Document Report Generator panel */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col justify-between shadow-lg h-[580px]" id="ai-report-generator-panel">
        <div className="space-y-4 flex-1 flex flex-col justify-between min-h-0">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base tracking-tight">{t.reports}</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Official Directives</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed flex-shrink-0">
            Select a public healthcare operations digest type to synthesize data summaries instantly based on district metrics.
          </p>

          {/* Form selecting report type */}
          <div className="flex flex-col sm:flex-row items-end gap-3 flex-shrink-0 bg-white/5 p-3 rounded-xl border border-white/10" id="report-type-selector">
            <div className="flex-1 flex flex-col space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Report Directive Type:</span>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="text-xs font-semibold bg-[#0b1220] border border-white/10 text-white rounded-lg px-2.5 py-2 cursor-pointer outline-hidden focus:border-emerald-500/50"
                id="report-type-dropdown"
              >
                <option value="Daily Operations Summary" className="bg-[#0b1220] text-white">Daily Operations Summary</option>
                <option value="Vaccine Logistics Report" className="bg-[#0b1220] text-white">Vaccine Logistics Report</option>
                <option value="Epidemiological Risk Assessment" className="bg-[#0b1220] text-white">Epidemiological Risk Assessment</option>
                <option value="District Resource Optimization Audit" className="bg-[#0b1220] text-white">District Resource Optimization Audit</option>
              </select>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={isReportLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer shrink-0 disabled:opacity-40 shadow-md shadow-emerald-600/20"
              id="generate-report-btn"
            >
              {isReportLoading ? "Compiling..." : "Generate AI Report"}
            </button>
          </div>

          {/* Generated markdown output view */}
          <div className="flex-1 overflow-y-auto border border-white/10 rounded-xl bg-white/5 p-4 min-h-0 custom-scrollbar" id="report-output-markdown">
            {isReportLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3" id="report-loader-animation">
                <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
                <p className="text-xs font-bold text-slate-400">Querying live district datasets and compiling markdown digest...</p>
              </div>
            ) : generatedReport ? (
              <div className="markdown-body text-xs text-slate-200 leading-relaxed font-semibold">
                <Markdown>{generatedReport}</Markdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 text-xs space-y-2 p-6" id="no-report-yet">
                <FileCheck className="h-10 w-10 text-slate-400" />
                <p className="font-bold text-slate-300">No Operations Report compiled yet.</p>
                <p className="text-[10px] text-slate-400 font-medium">Click the button above to generate a professional health brief.</p>
              </div>
            )}
          </div>

        </div>

        {/* Download action button */}
        {generatedReport && (
          <button
            onClick={handleDownloadReport}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 mt-4 transition-all cursor-pointer flex-shrink-0 shadow-lg shadow-emerald-600/20"
            id="download-report-btn"
          >
            <Download className="h-4 w-4" />
            <span>Download Report Markdown (.md)</span>
          </button>
        )}

        <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-3 border-t border-white/10 mt-4 flex-shrink-0">
          District Operations Registry Section
        </div>
      </div>

    </div>
  );
}
