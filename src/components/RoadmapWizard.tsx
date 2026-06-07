import React, { useState, useTransition } from "react";
import { Roadmap, RoadmapStep, Skill } from "../types";
import { Search, Sparkles, CheckCircle, Circle, MapPin, Award, ArrowUpRight, Cpu, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface RoadmapWizardProps {
  roadmaps: Roadmap[];
  skills: Skill[];
  onAddRoadmap: (roadmap: Roadmap) => void;
  onUpdateRoadmap: (id: string, updates: Partial<Roadmap>) => void;
  onGrantXp: (skillKey: string, amount: number) => void;
}

export default function RoadmapWizard({ roadmaps, skills, onAddRoadmap, onUpdateRoadmap, onGrantXp }: RoadmapWizardProps) {
  const [query, setQuery] = useState("");
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(roadmaps[0]?.id || null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [, startTransition] = useTransition();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setStatusMessage("Establishing connection with Gemini model gateway...");
    
    try {
      // Small timeout simulation for cinematic loader
      setTimeout(() => setStatusMessage("Gemini parsing structural prompt constraints..."), 700);
      setTimeout(() => setStatusMessage("Analyzing node-edge hierarchies and study estimates..."), 1300);

      const response = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: query.trim() })
      });

      if (!response.ok) {
        throw new Error("Server failed to respond with roadmap JSON packet.");
      }

      const data = await response.json();
      
      const newRoadmap: Roadmap = {
        id: "r_" + Date.now().toString(36),
        topic: data.topic,
        generatedBy: data.generatedBy || "AI Gemini",
        completed: false,
        createdAt: data.createdAt || new Date().toISOString(),
        steps: data.steps.map((st: any) => ({
          ...st,
          isCompleted: false
        }))
      };

      startTransition(() => {
        onAddRoadmap(newRoadmap);
        setActiveRoadmapId(newRoadmap.id);
        setQuery("");
        setLoading(false);
        setStatusMessage("");
      });
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      setStatusMessage("");
      alert("Error querying the roadmap generator server. Please confirm backend connectivity.");
    }
  };

  const activeRoadmap = roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0];

  const handleToggleStep = (roadmapId: string, stepOrder: number) => {
    const targetRoadmap = roadmaps.find(r => r.id === roadmapId);
    if (!targetRoadmap) return;

    const updatedSteps = targetRoadmap.steps.map((st) => {
      if (st.step_order === stepOrder) {
        const nextState = !st.isCompleted;
        if (nextState) {
          // Award XP on checking node
          onGrantXp("TypeScript", 50);
        }
        return { ...st, isCompleted: nextState };
      }
      return st;
    });

    const isAllDone = updatedSteps.every((st) => st.isCompleted);
    
    if (isAllDone && !targetRoadmap.completed) {
      onGrantXp("React", 200);
      alert(`Roadmap completed! Granted massive 200 XP to progression levels.`);
    }

    onUpdateRoadmap(roadmapId, {
      steps: updatedSteps,
      completed: isAllDone
    });
  };

  return (
    <div id="roadmap-wizard" className="space-y-6">
      {/* HUD Header */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-500 animate-pulse" />
            Gemini AI Study Architect
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Generate custom step-by-step developer paths via server-side Google GenAI query protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Creation and Roadmap index */}
        <div className="space-y-6 lg:col-span-1 col-span-1">
          {/* Query Form Card */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4 text-left">
            <h3 className="text-xs font-bold font-mono text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Compile Target Topic
            </h3>
            <p className="text-xs text-zinc-400">
              Enter any technical scope like "Kubernetes Networking", "Redis Cache eviction", or "D3.js maps".
            </p>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Rust WebAssembly"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-2.5" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 disabled:opacity-40 text-white font-mono text-xs font-bold rounded-lg transition-all shadow-md active:scale-95"
              >
                {loading ? "COMPILING GRAPH..." : "GENERATE AI ROADMAP"}
              </button>
            </form>

            {loading && (
              <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="text-[10px] font-mono text-blue-400 animate-pulse">
                  {statusMessage}
                </span>
              </div>
            )}
          </div>

          {/* List selection */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-left">
            <h3 className="text-xs font-bold font-mono text-zinc-400 tracking-wider uppercase">
              Workspace Roadmaps
            </h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-thin">
              {roadmaps.length === 0 ? (
                <div className="text-center py-8 text-zinc-600 text-xs font-mono">
                  NO ROADMAPS INSTALLED
                </div>
              ) : (
                roadmaps.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRoadmapId(r.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all block relative overflow-hidden ${
                      r.id === activeRoadmapId
                        ? "bg-blue-950/40 border-blue-800 text-white"
                        : "bg-zinc-950/30 border-zinc-850 hover:bg-zinc-950/60 text-zinc-400"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold leading-tight pr-4 truncate block font-sans">
                        {r.topic}
                      </span>
                      {r.completed && (
                        <Award className="w-4.5 h-4.5 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase mt-2 block">
                      Source: {r.generatedBy}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Step viewer details */}
        <div className="lg:col-span-2 col-span-1">
          {activeRoadmap ? (
            <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 text-left space-y-6">
              <div className="flex justify-between items-start border-b border-zinc-800/80 pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">ACTIVE ROADMAP PIPELINE</span>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {activeRoadmap.topic}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-400">
                    Compiled directly via: {activeRoadmap.generatedBy}
                  </p>
                </div>

                {/* Progress Metric */}
                <div className="text-right font-mono flex-shrink-0 bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-850">
                  <span className="text-lg font-bold text-blue-400 block tracking-wider leading-none">
                    {Math.round(
                      (activeRoadmap.steps.filter((s) => s.isCompleted).length / activeRoadmap.steps.length) * 100
                    )}%
                  </span>
                  <span className="text-[8px] text-zinc-500 uppercase block mt-1 tracking-wider">
                    COMPLETE_RAT
                  </span>
                </div>
              </div>

              {/* Milestones timeline */}
              <div className="relative border-l border-zinc-800 ml-3.5 pl-6.5 space-y-5">
                {activeRoadmap.steps.map((step) => (
                  <div key={step.step_order} className="relative group text-left">
                    {/* Circle Node indicator */}
                    <button
                      onClick={() => handleToggleStep(activeRoadmap.id, step.step_order)}
                      className="absolute -left-[38px] top-1.5 p-1 bg-zinc-900 border-2 rounded-full transition-all focus:outline-none z-10 hover:scale-110 active:scale-95"
                    >
                      {step.isCompleted ? (
                        <CheckCircle className="w-5.5 h-5.5 text-blue-500 fill-zinc-900" />
                      ) : (
                        <Circle className="w-5.5 h-5.5 text-zinc-700 hover:text-blue-500" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-blue-500 font-bold">
                          STAGE_0{step.step_order}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500 bg-zinc-950 border border-zinc-850 py-0.5 px-2 rounded-full">
                          Target: {step.timeEstimate || "3 Hours"}
                        </span>
                      </div>
                      
                      <h4 className={`text-sm font-semibold tracking-tight transition-colors ${
                        step.isCompleted ? "text-zinc-500 line-through" : "text-white"
                      }`}>
                        {step.title}
                      </h4>
                      
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom motivation info */}
              <div className="p-3 rounded-lg bg-zinc-950/40 border border-zinc-850 text-left flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                  Mark off each curriculum node upon completion to earn <span className="text-zinc-300 font-semibold font-mono">+50 general XP</span> checkpoints. Fully packing all milestones seals this roadmap and unlocks high-scale completion awards.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/10 min-h-[400px]">
              <MapPin className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-xs font-mono text-zinc-500">
                AITING_AI_GENERATION_QUERY...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
