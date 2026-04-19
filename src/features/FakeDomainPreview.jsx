import React, { useEffect, useState, useMemo } from "react";
import {
  Monitor, Smartphone, X, Zap, Shield,
  Smartphone as MobileIcon, ArrowRight, Lock,
  Check, ChevronRight, Code, Globe
} from "lucide-react";

function FakeDomainPreview({ domainData, onClose }) {
  if (!domainData) return null;

  const { name, tagline, metaDesc } = domainData;
  const [device, setDevice] = useState("desktop"); // desktop | mobile
  const [activeTab, setActiveTab] = useState("home"); // home | features | pricing

  // DYNAMIC THEMING: Generates a unique brand hue based on the name
  const brandColor = useMemo(() => {
    const hues = [220, 250, 280, 310, 190, 160]; // Indigo, Violet, Purple, Pink, Cyan, Emerald
    const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hues[charCodeSum % hues.length];
  }, [name]);

  const cleanDomain = name
    ?.toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9.-]/g, "");

  const fakeURL = `https://www.${cleanDomain || "vision"}.ai`;
  const logoText = cleanDomain?.split(".")[0] || "brand";

  // Handle ESC and Body Scroll
  useEffect(() => {
    const handleEsc = (e) => { e.key === "Escape" && onClose(); };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-2xl cursor-zoom-out" onClick={onClose} />

      <div
        className="relative w-full max-w-7xl h-full md:h-[95vh] bg-[#0a0a0a] md:rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
        style={{ '--brand-hue': brandColor }}
      >
        {/* 1. SAAS BROWSER CHROME */}
        <div className="flex items-center justify-between bg-[#111] px-6 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-white/10 rounded-full" />
              <div className="w-3 h-3 bg-white/10 rounded-full" />
              <div className="w-3 h-3 bg-white/10 rounded-full" />
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-black/40 border border-white/5 rounded-full w-[350px]">
              <Lock size={12} className="text-emerald-500" />
              <span className="text-[11px] text-slate-500 font-medium truncate">{fakeURL}</span>
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            <button onClick={() => setDevice("desktop")} className={`p-2 rounded-lg transition-all ${device === "desktop" ? "bg-white text-black" : "text-slate-500 hover:text-white"}`}>
              <Monitor size={16} />
            </button>
            <button onClick={() => setDevice("mobile")} className={`p-2 rounded-lg transition-all ${device === "mobile" ? "bg-white text-black" : "text-slate-500 hover:text-white"}`}>
              <Smartphone size={16} />
            </button>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* 2. PREVIEW CANVAS */}
        <div className="flex-1 overflow-y-auto bg-[#050505] custom-scrollbar">
          <div className={`mx-auto transition-all duration-700 ease-in-out ${device === "mobile" ? "max-w-[375px] my-10 rounded-[3rem] border-[8px] border-[#1a1a1a] shadow-2xl overflow-hidden" : "max-w-full"}`}>

            {/* IN-SITE NAVIGATION */}
            <nav className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-10">
              <span className="text-xl font-black italic tracking-tighter uppercase cursor-pointer" style={{ color: `hsl(var(--brand-hue), 80%, 70%)` }} onClick={() => setActiveTab("home")}>
                {logoText}
              </span>
              <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
                {["home", "features", "pricing"].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`transition-colors ${activeTab === tab ? "text-white underline decoration-2 underline-offset-8" : "text-slate-500 hover:text-white"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <button className="hidden md:block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white hover:text-black transition-all">
                Access Node
              </button>
            </nav>

            {/* DYNAMIC CONTENT AREA */}
            <main className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              {activeTab === "home" && <HomeView domainData={domainData} device={device} hue={brandColor} />}
              {activeTab === "features" && <FeaturesView hue={brandColor} />}
              {activeTab === "pricing" && <PricingView hue={brandColor} />}
            </main>

            {/* FOOTER */}
            <footer className="py-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 text-center border-t border-white/5 bg-[#080808]">
              © {new Date().getFullYear()} {logoText} Labs. // Build for the next.
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- SUB-VIEWS --- */

function HomeView({ domainData, device, hue }) {
  return (
    <>
      <section className="relative px-6 py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">
            System Status: Active
          </span>
          <h2 className={`font-black text-white tracking-tighter leading-[0.9] ${device === "mobile" ? "text-4xl" : "text-7xl"}`}>
            {domainData.tagline || "The Future of Digital Identity."}
          </h2>
          <p className={`text-slate-400 mx-auto font-medium leading-relaxed ${device === "mobile" ? "text-sm" : "text-xl max-w-xl"}`}>
            {domainData.metaDesc || "Scale your vision with the world's most advanced autonomous routing engine."}
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4">
            <button className="w-full md:w-auto px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-xl" style={{ backgroundColor: `hsl(${hue}, 80%, 70%)` }}>
              Initialize Launch
            </button>
            <button className="w-full md:w-auto px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Documentation
            </button>
          </div>
        </div>
      </section>

      <section className={`px-8 py-20 bg-[#080808] border-y border-white/5 ${device === "mobile" ? "flex flex-col gap-6" : "grid md:grid-cols-3 gap-10"}`}>
        <ModernFeature Icon={Zap} title="Sub-ms Latency" desc="Optimized for real-time RAG and agentic execution." hue={hue} />
        <ModernFeature Icon={Shield} title="Zero-Trust" desc="Enterprise encryption baked into the core protocol." hue={hue} />
        <ModernFeature Icon={Globe} title="Global Mesh" desc="Deploy across 40+ edge regions instantly." hue={hue} />
      </section>
    </>
  );
}

function FeaturesView({ hue }) {
  const features = [
    { title: "Autonomous Reasoning", body: "Agentic layers that determine the best path for every resolution ticket." },
    { title: "Contextual RAG", body: "Seamlessly integrate your knowledge base for hyper-accurate responses." },
    { title: "Smart Telemetry", body: "Live performance metrics with built-in F1 score and intent tracking." }
  ];

  return (
    <section className="px-8 py-20 max-w-5xl mx-auto space-y-24">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-white tracking-tighter">Core Architecture.</h2>
        <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Built for mission-critical operations</p>
      </div>
      <div className="space-y-20">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2 aspect-video bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: `radial-gradient(circle, hsl(${hue}, 80%, 70%) 0%, transparent 70%)` }} />
              <Code size={48} className="text-white/10" />
              <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white/20 animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="text-3xl font-bold text-white tracking-tight">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">{f.body}</p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                View Protocol <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingView({ hue }) {
  const tiers = [
    { name: "Dev", price: "$0", features: ["1,000 requests", "Community RAG", "24h latency"], pro: false },
    { name: "Scale", price: "$149", features: ["Unlimited requests", "Custom Agent Layers", "Sub-ms support"], pro: true }
  ];

  return (
    <section className="px-8 py-24 text-center">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-white tracking-tighter">Choose your tier.</h2>
          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">No hidden credits. Just raw power.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {tiers.map((t, i) => (
            <div key={i} className={`p-10 rounded-[2.5rem] text-left space-y-8 transition-all border ${t.pro ? 'bg-white/[0.04] border-white/20 shadow-2xl scale-105' : 'bg-white/[0.02] border-white/5'}`}>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t.name}</span>
                {t.pro && <span className="px-3 py-1 rounded-md text-[9px] font-black uppercase bg-white text-black">Active Growth</span>}
              </div>
              <div className="text-5xl font-black text-white">{t.price}<span className="text-lg text-slate-600 font-medium">/mo</span></div>
              <ul className="space-y-4">
                {t.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-xs text-slate-400">
                    <Check size={14} className="text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${t.pro ? 'text-black' : 'bg-white/5 text-white border border-white/10'}`}
                style={t.pro ? { backgroundColor: `hsl(${hue}, 80%, 70%)` } : {}}>
                {t.pro ? 'Initialize Scale' : 'Start Building'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModernFeature({ Icon, title, desc, hue }) {
  return (
    <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6"
        style={{ backgroundColor: `hsl(${hue}, 80%, 70%, 0.1)`, color: `hsl(${hue}, 80%, 70%)` }}>
        <Icon size={24} />
      </div>
      <h4 className="text-lg font-black text-white mb-2 tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

export default FakeDomainPreview;