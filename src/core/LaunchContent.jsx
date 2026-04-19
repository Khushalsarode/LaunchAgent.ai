import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Megaphone, Twitter, Linkedin, Send, Copy, Check,
  RefreshCcw, Zap, Globe, Edit3, Save, Sparkles, Layout
} from "lucide-react";

const LaunchContent = ({ project, data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data || {});

  useEffect(() => {
    if (data) setEditData(data);
  }, [data]);

  const fetchContent = async () => {
    if (!project?.domainName) return;
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Acting as a CMO, generate a viral launch pack for: ${project.domainName} (${project.tagline}).
        Return JSON: {
          "elevatorPitch": "...",
          "twitterPosts": ["...", "...", "..."],
          "linkedinPost": "...",
          "productHunt": { "tagline": "...", "desc": "..." },
          "logoPrompt": "..."
        }
      `;

      const result = await model.generateContent(prompt);
      const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
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

  // Uniform Stack Styles
  const cardClass = "bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col h-[450px] shadow-2xl";
  const headerClass = "bg-white/5 px-8 py-5 border-b border-white/5 flex justify-between items-center flex-shrink-0";
  const contentClass = "p-8 flex-1 overflow-y-auto custom-scrollbar";

  if (loading) return (
    <div className="h-[450px] flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/5 rounded-[3rem] animate-pulse">
      <Zap className="text-orange-500 animate-bounce mb-4" size={32} />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Forging Viral Narrative...</p>
    </div>
  );

  if (!data) return (
    <div className="h-[450px] flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 text-center">
      <Megaphone className="text-white/5 mb-6" size={80} />
      <button onClick={fetchContent} className="bg-white text-black px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-white transition-all">
        Initialize Launch Pack
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">

      {/* 🟢 TOP ACTION BAR */}
      <div className="flex items-center justify-between bg-white/5 p-3 rounded-[2rem] border border-white/5">
        <div className="flex items-center gap-3 px-4">
          <Sparkles size={14} className="text-orange-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{project?.domainName} // Campaign Engine</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            {isEditing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit Campaign</>}
          </button>
          <button onClick={fetchContent} className="p-2.5 bg-white/5 text-slate-500 hover:text-white rounded-xl border border-white/5"><RefreshCcw size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* CARD 1: ELEVATOR PITCH & PH */}
        <div className={cardClass}>
          <div className={headerClass}>
            <span className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Brand Narrative</span>
            <Globe size={14} className="text-slate-600" />
          </div>
          <div className={contentClass}>
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Elevator Pitch</p>
                {isEditing ? (
                  <textarea value={editData.elevatorPitch} onChange={(e) => setEditData({ ...editData, elevatorPitch: e.target.value })} className="w-full bg-transparent text-white text-sm outline-none resize-none font-bold italic" />
                ) : (
                  <p className="text-white font-bold italic">"{editData.elevatorPitch}"</p>
                )}
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Product Hunt Tagline</p>
                {isEditing ? (
                  <input value={editData.productHunt.tagline} onChange={(e) => setEditData({ ...editData, productHunt: { ...editData.productHunt, tagline: e.target.value } })} className="w-full bg-transparent text-indigo-400 text-xs outline-none font-black uppercase" />
                ) : (
                  <p className="text-indigo-400 font-black text-xs uppercase">{editData.productHunt?.tagline}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: X (TWITTER) STRATEGY */}
        <div className={cardClass}>
          <div className={headerClass}>
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Social (X) Feed</span>
            <Twitter size={14} className="text-slate-600" />
          </div>
          <div className={contentClass + " space-y-4"}>
            {editData.twitterPosts?.map((tweet, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 relative group">
                {isEditing ? (
                  <textarea value={tweet} onChange={(e) => {
                    const newTweets = [...editData.twitterPosts];
                    newTweets[i] = e.target.value;
                    setEditData({ ...editData, twitterPosts: newTweets });
                  }} className="w-full bg-transparent text-slate-300 text-[11px] outline-none resize-none" />
                ) : (
                  <p className="text-slate-300 text-[11px] leading-relaxed">{tweet}</p>
                )}
                <button onClick={() => copyToClipboard(tweet, `t-${i}`)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white">
                  {copiedId === `t-${i}` ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3: PROFESSIONAL (LINKEDIN) */}
        <div className={cardClass}>
          <div className={headerClass}>
            <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">LinkedIn Narrative</span>
            <Linkedin size={14} className="text-slate-600" />
          </div>
          <div className={contentClass}>
            {isEditing ? (
              <textarea
                value={editData.linkedinPost}
                onChange={(e) => setEditData({ ...editData, linkedinPost: e.target.value })}
                className="w-full h-full bg-transparent text-slate-400 text-[11px] font-sans outline-none resize-none"
              />
            ) : (
              <p className="text-slate-400 text-[11px] font-sans leading-relaxed whitespace-pre-wrap">{editData.linkedinPost}</p>
            )}
          </div>
        </div>

      </div>

      <div className="text-center">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">Campaign Subsystem Ready for Launch</p>
      </div>
    </div>
  );
};

export default LaunchContent;