import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  Trash2,
  Rocket,
  Search,
  Loader2,
  ArrowLeft
} from "lucide-react";

const UserBookmarks = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchBookmarks = useCallback(async () => {
    if (!user?.sub) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookmarks/${user.sub}`
      );
      setBookmarks(res.data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.sub]);

  useEffect(() => {
    if (isAuthenticated) fetchBookmarks();
  }, [isAuthenticated, fetchBookmarks]);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this project?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const openWorkspace = (bookmark) => {
    navigate("/workspace", { state: { data: bookmark } });
  };

  // ✅ IMPROVED SEARCH (domain + tagline + seo)
  const filteredBookmarks = bookmarks.filter((b) => {
    const q = searchTerm.toLowerCase();

    return (
      b.domainName?.toLowerCase().includes(q) ||
      b.tagline?.toLowerCase().includes(q) ||
      b.metaTitle?.toLowerCase().includes(q) ||
      b.targetAudience?.toLowerCase().includes(q)
    );
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-slate-400">Loading your saved ideas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-white"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <h1 className="text-3xl font-black flex items-center gap-2">
            <Bookmark className="text-indigo-500" />
            Saved Brand Concepts
          </h1>

          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-500" size={16} />
            <input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 pl-10 pr-4 py-2 rounded-xl"
            />
          </div>
        </div>

        {/* GRID */}
        {filteredBookmarks.length === 0 ? (
          <p className="text-center text-slate-500 py-20">
            No saved projects found.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredBookmarks.map((b) => (
              <div
                key={b._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition"
              >

                {/* TOP */}
                <div className="space-y-3">

                  {/* BRAND NAME = domainName */}
                  <h2 className="text-lg font-bold text-white">
                    {b.domainName || "Untitled Brand"}
                  </h2>

                  {/* TAGLINE */}
                  {b.tagline && (
                    <p className="text-sm text-slate-400 italic">
                      "{b.tagline}"
                    </p>
                  )}

                  {/* CORE INFO */}
                  <div className="text-xs space-y-1 text-slate-400">
                    <p>
                      <span className="text-slate-500">Audience:</span>{" "}
                      {b.targetAudience || "N/A"}
                    </p>

                    <p>
                      <span className="text-slate-500">Tone:</span>{" "}
                      {b.brandTone || "N/A"}
                    </p>

                    <p>
                      <span className="text-slate-500">Value:</span>{" "}
                      {b.valueProposition || "N/A"}
                    </p>
                  </div>

                  {/* SEO */}
                  <div className="pt-3 border-t border-slate-800 text-xs space-y-1">
                    <p className="text-slate-500 uppercase text-[10px]">
                      SEO
                    </p>

                    <p className="text-slate-300">
                      {b.metaTitle || "No SEO title"}
                    </p>

                    <p className="text-slate-500 line-clamp-2">
                      {b.metaDesc || "No description"}
                    </p>
                  </div>

                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => openWorkspace(b)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Rocket size={14} /> Open
                  </button>

                  <button
                    onClick={() => handleDelete(b._id)}
                    className="bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 p-2 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserBookmarks;