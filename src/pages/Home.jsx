import React from "react";
import {
  Rocket,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Globe,
  Layers,
  ChevronRight,
  Github
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#02040a] text-white selection:bg-indigo-500/30 selection:text-white font-sans">

      {/* 1. ULTRA-MINIMAL NAV */}
      <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-[#02040a]/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Rocket size={20} className="text-black fill-black" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              LaunchAgent<span className="text-indigo-500">.ai</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Infrastructure</a>
            <a href="#solana" className="hover:text-white transition-colors">Solana Node</a>
            <a href="#docs" className="hover:text-white transition-colors">API Docs</a>
          </div>

          <button className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95">
            Get Started
          </button>
        </div>
      </nav>

      {/* 2. HERO: THE "FORGE" AREA */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-10">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">
              Agentic Launch Protocol v2.0 Ready
            </span>
          </div>

          <h1 className="text-6xl md:text-[110px] font-black leading-[0.85] tracking-[ -0.05em] mb-10">
            SHIP YOUR IDEA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              BEFORE IT COOLS.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            The first autonomous agent that bridges **Solana** hashing with **DigitalOcean** scale.
            Generate brand, code, and infrastructure in 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="group w-full sm:w-auto bg-indigo-600 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30">
              Initialize Agent <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto border border-white/10 bg-white/5 backdrop-blur-md px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all">
              Join Discord
            </button>
          </div>

          {/* Social Proof / Tech Stack Bar */}
          <div className="mt-24 pt-10 border-t border-white/5 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale contrast-125">
            <span className="font-black text-xl tracking-tighter flex items-center gap-2"><Globe size={20} /> DIGITALOCEAN</span>
            <span className="font-black text-xl tracking-tighter flex items-center gap-2"><Layers size={20} /> SNOWFLAKE</span>
            <span className="font-black text-xl tracking-tighter flex items-center gap-2 font-mono">SOLANA</span>
            <span className="font-black text-xl tracking-tighter flex items-center gap-2"><Cpu size={20} /> GEMINI AI</span>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID FEATURES */}
      <section className="py-32 px-6 bg-[#010206]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Main Feature: Solana */}
            <div className="md:col-span-7 group relative bg-[#080a10] border border-white/5 rounded-[3rem] p-12 overflow-hidden hover:border-indigo-500/40 transition-all">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-4 italic">Immutable Branding</h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                  We hash your logo and brand DNA directly to the Solana Devnet.
                  Ownership is instant, verifiable, and permanent.
                </p>
                <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:gap-4 transition-all">
                  Explorer Contract <ChevronRight size={14} />
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-20 transition-all duration-700">
                <Github size={320} />
              </div>
            </div>

            {/* Feature 2: Speed */}
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-900/20 to-transparent border border-white/5 rounded-[3rem] p-12 hover:border-cyan-500/40 transition-all">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-8">
                <Zap size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-4 italic">7-Day Launchpad</h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Go from a prompt to a live DigitalOcean droplet with auto-SSL and monitoring.
              </p>
            </div>

            {/* Feature 3: Data */}
            <div className="md:col-span-5 bg-[#080a10] border border-white/5 rounded-[3rem] p-12 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-8">
                <Layers size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-4 italic">Snowflake Analytics</h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Enterprise-grade data warehousing for every startup launched.
              </p>
            </div>

            {/* Feature 4: Neural Engine */}
            <div className="md:col-span-7 bg-gradient-to-tr from-[#0a0f20] to-black border border-white/5 rounded-[3rem] p-12 hover:border-indigo-500/40 transition-all overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8">
                  <Cpu size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-4 italic">Gemini 2.5 Flash Core</h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                  Sub-second intent recognition and high-fidelity asset generation.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#010206]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
              <Rocket size={16} className="text-white/40" />
            </div>
            <span className="font-black tracking-tighter uppercase text-white/40">LaunchAgent.ai</span>
          </div>

          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] text-center">
            Precision Built for CDAC 2026 Batch
          </p>

          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-white transition-colors">X / Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}