import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Rocket, Zap, CheckCircle2, RefreshCcw, GripVertical,
  Target, BarChart, ChevronRight, Layout, Sparkles,
  ShieldCheck, AlertCircle, Search, Globe, Copy, Check
} from "lucide-react";

const DOMAIN_CHECK_KEY = import.meta.env.VITE_DOMAIN_CHECK_KEY;

const Roadmap = ({ project, data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [tasks, setTasks] = useState(data || []);

  // --- 🌐 DOMAIN SUGGESTION STATE ---
  const [domains, setDomains] = useState([]);
  const [isGeneratingDomains, setIsGeneratingDomains] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);

  const calculateReadiness = () => {
    if (!tasks.length) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const readinessScore = calculateReadiness();

  // --- 🤖 AI DOMAIN GENERATOR ---
  const generateDomainSuggestions = async () => {
    setIsGeneratingDomains(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Context: ${project?.name} - ${project?.tagline}.
        Task: Suggest 5 premium, short, and tech-oriented .com or .ai domain names for this project.
        Return ONLY a JSON array of strings: ["domain1.ai", "domain2.com", ...]
      `;

      const result = await model.generateContent(prompt);
      const match = result.response.text().match(/\[[\s\S]*\]/);
      if (match) {
        setDomains(JSON.parse(match[0]));
        setAvailabilityStatus({}); // Reset status for new batch
      }
    } catch (err) {
      console.error("Domain generation failed", err);
    } finally {
      setIsGeneratingDomains(false);
    }
  };

  // --- 🔎 WHOIS API VALIDATION ---
  const checkAvailability = async (domainName, index) => {
    setAvailabilityStatus(prev => ({ ...prev, [index]: "loading" }));

    try {
      const response = await fetch(
        `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${DOMAIN_CHECK_KEY}&domainName=${domainName}&outputFormat=json`
      );

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      const whois = data?.WhoisRecord;

      // Professional check: If registrant exists or domain is explicitly not available
      const isTaken = whois?.registryData?.registrant || whois?.substatus === "registered";

      setAvailabilityStatus(prev => ({
        ...prev,
        [index]: isTaken ? "taken" : "available"
      }));
    } catch (err) {
      setAvailabilityStatus(prev => ({ ...prev, [index]: "error" }));
    }
  };

  const optimizeRoadmap = async () => {
    setIsOptimizing(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Context: ${project?.name} - ${project?.tagline}. 
        Current Roadmap: ${JSON.stringify(tasks)}.
        Task: Re-prioritize this roadmap for maximum "Launch Readiness". 
        Focus on: RAG implementation, Agentic testing, and MVP UI.
        Return ONLY a JSON array of 7 items with {day, title, task, category, critical: boolean}.
      `;

      const result = await model.generateContent(prompt);
      const match = result.response.text().match(/\[[\s\S]*\]/);
      if (match) {
        const optimized = JSON.parse(match[0]);
        setTasks(optimized);
        onUpdate(optimized);
      }
    } catch (err) {
      console.error("Optimization failed", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    onUpdate(newTasks);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!tasks.length && !loading) {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-16 text-center space-y-8">
        <div className="w-24 h-24 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
          <Target className="text-indigo-400" size={48} />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Initialize Roadmap</h3>
          <p className="text-slate-500 text-sm font-medium">Generate a Notion-style execution plan synchronized with your {project?.name || 'SentinelAI'} infrastructure.</p>
        </div>
        <button onClick={optimizeRoadmap} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl">
          Generate Strategy
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">

      {/* 📊 DASHBOARD HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Launch Readiness</p>
            <h4 className="text-3xl font-black text-white italic">{readinessScore}%</h4>
          </div>
          <BarChart className="text-indigo-500/20 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" size={100} />
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 md:col-span-2">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] font-black text-slate-500 uppercase">System Progress</span>
              <span className="text-[10px] font-black text-indigo-400 uppercase italic">{readinessScore > 80 ? 'Launch Ready' : 'In Development'}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 shadow-[0_0_15px_#6366f1]" style={{ width: `${readinessScore}%` }} />
            </div>
          </div>
          <button
            onClick={optimizeRoadmap}
            disabled={isOptimizing}
            className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl border border-white/10 transition-all active:scale-90"
          >
            {isOptimizing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* 🌐 DOMAIN IDENTITY ENGINE (NEW) */}
      <div className="bg-[#0f0f0f]/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Globe className="text-indigo-400" size={20} />
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Brand Identity Registry</h4>
          </div>
          <button
            onClick={generateDomainSuggestions}
            disabled={isGeneratingDomains}
            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            {isGeneratingDomains ? <Loader2 size={12} /> : <RefreshCcw size={12} />}
            {domains.length > 0 ? 'Regenerate Names' : 'Suggest Domains'}
          </button>
        </div>

        {domains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain, index) => (
              <div key={index} className="bg-black/40 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-all flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold text-indigo-100">{domain}</span>
                  <button onClick={() => copyToClipboard(domain, index)} className="text-slate-600 hover:text-slate-400">
                    {copiedIndex === index ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {availabilityStatus[index] === "available" && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter italic">Available</span>}
                  {availabilityStatus[index] === "taken" && <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter italic">Taken</span>}
                  {availabilityStatus[index] === "loading" && <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter animate-pulse">Scanning DNS...</span>}
                  {!availabilityStatus[index] && <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter italic">Pending</span>}

                  <button
                    onClick={() => checkAvailability(domain, index)}
                    disabled={availabilityStatus[index] === "loading"}
                    className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 p-2 rounded-lg border border-indigo-500/20 transition-all"
                  >
                    <Search size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center border border-dashed border-white/5 rounded-2xl">
            <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest italic">No suggestions generated yet</p>
          </div>
        )}
      </div>

      {/* 📅 INTERACTIVE ROADMAP LIST */}
      <div className="space-y-4">
        {tasks.map((item, index) => (
          <div
            key={index}
            className={`group flex items-center gap-6 p-6 rounded-[2.5rem] border transition-all ${item.completed ? 'bg-[#0a0a0a] border-white/5 opacity-50' : 'bg-[#0f0f0f] border-white/10 hover:border-indigo-500/50'
              }`}
          >
            <div className="cursor-grab active:cursor-grabbing text-slate-700 hover:text-slate-400">
              <GripVertical size={20} />
            </div>

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm border ${item.completed ? 'bg-black border-white/5 text-slate-700' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
              }`}>
              {item.day}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">{item.category}</span>
                {item.critical && (
                  <span className="flex items-center gap-1 text-[8px] font-black uppercase text-amber-500 italic">
                    <AlertCircle size={10} /> Critical Path
                  </span>
                )}
              </div>
              <h5 className={`text-lg font-bold tracking-tight ${item.completed ? 'line-through text-slate-600' : 'text-white group-hover:text-indigo-400'}`}>
                {item.title}
              </h5>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                {item.task}
              </p>
            </div>

            <button
              onClick={() => toggleTask(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 text-black' : 'bg-white/5 border border-white/10 text-slate-500 hover:text-white'
                }`}
            >
              {item.completed ? <CheckCircle2 size={20} /> : <div className="w-2 h-2 rounded-full bg-slate-700" />}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 text-slate-600">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">State Synchronized with MongoDB Cluster</span>
      </div>
    </div>
  );
};

const Loader2 = ({ className, size = 20 }) => <RefreshCcw className={`animate-spin ${className}`} size={size} />;

export default Roadmap;