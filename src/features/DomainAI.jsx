import React, { useEffect, useState } from "react";
import {
    Rocket, Sparkles, Mic, Square, History,
    ChevronDown, Copy, Heart, Eye, FileText, Search,
    Wand2, Globe, Cpu, Layers, Terminal, Zap, Box, X
} from "lucide-react";
import axios from "axios";
import Select from "react-select";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Papa from "papaparse";
import { useAuth0 } from "@auth0/auth0-react";
import FakeDomainPreview from "./FakeDomainPreview";
import promptTemplates from "../assets/promptTemplates";

const DomainAI = () => {
    const { user } = useAuth0();

    const [industries, setIndustries] = useState([]);
    const [extensions, setExtensions] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const [selectedExtensions, setSelectedExtensions] = useState([]);
    const [customTLD, setCustomTLD] = useState("");
    const [showCustomTLD, setShowCustomTLD] = useState(false);
    const [projectTitle, setProjectTitle] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [primaryKeywords, setPrimaryKeywords] = useState(["", "", ""]);
    const [secondaryKeywords, setSecondaryKeywords] = useState(["", "", ""]);
    const [aiResponse, setAiResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [previewDomainData, setPreviewDomainData] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [availabilityStatus, setAvailabilityStatus] = useState({});

    // New states for the Prompt Feature
    const [usePromptMode, setUsePromptMode] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");

    const [simplePrompt, setSimplePrompt] = useState("");
    const [isImproved, setIsImproved] = useState(false);
    //const [improvedPrompt, setImprovedPrompt] = useState("");
    const [showImproved, setShowImproved] = useState(false);
    const [improvedPrompt, setImprovedPrompt] = useState("");
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [templateData, setTemplateData] = useState({});
    const [showAllChips, setShowAllChips] = useState(false);

    //----------------------Record and task ---------------------
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const allChips = [
        // 🔹 AI / SaaS
        "AI tool for content creators",
        "SaaS platform for small businesses",
        "AI resume builder for students",
        "Automation tool for marketing teams",

        // 🔹 Ecommerce / D2C
        "Ecommerce fashion brand for Gen Z",
        "Luxury skincare D2C brand",
        "Eco-friendly home products brand",
        "Pet products online store",

        // 🔹 Startup / Tech
        "Startup idea for logistics optimization",
        "B2B software for HR teams",
        "Marketplace for freelancers",
        "On-demand service app",

        // 🔹 Finance / Web3
        "Fintech app for saving money",
        "Crypto/Web3 platform for NFTs",
        "Investment app for beginners",
        "Digital banking solution for India",

        // 🔹 Health / Fitness
        "Fitness app for weight loss",
        "Mental wellness startup",
        "Yoga and meditation platform",
        "Nutrition tracking mobile app",

        // 🔹 EdTech
        "EdTech platform for coding",
        "Online learning app for kids",
        "UPSC preparation platform",
        "Skill-based learning startup",

        // 🔹 Creator / Personal Brand
        "Personal brand for tech YouTuber",
        "Instagram brand for fitness coach",
        "Podcast brand about startups",
        "LinkedIn personal brand for founder",

        // 🔹 Agency / Services
        "Digital marketing agency",
        "Creative design studio",
        "Startup consulting agency",
        "Social media growth agency",

        // 🔹 Mobile Apps
        "Productivity app for students",
        "Habit tracking mobile app",
        "Travel planning app",
        "Food delivery startup app",

        // 🔹 Fun / Creative
        "Futuristic space startup",
        "Gaming brand for esports",
        "Music streaming platform",
        "AI-powered storytelling app"
    ];
    const visibleChips = showAllChips
        ? allChips
        : allChips.slice(0, 8);
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const recorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus"
            });

            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = async () => {
                if (!chunks.length) return;

                setIsTranscribing(true);

                const blob = new Blob(chunks, { type: "audio/webm" });

                try {
                    const formData = new FormData();
                    formData.append("file", blob, "recording.webm");

                    const res = await axios.post(
                        "http://localhost:5000/api/transcribe",
                        formData
                    );

                    const text = res.data?.text;

                    if (text) {
                        setSimplePrompt(prev => prev + " " + text);
                    }

                } catch (err) {
                    console.error("Transcription error:", err);
                }

                setIsTranscribing(false);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);

        } catch (err) {
            console.error("Mic error:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };


    //------------------UseEffect for Prompt history ------------------
    const [promptHistory, setPromptHistory] = useState([]);
    const savePromptToHistory = async (prompt) => {
        try {
            if (!user?.sub || !prompt?.trim()) return;

            const res = await axios.post("http://localhost:5000/api/prompts", {
                userId: user.sub,
                prompt: prompt.trim()
            });

            if (res.data?.prompt) {
                setPromptHistory(prev => {
                    const updated = [{ prompt: res.data.prompt }, ...prev];
                    return updated.slice(0, 8);
                });
            }

        } catch (err) {
            console.error("Save failed:", err.response?.data || err.message);
        }
    };


    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (!user?.sub) return;

                const res = await axios.get(
                    `http://localhost:5000/api/prompts/${user.sub}`
                );

                setPromptHistory(Array.isArray(res.data) ? res.data : []);

            } catch (err) {
                console.error("History fetch error:", err);
            }
        };

        fetchHistory();
    }, [user]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!simplePrompt.trim()) {
                setSuggestions([]);
                return;
            }

            const words = simplePrompt.toLowerCase();

            const sug = [];

            if (words.includes("ai")) sug.push(".ai", "automation", "machine learning");
            if (words.includes("fitness")) sug.push(".fit", "health", "workout");
            if (words.includes("finance")) sug.push(".finance", "fintech", "money");

            setSuggestions(sug);
        }, 400);

        return () => clearTimeout(timeout);
    }, [simplePrompt]);

    // ---------------- Fetch Industry + Extensions ----------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [industryRes, extensionRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/industries"),
                    axios.get("http://localhost:5000/api/extensions"),
                ]);

                setIndustries(
                    industryRes.data.map((ind) => ({
                        value: ind.Industry,
                        label: ind.Industry,
                    }))
                );

                setExtensions(
                    extensionRes.data.map((ext) => ({
                        value: ext.Extension,
                        label: ext.Extension,
                    }))
                );
            } catch (error) {
                console.error(error);
                alert("Failed to load industries/extensions");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (activeTemplate) {
            const preview = JSON.stringify(templateData, null, 2);
            setSimplePrompt(preview);
        }
    }, [templateData, activeTemplate]);
    // ---------------- Generate ----------------
    const handleGenerate = async () => {
        // ---------------- Validation ----------------
        if (!usePromptMode) {
            if (!projectTitle || !projectDescription || !selectedIndustry) {
                alert("Fill all required fields");
                return;
            }
        } else {
            if (!simplePrompt.trim() && !activeTemplate) {
                alert("Please enter a prompt or select a template");
                return;
            }
        }

        setLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(
                import.meta.env.VITE_GOOGLE_GENAI_API_KEY
            );

            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
            });

            let finalPrompt = "";

            // ---------------- 1. TEMPLATE MODE ----------------
            if (usePromptMode && activeTemplate) {
                const requiredFields = promptTemplates[activeTemplate].fields;

                const isIncomplete = requiredFields.some(
                    (f) => !templateData[f.key]?.trim()
                );

                if (isIncomplete) {
                    alert("Please fill all template fields");
                    return;
                }
            }

            // ---------------- 2. SIMPLE PROMPT MODE ----------------
            else if (usePromptMode) {
                finalPrompt = `
You are a WORLD-CLASS STARTUP LAUNCH STRATEGIST.

Transform the user idea into 5 high-quality, launch-ready brand concepts.

User Idea:
${simplePrompt}

Each concept must include:
- Brand Name
- Tagline
- Value Proposition
- Target Audience
- Brand Tone
- SEO Title
- SEO Description
- Domain Ideas (max 3)

STRICT RULES:
- Do NOT include explanations
- Do NOT use markdown
- Do NOT number items
- Do NOT add extra commentary
- Output ONLY structured blocks
- Keep it concise and high-quality

OUTPUT FORMAT (MANDATORY):

=== BLOCK START ===
Brand Name: ...
Tagline: ...
Value Proposition: ...
Target Audience: ...
Brand Tone: ...
SEO Title: ...
SEO Description: ...
Domain Ideas: name.com, name.io, name.ai
=== BLOCK END ===

Repeat 5 times exactly.
`;
            }

            // ---------------- 3. FORM (BUILDER MODE) ----------------
            else {
                const keywordStr = [
                    ...primaryKeywords.filter(Boolean),
                    ...secondaryKeywords.filter(Boolean),
                ].join(", ");

                const tldStr = [
                    ...selectedExtensions.map((ext) => ext.value),
                    ...(customTLD ? [customTLD] : []),
                ].join(", ");

                finalPrompt = `
You are a WORLD-CLASS STARTUP LAUNCH STRATEGIST.

You generate 5 high-quality, launch-ready brand concepts.

Each concept must be strategic, not just naming.

Each MUST include:
- Brand Name
- Tagline
- Value Proposition
- Target Audience
- Brand Tone
- SEO Title
- SEO Description
- Domain Ideas (max 3)

STRICT RULES:
- Do NOT include explanations
- Do NOT use markdown
- Do NOT number items
- Do NOT add extra commentary
- Output ONLY structured blocks
- Keep content concise, sharp, and startup-ready

OUTPUT FORMAT (MANDATORY):

=== BLOCK START ===
Brand Name: ...
Tagline: ...
Value Proposition: ...
Target Audience: ...
Brand Tone: ...
SEO Title: ...
SEO Description: ...
Domain Ideas: name.com, name.io, name.ai
=== BLOCK END ===

Repeat 5 times.

CONTEXT:
Project: ${projectTitle}
Industry: ${selectedIndustry?.value}
Description: ${projectDescription}
Keywords: ${keywordStr || "None"}
Preferred Extensions: ${tldStr || "Any"}
`;
            }

            // ---------------- AI CALL ----------------
            const result = await model.generateContent(finalPrompt);
            const text = result?.response?.text?.();

            const cleanText = (text || "")
                .replace(/\*\*/g, "")
                .replace(/#/g, "")
                .replace(/[-•]/g, "")
                .trim();

            setAiResponse(cleanText);

            // Save history only for prompt mode
            if (usePromptMode && simplePrompt.trim()) {
                await savePromptToHistory(simplePrompt.trim());
            }

        } catch (err) {
            console.error(err);
            alert("AI Generation failed.");
        } finally {
            setLoading(false);
        }
    };

    const enhancePromptWithAI = async () => {
        if (!simplePrompt.trim()) {
            alert("Enter a prompt first");
            return;
        }

        try {
            setLoading(true);

            const genAI = new GoogleGenerativeAI(
                import.meta.env.VITE_GOOGLE_GENAI_API_KEY
            );

            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
            });

            const improvePrompt = `
You are an expert prompt engineer specializing in AI startup ideation and branding systems.

Rewrite the user input into a HIGH-QUALITY structured AI prompt for generating startup launch concepts and brand ideas.

User Input:
${simplePrompt}

Your job:
Convert this into a clear, optimized prompt that another AI can use to generate better brand and launch ideas.

The improved prompt MUST include:

1. Objective (what the AI should generate)
2. Context (industry, audience, tone inferred from input)
3. Constraints (what to avoid)
4. Output Format (clearly structured expected response)

Rules:
- Do NOT generate domain names
- Do NOT generate final results
- Do NOT give explanations
- ONLY return the improved prompt
- Keep it concise but structured
- Make it production-ready for AI generation

Output format MUST be:

OBJECTIVE:
...

CONTEXT:
...

CONSTRAINTS:
...

OUTPUT FORMAT:
...
`;

            const result = await model.generateContent(improvePrompt);
            const text = result?.response?.text?.();

            if (text) {
                const cleanText = text
                    .replace(/\*\*/g, "")
                    .replace(/#/g, "")
                    .replace(/[-•]/g, "")
                    .trim();

                setImprovedPrompt(cleanText);
                setShowImproved(true);
            }

        } catch (err) {
            console.error(err);
            alert("Failed to enhance prompt");
        } finally {
            setLoading(false);
        }
    };

    const DOMAIN_CHECK_KEY = import.meta.env.VITE_DOMAIN_CHECK_KEY;

    const checkAvailability = async (domainName, index) => {
        setAvailabilityStatus(prev => ({
            ...prev,
            [index]: "loading"
        }));

        try {
            const response = await fetch(
                `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${DOMAIN_CHECK_KEY}&domainName=${domainName}&outputFormat=json`
            );

            if (!response.ok) throw new Error("Network error");

            const data = await response.json();
            const whois = data?.WhoisRecord;
            const registrant = whois?.registryData?.registrant;

            if (whois && whois.registryData && registrant) {
                setAvailabilityStatus(prev => ({
                    ...prev,
                    [index]: "taken"
                }));
            } else {
                setAvailabilityStatus(prev => ({
                    ...prev,
                    [index]: "available"
                }));
            }

        } catch (err) {
            setAvailabilityStatus(prev => ({
                ...prev,
                [index]: "error"
            }));
        }
    };

    // ---------------- Parse Response ----------------
    const parseDomains = () => {
        if (!aiResponse) return [];

        const blocks = aiResponse
            .split("=== BLOCK START ===")
            .filter(Boolean)
            .map(b => b.replace("=== BLOCK END ===", "").trim());

        return blocks.map(block => {
            const get = (key) => {
                const match = block.match(new RegExp(`${key}:\\s*(.*)`, "i"));
                return match ? match[1].trim() : "";
            };

            return {
                name: get("Brand Name"),
                tagline: get("Tagline"),
                valueProposition: get("Value Proposition"),
                targetAudience: get("Target Audience"),
                brandTone: get("Brand Tone"),
                metaTitle: get("SEO Title"),
                metaDesc: get("SEO Description"),
                domainIdeas: get("Domain Ideas")?.split(",").map(d => d.trim()) || [],
            };
        });
    };
    const handleCopy = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            alert("Copy failed. Please copy manually.");
        }
    };

    const handleBookmark = async (block) => {
        if (!user?.sub) {
            alert("Please login to bookmark domains.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/bookmarks", {
                userId: user.sub,

                domainName: block.name,

                tagline: block.tagline,
                valueProposition: block.valueProposition,
                targetAudience: block.targetAudience,
                brandTone: block.brandTone,

                metaTitle: block.metaTitle,
                metaDesc: block.metaDesc,

                domainIdeas: block.domainIdeas || []
            });

            alert("Domain bookmarked successfully!");

        } catch (error) {
            const msg = error?.response?.data?.message;

            if (msg === "Already bookmarked") {
                alert("⚠️ Already bookmarked");
                return;
            }

            console.error("Bookmark error:", error);
            alert("Bookmark failed.");
        }
    };

    //---chips topics///
    const createTemplate = (role, context) => (data) => `
            You are a WORLD-CLASS ${role}.

            Generate 5 brand concepts.

            CONTEXT:
            ${context(data)}

            ${baseOutputFormat}
        `;


    //Form custom style:
    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: '#0d1117',
            borderColor: state.isFocused ? '#6366f1' : 'rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '6px',
            boxShadow: 'none',
            '&:hover': { borderColor: 'rgba(255,255,255,0.2)' }
        }),
        singleValue: (base) => ({ ...base, color: 'white', fontSize: '14px' }),
        menu: (base) => ({ ...base, backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#6366f1' : 'transparent',
            color: 'white',
            fontSize: '13px',
            '&:active': { backgroundColor: '#4f46e5' }
        })
    };

    const multiSelectStyles = {
        ...customSelectStyles,
        multiValue: (base) => ({ ...base, backgroundColor: '#6366f1', borderRadius: '6px' }),
        multiValueLabel: (base) => ({ ...base, color: 'white', fontWeight: 'bold', fontSize: '11px' }),
        multiValueRemove: (base) => ({ ...base, color: 'white', '&:hover': { backgroundColor: '#4f46e5', color: 'white' } })
    };

    //Preview handle close
    useEffect(() => {
        if (previewDomainData) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function: Ensures scroll is restored if the component 
        // crashes or unmounts while the modal is open.
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [previewDomainData]);

    // ---------------- UI ----------------
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-6">
            <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-10 space-y-10 shadow-xl">

                {/* Header */}

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    <div className="space-y-3">

                        <h1 className="text-4xl font-bold tracking-tight">

                            🚀 Launch Agent

                        </h1>

                        <p className="text-slate-400">

                            Turn ideas into validated brands, naming systems & launch strategies instantly.

                        </p>

                    </div>



                    {/* Toggle Switch */}

                    <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">

                        <button

                            onClick={() => setUsePromptMode(false)}

                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!usePromptMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}

                        >

                            Builder Mode

                        </button>

                        <button

                            onClick={() => setUsePromptMode(true)}

                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${usePromptMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}

                        >

                            Explorer Mode

                        </button>

                    </div>

                </div>


                {/* Form Section */}
                {!usePromptMode ? (
                    <div className="grid md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* LEFT COLUMN: PRIMARY DEFINITION */}
                        <div className="space-y-8">
                            <div className="relative group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-6 w-1 bg-indigo-500 rounded-full"></div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Identity Core</h3>
                                </div>

                                <div className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm">
                                    {/* Project Name */}
                                    <div>
                                        <label className="block text-[10px] font-bold mb-3 text-slate-400 uppercase tracking-widest">Launch Identifier *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. EduSync"
                                            value={projectTitle}
                                            onChange={(e) => setProjectTitle(e.target.value)}
                                            className="w-full bg-[#0d1117] border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-[10px] font-bold mb-3 text-slate-400 uppercase tracking-widest">Neural Mission Brief *</label>
                                        <textarea
                                            rows="5"
                                            placeholder="Describe the problem you're solving and the agentic solution..."
                                            value={projectDescription}
                                            onChange={(e) => setProjectDescription(e.target.value)}
                                            className="w-full bg-[#0d1117] border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none resize-none leading-relaxed"
                                        />
                                    </div>

                                    {/* Industry Selection */}
                                    <div>
                                        <label className="block text-[10px] font-bold mb-3 text-slate-400 uppercase tracking-widest">Domain Sector *</label>
                                        <Select
                                            options={industries}
                                            value={selectedIndustry}
                                            onChange={setSelectedIndustry}
                                            placeholder="Select Industry Sector"
                                            styles={customSelectStyles}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: TECHNICAL SIGNALS */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-6 w-1 bg-cyan-500 rounded-full"></div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Signal Parameters</h3>
                            </div>

                            <div className="space-y-8 bg-white/[0.02] border border-white/5 p-8 rounded-[2rem]">

                                {/* Core & Market Signals Combined Grid */}
                                <div className="grid gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold mb-3 text-slate-400 uppercase tracking-widest flex justify-between">
                                            Primary Keywords <span>(Target Core)</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {primaryKeywords.map((k, i) => (
                                                <input
                                                    key={i}
                                                    type="text"
                                                    placeholder={`#${i + 1}`}
                                                    value={k}
                                                    onChange={(e) => {
                                                        const updated = [...primaryKeywords];
                                                        updated[i] = e.target.value;
                                                        setPrimaryKeywords(updated);
                                                    }}
                                                    className="bg-[#0d1117] border border-white/10 rounded-xl p-3 text-xs text-indigo-300 focus:border-indigo-500 outline-none transition-all"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold mb-3 text-slate-400 uppercase tracking-widest flex justify-between">
                                            Secondary Inputs <span>(Context)</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {secondaryKeywords.map((k, i) => (
                                                <input
                                                    key={i}
                                                    type="text"
                                                    placeholder={`+`}
                                                    value={k}
                                                    onChange={(e) => {
                                                        const updated = [...secondaryKeywords];
                                                        updated[i] = e.target.value;
                                                        setSecondaryKeywords(updated);
                                                    }}
                                                    className="bg-[#0d1117] border border-white/10 rounded-xl p-3 text-xs text-cyan-300/70 focus:border-cyan-500 outline-none transition-all"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Domain Configuration */}
                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Naming Protocols</label>
                                        <button
                                            onClick={() => setShowCustomTLD(!showCustomTLD)}
                                            className="text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-tighter px-3 py-1 bg-indigo-500/10 rounded-full transition-all"
                                        >
                                            {showCustomTLD ? "Standard Lists" : "Manual Override"}
                                        </button>
                                    </div>

                                    {!showCustomTLD ? (
                                        <Select
                                            isMulti
                                            options={extensions}
                                            value={selectedExtensions}
                                            onChange={setSelectedExtensions}
                                            placeholder="Target TLDs..."
                                            styles={multiSelectStyles}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder=".ai, .dev, .io"
                                            value={customTLD}
                                            onChange={(e) => setCustomTLD(e.target.value)}
                                            className="w-full bg-[#0d1117] border border-indigo-500/30 rounded-2xl p-4 text-indigo-400 placeholder-indigo-900/50 outline-none"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* AI Assistant Hint */}
                            <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-4">
                                <span className="text-xl">💡</span>
                                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                    The engine uses these signals to generate the <span className="text-indigo-400 font-bold">Neural Identity</span>. For best results, use at least one technical and one lifestyle keyword.
                                </p>
                            </div>
                        </div>
                    </div>
                )

                    : <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                        {/* 1. CONFIGURATION LAYER: Blueprint Selection */}
                        <div className="relative overflow-hidden p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
                            <div className="relative flex flex-col gap-6 p-6 bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-[23px]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                            <Sparkles size={18} className="text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Project Blueprints</h3>
                                            <p className="text-[10px] text-slate-500 font-medium">Select a specialized neural framework</p>
                                        </div>
                                    </div>
                                    {activeTemplate && (
                                        <span className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-tighter">
                                            Template Active
                                        </span>
                                    )}
                                </div>

                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedTemplate(value);
                                        setActiveTemplate(value);
                                        setTemplateData({});
                                    }}
                                    className="w-full bg-[#0d1117] border border-white/5 rounded-xl p-4 text-sm text-slate-300 focus:border-indigo-500/50 transition-all outline-none appearance-none cursor-pointer hover:bg-[#161b22]"
                                >
                                    <option value="">Standard Mode (Freeform Engine)</option>
                                    {Object.entries(promptTemplates).map(([key, tpl]) => (
                                        <option key={key} value={key}>{tpl.title}</option>
                                    ))}
                                </select>

                                {activeTemplate && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-500">
                                        {promptTemplates[activeTemplate].fields.map((field) => (
                                            <div key={field.key} className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">{field.key}</label>
                                                <input
                                                    type="text"
                                                    placeholder={field.placeholder}
                                                    value={templateData[field.key] || ""}
                                                    onChange={(e) => setTemplateData({ ...templateData, [field.key]: e.target.value })}
                                                    className="w-full bg-[#0d1117] border border-white/5 rounded-xl p-3 text-xs text-slate-400 focus:ring-1 focus:ring-indigo-500/50 focus:bg-[#161b22] outline-none transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. COMMAND INPUT: The Core Engine */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-indigo-500/20 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>

                            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                                {!showImproved ? (
                                    <div className="flex flex-col">
                                        <textarea
                                            rows="7"
                                            maxLength={1500}
                                            placeholder="Define your vision, problem space, and target audience..."
                                            value={simplePrompt}
                                            onChange={(e) => setSimplePrompt(e.target.value)}
                                            className="w-full bg-transparent p-10 text-xl text-white placeholder-slate-700 focus:outline-none resize-none leading-relaxed font-light tracking-tight"
                                        />

                                        <div className="flex items-center justify-between px-10 py-6 bg-white/[0.01] border-t border-white/5">
                                            <div className="flex items-center gap-6">
                                                <button
                                                    onClick={isRecording ? stopRecording : startRecording}
                                                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all border ${isRecording
                                                        ? "bg-red-500/10 border-red-500/50 text-red-500 animate-pulse"
                                                        : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300"
                                                        }`}
                                                >
                                                    <Mic size={14} /> {isRecording ? "Neural Link Active" : "Voice Command"}
                                                </button>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
                                                        Capacity: {Math.round((simplePrompt.length / 1500) * 100)}%
                                                    </span>
                                                    <div className="w-20 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                                        <div
                                                            className="h-full bg-indigo-500 transition-all duration-500"
                                                            style={{ width: `${(simplePrompt.length / 1500) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={enhancePromptWithAI}
                                                className="group relative flex items-center gap-3 px-8 py-3.5 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 active:scale-95"
                                            >
                                                <Sparkles size={16} className="transition-transform group-hover:rotate-12" />
                                                Optimize Logic
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-10 space-y-8 bg-[#0a0c10] animate-in slide-in-from-right-4 duration-500">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <div className="h-1 w-1 rounded-full bg-indigo-400 animate-ping"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Optimization Complete</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Source Input</label>
                                                <textarea
                                                    value={simplePrompt}
                                                    onChange={(e) => setSimplePrompt(e.target.value)}
                                                    className="w-full bg-[#0d1117] border border-white/5 rounded-2xl p-6 text-sm text-slate-500 outline-none leading-relaxed"
                                                    rows="6"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Neural Output</label>
                                                <textarea
                                                    value={improvedPrompt}
                                                    onChange={(e) => setImprovedPrompt(e.target.value)}
                                                    className="w-full bg-indigo-500/[0.03] border border-indigo-500/30 rounded-2xl p-6 text-sm text-white outline-none leading-relaxed shadow-inner"
                                                    rows="6"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end items-center gap-6">
                                            <button onClick={() => setShowImproved(false)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Discard Analysis</button>
                                            <button
                                                onClick={() => { setSimplePrompt(improvedPrompt); setShowImproved(false); }}
                                                className="bg-indigo-600 px-10 py-4 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                                            >
                                                Apply Optimization
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. CONTEXTUAL NODES: Suggestions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] whitespace-nowrap">Inspiration Nodes</span>
                                <div className="h-px w-full bg-white/5"></div>
                                <button
                                    onClick={() => setShowAllChips(prev => !prev)}
                                    className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter hover:text-indigo-300 transition-colors"
                                >
                                    {showAllChips ? "Minimize" : "Expand"}
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {visibleChips.map((example, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSimplePrompt(example)}
                                        className="px-5 py-2.5 text-[11px] font-bold text-slate-400 bg-white/[0.02] hover:bg-indigo-500 hover:text-white border border-white/5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>

                            {promptHistory.length > 0 && (
                                <div className="pt-8 border-t border-white/5 flex items-start gap-8">
                                    <div className="flex-shrink-0">
                                        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] vertical-text">History</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {promptHistory.slice(0, 3).map((p, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSimplePrompt(p?.prompt || "")}
                                                className="group flex items-center gap-3 px-4 py-2 bg-transparent border border-white/5 rounded-lg hover:border-indigo-500/50 transition-all"
                                            >
                                                <div className="w-1 h-1 rounded-full bg-slate-800 group-hover:bg-indigo-500"></div>
                                                <span className="text-[10px] text-slate-500 font-medium tracking-tight">
                                                    {(p?.prompt || "").slice(0, 40)}...
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. SYSTEM ADVISORY */}
                        <div className="relative p-5 bg-[#0d1117] border border-white/5 rounded-[1.5rem] overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all duration-1000"></div>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="mt-1">
                                    <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse"></div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                        <span className="text-white font-black uppercase tracking-widest mr-2 text-[9px]">Neural Advisory:</span>
                                        Incorporate specific tone parameters (e.g. <span className="text-indigo-300">"Modern Minimalist"</span>) to calibrate the visual output layer.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>}

                {/* Generate Button */}
                <div className="text-center pt-4">
                    <div className="text-center pt-8 pb-12 relative">
                        {/* Ambient Glow background */}
                        <div className={`absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full transition-opacity duration-1000 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>

                        <button
                            onClick={async () => {
                                setShowImproved(false);

                                const promptToSave = usePromptMode
                                    ? (simplePrompt.trim() || "")
                                    : "";

                                await handleGenerate();

                                if (usePromptMode && promptToSave) {
                                    await savePromptToHistory(promptToSave);
                                }
                            }}
                            disabled={loading}
                            className="group relative bg-white text-black hover:bg-indigo-600 hover:text-white px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl active:scale-95 overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin group-hover:border-white/20 group-hover:border-t-white"></div>
                                        <span>Architecting Strategy...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap size={16} className="transition-transform group-hover:scale-125 group-hover:rotate-12" />
                                        <span>Initialize Launch Sequence</span>
                                    </>
                                )}
                            </div>

                            {/* SaaS-style Button Glare */}
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shine" />
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {loading && (
                        <div className="text-center text-slate-400">
                            Generating smart suggestions...
                        </div>
                    )}

                    <div className="space-y-10">
                        {/* Loading State: Neural Analysis */}
                        {loading && (
                            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-72 bg-white/[0.03] border border-white/5 rounded-[2.5rem] animate-pulse"></div>
                                ))}
                            </div>
                        )}

                        {/* Empty State: System Standby */}
                        {!loading && parseDomains().length === 0 && (
                            <div className="text-center py-24 border border-dashed border-white/10 rounded-[3rem] bg-[#0a0a0a]/50 backdrop-blur-sm">
                                <div className="inline-flex p-5 bg-indigo-500/5 rounded-2xl mb-6 text-indigo-500/50">
                                    <Box size={40} strokeWidth={1} />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Registry Standby</p>
                                <p className="text-slate-600 text-xs mt-3 max-w-xs mx-auto leading-relaxed font-medium">
                                    {usePromptMode ? "Input neural directives" : "Configure blueprint fields"} to initialize brand generation.
                                </p>
                            </div>
                        )}

                        {/* Results Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {parseDomains().map((block, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-[#0d1117] border border-white/5 rounded-[2.5rem] p-8 space-y-6 transition-all duration-500 hover:border-indigo-500/40 hover:bg-[#11161d] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
                                >
                                    {/* Identifier Header */}
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md uppercase tracking-widest">Protocol 0{index + 1}</span>
                                                {availabilityStatus[index] === "available" && (
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse"></div>
                                                )}
                                            </div>
                                            <h3 className="text-4xl font-black text-white tracking-tighter italic leading-none">
                                                {block.name}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => handleBookmark(block)}
                                            className="p-3 bg-white/5 hover:bg-pink-500/10 rounded-2xl text-slate-500 hover:text-pink-500 transition-all border border-transparent hover:border-pink-500/20"
                                        >
                                            <Heart size={20} fill={block.isSaved ? "currentColor" : "none"} />
                                        </button>
                                    </div>

                                    {/* Intelligence Points */}
                                    <div className="space-y-5 pt-5 border-t border-white/5">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Strategic Narrative</span>
                                            <p className="text-sm text-slate-300 font-medium italic leading-relaxed">"{block.tagline}"</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Search Authority</span>
                                                <p className="text-xs text-indigo-100 font-bold">{block.metaTitle}</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Market Brief</span>
                                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium line-clamp-2">{block.metaDesc}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Command Dock */}
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <button
                                            onClick={() => checkAvailability(block.name, index)}
                                            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg shadow-emerald-900/10"
                                        >
                                            <Search size={14} /> Validate
                                        </button>
                                        <button
                                            onClick={() => setPreviewDomainData(block)}
                                            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg shadow-indigo-900/10"
                                        >
                                            <Eye size={14} /> Preview
                                        </button>
                                        <button
                                            onClick={() => handleCopy(block.name, index)}
                                            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#161b22] hover:bg-[#1c222b] text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border border-white/5"
                                        >
                                            {copiedIndex === index ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                            {copiedIndex === index ? "Synced" : "Copy Name"}
                                        </button>
                                        <button
                                            onClick={() => exportSingleMD(block)}
                                            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#161b22] hover:bg-[#1c222b] text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all border border-white/5"
                                        >
                                            <FileText size={14} /> Export Brief
                                        </button>
                                    </div>

                                    {/* Network Status Feedback */}
                                    {availabilityStatus[index] && (
                                        <div className={`mt-2 flex items-center gap-3 px-4 py-3 rounded-xl border animate-in slide-in-from-top-2 duration-300 ${availabilityStatus[index] === "available" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" :
                                            availabilityStatus[index] === "taken" ? "bg-red-500/5 border-red-500/20 text-red-400" :
                                                "bg-yellow-500/5 border-yellow-500/20 text-yellow-400"
                                            }`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${availabilityStatus[index] === "available" ? "bg-emerald-500 animate-pulse" :
                                                availabilityStatus[index] === "taken" ? "bg-red-500" : "bg-yellow-500"
                                                }`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                                {availabilityStatus[index] === "loading" && "Awaiting Registry Handshake..."}
                                                {availabilityStatus[index] === "available" && "Identity Available"}
                                                {availabilityStatus[index] === "taken" && "Identity Occupied"}
                                                {availabilityStatus[index] === "error" && "Validation Protocol Failure"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* High-Fidelity Preview Overlay */}
                {previewDomainData && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
                        onKeyDown={(e) => e.key === 'Escape' && setPreviewDomainData(null)}
                        tabIndex="0" // Makes the div focusable to capture Escape key
                    >
                        {/* Backdrop Trigger: Click anywhere outside the modal to close */}
                        <div
                            className="absolute inset-0 bg-[#050505]/85 backdrop-blur-xl cursor-zoom-out"
                            onClick={() => setPreviewDomainData(null)}
                            aria-hidden="true"
                        />

                        {/* Modal Container */}
                        <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 overflow-hidden">

                            {/* Top Command Bar: Floating Close Button */}
                            <div className="absolute top-6 right-6 z-[110]">
                                <button
                                    onClick={() => setPreviewDomainData(null)}
                                    className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full border border-white/5 transition-all active:scale-90"
                                    title="Close Preview (Esc)"
                                >
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Neural Progress Indicator (Static/Decoration) */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                            {/* Scrollable Content Area */}
                            <div className="h-full overflow-y-auto custom-scrollbar p-1">
                                <FakeDomainPreview
                                    domainData={previewDomainData}
                                    onClose={() => setPreviewDomainData(null)}
                                />
                            </div>

                            {/* Hint for Power Users */}
                            <div className="absolute bottom-4 right-8 pointer-events-none">
                                <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]">
                                    Press <span className="text-slate-500">ESC</span> to exit
                                </span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default DomainAI;