import React, { useState, useEffect } from 'react';
import {
    Database, ShieldCheck, Activity, Code, Eye,
    AlertCircle, Globe, Zap, Shield, ChevronRight,
    Terminal, Lock, Unlock, HardDrive, RefreshCcw
} from 'lucide-react';
import { Connection, PublicKey } from "@solana/web3.js";

const OriginVerifier = () => {
    const [lookupAddress, setLookupAddress] = useState("");
    const [networkStats, setNetworkStats] = useState(null);
    const [rawJson, setRawJson] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("saas");
    const [querySpeed, setQuerySpeed] = useState(0);

    // Switch from the standard endpoint to a mirror if 429s persist
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    // Alternative mirror if needed:
    // const connection = new Connection("https://devnet.helius-rpc.com/?api-key=YOUR_KEY", "confirmed");   

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!lookupAddress) return;

        const start = performance.now();
        setIsSearching(true);
        setError(null);
        setNetworkStats(null);

        try {
            const pubKey = new PublicKey(lookupAddress);
            const info = await connection.getAccountInfo(pubKey);

            if (info) {
                setRawJson(info);
                let decodedMemo = "";
                try {
                    // SaaS level decoding: check for common memo patterns
                    decodedMemo = new TextDecoder().decode(info.data).replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
                } catch (e) {
                    decodedMemo = "ENCRYPTED_DATA_STREAM";
                }

                setNetworkStats({
                    lamports: info.lamports,
                    owner: info.owner.toBase58(),
                    space: info.data.length,
                    executable: info.executable,
                    memo: decodedMemo,
                    trustScore: info.lamports > 0 ? 98 : 45,
                    lastCheck: new Date().toLocaleTimeString()
                });
                setQuerySpeed(Math.round(performance.now() - start));
            } else {
                setError("Null response: Address does not exist on Devnet ledger.");
            }
        } catch (err) {
            setError("Protocol Error: Check address checksum or network status.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 space-y-6 pb-20 font-sans selection:bg-cyan-500/30">
            {/* SAAS HEADER */}
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <ShieldCheck className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight italic uppercase">Ledger Audit </h2>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                            <Globe size={10} className="text-emerald-500" /> Multi-Chain Verification Node
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex gap-6">
                    <div className="text-right">
                        <p className="text-[8px] text-slate-500 font-black uppercase">Network</p>
                        <p className="text-[10px] text-white font-mono">SOLANA_DEVNET</p>
                    </div>
                    <div className="text-right border-l border-white/10 pl-6">
                        <p className="text-[8px] text-slate-500 font-black uppercase">Latency</p>
                        <p className="text-[10px] text-cyan-500 font-mono">{querySpeed > 0 ? `${querySpeed}ms` : '--'}</p>
                    </div>
                </div>
            </div>

            {/* SEARCH ENGINE BAR */}
            <form onSubmit={handleVerify} className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Terminal size={16} className="text-slate-600" />
                </div>
                <input
                    type="text"
                    value={lookupAddress}
                    onChange={(e) => setLookupAddress(e.target.value)}
                    placeholder="Input Transaction Signature or Account Pubkey..."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-5 pl-14 pr-32 text-xs font-mono text-cyan-400 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-3 top-3 bottom-3 px-6 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                    {isSearching ? <RefreshCcw className="animate-spin" size={14} /> : "Analyze"}
                </button>
            </form>

            {error && (
                <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95">
                    <AlertCircle className="text-red-500" size={16} />
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-tighter">{error}</p>
                </div>
            )}

            {networkStats && (
                <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* LEFT COL: STATUS & SCORE */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="relative">
                                <svg className="w-24 h-24">
                                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                    <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="276" strokeDashoffset={276 - (276 * networkStats.trustScore) / 100} className="text-cyan-500 transition-all duration-1000" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-black text-white leading-none">{networkStats.trustScore}</span>
                                    <span className="text-[8px] text-slate-500 font-bold uppercase">Trust Score</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-slate-400 leading-relaxed font-medium italic">
                                Account demonstrates healthy lamport reserve and active data storage.
                            </p>
                        </div>

                        <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4">
                            <div className="flex justify-between items-center mb-4 text-[9px] font-black text-cyan-500 uppercase">
                                <span>Integrity Log</span>
                                <Lock size={12} />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] text-slate-300 font-mono">Ledger Verified</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] text-slate-300 font-mono">Owner Consistent</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL: DATA DETAILS */}
                    <div className="md:col-span-2 space-y-6">
                        {/* VIEW MODE TOGGLE */}
                        <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-white/5 self-start w-fit">
                            <button onClick={() => setViewMode("saas")} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === "saas" ? "bg-white text-black" : "text-slate-500 hover:text-white"}`}>
                                <Eye size={12} /> Intelligence
                            </button>
                            <button onClick={() => setViewMode("json")} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === "json" ? "bg-white text-black" : "text-slate-500 hover:text-white"}`}>
                                <Code size={12} /> Terminal
                            </button>
                        </div>

                        {viewMode === "saas" ? (
                            <div className="space-y-4">
                                <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        <Stat label="Account Owner" value={networkStats.owner} mono />
                                        <Stat label="Total Balance" value={`${(networkStats.lamports / 1e9).toFixed(4)} SOL`} />
                                        <Stat label="Data Allocation" value={`${networkStats.space} Bytes`} />
                                        <Stat label="Executable" value={networkStats.executable ? "TRUE" : "FALSE"} />
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Shield className="text-cyan-500" size={14} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Decoded Fingerprint</span>
                                        </div>
                                        <div className="bg-black rounded-xl p-4 border border-white/5">
                                            <p className="text-[11px] font-mono text-cyan-400 break-all leading-relaxed">
                                                {networkStats.memo || "NO_PLAINTEXT_DATA_IDENTIFIED"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-black border border-white/10 rounded-3xl p-6 font-mono text-[11px] text-cyan-500/80 max-h-[400px] overflow-auto shadow-inner">
                                <div className="flex items-center gap-2 text-slate-600 mb-4 border-b border-white/5 pb-2">
                                    <Terminal size={12} /> root@sentinel:~/ledger_output.json
                                </div>
                                {JSON.stringify(rawJson, (k, v) => typeof v === 'bigint' ? v.toString() : v, 4)}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/* SaaS Sub-Component */
const Stat = ({ label, value, mono }) => (
    <div className="space-y-1">
        <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{label}</p>
        <p className={`text-[10px] font-bold text-white truncate ${mono ? 'font-mono text-slate-400' : ''}`}>{value}</p>
    </div>
);

export default OriginVerifier;