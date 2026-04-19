import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const Settings = () => {
  const { user } = useAuth0();
  
  // States for Toggles
  const [alerts, setAlerts] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [inAppNotify, setInAppNotify] = useState(true);
  const [aiModel, setAiModel] = useState("gemini-1.5-flash");
  const [theme, setTheme] = useState("Midnight Dark");

  // 🔹 Clear Data (API Call)
  const handleClearData = async () => {
    if (!user?.sub) return;
    const confirmDelete = window.confirm("Are you sure? This will delete all your saved bookmarks permanently.");
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/bookmarks/user/${user.sub}`);
        alert("All bookmarks have been cleared successfully.");
      } catch (error) {
        console.error("Error deleting bookmarks:", error);
        alert("Failed to clear data.");
      }
    }
  };

  const handleCacheClear = () => {
    localStorage.clear();
    alert("Local cache cleared. The app will reload.");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-slate-400">Manage your AI Launch Agent preferences and account security.</p>
        </div>


        {/* 🧠 AI & Performance */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-4">🧠 AI & Performance</h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-medium">AI Intelligence Level</p>
              <p className="text-xs text-slate-500">Gemini 1.5 Pro provides deeper strategic insights.</p>
            </div>
            <select 
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none text-sm"
            >
              <option value="gemini-1.5-flash">1.5 Flash (Standard)</option>
              <option value="gemini-1.5-pro">1.5 Pro (Strategic)</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">System Cache</p>
              <p className="text-xs text-slate-500">Clear local storage to fix UI glitches.</p>
            </div>
            <button onClick={handleCacheClear} className="text-indigo-400 hover:text-indigo-300 text-sm font-bold">Clear Cache</button>
          </div>
        </section>

        {/* 🔔 Notifications */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-4">🔔 Notifications</h2>
          <div className="space-y-6">
            <Toggle label="Email Alerts" sub="Notify me about domain status changes." active={alerts} onClick={() => setAlerts(!alerts)} />
            <Toggle label="Newsletter" sub="Weekly startup launch tips & AI trends." active={newsletter} onClick={() => setNewsletter(!newsletter)} />
            <Toggle label="In-App Notifications" sub="Real-time notifications in the dashboard." active={inAppNotify} onClick={() => setInAppNotify(!inAppNotify)} />
          </div>
        </section>

        {/* ⚠️ Danger Zone */}
        <section className="bg-slate-900 border border-red-900/30 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-semibold text-red-500 border-b border-slate-800 pb-4">⚠️ Danger Zone</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Remove All Data</p>
                <p className="text-xs text-slate-500">Wipe all bookmarks from our servers.</p>
              </div>
              <button onClick={handleClearData} className="px-4 py-2 border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition">Clear Data</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Delete Account</p>
                <p className="text-xs text-slate-500">Permanently close your AI Launch Agent account.</p>
              </div>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition">Delete Account</button>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex justify-end pt-4">
          <button className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition transform active:scale-95">
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};

// Toggle Sub-Component
const Toggle = ({ label, sub, active, onClick }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-slate-200">{label}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
    <button 
      onClick={onClick}
      className={`w-12 h-6 rounded-full transition-all duration-200 relative ${active ? 'bg-indigo-600' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${active ? 'left-7' : 'left-1'}`}></div>
    </button>
  </div>
);

export default Settings;