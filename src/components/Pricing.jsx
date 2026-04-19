import React from "react";
import { Check, Zap, Rocket, Shield, Cpu, Globe } from "lucide-react";

const Pricing = () => {
    return (
        <div className="bg-[#020617] text-slate-200 min-h-screen font-sans selection:bg-indigo-500/30 pt-32 pb-20 px-6">

            {/* --- HEADER --- */}
            <section className="max-w-4xl mx-auto text-center space-y-6 mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                    Scalable Infrastructure
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] text-white uppercase italic">
                    READY TO <span className="text-indigo-500">SCALE?</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                    Choose the compute power required for your next unicorn.
                    From solo hackers to global engineering teams.
                </p>
            </section>

            {/* --- PRICING GRID --- */}
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

                {/* Tier 1: SOLOPRENEUR */}
                <PricingCard
                    tier="Solo Hacker"
                    price="0"
                    desc="Perfect for validating your first 3 ideas."
                    icon={<Zap size={24} className="text-slate-400" />}
                    features={[
                        "3 AI-Generated Startup Kits",
                        "Basic Naming & Branding",
                        "Markdown Export",
                        "Community Support"
                    ]}
                />

                {/* Tier 2: FOUNDER (THE BENTO HIGHLIGHT) */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-[#080a10] border border-indigo-500/30 rounded-[2.5rem] p-10 h-full flex flex-col space-y-8 shadow-2xl">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/40">
                                <Rocket size={24} className="text-white" />
                            </div>
                            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">
                                Most Popular
                            </span>
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Founder Node</h3>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-5xl font-black text-white tracking-tighter">$29</span>
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">/ Month</span>
                            </div>
                        </div>

                        <ul className="space-y-4 flex-1">
                            <FeatureItem text="Unlimited Startup Kits" active />
                            <FeatureItem text="Solana IP Hashing (10/mo)" active />
                            <FeatureItem text="Advanced Market Positioning" active />
                            <FeatureItem text="DigitalOcean Deployment Config" active />
                            <FeatureItem text="Export to ZIP & PDF" active />
                        </ul>

                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]">
                            Initialize Node
                        </button>
                    </div>
                </div>

                {/* Tier 3: ENTERPRISE */}
                <PricingCard
                    tier="Venture Lab"
                    price="Custom"
                    desc="For incubators and CDAC-level engineering groups."
                    icon={<Globe size={24} className="text-indigo-400" />}
                    features={[
                        "White-label AI Output",
                        "On-Chain Bulk Registry",
                        "Custom LLM Fine-tuning",
                        "24/7 Priority Support",
                        "SSO & Team Auth"
                    ]}
                    isEnterprise
                />
            </div>

            {/* --- FOOTNOTE --- */}
            <section className="mt-20 text-center">
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em]">
                    All transactions are processed via secure encrypted protocols.
                </p>
            </section>
        </div>
    );
};

// --- HELPER COMPONENTS ---

const PricingCard = ({ tier, price, desc, icon, features, isEnterprise }) => (
    <div className="bg-[#0a0f1e]/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col space-y-8 hover:border-white/10 transition-all">
        <div className="p-3 bg-white/5 rounded-2xl w-fit border border-white/5">
            {icon}
        </div>

        <div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{tier}</h3>
            <div className="flex items-baseline gap-1 mt-2">
                <span className="text-5xl font-black text-white tracking-tighter">
                    {price === "0" ? "FREE" : price === "Custom" ? "POA" : `$${price}`}
                </span>
                {price !== "0" && price !== "Custom" && (
                    <span className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">/ Month</span>
                )}
            </div>
            <p className="text-slate-500 text-sm mt-4 font-medium leading-relaxed">{desc}</p>
        </div>

        <ul className="space-y-4 flex-1">
            {features.map((f, i) => (
                <FeatureItem key={i} text={f} />
            ))}
        </ul>

        <button className={`w-full font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all active:scale-[0.98] ${isEnterprise
            ? 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
            : 'bg-white text-black hover:bg-indigo-600 hover:text-white'
            }`}>
            {isEnterprise ? 'Contact Sales' : 'Start Building'}
        </button>
    </div>
);

const FeatureItem = ({ text, active }) => (
    <li className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest ${active ? 'text-slate-200' : 'text-slate-500'}`}>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-700'}`}>
            <Check size={10} strokeWidth={4} />
        </div>
        {text}
    </li>
);

export default Pricing;