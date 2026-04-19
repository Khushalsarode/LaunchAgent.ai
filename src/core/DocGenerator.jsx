import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FileText,
  ShieldCheck,
  Scale,
  BookOpen,
  Download,
  Copy,
  Check,
  RefreshCcw,
  PlusCircle,
  Clock,
  Edit3,
  Eye
} from "lucide-react";

const DocGenerator = ({ project, data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [activeDocId, setActiveDocId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const docTypes = [
    { id: "readme", label: "README.md", icon: <BookOpen size={20} />, prompt: "Detailed GitHub README with installation, tech stack, and project vision." },
    { id: "privacy", label: "Privacy Policy", icon: <ShieldCheck size={20} />, prompt: "Standard GDPR and CCPA compliant Privacy Policy for a digital startup." },
    { id: "tos", label: "Terms of Service", icon: <Scale size={20} />, prompt: "Comprehensive Terms of Service agreement covering user conduct and liability." },
    { id: "security", label: "Security.md", icon: <FileText size={20} />, prompt: "Vulnerability reporting protocols and basic security commitment statement." },
  ];

  const generateDoc = async (docType) => {
    if (!project?.domainName) return;
    setLoading(true);
    setActiveDocId(docType.id);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Act as a professional legal and technical writer. 
        Generate a detailed ${docType.label} for:
        Project: ${project.domainName}
        Concept: ${project.tagline}
        Requirements: ${docType.prompt}
        Return ONLY raw Markdown content. Do not include markdown code wrappers.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      onUpdate({
        ...data,
        [docType.id]: text.trim(),
      });
    } catch (err) {
      console.error("Doc Generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  // 📝 HANDLER FOR MANUAL EDITS
  const handleTextChange = (e) => {
    onUpdate({
      ...data,
      [activeDocId]: e.target.value
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDoc = (id, content) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id.toUpperCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentContent = data?.[activeDocId];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

      {/* 🛠️ DOC TYPE SELECTION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {docTypes.map((doc) => {
          const isGenerated = !!data?.[doc.id];
          const isActive = activeDocId === doc.id;

          return (
            <button
              key={doc.id}
              onClick={() => {
                setActiveDocId(doc.id);
                if (!isGenerated) generateDoc(doc);
              }}
              disabled={loading}
              className={`p-6 rounded-[2rem] border transition-all flex flex-col items-start gap-4 relative overflow-hidden group ${isActive
                ? "bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-500/20"
                : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
            >
              <div className={`${isActive ? "text-white" : "text-indigo-400"}`}>{doc.icon}</div>
              <div className="text-left">
                <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-indigo-200" : "text-slate-500"}`}>Asset</p>
                <p className={`text-sm font-bold ${isActive ? "text-white" : "text-slate-300"}`}>{doc.label}</p>
              </div>
              {isGenerated && !isActive && <div className="absolute top-4 right-4 text-emerald-500"><Check size={14} /></div>}
            </button>
          );
        })}
      </div>

      {/* 📑 EDITOR INTERFACE */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">

        {/* Toolbar */}
        <div className="bg-slate-800/50 px-8 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${loading ? 'animate-ping bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {activeDocId ? `${activeDocId}.md` : "Select Document"}
              </span>
            </div>

            {currentContent && (
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${isEditing ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                >
                  <Edit3 size={12} className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${!isEditing ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                >
                  <Eye size={12} className="inline mr-1" /> Preview
                </button>
              </div>
            )}
          </div>

          {currentContent && !loading && (
            <div className="flex gap-2">
              <button onClick={() => copyToClipboard(currentContent)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-all">
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
              <button onClick={() => downloadDoc(activeDocId, currentContent)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-all">
                <Download size={18} />
              </button>
              <button onClick={() => generateDoc(docTypes.find(d => d.id === activeDocId))} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-all">
                <RefreshCcw size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Editor Body */}
        <div className="min-h-[500px] bg-[#0b1221] relative flex">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b1221]/80 z-10">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Writing Markdown...</p>
            </div>
          ) : currentContent ? (
            <div className="flex-1 flex">
              {/* Gutter (Visual Line Numbers) */}
              <div className="w-12 bg-slate-950/50 border-r border-slate-800/50 flex flex-col items-center py-10 text-[10px] font-mono text-slate-700 select-none">
                {Array.from({ length: 20 }).map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>

              {isEditing ? (
                <textarea
                  value={currentContent}
                  onChange={handleTextChange}
                  spellCheck="false"
                  className="flex-1 bg-transparent p-10 text-sm font-mono text-indigo-100 outline-none resize-none leading-relaxed placeholder-slate-700"
                  placeholder="Start typing your document..."
                />
              ) : (
                <div className="flex-1 p-10 text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap overflow-y-auto">
                  {currentContent}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
              <PlusCircle size={40} className="text-slate-800 mb-4" />
              <h4 className="text-slate-400 font-bold">Workspace Empty</h4>
              <p className="text-slate-600 text-xs mt-2 max-w-xs">Select an asset type above to generate your technical and legal documents.</p>
            </div>
          )}
        </div>

        {/* Status Bar */}
        {currentContent && (
          <div className="bg-slate-950 px-8 py-2 border-t border-slate-800 flex justify-between items-center">
            <div className="flex gap-4">
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">UTF-8</span>
              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Markdown</span>
            </div>
            <div className="text-[9px] font-bold text-indigo-500/50 uppercase italic">
              Draft is automatically saved to workspace
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocGenerator;