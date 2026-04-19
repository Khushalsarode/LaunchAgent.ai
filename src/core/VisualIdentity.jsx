import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Palette, Type, Sparkles, Copy, RefreshCcw, Check,
  LayoutTemplate, Edit3, Save, Fingerprint, Eye,
  Terminal, Globe, Layers
} from "lucide-react";

const VisualIdentity = ({ project, data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data || {});

  useEffect(() => {
    if (data) setEditData(data);
  }, [data]);

  const generateVisualIdentity = async (styleMode = "Modern Minimalist") => {
    if (!project?.domainName) return;
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Generate a comprehensive tech visual identity for: ${project.domainName}. 
      Tagline: ${project.tagline}. 
      Style Mode: ${styleMode}.
      Return ONLY a JSON object: 
      { 
        "colors": ["#primary", "#secondary", "#accent"], 
        "fonts": ["Heading Font (e.g. Inter)", "Body Font (e.g. JetBrains Mono)"], 
        "logoPrompt": "Midjourney prompt for a minimalist vector logo...", 
        "style": ["${styleMode}", "Bento Grid", "High Contrast"] 
      }`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        onUpdate(parsedData);
        setEditData(parsedData);
      }
    } catch (err) { console.error("Visual Identity Error:", err); } finally { setLoading(false); }
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // UI Components Shared Classes
  const cardClass = "bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col h-[520px] shadow-2xl transition-all hover:border-white/20 relative group";
  const headerClass = "bg-white/5 px-8 py-5 border-b border-white/5 flex justify-between items-center flex-shrink-0";
  const contentClass = "p-8 flex-1 overflow-y-auto custom-scrollbar";

  if (loading) return (
    <div className="h-[520px] flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/5 rounded-[3rem]">
      <div className="relative">
        <Fingerprint className="text-cyan-500 animate-pulse mb-4" size={48} />
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">Compiling Brand DNA...</p>
    </div>
  );

  if (!data) return (
    <div className="h-[520px] flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
        <Palette size={400} />
      </div>
      <div className="relative z-10 space-y-8">
        <div className="w-20 h-20 bg-cyan-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-cyan-500/20 shadow-inner">
          <Sparkles className="text-cyan-400" size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white italic tracking-tighter mb-2">Visual Identity Engine</h3>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">Generate a consistent design system for {project?.domainName} tailored for the 2026 tech stack.</p>
        </div>
        <button onClick={() => generateVisualIdentity()} className="bg-white text-black px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-cyan-500 hover:text-white transition-all shadow-xl shadow-cyan-500/10">
          Synthesize Brand
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">

      {/* 🟢 TOP CONTROL STRIP */}
      <div className="flex flex-wrap items-center justify-between bg-white/5 p-3 rounded-[2rem] border border-white/5 gap-4">
        <div className="flex items-center gap-4 px-4">
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Brand OS v1.0</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex gap-4">
            {["Minimalist", "Cyberpunk", "Corporate"].map(mode => (
              <button key={mode} onClick={() => generateVisualIdentity(mode)} className="text-[9px] font-bold text-slate-500 hover:text-cyan-400 uppercase tracking-tighter transition-colors">
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-cyan-600 text-white' : 'bg-white text-black hover:bg-slate-200'}`}
          >
            {isEditing ? <><Save size={14} /> Lock Design</> : <><Edit3 size={14} /> Refine</>}
          </button>
          <button onClick={() => generateVisualIdentity()} className="p-2.5 bg-white/5 text-slate-500 hover:text-white rounded-xl border border-white/5">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* CARD 1: COLOR SYSTEMS */}
        <div className={cardClass}>
          <div className={headerClass}>
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-cyan-400" />
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Color Tokens</span>
            </div>
            <LayoutTemplate size={14} className="text-slate-700" />
          </div>
          <div className={contentClass}>
            <div className="space-y-4">
              {editData.colors?.map((color, i) => (
                <div key={i} className="flex items-center gap-4 bg-[#111] p-4 rounded-[1.5rem] border border-white/5 group/color">
                  <div className="w-14 h-14 rounded-xl shadow-2xl flex-shrink-0 transition-transform group-hover/color:scale-105" style={{ backgroundColor: color }} />
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{i === 0 ? 'Primary' : i === 1 ? 'Secondary' : 'Accent'}</p>
                    {isEditing ? (
                      <input
                        value={color}
                        onChange={(e) => {
                          const newColors = [...editData.colors];
                          newColors[i] = e.target.value;
                          setEditData({ ...editData, colors: newColors });
                        }}
                        className="bg-transparent text-white font-mono text-sm uppercase outline-none border-b border-cyan-500/30 w-full"
                      />
                    ) : (
                      <p className="text-white font-mono text-sm uppercase tracking-widest">{color}</p>
                    )}
                  </div>
                  <button onClick={() => copyToClipboard(color, `c-${i}`)} className="text-slate-600 hover:text-white">
                    {copiedId === `c-${i}` ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2: TYPOGRAPHY & PREVIEW */}
        <div className={cardClass}>
          <div className={headerClass}>
            <div className="flex items-center gap-2">
              <Type size={14} className="text-emerald-400" />
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Typography</span>
            </div>
            <Eye size={14} className="text-slate-700" />
          </div>
          <div className={contentClass}>
            <div className="space-y-8 h-full flex flex-col">
              <div className="p-6 bg-[#111] rounded-[2rem] border border-white/5">
                {isEditing ? (
                  <div className="space-y-4">
                    <input value={editData.fonts[0]} onChange={(e) => setEditData({ ...editData, fonts: [e.target.value, editData.fonts[1]] })} className="w-full bg-transparent text-white font-bold text-xl outline-none border-b border-white/10" />
                    <input value={editData.fonts[1]} onChange={(e) => setEditData({ ...editData, fonts: [editData.fonts[0], e.target.value] })} className="w-full bg-transparent text-slate-500 text-sm outline-none" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-3xl text-white font-black tracking-tighter leading-none">{editData.fonts[0]}</p>
                    <p className="text-slate-500 text-xs font-mono">{editData.fonts[1]}</p>
                  </div>
                )}
              </div>

              {/* LIVE PREVIEW COMPONENT */}
              <div className="mt-auto p-6 rounded-[2rem] border border-white/5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${editData.colors[0]}15, transparent)` }}>
                <p className="text-[9px] font-black text-slate-500 uppercase mb-6 tracking-[0.2em]">Component UI Preview</p>
                <div className="space-y-4">
                  <div className="h-10 w-full rounded-xl flex items-center px-4 text-[10px] font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: editData.colors[0], color: '#000' }}>
                    Execute Command
                  </div>
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 border" style={{ borderColor: `${editData.colors[2]}44` }}>
                      <Terminal size={14} style={{ color: editData.colors[2] }} />
                    </div>
                    <div className="flex-1 h-8 bg-white/5 rounded-lg border border-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: LOGO & BRAND STYLE */}
        <div className={cardClass}>
          <div className={headerClass}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Logo Forge</span>
            </div>
            <Globe size={14} className="text-slate-700" />
          </div>
          <div className={contentClass}>
            <div className="h-full flex flex-col">
              <div className="flex-1 bg-[#111] p-6 rounded-[2rem] border border-white/5 relative">
                <p className="text-[9px] font-black text-indigo-500 uppercase mb-4 tracking-widest font-mono">AI Generator Prompt</p>
                {isEditing ? (
                  <textarea
                    value={editData.logoPrompt}
                    onChange={(e) => setEditData({ ...editData, logoPrompt: e.target.value })}
                    className="w-full h-32 bg-transparent text-slate-400 text-[11px] leading-relaxed italic outline-none resize-none custom-scrollbar"
                  />
                ) : (
                  <p className="text-slate-400 text-[11px] leading-loose italic">
                    "{editData.logoPrompt}"
                  </p>
                )}
                <button
                  onClick={() => copyToClipboard(editData.logoPrompt, 'logo')}
                  className="absolute bottom-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-500 transition-all border border-white/5"
                >
                  {copiedId === 'logo' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {editData.style?.map((s, i) => (
                  <div key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-8 border-t border-white/5 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Design Subsystem Matrix // 2026 Batch</p>
        <div className="flex gap-4">
          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
        </div>
      </div>
    </div>
  );
};

export default VisualIdentity;