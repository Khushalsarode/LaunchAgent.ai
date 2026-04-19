import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Monitor, Smartphone, Sparkles, Settings2, Globe,
  BarChart3, Rocket, Terminal, Activity, ShieldCheck,
  Cpu, Database, ChevronRight, X, Zap, Layers,
  CheckCircle2, Server, MessageSquare, Sliders
} from "lucide-react";

const MVPPreview = ({ project, brandKit, data, onUpdate }) => {
  const [activePage, setActivePage] = useState("landing");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const [isPrompting, setIsPrompting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [siteLogs, setSiteLogs] = useState([]);

  // --- ⚙️ FUNCTIONAL SETTINGS ---
  const [engineConfig, setEngineConfig] = useState({
    temperature: data?.settings?.temperature || 0.4,
    model: data?.settings?.model || "Gemini 2.0 Flash",
    systemPrompt: data?.settings?.systemPrompt || "Act as LaunchAgent.ai Core resolution agent."
  });

  const primaryColor = brandKit?.colors?.[0] || "#6366f1";

  // --- 🗺️ DYNAMIC DISPLAY NAMES ---
  const pageNames = {
    landing: data?.pages?.landingName || "Overview",
    product: data?.pages?.productName || "Resolution Engine",
    analytics: data?.pages?.analyticsName || "Analytics",
    pricing: data?.pages?.pricingName || "Deployment"
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const ticketActions = [
        "Analyzing Ticket TK-102...", `RAG: Querying ${project?.name || 'Sentinel'} Vector Space`,
        "Intent: Technical Escalation", "Vector search complete (0.02ms)",
        "Sentinel-Alpha: Routing to DevOps", "Payload validated via Zero-shot"
      ];
      const newLog = { id: Date.now(), msg: ticketActions[Math.floor(Math.random() * ticketActions.length)] };
      setSiteLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, [project]);

  // --- ⌨️ SYNCED AI COMMAND (Prompt + Settings) ---
  const handleAICommand = async (e) => {
    e.preventDefault();
    if (!userPrompt) return;
    setLoading(true);
    setIsPrompting(false);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { temperature: engineConfig.temperature }
      });

      const prompt = `
        Role: ${engineConfig.systemPrompt}
        Task: Update LaunchAgent.ai MVP Data. 
        Current Context: ${JSON.stringify(data)}
        Instruction: "${userPrompt}"
        Output valid JSON only.
      `;

      const result = await model.generateContent(prompt);
      const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
      if (jsonMatch) onUpdate(JSON.parse(jsonMatch[0]));
      setUserPrompt("");
    } catch (err) {
      console.error("Engine Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = () => {
    onUpdate({ ...data, settings: engineConfig });
    setShowSettings(false);
  };

  return (
    <div className="relative min-h-[90vh] bg-[#050505] rounded-[3rem] border border-white/5 overflow-hidden flex flex-col font-sans">

      {/* 🟢 TOP NAV: AGENT OS HEADER */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-2xl z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-xs font-black text-white uppercase leading-none mb-1">{project?.name || "LaunchAgent.ai"}</h2>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">mvp preview</span>
              </div>
            </div>
          </div>

          <nav className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
            {Object.keys(pageNames).map(tab => (
              <button
                key={tab}
                onClick={() => setActivePage(tab)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activePage === tab ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
              >
                {pageNames[tab]}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2.5 border rounded-xl transition-all ${showSettings ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
          >
            <Settings2 size={16} />
          </button>
          <button onClick={() => setIsPrompting(true)} className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
            <Sparkles size={14} /> Prompt
          </button>
        </div>
      </header>

      {/* ⚙️ FUNCTIONAL SETTINGS PANEL */}
      {showSettings && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in">
          <div className="w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-white italic flex items-center gap-2 uppercase tracking-tighter"><Sliders size={18} className="text-indigo-500" /> Core Parameters</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Temperature</label><span className="text-indigo-400 font-mono text-xs">{engineConfig.temperature}</span></div>
                <input type="range" min="0" max="1" step="0.1" value={engineConfig.temperature} onChange={(e) => setEngineConfig({ ...engineConfig, temperature: parseFloat(e.target.value) })} className="w-full accent-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Model Architecture</label>
                <select value={engineConfig.model} onChange={(e) => setEngineConfig({ ...engineConfig, model: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white">
                  <option>Gemini 2.0 Flash</option>
                  <option>Sentinel-Custom-v1 (Fine-tuned)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Base Instruction Layer</label>
                <textarea value={engineConfig.systemPrompt} onChange={(e) => setEngineConfig({ ...engineConfig, systemPrompt: e.target.value })} className="w-full h-24 bg-black border border-white/10 rounded-xl p-3 text-xs text-slate-400 font-mono focus:border-indigo-500 outline-none" />
              </div>
              <button onClick={saveSettings} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20">Save Configuration</button>
            </div>
          </div>
        </div>
      )}

      {/* 🌍 THE CANVAS */}
      <main className="flex-1 p-8 lg:p-12 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.05)_0%,_transparent_60%)] overflow-y-auto">
        <div className={`mx-auto bg-white rounded-[3.5rem] shadow-2xl overflow-hidden transition-all duration-700 ${viewMode === 'mobile' ? 'w-[375px] min-h-[667px]' : 'w-full max-w-6xl'}`}>
          <div className="bg-white text-slate-950 min-h-[720px] p-12">

            {activePage === 'landing' && (
              <div className="py-12 space-y-8 text-center animate-in fade-in">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border rounded-full">
                  <Zap size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">{data?.landing?.badge || "RAG-Powered Engine"}</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                  {data?.landing?.heroTitle || "Resolution"} <span className="text-indigo-600">Automated.</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                  {data?.landing?.subText || "Empowering IT teams with intelligent agentic ticket routing and self-solving infrastructure."}
                </p>
                <button style={{ backgroundColor: primaryColor }} className="px-12 py-5 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-2xl shadow-indigo-500/20">
                  {data?.landing?.cta || "Launch Agent"}
                </button>
              </div>
            )}

            {activePage === 'product' && (
              <div className="animate-in slide-in-from-right-8 space-y-8">
                <div className="flex justify-between items-end border-b pb-8 border-slate-100">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase">Core Control</h3>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Live Orchestration Stream</p>
                  </div>
                  <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 text-[10px] font-black uppercase tracking-widest">Model: {engineConfig.model}</div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    {(data?.tickets || [{ id: "TK-202", title: "Global VPN Outage", status: "Resolving" }]).map(tk => (
                      <div key={tk.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between hover:border-indigo-400 transition-all cursor-pointer">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white rounded-2xl border flex items-center justify-center text-indigo-500"><MessageSquare size={20} /></div>
                          <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tk.id}</p><h5 className="font-bold text-lg text-slate-900">{tk.title}</h5></div>
                        </div>
                        <span className="px-4 py-2 bg-white border rounded-full text-[9px] font-black uppercase italic text-indigo-600">{tk.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-xl">
                    <Layers className="text-indigo-400" size={40} />
                    <div>
                      <h4 className="text-xl font-black mb-2 italic">Vector Depth</h4>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">Analyzing semantic similarity at temp {engineConfig.temperature} for highest resolution confidence.</p>
                      <div className="h-1 bg-white/10 rounded-full"><div className="h-full bg-indigo-500 w-[85%] shadow-[0_0_15px_#6366f1]" /></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 📟 THE TERMINAL FOOTER */}
      <footer className="h-16 border-t border-white/5 flex items-center justify-between px-10 bg-black/40">
        <div className="flex items-center gap-3">
          <Terminal size={14} className="text-indigo-400" />
          <p className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">
            {siteLogs[0]?.msg || "Sentinel-Alpha Standby..."}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" /><span className="text-[8px] font-black text-slate-500 uppercase">Engine Live</span></div>
          <div className="flex items-center gap-2 text-indigo-400"><Database size={12} /><span className="text-[8px] font-black text-slate-500 uppercase">RAG v2.0 Ready</span></div>
        </div>
      </footer>

      {/* ⌨️ COMMAND OVERLAY */}
      {isPrompting && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center pt-32 p-4 animate-in fade-in">
          <form onSubmit={handleAICommand} className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl p-2 flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-4">
            <Sparkles className="ml-4 text-indigo-400" size={20} />
            <input autoFocus value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} placeholder="Prompt the engine (e.g., 'Update ticket IDs to start with SNL-')" className="flex-1 bg-transparent border-none outline-none text-white text-sm py-4" />
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase">Execute</button>
            <button type="button" onClick={() => setIsPrompting(false)} className="px-4 text-slate-500 text-[10px] font-black uppercase">Close</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MVPPreview;