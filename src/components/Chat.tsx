"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, LogOut, Download, Briefcase } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<{name: string, subject: string, level: string, language?: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = localStorage.getItem("edu_profile");
    if (p) {
      const parsed = JSON.parse(p);
      setProfile(parsed);
      const greetingLang = parsed.language === "Spanish" ? "Hola" : parsed.language === "French" ? "Bonjour" : parsed.language === "Hindi" ? "नमस्ते" : "Hi";
      // Initial greeting
      setMessages([
        {
          role: "assistant",
          content: `${greetingLang} ${parsed.name}! I'm excited to help you learn **${parsed.subject}** at a **${parsed.level}** level. \n\nWhat specific topic would you like to start with?`
        }
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, customAction?: "career") => {
    if (e) e.preventDefault();
    if ((!input.trim() && !customAction) || isLoading) return;

    let userMessageContent = input;
    if (customAction === "career") {
      userMessageContent = "How can I use this in my future career?";
    }

    const userMessage = { role: "user" as const, content: userMessageContent };
    setMessages(prev => [...prev, userMessage]);
    if (!customAction) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          profile,
          action: customAction 
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch response");
      }
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Oops! Something went wrong.";
      setMessages(prev => [...prev, { role: "assistant", content: `**Error:** ${errorMessage}\n\nPlease try asking again or checking your API key.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("edu_profile");
    window.location.reload();
  };

  const downloadPDF = async () => {
    if (typeof window === "undefined" || !chatContainerRef.current) return;
    
    // Dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import("html2pdf.js")).default;
    
    const element = chatContainerRef.current;
    const opt = {
      margin:       1,
      filename:     `${profile?.subject}_Notes.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!profile) return null;

  return (
    <div className="flex flex-col h-full bg-slate-900 border-x border-slate-800 shadow-2xl relative">
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">EduBridge AI</h1>
            <p className="text-xs text-slate-400">{profile.subject} • {profile.level} • {profile.language || 'English'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => handleSubmit(undefined, "career")} className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg flex items-center text-sm font-medium transition-colors" title="Career Guidance">
            <Briefcase className="w-4 h-4 mr-1.5" /> Career
          </button>
          <button onClick={downloadPDF} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center text-sm font-medium transition-colors" title="Download PDF Notes">
            <Download className="w-4 h-4 mr-1.5" /> PDF
          </button>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors ml-2" title="Reset Profile">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" id="chat-container" ref={chatContainerRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex space-x-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-600" : "bg-slate-700"}`}>
                {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-400" />}
              </div>
              <div className={`rounded-2xl px-5 py-4 ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm shadow-sm"}`}>
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <span className="text-slate-400 text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={e => handleSubmit(e)} className="flex items-end space-x-2 bg-slate-800 p-2 rounded-2xl border border-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-3 outline-none text-slate-200"
            rows={1}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white p-3 rounded-xl transition-all hover:bg-blue-500 flex-shrink-0 mb-1 mr-1"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-3">EduBridge AI can make mistakes. Always verify important info.</p>
      </div>
    </div>
  );
}
