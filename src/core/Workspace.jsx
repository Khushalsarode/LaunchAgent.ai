import React, { useEffect, useState, useCallback, useRef } from "react"; // Added useCallback
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  LayoutDashboard, CheckCircle2, Circle, DownloadCloud, ChevronRight, Cpu, CloudSync, CloudCheck
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  initializeProjectIdentity,
  createDynamicProof,
  verifyLocalData
} from "../assets/solanaSetup";

// Components
import ProjectStrategy from "./ProjectStrategy";
import VisualIdentity from "./VisualIdentity";
import ContentLibrary from "./LaunchContent";
import Roadmap from "./Roadmap";
import MVPPreview from "./MVPPreview";
import DocGenerator from "./DocGenerator";
import ImagenForge from "./ImagenForge";
import SolanaVault from "./SolanaVault";
import TechnicalDoc from "./TechnicalDoc";

const Workspace = () => {
  // --- 1. ALL HOOKS MUST BE AT THE TOP ---
  const { user, isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("strategy");
  const [syncStatus, setSyncStatus] = useState("synced");

  const [connection, setConnection] = useState(null);
  const [myKeypair, setMyKeypair] = useState(null);

  const [generations, setGenerations] = useState({
    strategy: null, branding: null, content: null, docs: null,
    roadmap: null, mvp: null, doc: null, asset: null,
  });

  const handshakeStarted = useRef(false);

  useEffect(() => {
    const setupSolana = async () => {
      if (!isAuthenticated || connection || handshakeStarted.current) return;

      handshakeStarted.current = true; // LOCK
      try {
        const result = await initializeProjectIdentity();
        if (result) {
          setConnection(result.connection);
          setMyKeypair(result.myProjectKeypair);
        }
      } catch (err) {
        console.error("Setup Error", err);
        handshakeStarted.current = false; // UNLOCK on error
      }
    };
    setupSolana();
  }, [isAuthenticated, connection]);

  // Define saveToCloud with useCallback so it's stable
  const saveToCloud = useCallback(async (updatedGenerations) => {
    if (!project || !user) return;

    setSyncStatus("saving");
    try {
      await axios.post("http://localhost:5000/api/workspace/save", {
        userId: user.sub,
        domainName: project.domainName,
        // Map the Bookmark data here
        projectContext: {
          tagline: project.tagline,
          valueProposition: project.valueProposition,
          targetAudience: project.targetAudience,
          brandTone: project.brandTone,
          metaTitle: project.metaTitle,
          metaDesc: project.metaDesc,
          domainIdeas: project.domainIdeas
        },
        generations: updatedGenerations,
        lastUpdated: new Date()
      });
      setSyncStatus("synced");
    } catch (err) {
      setSyncStatus("error");
      console.error("Cloud Sync Failed:", err);
    }
  }, [project, user]);

  // Hook for initial load
  useEffect(() => {
    const initializeWorkspace = async () => {
      const stateData = location.state?.data;
      if (!stateData) {
        navigate("/bookmarks");
        return;
      }
      setProject(stateData);

      if (user?.sub) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/workspace/${user.sub}/${encodeURIComponent(stateData.domainName)}`
          );
          if (response.data) {
            setGenerations(response.data.generations);
          }
        } catch (err) {
          console.log("No previous cloud data found.");
        }
      }
    };

    if (!isLoading && isAuthenticated) {
      initializeWorkspace();
    }
  }, [location.state, navigate, user, isAuthenticated, isLoading]);

  // --- 2. EARLY RETURNS AFTER ALL HOOKS ---

  if (isLoading) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-cyan-500 animate-pulse font-black tracking-widest text-xs">
          VERIFYING NEURAL CREDENTIALS...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-slate-500 font-mono uppercase tracking-widest animate-pulse">
        Synchronizing Neural Link...
      </div>
    );
  }

  // --- 3. HELPER FUNCTIONS ---

  // Inside Workspace.jsx helper functions
  const updateGeneration = (tabId, data) => {
    setGenerations((prev) => {
      let updatedValue = data;

      // Logic for blockchain: We use 'blockchainProof' to match your tab data
      if (tabId === "blockchainProof") {
        updatedValue = {
          ...data,
          // We can store a history if we want, or just the latest
          lastVerified: new Date().toISOString()
        };
      }

      const newGenerations = { ...prev, [tabId]: updatedValue };
      saveToCloud(newGenerations);
      return newGenerations;
    });
  };

  const exportToZip = async () => {
    if (!project) return;
    const zip = new JSZip();
    const projectName = project.domainName.replace(/\s+/g, '_');
    const root = zip.folder(`${projectName}_Deployment_Package`);

    // --- 1. PROJECT IDENTITY & BRAND CORE (From Bookmark Data) ---
    const identity = root.folder("00_Project_Identity");
    identity.file("Brand_Core.md", `
# Brand Identity: ${project.domainName}
**Tagline:** ${project.tagline}
**Value Proposition:** ${project.valueProposition}

### Marketing & SEO Context
- **Meta Title:** ${project.metaTitle}
- **Meta Description:** ${project.metaDesc}

### Target Profile
- **Audience:** ${project.targetAudience}
- **Tone of Voice:** ${project.brandTone}

### Proposed Domains
${project.domainIdeas?.map(id => `- ${id}`).join('\n') || "- No domains listed"}

---
*Generated via LaunchAgent Terminal v2*
  `);

    // --- 2. SYSTEM MANIFEST ---
    root.file("00_SYSTEM_MANIFEST.md", `
# ${project.domainName} - Project Manifest
**Mission:** ${project.tagline}
**Export ID:** ${user?.sub || 'anonymous'}
**Timestamp:** ${new Date().toLocaleString()}

## Deployment Status
- Intelligence: ${generations.strategy ? "✅ COMPLETE" : "❌ PENDING"}
- Visual ID: ${generations.branding ? "✅ COMPLETE" : "❌ PENDING"}
- Core Tech Docs: ${generations.docs ? "✅ COMPLETE" : "❌ PENDING"}
- Prototype/MVP: ${generations.mvp ? "✅ COMPLETE" : "❌ PENDING"}
  `);

    // --- 3. AI GENERATIONS (Intelligence / Strategy) ---
    if (generations.strategy) {
      const intel = root.folder("01_Intelligence");
      intel.file("Market_Strategy.md", `# Market Intelligence\n\n${generations.strategy.analysis || generations.strategy || ''}`);
    }

    // --- 4. VISUAL IDENTITY ---
    if (generations.branding) {
      const visuals = root.folder("02_Visual_Identity");
      visuals.file("Brand_Specs.json", JSON.stringify(generations.branding, null, 2));
      if (generations.branding.palette) {
        visuals.file("Color_Palette.md", `# Brand Colors\n\n${JSON.stringify(generations.branding.palette)}`);
      }
    }

    // --- 5. CAMPAIGN & CONTENT ---
    if (generations.content) {
      const content = root.folder("03_Marketing_Campaign");
      content.file("Launch_Content.md", `# Campaign Assets\n\n${generations.content.copy || JSON.stringify(generations.content)}`);
    }

    // --- 6. CORE TECH & GOVERNANCE ---
    if (generations.docs || generations.doc) {
      const docs = root.folder("04_Documentation");
      const techData = generations.docs || generations.doc;
      docs.file("Technical_Specifications.md", typeof techData === 'string' ? techData : JSON.stringify(techData, null, 2));
    }

    // --- 7. DEPLOYMENT ROADMAP ---
    if (generations.roadmap) {
      const roadmap = root.folder("05_Deployment_Roadmap");
      roadmap.file("Execution_Plan.md", `# Roadmap\n\n${JSON.stringify(generations.roadmap, null, 2)}`);
    }

    // --- 8. PROTOTYPE / MVP PREVIEW ---
    if (generations.mvp) {
      const mvp = root.folder("06_MVP_Prototype");
      mvp.file("MVP_Logic.jsx", generations.mvp.code || generations.mvp);
      mvp.file("Architecture_Notes.md", `Built for domain: ${project.domainName}`);
    }

    // --- 9. ASSET FORGE (ImagenForge) ---
    if (generations.asset) {
      const assets = root.folder("07_Generated_Assets");
      assets.file("Asset_Metadata.json", JSON.stringify(generations.asset, null, 2));
      // If you have base64 images in generations.asset, you could technically add them here
    }

    //10. BLOCKCHAIN PROOF
    if (generations.blockchainProof) {
      const vault = root.folder("08_Blockchain_Verification");
      vault.file("SOLANA_RECEIPT.json", JSON.stringify(generations.blockchainProof, null, 2));
      vault.file("PROOF_README.md", `
# On-Chain Originality Proof
**Project:** ${project.domainName}
**Fingerprint:** ${generations.blockchainProof.fingerprint}
**Transaction:** ${generations.blockchainProof.signature}
**Network:** Solana Devnet

Verify this fingerprint against the project manifest to ensure authenticity.
  `);
    }

    // --- FINAL GENERATION & DOWNLOAD ---
    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${projectName}_Full_Context_Export.zip`);
    } catch (err) {
      console.error("ZIP Generation Failed:", err);
      alert("Failed to generate deployment package.");
    }
  };
  const menuItems = [
    { id: "strategy", label: "Intelligence", icon: "🎯" },
    { id: "branding", label: "Visual ID", icon: "🎨" },
    { id: "content", label: "Campaign", icon: "📢" },
    { id: "docs", label: "Core Tech", icon: "📄" },
    { id: "roadmap", label: "Deployment", icon: "🚀" },
    { id: "mvp", label: "Prototype", icon: "🌐" },
    { id: "doc", label: "Governance", icon: "⚖️" },
    // Changed id to match the state key 'blockchainProof' for the checkmark logic
    { id: "blockchainProof", label: "Solana Vault", icon: "⛓️", tab: "solanavault" },
    { id: "asset", label: "Asset Forge", icon: "✨" },
  ];

  // --- 4. RENDER JSX ---

  return (
    <div className="flex h-screen w-full bg-[#050505] text-slate-200 overflow-hidden font-sans">
      <aside className="w-80 flex-shrink-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={14} className="text-cyan-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">LaunchAgent Terminal v2</span>
          </div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter truncate">
            {project.domainName}
          </h2>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              // Use item.tab if it exists (for Solana), otherwise use item.id
              onClick={() => setActiveTab(item.tab || item.id)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${activeTab === (item.tab || item.id)
                ? "bg-[#161b22] text-cyan-400 border-cyan-500/30"
                : "text-slate-400 border-transparent hover:bg-white/5"
                }`}
            >
              <div className="flex items-center gap-4">
                <span>{item.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {/* This now correctly checks if blockchainProof exists */}
              {generations[item.id] ? <CheckCircle2 size={14} className="text-cyan-500" /> : <Circle size={14} className="opacity-10" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {syncStatus === "saving" ? <CloudSync size={14} className="text-yellow-500 animate-spin" /> : <CloudCheck size={14} className="text-emerald-500" />}
              <span className="text-[9px] font-black uppercase text-slate-500">
                {syncStatus === "saving" ? "Syncing..." : "Cloud Secure"}
              </span>
            </div>
            <span className="text-[9px] text-slate-600 font-bold uppercase">{user.nickname}</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto bg-[#050505]">
        <div className="max-w-5xl mx-auto p-16 space-y-12">
          <header className="flex justify-between items-end border-b border-white/5 pb-10">
            <h2 className="text-5xl font-black text-white capitalize italic tracking-tighter">{activeTab}</h2>
            <button onClick={exportToZip} className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest">
              <DownloadCloud size={16} className="inline mr-2" /> Deploy Manifest
            </button>
          </header>
          <section>
            {activeTab === "strategy" && <ProjectStrategy project={project} data={generations.strategy} onUpdate={(d) => updateGeneration("strategy", d)} />}
            {activeTab === "branding" && <VisualIdentity project={project} data={generations.branding} onUpdate={(d) => updateGeneration("branding", d)} />}
            {activeTab === "content" && <ContentLibrary project={project} data={generations.content} onUpdate={(d) => updateGeneration("content", d)} />}
            {activeTab === "asset" && <ImagenForge project={project} data={generations.asset} onUpdate={(d) => updateGeneration("asset", d)} />}
            {activeTab === "docs" && <TechnicalDoc project={project} data={generations.docs} onUpdate={(d) => updateGeneration("docs", d)} />}
            {activeTab === "roadmap" && <Roadmap project={project} data={generations.roadmap} onUpdate={(d) => updateGeneration("roadmap", d)} />}
            {activeTab === "mvp" && <MVPPreview project={project} data={generations.mvp} onUpdate={(d) => updateGeneration("mvp", d)} />}
            {activeTab === "doc" && <DocGenerator project={project} data={generations.doc} onUpdate={(d) => updateGeneration("doc", d)} />}

            {activeTab === "solanavault" && (
              <div className="max-w-md mx-auto">
                {connection && myKeypair ? (
                  <SolanaVault
                    project={project}
                    connection={connection}
                    myKeypair={myKeypair}
                    onUpdate={(data) => updateGeneration("blockchainProof", data)}
                    existingProof={generations.blockchainProof}
                  />
                ) : (
                  <div className="text-center p-10 border border-white/5 rounded-2xl bg-white/[0.02]">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                      Establishing Neural Handshake...
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Workspace;