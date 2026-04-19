import React, { useState } from "react";
import {
  Search,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Calendar,
  Server,
  User,
  ArrowRight,
  ExternalLink,
  Loader2,
  Info,
  Clock,
  Activity,
  AlertCircle
} from "lucide-react";

const DomainStatus = () => {
  const [domainName, setDomainName] = useState("");
  const [domainInfo, setDomainInfo] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_DOMAIN_CHECK_KEY;

  const normalize = (d) => d.trim().toLowerCase().replace(/^https?:\/\//, "");
  const isValid = (d) => /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(d);

  const fetchDomainInfo = async () => {
    const clean = normalize(domainName);
    setError("");
    setDomainInfo(null);

    if (!clean || !isValid(clean)) {
      setError("Enter valid domain (example: google.com)");
      return;
    }

    try {
      setStatus("loading");

      const res = await fetch(
        `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${API_KEY}&domainName=${clean}&outputFormat=json`
      );

      const data = await res.json();

      // Logic based on the provided Python script
      if (data.ErrorMessage) {
        setStatus("available");
        setDomainInfo(null);
        return;
      }

      const whois = data?.WhoisRecord;

      // If the registrar name exists, the domain is taken
      if (whois && whois.registrarName) {
        setStatus("taken");
        setDomainInfo(whois);
      } else {
        setStatus("available");
        setDomainInfo(null);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Scanner offline. Check API key or connection.");
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : "N/A";

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-2 pt-10">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <Activity size={14} /> Real-time Network Scan
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic">
            Whois<span className="text-indigo-500">Intel</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em]">
            Global Domain Registry & Telemetry
          </p>
        </div>

        {/* INPUT SECTION */}
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
          <div className="relative flex gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
            <input
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="brandname.com"
              className="flex-1 bg-transparent border-none p-4 text-white focus:ring-0 text-lg placeholder:text-slate-600"
              onKeyDown={(e) => e.key === "Enter" && fetchDomainInfo()}
            />
            <button
              onClick={fetchDomainInfo}
              disabled={status === "loading"}
              className="bg-indigo-600 hover:bg-indigo-500 px-8 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              {status === "loading" ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              {status === "loading" ? "Scanning..." : "Search"}
            </button>
          </div>
          {error && <div className="absolute -bottom-6 left-2 text-red-400 text-xs font-bold">{error}</div>}
        </div>

        {/* RESULTS AREA */}
        <div className="pt-6">
          {/* AVAILABLE STATE */}
          {status === "available" && (
            <div className="animate-in zoom-in-95 duration-300 space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-6 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]">
                <div className="p-4 bg-emerald-500/20 rounded-full">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-white tracking-tighter">{domainName}</h2>
                  <p className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em]">
                    Unclaimed Territory
                  </p>
                </div>

                <div className="w-full max-w-md grid grid-cols-1 gap-3 pt-4">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">
                    Secure ownership via trusted registrars:
                  </p>
                  {/* We reuse your BuyLinks logic here for consistency */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { name: "GoDaddy", url: `https://www.godaddy.com/domainsearch/find?domainToCheck=${domainName}`, color: "hover:bg-[#00a63f]" },
                      { name: "Namecheap", url: `https://www.namecheap.com/domains/registration/results/?domain=${domainName}`, color: "hover:bg-[#de3723]" },
                      { name: "Porkbun", url: `https://porkbun.com/checkout/search?q=${domainName}`, color: "hover:bg-[#f34647]" },
                    ].map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 border border-slate-800 rounded-2xl transition-all hover:scale-105 active:scale-95 group ${r.color}`}
                      >
                        <ExternalLink size={14} className="text-slate-500 group-hover:text-white" />
                        <span className="text-[10px] font-black uppercase tracking-tighter group-hover:text-white">{r.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAKEN STATE */}
          {status === "taken" && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {/* SUMMARY BAR */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-red-500">
                <div className="flex items-center gap-4">
                  <XCircle className="text-red-500" size={32} />
                  <div>
                    <h2 className="text-xl font-bold text-white">{domainName}</h2>
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-tighter">Status: Registered / Not Available</p>
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Registrar ID</p>
                  <p className="text-white font-mono">{domainInfo?.registrarIANAID || "N/A"}</p>
                </div>
              </div>

              {/* DATA GRID */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard
                  title="Registry Info"
                  icon={<Info size={16} className="text-indigo-400" />}
                  items={[
                    ["Registrar", domainInfo?.registrarName],
                    ["Age", `${domainInfo?.estimatedDomainAge || 0} days`],
                    ["Raw Status", domainInfo?.status?.split(' ')[0] || "Active"],
                  ]}
                />

                <InfoCard
                  title="Owner Details"
                  icon={<User size={16} className="text-purple-400" />}
                  items={[
                    ["Org", domainInfo?.registryData?.registrant?.organization || "Protected"],
                    ["Country", domainInfo?.registryData?.registrant?.country || "Private"],
                    ["Privacy", "WHOIS Shield Active"],
                  ]}
                />

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest border-b border-slate-800 pb-3">
                    <Server size={16} /> Nameservers
                  </div>
                  <div className="space-y-2">
                    {domainInfo?.registryData?.nameServers?.hostNames?.slice(0, 3).map((ns, i) => (
                      <div key={i} className="text-[11px] font-mono text-slate-400 bg-slate-800/50 p-2 rounded border border-slate-700/50 truncate">
                        {ns}
                      </div>
                    )) || <p className="text-slate-600 text-xs italic">No server data visible</p>}
                  </div>
                </div>
              </div>

              {/* DATES & BUYING */}
              <div className="grid md:grid-cols-2 gap-6">
                <TimelineCard info={domainInfo} />
                <BuyLinks domain={domainName} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- COMPONENT HELPERS --- */

const InfoCard = ({ title, icon, items }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 transition-all hover:border-slate-700">
    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest border-b border-slate-800 pb-3">
      {icon} {title}
    </div>
    {items.map(([k, v], i) => (
      <div key={i} className="flex justify-between items-center text-sm">
        <span className="text-slate-500 font-medium">{k}</span>
        <span className="text-slate-200 font-bold truncate max-w-[140px]">{v || "N/A"}</span>
      </div>
    ))}
  </div>
);

const TimelineCard = ({ info }) => {
  const expires = info?.registryData?.expiresDate;
  const daysLeft = expires ? Math.ceil((new Date(expires) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest border-b border-slate-800 pb-3">
        <Clock size={16} /> Registry Lifecycle
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Registered On</span>
          <span className="text-slate-300 font-mono">{info?.registryData?.createdDate ? new Date(info.registryData.createdDate).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Expires On</span>
          <span className="text-slate-300 font-mono">{info?.registryData?.expiresDate ? new Date(info.registryData.expiresDate).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
      <div className={`mt-4 p-4 rounded-xl text-center ${daysLeft < 90 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
        <span className="text-2xl font-black">{daysLeft || '0'}</span>
        <span className="text-[10px] block uppercase font-bold tracking-tighter">Days Remaining</span>
      </div>
    </div>
  );
};

const BuyLinks = ({ domain }) => {
  const registrars = [
    { name: "GoDaddy", url: `https://www.godaddy.com/domainsearch/find?domainToCheck=${domain}` },
    { name: "Namecheap", url: `https://www.namecheap.com/domains/registration/results/?domain=${domain}` },
    { name: "Porkbun", url: `https://porkbun.com/checkout/search?q=${domain}` },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest border-b border-slate-800 pb-3">
        <AlertCircle size={16} /> Acquisition Paths
      </div>
      <div className="grid grid-cols-1 gap-2">
        {registrars.map((r, i) => (
          <a key={i} href={r.url} target="_blank" className="bg-slate-800 hover:bg-indigo-600 px-4 py-3 rounded-xl flex justify-between items-center text-xs font-bold transition-all group">
            {r.name}
            <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default DomainStatus;