import React from "react";
import {
  Rocket, Github, Twitter, Linkedin,
  Mail, ExternalLink, Cpu, Fingerprint
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#02040a] border-t border-white/5 text-slate-500 font-sans">
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">

          {/* 🚀 Brand Column */}
          <div className="md:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
                <Rocket size={20} className="text-white fill-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic text-white">
                LaunchAgent<span className="text-indigo-500">.ai</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm font-medium">
              The first autonomous agentic workspace bridging
              <span className="text-slate-300"> Solana Intelligence</span> with
              <span className="text-slate-300"> DigitalOcean Scale</span>.
              We don't just prompt; we forge reality.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Github size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
            </div>
          </div>

          {/* 🛠️ Platform Column */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Platform</h3>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
              <FooterLink to="/domainai">Domain Studio</FooterLink>
              <FooterLink to="/status">Project Forge</FooterLink>
              <FooterLink to="/roadmap">Agentic Roadmap</FooterLink>
              <FooterLink to="/mvp">Solana Registry</FooterLink>
            </ul>
          </div>

          {/* 📚 Intelligence Column */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Intelligence</h3>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
              <FooterLink to="/docs">Documentation</FooterLink>
              <FooterLink to="/about">Our Vision</FooterLink>
              <li className="flex items-center gap-2 group cursor-pointer hover:text-indigo-400 transition-colors">
                <Cpu size={14} className="text-indigo-500" />
                <span>Gemini 2.5 Flash</span>
              </li>
              <li className="flex items-center gap-2 group cursor-pointer hover:text-emerald-400 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Node Status</span>
              </li>
            </ul>
          </div>

          {/* ⚖️ Legal Column */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Legal</h3>
            <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
              <FooterLink to="/privacy">Privacy Protocol</FooterLink>
              <FooterLink to="/terms">Terms of Forge</FooterLink>
              <FooterLink to="/security">Encryption</FooterLink>
            </ul>
          </div>

          {/* 📬 Node Contact */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Node</h3>
            <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-white transition group border border-white/5 bg-white/5 px-4 py-3 rounded-xl">
              <Mail size={14} className="text-indigo-500" />
              <span>Contact HQ</span>
            </button>
          </div>
        </div>

        {/* 🛡️ Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
              © {currentYear} LaunchAgent.ai
            </p>
            <div className="h-4 w-px bg-white/5 hidden md:block" />

          </div>

          <div className="flex items-center gap-8 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
            <span className="flex items-center gap-2 group hover:text-indigo-400 transition-colors cursor-default">
              <Fingerprint size={12} className="text-indigo-500" />
              Mainnet-Beta Ready
            </span>
            <span className="flex items-center gap-2 group hover:text-cyan-400 transition-colors cursor-default">
              <Rocket size={12} className="text-cyan-500" />
              Phase: Hypergrowth
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Helper Components ---

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-white transition-all flex items-center gap-1 group">
      {children}
      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all text-indigo-500" />
    </Link>
  </li>
);

const SocialIcon = ({ icon, href }) => (
  <a
    href={href}
    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-indigo-500 hover:text-white hover:bg-indigo-500/10 transition-all shadow-xl"
  >
    {icon}
  </a>
);