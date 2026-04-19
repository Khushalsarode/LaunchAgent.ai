import React from "react";
import {
  Cpu, Target, Zap, Shield, Users,
  Rocket, Sparkles, ChevronRight, Fingerprint,
  Layers
} from "lucide-react";

const About = () => {
  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen font-sans selection:bg-indigo-500/30">

      {/* --- 🟢 VISION HEADER --- */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>

        <div className="relative max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4">
            Our Philosophy
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] text-white uppercase italic">
            IDEAS ARE CHEAP. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">EXECUTION IS EVERYTHING.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            LaunchAgent.ai was engineered to eliminate the "Zero-to-One" friction.
            We provide the architectural backbone so founders can focus on solving
            real problems, not formatting README files.
          </p>
        </div>
      </section>

      {/* --- 🟡 THE TECH STACK ( HIGHLIGHT) --- */}
      <section className="py-20 px-6 border-y border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700">
            <TechBrand icon={<Fingerprint size={20} />} name="SOLANA" desc="On-chain IP Hashing" />
            <TechBrand icon={<Cpu size={20} />} name="EVELEN LAB" desc="Voice AI" />
            <TechBrand icon={<Cpu size={20} />} name="GEMINI 2.5" desc="Neural Logic" />
            <TechBrand icon={<Rocket size={20} />} name="DIGITALOCEAN" desc="Edge Hosting" />
          </div>
        </div>
      </section>

      {/* --- 🔴 MISSION & AGENTIC LOGIC --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
              <Target className="text-indigo-500" size={40} /> THE MISSION
            </h2>
            <p className="text-slate-400 leading-relaxed text-xl font-medium">
              We believe the next unicorn will be built by a solo founder with an AI agent.
              Our mission is to be that agent—handling the branding, positioning, and
              infrastructure code required to launch at global scale.
            </p>

            <div className="grid gap-8">
              <MissionItem
                icon={<Cpu size={24} />}
                title="NEURAL POSITIONING"
                desc="Leveraging Gemini 2.5 to find market gaps and unique brand voices."
              />
              <MissionItem
                icon={<Shield size={24} />}
                title="IMMUTABLE ORIGIN"
                desc="Timestumping your brand DNA on the Solana ledger for instant IP protection."
              />
            </div>
          </div>

          {/* THE "AI EDGE" GLASS CARD */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-[#0a0a0a] border border-white/10 p-12 rounded-[3rem] overflow-hidden">
              <div className="absolute -right-10 -top-10 text-white/5 rotate-12">
                <Sparkles size={280} />
              </div>
              <div className="relative z-10">
                <div className="p-4 bg-indigo-500/10 rounded-2xl w-fit mb-8 text-indigo-400">
                  <Zap size={32} />
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic mb-6 tracking-tighter">The Agentic Edge</h3>
                <p className="text-slate-400 italic font-mono text-sm leading-[1.8]">
                  "Traditional templates are static. LaunchAgent.ai is dynamic.
                  It doesn't just fill blanks; it synthesizes visual psychology,
                  technical architecture, and market trends into a launchable asset."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 🔵 THE THREE PILLARS --- */}
      <section className="py-24 px-6 bg-[#010206]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <PillarCard
            icon={<Shield className="text-indigo-400" />}
            title="VERIFIED"
            desc="Blockchain-backed uniqueness and legal-grade documentation templates."
          />
          <PillarCard
            icon={<Users className="text-cyan-400" />}
            title="FOUNDER-CENTRIC"
            desc="Optimized for speed. No bloat. Just the assets you need to ship today."
          />
          <PillarCard
            icon={<Rocket className="text-indigo-600" />}
            title="PRODUCTION-READY"
            desc="Automated deployment configurations for DigitalOcean and Docker."
          />
        </div>
      </section>

      {/* --- 🟣 FINAL CALL TO ACTION --- */}
      <section className="py-32 px-6 text-center border-t border-white/5 bg-black">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none">
            STOP TALKING. <br /> START <span className="text-indigo-500 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">SHIPPING.</span>
          </h2>
          <button className="group bg-white text-black hover:bg-indigo-600 hover:text-white transition-all px-12 py-6 rounded-2xl font-black uppercase text-sm tracking-[0.3em] flex items-center gap-4 mx-auto shadow-2xl shadow-white/5 active:scale-95">
            INITIALIZE YOUR STARTUP <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.5em] pt-12">
            PRECISION ENGINEERED BY CDAC PG-DAC 2026 BATCH
          </p>
        </div>
      </section>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const TechBrand = ({ icon, name, desc }) => (
  <div className="text-center md:text-left">
    <div className="flex items-center gap-2 text-white font-black tracking-tighter mb-1">
      {icon} {name}
    </div>
    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{desc}</div>
  </div>
);

const MissionItem = ({ icon, title, desc }) => (
  <div className="flex gap-6 items-start group">
    <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <div>
      <h4 className="font-black text-white text-lg uppercase tracking-tight mb-1 italic">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

const PillarCard = ({ icon, title, desc }) => (
  <div className="p-12 bg-[#080a10] border border-white/5 rounded-[3rem] space-y-8 hover:border-indigo-500/40 transition-all group relative overflow-hidden">
    <div className="w-16 h-16 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10">
      {icon}
    </div>
    <div className="relative z-10">
      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{title}</h3>
      <p className="text-slate-500 text-sm leading-[1.8] font-medium">{desc}</p>
    </div>
    <div className="absolute -bottom-10 -right-10 text-white/[0.02] group-hover:text-indigo-500/[0.05] transition-colors">
      {icon}
    </div>
  </div>
);

export default About;