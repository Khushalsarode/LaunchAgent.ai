import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    Sparkles, Download, Layers, Shield,
    Palette, MousePointer2, Loader2, Image as ImageIcon
} from "lucide-react";

const ImagenForge = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [config, setConfig] = useState({
        companyName: "SentinelAI",
        style: "Minimalist Vector",
        vibe: "Cybersecurity & Tech",
        colorScheme: "Cyan and Deep Blue",
        shape: "Shield/Hexagon",
    });

    // Predefined SaaS Styles
    const styles = ["Minimalist Vector", "3D Glossy", "Abstract Geometric", "Futuristic Mascot", "Lettermark"];
    const shapes = ["Shield/Hexagon", "Circular", "Abstract", "Linear/Grid"];

    const generateLogo = async () => {
        setLoading(true);
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

            // SaaS-level prompt engineering
            const engineeredPrompt = `
        Create a professional, high-end SaaS logo for a company named "${config.companyName}".
        Logo Style: ${config.style}.
        Industry/Vibe: ${config.vibe}.
        Primary Colors: ${config.colorScheme}.
        Icon Shape: ${config.shape}.
        Requirements: High-quality vector-like finish, centered composition, solid dark background, 
        sharp edges, modern startup aesthetic, no realistic photo elements.
      `;

            const result = await model.generateContent(engineeredPrompt);
            const response = result.response;
            const imagePart = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);

            if (imagePart?.inlineData) {
                setImageUrl(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
            }
        } catch (err) {
            console.error("Forge Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const downloadLogo = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `${config.companyName}-Logo.png`;
        link.click();
    };

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#050505] p-8 rounded-[3rem] border border-white/5 text-white">

            {/* LEFT: Controls (4 Columns) */}
            <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl">
                        <Shield className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Logo Forge</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SentinelAI Brand Engine</p>
                    </div>
                </div>

                {/* Input: Company Name */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Layers size={14} /> Brand Name
                    </label>
                    <input
                        value={config.companyName}
                        onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-indigo-500/50 outline-none transition-all"
                        placeholder="Enter project name..."
                    />
                </div>

                {/* Selector: Style */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                        <Palette size={14} /> Aesthetic Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {styles.map(s => (
                            <button
                                key={s}
                                onClick={() => setConfig({ ...config, style: s })}
                                className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${config.style === s ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white/5 border-transparent text-slate-400'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selector: Shape */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                        <MousePointer2 size={14} /> Icon Geometry
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {shapes.map(sh => (
                            <button
                                key={sh}
                                onClick={() => setConfig({ ...config, shape: sh })}
                                className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${config.shape === sh ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white/5 border-transparent text-slate-400'}`}
                            >
                                {sh}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={generateLogo}
                    disabled={loading}
                    className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase text-[12px] tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50 mt-4"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                    {loading ? "Forging Neural Assets..." : "Generate Brand Identity"}
                </button>
            </div>

            {/* RIGHT: Preview (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex-1 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] flex items-center justify-center relative group overflow-hidden min-h-[450px]">
                    {imageUrl ? (
                        <>
                            <img src={imageUrl} alt="Logo" className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={downloadLogo} className="p-5 bg-white text-black rounded-full hover:bg-indigo-500 hover:text-white transition-all">
                                    <Download size={24} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-4 opacity-20">
                            <ImageIcon size={64} className="mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Waiting for Prompt</p>
                        </div>
                    )}
                    {loading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-[3rem]">
                            <div className="text-center space-y-4">
                                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Running Gemini 2.5 Image Engine</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Generation Info Card */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Engine: <span className="text-white">Gemini 2.5 Flash Image</span>
                        </p>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Latency: ~8.4s</p>
                </div>
            </div>
        </div>
    );
};

export default ImagenForge;