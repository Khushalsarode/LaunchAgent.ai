import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 State to track the active project for the Score Widget
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.sub) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/bookmarks/${user.sub}`);
        setBookmarks(res.data);
        // Default the widget to show the most recent project
        if (res.data.length > 0) {
          setSelectedProject(res.data[0]);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchStats();
  }, [isAuthenticated, user]);

  const stats = [
    { label: "Active Projects", value: bookmarks.length, icon: "📁" },
    { label: "Top Readiness", value: "84%", icon: "🚀", color: "text-emerald-400" },
    { label: "AI Tokens", value: "Unlimited", icon: "⚡", color: "text-indigo-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.given_name || "Founder"}!
            </h1>
            <p className="text-slate-400 text-sm">You have {bookmarks.length} startup ideas ready for takeoff.</p>
          </div>
          <button
            onClick={() => navigate("/domain-ai")}
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            + Create New Project
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 transition hover:border-slate-700">
              <span className="text-3xl bg-slate-800 p-3 rounded-xl">{stat.icon}</span>
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color || "text-white"}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Main Content: Project List */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-white px-2">Recent Projects</h2>
            {loading ? (
              <div className="p-10 text-center animate-pulse text-slate-500 font-mono">Loading your empire...</div>
            ) : bookmarks.length === 0 ? (
              <div className="bg-slate-900 border border-dashed border-slate-700 p-10 rounded-3xl text-center">
                <p className="text-slate-500">No projects yet. Start your first one!</p>
              </div>
            ) : (
              bookmarks.slice(0, 5).map((b, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedProject(b)}
                  className={`p-5 rounded-2xl flex justify-between items-center border transition cursor-pointer ${selectedProject?._id === b._id
                      ? "bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/5"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${selectedProject?._id === b._id ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400"}`}>
                      {b.domainName?.[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{b.domainName}</h4>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">{b.tagline}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/workspace`, { state: { data: b } });
                    }}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Open Workspace →
                  </button>
                </div>
              ))
            )}
            <button
              onClick={() => navigate("/bookmarks")}
              className="w-full py-3 text-slate-500 hover:text-indigo-400 text-sm transition font-medium"
            >
              View all saved domains
            </button>
          </div>

          {/* Side Panel: Dynamic Score Widget */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white px-2">Launch Readiness</h2>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 sticky top-6">
              {selectedProject ? (
                <>
                  <div className="text-center space-y-2">
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-tighter">{selectedProject.domainName}</h3>
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-emerald-500/20 mb-2">
                      <span className="text-2xl font-bold text-emerald-400">84%</span>
                    </div>
                    <p className="text-sm font-bold text-slate-300">Total Score</p>
                  </div>

                  <div className="space-y-4">
                    <ProgressBar label="Branding" score={90} color="bg-indigo-500" />
                    <ProgressBar label="Documentation" score={75} color="bg-emerald-500" />
                    <ProgressBar label="SEO Setup" score={60} color="bg-blue-500" />
                  </div>

                  <button
                    onClick={() => navigate(`/workspace`, { state: { data: selectedProject } })}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-bold text-white transition shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    Complete Roadmap
                  </button>
                </>
              ) : (
                <div className="text-center text-slate-500 py-10 italic">
                  Select a project to view its status
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// 🔹 Reusable Progress Bar Component
const ProgressBar = ({ label, score, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 tracking-wider">
      <span>{label}</span>
      <span>{score}%</span>
    </div>
    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
      <div
        className={`${color} h-full rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${score}%` }}
      ></div>
    </div>
  </div>
);

export default UserDashboard;