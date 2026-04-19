import React, { useState, useRef, useEffect } from "react";
import {
  Rocket, User, Layout, Settings, LogOut,
  Bookmark, Zap, Bell, Search, HelpCircle,
  Cpu, ChevronDown, Command, Fingerprint
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#02040a]/80 backdrop-blur-xl border-b border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* 🚀 Brand Identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-all">
            <Rocket className="text-white fill-white" size={18} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic text-white">
            LaunchAgent<span className="text-indigo-500">.ai</span>
          </span>
        </Link>

        {/* 🛠️ Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="hover:text-white transition-colors">Infrastructure</Link>
              <Link to="/about" className="hover:text-white transition-colors">Our Vision</Link>
              <Link to="/Pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link to="/verification" className="hover:text-white transition-colors">Verification</Link>
            </>
          ) : (
            <>
              <Link to="/domainai" className="hover:text-white transition-colors flex items-center gap-2">
                Idea Studio
              </Link>
              <Link to="/status" className="hover:text-white transition-colors flex items-center gap-2">
                Launch Board
              </Link>
              <Link to="/bookmarks" className="hover:text-white transition-colors flex items-center gap-2">
                <Bookmark size={12} className="text-indigo-500" /> Saved Concepts
              </Link>
              <Link to="/verification" className="hover:text-white transition-colors">Verification</Link>
            </>
          )}
        </div>

        {/* 👤 User Actions Section */}
        <div className="flex items-center gap-4" ref={dropdownRef}>
          {!isAuthenticated ? (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-white text-black hover:bg-indigo-600 hover:text-white transition-all px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95"
            >
              Start Creating
            </button>
          ) : (
            <>
              {/* Utility Icons */}
              <div className="hidden sm:flex items-center gap-4 text-slate-500">
                <button className="hover:text-white transition-colors p-2 bg-white/5 rounded-lg border border-white/5">
                  <Search size={16} />
                </button>
              </div>

              {/* Notification System */}
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              </button>

              {/* Founder Profile Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white/5 border border-white/10 rounded-full hover:border-indigo-500/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-slate-900">
                    {user?.picture ? (
                      <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-500">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-300 z-[110]">
                    <div className="px-4 py-4 mb-2 bg-white/5 rounded-2xl border border-white/5">
                      <p className="font-black text-white text-[10px] uppercase tracking-widest truncate">
                        {user?.name || "Founder Node 01"}
                      </p>
                      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest truncate mt-1">
                        {user?.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <DropdownLink to="/userprofile" icon={<Fingerprint size={14} />} label="Founder Profile" onClick={() => setIsDropdownOpen(false)} />
                      <DropdownLink to="/userdashboard" icon={<Layout size={14} />} label="Idea Registry" onClick={() => setIsDropdownOpen(false)} />
                      <DropdownLink to="/settings" icon={<Command size={14} />} label="API Config" onClick={() => setIsDropdownOpen(false)} />
                      <DropdownLink to="/Prompthistory" icon={<Cpu size={14} />} label="Prompt Intelligence" onClick={() => setIsDropdownOpen(false)} />
                    </div>

                    <div className="border-t border-white/5 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <LogOut size={14} />
                        Terminate Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const DropdownLink = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
  >
    <span className="text-indigo-500">{icon}</span>
    <span className="flex-1">{label}</span>
  </Link>
);

export default Navbar;