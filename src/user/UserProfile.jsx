import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-400">Please sign in to view your profile.</p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-indigo-600 rounded-xl text-white font-bold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <img 
              src={user.picture} 
              alt={user.name} 
              className="w-32 h-32 rounded-full border-4 border-indigo-500/30 p-1 shadow-2xl"
            />
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-4xl font-bold text-white tracking-tight">{user.name}</h1>
              <p className="text-indigo-400 font-mono text-sm">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verified Founder
                </span>
                <span className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Pro Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">Projects Launched</p>
            <p className="text-3xl font-bold text-white">12</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">Avg. Launch Score</p>
            <p className="text-3xl font-bold text-emerald-400">84%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">Tokens Used</p>
            <p className="text-3xl font-bold text-indigo-400">2.4k</p>
          </div>
        </div>

        {/* Detailed Info Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Account Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-semibold text-white">Account Security</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500 text-sm">Auth Provider</span>
                <span className="text-slate-300 text-sm capitalize">{user.sub?.split('|')[0]}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500 text-sm">Last Login</span>
                <span className="text-slate-300 text-sm">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500 text-sm">Locale</span>
                <span className="text-slate-300 text-sm uppercase">{user.locale || "EN-US"}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-semibold text-white">Management</h3>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => navigate("/bookmarks")}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-sm font-bold"
              >
                📂 View Saved Projects
              </button>
              <button 
                onClick={() => navigate("/settings")}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-sm font-bold"
              >
                🛠️ Developer Settings
              </button>
              <button 
                onClick={() => logout({ returnTo: window.location.origin })}
                className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-900/50 rounded-xl transition text-sm font-bold"
              >
                🚪 Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;