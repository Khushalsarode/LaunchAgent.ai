import React, { useState } from "react";
import {
    Rocket, Sparkles, Shield, HardDrive,
    Terminal, Zap, Code2, Globe,
    ChevronRight, Command, Fingerprint
} from "lucide-react";

export default function Dashboard() {
    const [isForging, setIsForging] = useState(false);
    const [status, setStatus] = useState("Idle");

    const startForge = () => {
        setIsForging(true);
        setStatus("Analyzing Intent...");
        setTimeout(() => setStatus("Generating Brand DNA (Gemini 2.5)..."), 2000);
        setTimeout(() => setStatus("Hashing Idea to Solana..."), 4000);
        setTimeout(() => setStatus("Configuring DigitalOcean Droplet..."), 6000);
        setTimeout(() => { setIsForging(false); setStatus("Launch Ready"); }, 8000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30">

            {/* SIDEBAR NAVIGATION */}
            <aside className="fixed left-0 top-0 h-full w-20 border-r border-white/5 bg-black flex flex-col items-center py-8 gap-10 z-50">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Rocket size={20} className="text-white" />
                </div>
                <div className="flex flex-col gap-8 opacity-40">
                    <Command size={22} className="hover:text-white cursor-pointer transition-colors" />
                    <Fingerprint size={22} className="hover:text-white cursor-pointer transition-colors" />
                    <Terminal size={22} className="hover:text-white cursor-pointer transition-colors" />
                    <Globe size={22} className="hover:text-white cursor-pointer transition-colors" />
                </div>
            </aside>

            {/* MAIN WORKSPACE */}
            <main className="pl-20">
                {/* HEADER */}
                <header className="border-b border-white/5 px-10 py-6 flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Workspace /</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Project_Forge</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-green-500">Solana Mainnet-Beta</span>
                        </div>
                        <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                            <Zap size={16} />
                        </button>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    {/* TOP GRID: INPUT & STATUS */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

                        {/* INPUT SECTION (8 Cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Sparkles size={120} />
                                </div>

                                <h2 className="text-3xl font-black tracking-tighter mb-2 italic">INITIALIZE AGENT</h2>
                                <p className="text-slate-500 text-sm mb-8 font-medium">What are we launching today? Describe the problem and target audience.</p>

                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg font-medium focus:outline-none focus:border-indigo-500/50 min-h-[160px] transition-all"
                                    placeholder="e.g. A decentralized ticket routing system for IT services using RAG..."
                                />

                                <div className="flex flex-wrap gap-3 mt-6">
                                    {["SaaS", "FinTech", "Web3", "Developer Tool"].map(tag => (
                                        <button key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:border-indigo-500/50 transition-all">
                                            {tag}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={startForge}
                                    disabled={isForging}
                                    className="w-full mt-10 py-5 bg-white text-black rounded-[1.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {isForging ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Rocket size={18} />}
                                    {isForging ? "FORGING ASSETS..." : "START LAUNCH SEQUENCE"}
                                </button>
                            </div>
                        </div>

                        {/* STATUS CARDS (4 Cols) */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Node</span>
                                    <Shield size={16} className="text-indigo-500" />
                                </div>
                                <p className="text-xs font-mono text-indigo-400 mb-1">ID: 4x82...A92Z</p>
                                <h4 className="font-bold text-xl uppercase tracking-tighter">{status}</h4>
                                <div className="mt-6 w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                    <div className={`h-full bg-indigo-500 transition-all duration-700 ${isForging ? 'w-2/3' : 'w-0'}`} />
                                </div>
                            </div>

                            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white group cursor-pointer hover:bg-indigo-500 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <HardDrive size={24} />
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h4 className="font-black text-xl uppercase tracking-tighter">View Infrastructure</h4>
                                <p className="text-white/60 text-xs mt-2 font-medium">Manage your DigitalOcean droplet clusters and secrets.</p>
                            </div>
                        </div>
                    </div>

                    {/* LOWER GRID: RECENT FORGES */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-4 hover:bg-white/[0.07] transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                <Code2 size={20} />
                            </div>
                            <div>
                                <h5 className="font-bold text-sm uppercase">Documentation Forge</h5>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Generate README & API Specs</p>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-4 hover:bg-white/[0.07] transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h5 className="font-bold text-sm uppercase">Market Positioning</h5>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">AI Competitor Analysis</p>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-4 hover:bg-white/[0.07] transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h5 className="font-bold text-sm uppercase">Trust Protocol</h5>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Blockchain Verification</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}