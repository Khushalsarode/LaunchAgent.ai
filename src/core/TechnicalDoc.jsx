import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FileCode, Terminal, Download, RefreshCcw,
  Copy, Check, Cpu, FolderTree, Edit3,
  Save, Code2, BookOpen, Users2, Box
} from "lucide-react";

const TechnicalDocs = ({ project, data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data || {});

  useEffect(() => {
    if (data) setEditData(data);
  }, [data]);

  const fetchDocs = async () => {
    if (!project?.domainName) return;
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Generate technical documentation for the project: ${project.domainName}. 
      Tagline: ${project.tagline}. 
      Return ONLY a JSON object: { "readme": "...", "contributing": "...", "architecture": "..." }`;

      const result = await model.generateContent(prompt);
      const match = result.response.text().match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        onUpdate(parsed);
        setEditData(parsed);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text || "");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Shared card style for uniform width/height
  const cardClass = "bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col h-[500px] shadow-2xl";
  const headerClass = "bg-white/5 px-8 py-5 border-b border-white/5 flex justify-between items-center flex-shrink-0";
  const contentClass = "p-8 flex-1 overflow-y-auto custom-scrollbar";
  const textInputClass = "w-full h-full bg-transparent text-xs font-mono outline-none resize-none leading-relaxed";

  if (loading) return (
    <div className="h-[500px] flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/5 rounded-[3rem] animate-pulse">
      <RefreshCcw className="animate-spin text-indigo-500 mb-4" size={32} />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Generating Repository Assets...</p>
    </div>
  );

  if (!data) return (
    <div className="h-[500px] flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 text-center">
      <Box className="text-white/10 mb-6" size={64} />
      <h3 className="text-xl font-bold text-white mb-2 italic">Documentation Workspace</h3>
      <p className="text-slate-500 text-xs mb-8 max-w-xs">Initialize the technical stack documentation for {project?.domainName || 'your project'}.</p>
      <button onClick={fetchDocs} className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
        Build Repository Docs
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">

      {/* 🛠️ CONTROL BAR */}
      <div className="flex items-center justify-between bg-white/5 p-3 rounded-[2rem] border border-white/5">
        <div className="flex items-center gap-3 px-4">
          <Terminal size={14} className="text-indigo-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{project?.domainName} // DX Suite</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
          >
            {isEditing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit All</>}
          </button>
          <button onClick={fetchDocs} className="p-2.5 bg-white/5 text-slate-500 hover:text-white rounded-xl border border-white/5">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* 🥞 STACKED GRID (All same size) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* CARD 1: README */}
        <div className={cardClass}>
          <div className={headerClass}>
            <div className="flex items-center gap-3">
              <BookOpen size={16} className="text-emerald-400" />
              <span className="text-slate-400 text-[10px] font-black uppercase font-mono tracking-widest">README.md</span>
            </div>
            <button onClick={() => copyToClipboard(editData.readme, 'readme')} className="text-slate-500 hover:text-white">
              {copiedId === 'readme' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className={contentClass}>
            {isEditing ? (
              <textarea
                value={editData.readme}
                onChange={(e) => setEditData({ ...editData, readme: e.target.value })}
                className={`${textInputClass} text-emerald-500/80`}
              />
            ) : (
              <div className="text-slate-300 text-[11px] font-mono leading-relaxed whitespace-pre-wrap">
                {editData.readme}
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: ARCHITECTURE */}
        <div className={cardClass}>
          <div className={headerClass}>
            <div className="flex items-center gap-3">
              <FolderTree size={16} className="text-indigo-400" />
              <span className="text-slate-400 text-[10px] font-black uppercase font-mono tracking-widest">Architecture</span>
            </div>
            <button onClick={() => copyToClipboard(editData.architecture, 'arch')} className="text-slate-500 hover:text-white">
              {copiedId === 'arch' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className={contentClass}>
            {isEditing ? (
              <textarea
                value={editData.architecture}
                onChange={(e) => setEditData({ ...editData, architecture: e.target.value })}
                className={`${textInputClass} text-indigo-400/80`}
              />
            ) : (
              <pre className="text-indigo-400/80 text-[11px] font-mono leading-relaxed h-full">
                {editData.architecture}
              </pre>
            )}
          </div>
        </div>

        {/* CARD 3: CONTRIBUTING */}
        <div className={cardClass}>
          <div className={headerClass}>
            <div className="flex items-center gap-3">
              <Users2 size={16} className="text-slate-400" />
              <span className="text-slate-400 text-[10px] font-black uppercase font-mono tracking-widest">Contributing</span>
            </div>
            <button onClick={() => copyToClipboard(editData.contributing, 'contrib')} className="text-slate-500 hover:text-white">
              {copiedId === 'contrib' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className={contentClass}>
            {isEditing ? (
              <textarea
                value={editData.contributing}
                onChange={(e) => setEditData({ ...editData, contributing: e.target.value })}
                className={`${textInputClass} text-slate-500`}
              />
            ) : (
              <div className="text-slate-500 text-[11px] font-mono leading-relaxed whitespace-pre-wrap">
                {editData.contributing}
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="pt-6 border-t border-white/5 text-center">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Repository Manifest Synchronized // {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default TechnicalDocs;