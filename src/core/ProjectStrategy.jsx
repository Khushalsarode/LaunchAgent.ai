import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  BarChart3,
  Target,
  TrendingUp,
  ShieldAlert,
  Zap,
  RefreshCcw,
  Layers
} from "lucide-react";

const ProjectStrategy = ({ project, data, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const generateStrategy = async () => {
    if (!project || !project.domainName) return;
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Act as a world-class Venture Capitalist and Startup Strategist.
        Analyze:
        - Domain: ${project.domainName}
        - Mission: ${project.tagline}
        - Context: ${project.metaDesc}

        Return ONLY valid JSON:
        {
          "scores": {
            "memorability": number,
            "brandability": number,
            "pronunciation": number,
            "seo": number,
            "risk": number,
            "tone": number
          },
          "details": {
            "marketPosition": "string",
            "targetAudience": ["string"],
            "coreValues": ["string"],
            "competitiveEdge": "string",
            "revenueModel": "string",
            "nextSteps": ["string"]
          }
        }
      `;

      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
      const parsedData = JSON.parse(jsonStr);

      // Save to Workspace Store
      onUpdate(parsedData);

    } catch (err) {
      console.error("Strategy Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- UI: LOADING STATE ---
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="md:col-span-3 h-32 bg-slate-900 border border-slate-800 rounded-3xl" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-900 border border-slate-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  // --- UI: INITIAL TRIGGER (SaaS Style) ---
  if (!data) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-16 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <TrendingUp size={120} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/30">
            <BarChart3 className="text-indigo-400" size={36} />
          </div>
          <h3 className="text-3xl font-black text-white italic">Strategic Intel</h3>
          <p className="text-slate-400 max-w-sm mx-auto">
            Analyze market positioning, SEO viability, and revenue models for <span className="text-white">{project.domainName}</span>.
          </p>
          <button
            onClick={generateStrategy}
            className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95 shadow-2xl shadow-white/5"
          >
            Run VC Analysis
          </button>
        </div>
      </div>
    );
  }

  // --- UI: MAIN CONTENT (Stored Data) ---
  const { scores, details } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

      {/* HEADER WITH REFRESH */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg"><Target className="text-indigo-400" size={20} /></div>
          <h3 className="text-xl font-bold text-white tracking-tight">Venture Intelligence</h3>
        </div>
        <button onClick={generateStrategy} className="text-slate-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
          <RefreshCcw size={14} /> Re-Analyze
        </button>
      </div>

      {/* 📊 SCORES GRID */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <ScoreCard label="Memorability" score={scores?.memorability} icon="🧠" color="text-indigo-400" />
        <ScoreCard label="Brandability" score={scores?.brandability} icon="💎" color="text-purple-400" />
        <ScoreCard label="Phonetics" score={scores?.pronunciation} icon="🗣️" color="text-blue-400" />
        <ScoreCard label="SEO Path" score={scores?.seo} icon="📈" color="text-emerald-400" />
        <ScoreCard label="Market Risk" score={scores?.risk} icon="⚠️" color="text-amber-400" />
        <ScoreCard label="Tone Match" score={scores?.tone} icon="🎭" color="text-pink-400" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* MAIN ANALYSIS */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] border-l-4 border-l-indigo-600 shadow-xl">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Market Positioning</span>
            <p className="text-2xl text-white font-bold mt-4 leading-snug italic">
              "{details?.marketPosition}"
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
            <div className="flex items-center gap-2 mb-6">
              <Layers size={18} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Operational Next Steps</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {details?.nextSteps?.map((step, i) => (
                <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-300 text-sm flex gap-4 items-start">
                  <span className="text-indigo-500 font-black">0{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECONDARY INTEL */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Zap size={16} className="text-amber-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Model</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {details?.revenueModel}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <ShieldAlert size={16} className="text-purple-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Audience</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {details?.targetAudience?.map((t, i) => (
                <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreCard = ({ label, score, icon, color }) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center space-y-2 hover:border-slate-700 transition-colors">
    <span className="text-xl">{icon}</span>
    <span className={`text-lg font-black ${color}`}>{score ?? 0}%</span>
    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{label}</p>
  </div>
);

export default ProjectStrategy;