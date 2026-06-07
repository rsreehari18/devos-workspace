import React, { useState } from "react";
import { Sparkles, ArrowRight, Loader2, Copy, Check, FileDown, Brain, HelpCircle, UserCheck } from "lucide-react";
import { motion } from "motion/react";

export default function ResumeBuilderPanel() {
  // Resume Bullet states
  const [rawText, setRawText] = useState("");
  const [actionVerb, setActionVerb] = useState("Architected");
  const [generatedBullet, setGeneratedBullet] = useState("");
  const [loadingBullet, setLoadingBullet] = useState(false);
  const [copiedBullet, setCopiedBullet] = useState(false);

  // Portfolio Bio states
  const [targetRole, setTargetRole] = useState("Full Stack Systems Architect");
  const [focusSkills, setFocusSkills] = useState("TypeScript, React 19, Node.js Express, PostgreSQL");
  const [loadingBio, setLoadingBio] = useState(false);
  const [bioResult, setBioResult] = useState<{
    headline: string;
    bio: string;
    snippets: { title: string; description: string; tag: string }[];
  } | null>({
    headline: "Passionate Full-Stack Developer specializing in high-performance Web-systems",
    bio: "Systems architect possessing robust mastery of concurrent component handshakes, secure encryption gates, and stateless REST proxy gateways. Focused on creating responsive user workspaces coupled with optimized database schemas.",
    snippets: [
      { title: "Stateless Token Gateways", description: "Configured resilient Node/Express middleware validating JWT tokens and securing local memory stores from unauthorized scraper scripts.", tag: "Security" },
      { title: "Interactive Canvas Charting", description: "Designed micro-dashboard boards utilizing SVG indicators and D3 layout structures, optimizing screen updates by 45%.", tag: "Frontend" },
      { title: "Relational Index Optimizations", description: "Wrote structured PostgreSQL schemas with cascade triggers to guarantee referential safety under peak container traffic.", tag: "Database" }
    ]
  });
  const [copiedBio, setCopiedBio] = useState(false);

  const verbs = [
    "Architected",
    "Optimized",
    "Engineered",
    "Spearheaded",
    "Formulated",
    "Synthesized",
    "Overhauled",
    "Automated"
  ];

  const handleGenerateBullet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;
    setLoadingBullet(true);
    try {
      const res = await fetch("/api/resume/bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, actionVerb })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedBullet(data.bullet);
      }
    } catch (err) {
      console.warn("Express endpoint timeout. Emulating rule benchmark formats.");
    } finally {
      setLoadingBullet(false);
    }
  };

  const handleGenerateBio = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBio(true);
    try {
      const skillsArray = focusSkills.split(",").map(s => s.trim());
      const res = await fetch("/api/portfolio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole, focusSkills: skillsArray })
      });
      if (res.ok) {
        const data = await res.json();
        setBioResult({
          headline: data.headline,
          bio: data.bio,
          snippets: data.featuredSnippets
        });
      }
    } catch (err) {
      console.warn("AI compile standby.");
    } finally {
      setLoadingBio(false);
    }
  };

  const handleCopyText = (text: string, type: "bullet" | "bio") => {
    navigator.clipboard.writeText(text);
    if (type === "bullet") {
      setCopiedBullet(true);
      setTimeout(() => setCopiedBullet(false), 2000);
    } else {
      setCopiedBio(true);
      setTimeout(() => setCopiedBio(false), 2000);
    }
  };

  const handleDownloadBullet = () => {
    if (!generatedBullet) return;
    const blob = new Blob([generatedBullet], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "devos_optimized_resume_bullet.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
      
      {/* Target Column 1: STAR Resume Bullet Optimizer */}
      <div className="space-y-5">
        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-850 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-850/60">
            <div className="p-1.5 rounded bg-blue-950/40 border border-blue-900/30 text-blue-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                STAR Resume Bullet Optimizer
              </h3>
              <p className="text-[10px] text-zinc-500">
                Turn standard project todo descriptions into elite recruiter-facing results sentences.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateBullet} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Impact Action Verb Selection</label>
              <div className="grid grid-cols-4 gap-1.5">
                {verbs.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setActionVerb(v)}
                    className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                      actionVerb === v 
                        ? "bg-blue-600 text-white font-bold" 
                        : "bg-zinc-950 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Rough Description / Raw Actions</label>
              <textarea
                placeholder="Describe your task, such as: 'I built a login system with express showing otp codes and JWT in a sandbox dashboard'"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-805 p-3 text-xs text-white rounded font-sans placeholder-zinc-600 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loadingBullet || !rawText.trim()}
              className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-xs font-mono font-bold text-white transition-all disabled:opacity-45 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
            >
              {loadingBullet ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  GENERATING_STAR_BULLET...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  COMPILE HIGH-IMPACT STAR BULLET
                </>
              )}
            </button>
          </form>

          {/* Result block */}
          {generatedBullet && (
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-850/80 space-y-3 relative group">
              <span className="text-[9px] font-mono text-blue-400 block uppercase tracking-widest">
                Optimized Result (Ready to paste)
              </span>
              <p className="text-xs text-white leading-relaxed font-sans pr-16 select-all">
                {generatedBullet}
              </p>
              
              <div className="flex gap-2 justify-end pt-2 border-t border-zinc-850/60">
                <button
                  onClick={() => handleCopyText(generatedBullet, "bullet")}
                  className="p-1 px-2.5 rounded bg-zinc-900 border border-zinc-805 text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-all"
                  title="Copy to clipboard"
                >
                  {copiedBullet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedBullet ? "COPIED" : "COPY"}
                </button>
                <button
                  onClick={handleDownloadBullet}
                  className="p-1 px-2.5 rounded bg-zinc-900 border border-zinc-805 text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-all"
                  title="Download TXT"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  TXT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Target Column 2: AI Portfolio Bio and Elevator Content Developer */}
      <div className="space-y-5">
        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-850 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-850/60">
            <div className="p-1.5 rounded bg-purple-950/40 border border-purple-900/30 text-purple-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Recruiter Bio & Elevator Pitch Compiler
              </h3>
              <p className="text-[10px] text-zinc-500">
                Generate high-performance description segments for your developer portfolio layout.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateBio} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">TARGET ROLE</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white rounded font-sans focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">FOCUS SKILLS</label>
                <input
                  type="text"
                  value={focusSkills}
                  onChange={(e) => setFocusSkills(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white rounded font-sans focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingBio}
              className="w-full py-2 rounded bg-purple-750 hover:bg-purple-650 text-xs font-mono font-bold text-white transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1 shadow-lg"
            >
              {loadingBio ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  REVOLVING_AI_PROFILES...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  MUTATE PORTFOLIO META-DATA
                </>
              )}
            </button>
          </form>

          {/* Result Block */}
          {bioResult && (
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-850/85 space-y-4">
              <div>
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-1">Headline Elevator Pitch</span>
                <p className="text-xs text-white font-bold tracking-tight leading-relaxed select-all">
                  "{bioResult.headline}"
                </p>
              </div>

              <div>
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-1">Professional Developer Narrative</span>
                <p className="text-xs text-zinc-450 leading-relaxed font-sans pr-2 select-all">
                  {bioResult.bio}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-850/60 space-y-2">
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-1">Featured Experience Snippets</span>
                <div className="space-y-2">
                  {bioResult.snippets.map((snip, index) => (
                    <div key={index} className="p-2.5 rounded bg-zinc-900/60 border border-zinc-850 flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-white block">{snip.title}</span>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">{snip.description}</p>
                      </div>
                      <span className="text-[8px] font-mono uppercase bg-purple-950/40 border border-purple-900/30 text-purple-400 px-1.5 py-0.5 rounded">
                        {snip.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleCopyText(`Headline: ${bioResult.headline}\nBio: ${bioResult.bio}\nSnippets: ${bioResult.snippets.map(s => s.title + ' - ' + s.description).join('\n')}`, "bio")}
                  className="px-4 py-1 rounded bg-zinc-900 border border-zinc-805 text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copiedBio ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedBio ? "COPIED_PROFILE" : "COPY ENTIRE BIO"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
