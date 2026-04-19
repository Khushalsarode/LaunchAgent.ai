import React from "react";
import {
  Rocket, Brain, Globe, FileText, BarChart3,
  ChevronRight, ArrowRight, ShieldCheck, Zap
} from "lucide-react";

const Home = () => {
  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen font-sans selection:bg-indigo-500/30">
      {/* 🔴 HERO SECTION */}
      <section className="relative pt-40 pb-28 px-6 text-center overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>

        <div className="relative max-w-5xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            v1.0 Now Live
          </div>

          <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter text-white">
            SHIP YOUR IDEA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-600">
              INTO REALITY.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            The first autonomous AI agent that generates your brand,
            hashes your IP to Solana, and deploys to DigitalOcean.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <button className="group bg-indigo-600 hover:bg-indigo-500 transition-all px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-2xl shadow-indigo-600/20">
              Generate My Launch Plan <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-white/10 bg-white/5 hover:bg-white/10 transition-all px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* 🟡 PROBLEM SECTION (Bento Grid Style) */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
              Why Great Ideas <span className="text-slate-600">Die.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0a0f1e]/40 border border-white/5 rounded-[2rem] p-8 hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6"><Zap size={24} /></div>
              <h3 className="text-xl font-bold mb-2 uppercase">Naming Friction</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Finding unique domains and MEME-worthy names shouldn't take weeks.</p>
            </div>
            <div className="bg-[#0a0f1e]/40 border border-white/5 rounded-[2rem] p-8 hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6"><ShieldCheck size={24} /></div>
              <h3 className="text-xl font-bold mb-2 uppercase">IP Protection</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Most founders fear sharing ideas. We hash your prompt on-chain instantly.</p>
            </div>
            <div className="bg-[#0a0f1e]/40 border border-white/5 rounded-[2rem] p-8 hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6"><FileText size={24} /></div>
              <h3 className="text-xl font-bold mb-2 uppercase">The Doc Block</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Writing READMEs and legal drafts is a momentum killer. Our agent does it for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔵 SOLUTION PREVIEW */}
      <section className="py-24 px-6 bg-[#030712] relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase italic">
              The Agentic <br /><span className="text-indigo-500">Workspace.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              A single workspace where Gemini 2.5 handles the strategy and Solana handles the verification.
            </p>
            <div className="space-y-4">
              {["Smart Intent Positioning", "Blockchain IP Hashing", "Launch Content Packs", "One-Click DO Deployment"].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-300">
                  <ChevronRight size={16} className="text-indigo-500" /> {item}
                </div>
              ))}
            </div>
          </div>

          {/* LAUNCH SCORE PREVIEW CARD */}
          <div className="bg-gradient-to-br from-[#0a0f1e] to-black border border-white/10 rounded-[3rem] p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-black uppercase tracking-widest text-xs text-slate-500">Project Score</h3>
              <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-500 font-black tracking-widest uppercase">Launch Ready</div>
            </div>
            <div className="flex flex-col items-center space-y-10">
              <div className="w-48 h-48 rounded-full border-[12px] border-indigo-500/20 border-t-indigo-500 flex items-center justify-center text-5xl font-black italic">
                84%
              </div>
              <div className="w-full space-y-6">
                <Progress label="Brand Clarity" value={90} color="bg-indigo-500" />
                <Progress label="Solana Verification" value={100} color="bg-cyan-400" />
                <Progress label="Market Positioning" value={80} color="bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🟣 FINAL CTA */}
      <footer className="py-32 px-6 text-center border-t border-white/5 bg-black">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase">
            Stop Thinking. <br /> <span className="text-indigo-500">Start Shipping.</span>
          </h2>
          <button className="bg-white text-black hover:bg-indigo-500 hover:text-white transition-all px-12 py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-white/5">
            Initialize Launch Sequence
          </button>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em] pt-12">
            Engineered for the CDAC 2026 Batch
          </p>
        </div>
      </footer>
    </div>
  );
};

const Progress = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
      <div
        className={`${color} h-full transition-all duration-1000`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export default Home;