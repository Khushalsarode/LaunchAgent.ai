import React, { useState, useEffect, useCallback } from 'react';
import {
    ShieldCheck, Loader2, Fingerprint, Lock,
    RefreshCw, ExternalLink, Activity, CheckCircle2,
    Gem, Copy, Check, AlertTriangle
} from 'lucide-react';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createDynamicProof, verifyLocalData } from '../assets/solanaSetup.js';

const SolanaVault = ({ project, connection, myKeypair, onUpdate, existingProof }) => {
    const [isVaulting, setIsVaulting] = useState(false);
    const [isLoadingAirdrop, setIsLoadingAirdrop] = useState(false);
    const [walletBalance, setWalletBalance] = useState(null);
    const [copied, setCopied] = useState(false);

    // Optimized Balance Fetcher
    const fetchBalance = useCallback(async () => {
        if (!connection || !myKeypair) return;
        try {
            const bal = await connection.getBalance(myKeypair.publicKey, "confirmed");
            setWalletBalance(bal / LAMPORTS_PER_SOL);
        } catch (err) {
            console.error("Ledger sync failed. Check Devnet status.");
        }
    }, [connection, myKeypair]);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance, existingProof]);

    const handleCopy = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLockIdea = async () => {
        if (walletBalance === 0 || isVaulting) return;
        setIsVaulting(true);

        const projectData = {
            name: project?.domainName || "Unknown",
            tagline: project?.tagline || "",
            coreLogic: project?.valueProposition || ""
        };

        try {
            const result = await createDynamicProof(connection, myKeypair, projectData);
            if (result.success) {
                onUpdate("blockchainProof", {
                    ...result,
                    timestamp: new Date().toISOString()
                });
                await fetchBalance();
            }
        } catch (err) {
            console.error("Vaulting Error:", err);
        } finally {
            setIsVaulting(false);
        }
    };

    const handleAirdrop = async () => {
        if (isLoadingAirdrop) return;
        setIsLoadingAirdrop(true);
        try {
            const sig = await connection.requestAirdrop(myKeypair.publicKey, 1 * LAMPORTS_PER_SOL);

            // Use 'confirmed' for better reliability during heavy traffic
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
                signature: sig,
                blockhash,
                lastValidBlockHeight
            }, "confirmed");

            setTimeout(fetchBalance, 1500);
        } catch (err) {
            // SaaS Polish: Catch the 429 specifically
            if (err.message.includes("429")) {
                alert("Devnet Rate Limit: The public faucet is busy. Please try again in 60 seconds or use faucet.solana.com");
            } else {
                console.warn("Airdrop failed:", err.message);
            }
        } finally {
            setIsLoadingAirdrop(false);
        }
    };

    const verification = existingProof ? verifyLocalData({
        name: project?.domainName,
        tagline: project?.tagline,
        coreLogic: project?.valueProposition,
    }, existingProof.fingerprint) : null;

    return (
        <div className="bg-[#050505] border border-cyan-500/10 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(6,182,212,0.1)] transition-all duration-700">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-transparent p-6 border-b border-white/5">
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Gem size={16} className="text-cyan-400" />
                            <h3 className="text-white font-bold text-sm tracking-tight italic uppercase">Origin Shield</h3>
                        </div>
                        <p className="text-slate-500 text-[8px] uppercase tracking-[0.3em] font-black">SentinelAI Ledger Auth</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl px-3 py-2 border border-white/5 text-right backdrop-blur-md">
                        <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Vault Gas</p>
                        <p className="text-xs font-mono text-white leading-none">
                            {walletBalance !== null ? walletBalance.toFixed(3) : "0.000"} <span className="text-[9px] text-cyan-500/50 ml-1">SOL</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* DYNAMIC VERIFICATION STATUS */}
                {existingProof && (
                    <div className={`p-4 rounded-2xl border transition-all duration-500 ${verification?.isValid
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-red-500/5 border-red-500/20 animate-pulse"
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {verification?.isValid ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-red-500" />}
                                <span className={`text-[9px] font-black uppercase tracking-widest ${verification?.isValid ? "text-emerald-500" : "text-red-500"}`}>
                                    {verification?.isValid ? "Ledger Verified" : "Integrity Breach"}
                                </span>
                            </div>
                        </div>
                        <p className="text-[9px] text-slate-400 leading-relaxed italic">
                            {verification?.isValid
                                ? "Metadata hash matches the on-chain fingerprint exactly."
                                : "Warning: Local project data does not match the sealed on-chain record."}
                        </p>
                    </div>
                )}

                {/* SIGNATURE BLOCK */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-20 transition-all duration-700 rotate-12">
                        <Fingerprint size={80} />
                    </div>

                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Global Signature</p>
                            <p className="text-[7px] text-slate-600 uppercase font-bold">Transaction Authority Key</p>
                        </div>
                        {existingProof?.signature && (
                            <button onClick={() => handleCopy(existingProof.signature)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-cyan-400">
                                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            </button>
                        )}
                    </div>

                    <div className="w-full bg-black/60 border border-white/10 rounded-xl p-3 mb-1">
                        <code className="block text-[9px] text-slate-300 font-mono break-all leading-relaxed">
                            {existingProof?.signature || "0x_Await_Deployment_Signal..."}
                        </code>
                    </div>
                </div>

                {/* MAIN ACTIONS */}
                <div className="space-y-3">
                    <button
                        onClick={handleLockIdea}
                        disabled={isVaulting || walletBalance === 0}
                        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 ${existingProof
                            ? "bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/5"
                            : "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                            } disabled:opacity-20 disabled:cursor-not-allowed active:scale-95`}
                    >
                        {isVaulting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Committing...</span>
                            </>
                        ) : existingProof ? (
                            "Re-Seal Logic"
                        ) : (
                            "Commit to Ledger"
                        )}
                    </button>

                    {walletBalance === 0 && (
                        <button
                            onClick={handleAirdrop}
                            disabled={isLoadingAirdrop}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[9px] font-bold uppercase tracking-widest text-slate-400 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={12} className={isLoadingAirdrop ? "animate-spin" : ""} />
                            {isLoadingAirdrop ? "Requesting..." : "Request Gas Credits"}
                        </button>
                    )}
                </div>

                {/* RECEIPT LINK */}
                {existingProof?.explorerUrl && (
                    <div className="pt-4 border-t border-white/5 text-center">
                        <a href={existingProof.explorerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 group">
                            <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-cyan-400 transition-colors tracking-widest">Audit Receipt</span>
                            <ExternalLink size={10} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SolanaVault;