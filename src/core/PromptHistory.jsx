import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {
    Search,
    Trash2,
    Sparkles,
    Play,
    Copy,
    Clock,
    Hash,
    ChevronDown,
    ChevronUp,
    Inbox,
    Loader2 // Added for delete loading state
} from "lucide-react";

const TAGS = ["all", "ai", "startup", "saas", "blog", "product"];

const PromptHistory = ({ onUsePrompt, onImprovePrompt, onGenerate }) => {
    const { user, isAuthenticated } = useAuth0();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState("all");

    const fetchHistory = async () => {
        if (!user?.sub) return;
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/prompts/${user.sub}`);
            const enriched = (Array.isArray(res.data) ? res.data : []).map((p) => ({
                ...p,
                tag: p.tag || (p.prompt.toLowerCase().includes("ai") ? "ai" : "product"),
            }));
            setHistory(enriched);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.sub) fetchHistory();
    }, [user?.sub]);

    const filteredHistory = useMemo(() => {
        return history.filter((item) => {
            const matchSearch = item.prompt.toLowerCase().includes(search.toLowerCase());
            const matchTag = activeTag === "all" || item.tag === activeTag;
            return matchSearch && matchTag;
        });
    }, [history, search, activeTag]);

    const deletePrompt = async (id) => {
        if (!window.confirm("Delete this prompt permanently?")) return;
        try {
            setDeletingId(id);
            await axios.delete(`http://localhost:5000/api/prompts/${id}`);
            setHistory((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
                <div className="p-4 bg-slate-900 rounded-full mb-4">
                    <Clock size={32} className="opacity-20" />
                </div>
                <p className="text-lg font-medium">Please login to access your dashboard</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-8 text-slate-100 font-sans">

            {/* HEADER SECTION */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Prompt Library
                    </h1>
                    <p className="text-slate-500 mt-1">Manage and optimize your curated AI workflows.</p>
                </div>
                <div className="bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800 text-xs font-mono text-slate-400">
                    {filteredHistory.length} Saved Prompts
                </div>
            </header>

            {/* FILTER BAR */}
            <div className="sticky top-4 z-10 space-y-4 mb-8">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search your library..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-2xl"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {TAGS.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${activeTag === tag
                                ? "bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                                }`}
                        >
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* PROMPT LIST */}
            {loading ? (
                <div className="grid gap-4 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-900 rounded-2xl border border-slate-800" />)}
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
                    <Inbox className="text-slate-700 mb-4" size={48} />
                    <h3 className="text-slate-300 font-medium">No prompts found</h3>
                    <p className="text-slate-500 text-sm">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredHistory.map((item) => {
                        const isOpen = expandedId === item._id;
                        const isDeleting = deletingId === item._id;

                        return (
                            <div
                                key={item._id}
                                className={`group relative bg-slate-900/40 border border-slate-800 rounded-2xl transition-all hover:bg-slate-900/60 hover:border-slate-700 shadow-sm ${isDeleting ? "opacity-50 scale-[0.98]" : ""}`}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <div
                                            className="cursor-pointer flex-1"
                                            onClick={() => setExpandedId(isOpen ? null : item._id)}
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                    <Hash size={10} /> {item.tag}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    ID: {item._id.slice(-6)}
                                                </span>
                                            </div>
                                            <p className={`text-slate-200 leading-relaxed transition-all ${isOpen ? "" : "line-clamp-2"}`}>
                                                {item.prompt}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setExpandedId(isOpen ? null : item._id)}
                                            className="text-slate-600 hover:text-slate-300 transition-colors"
                                        >
                                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/50">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => onUsePrompt?.(item.prompt)}
                                                className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                                            >
                                                <Copy size={14} /> Copy
                                            </button>
                                            <button
                                                onClick={() => onImprovePrompt?.(item.prompt)}
                                                className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                                            >
                                                <Sparkles size={14} /> Improve
                                            </button>
                                            <button
                                                onClick={() => onGenerate?.(item.prompt)}
                                                className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                <Play size={14} /> Generate
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] text-slate-500 flex items-center gap-1 mr-2">
                                                <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                                            </span>

                                            {/* DELETE BUTTON INTEGRATION */}
                                            <button
                                                onClick={() => deletePrompt(item._id)}
                                                disabled={isDeleting}
                                                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50 group/del"
                                                title="Delete Prompt"
                                            >
                                                {isDeleting ? (
                                                    <Loader2 size={16} className="animate-spin text-red-400" />
                                                ) : (
                                                    <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PromptHistory;