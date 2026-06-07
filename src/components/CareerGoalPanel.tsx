import React, { useState, useEffect } from "react";
import { CareerGoal } from "../types";
import { Award, Building, DollarSign, Calendar, Plus, Check, Trash2, Edit3, Target, Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function CareerGoalPanel() {
  const [goal, setGoal] = useState<CareerGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  // Form coordinates
  const [role, setRole] = useState("");
  const [dreamCompany, setDreamCompany] = useState("");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [targetTimeline, setTargetTimeline] = useState("");
  const [newMilestoneText, setNewMilestoneText] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch("/api/career-goal")
      .then(res => res.json())
      .then(data => {
        setGoal(data);
        setRole(data.role);
        setDreamCompany(data.dreamCompany);
        setSalaryExpectation(data.salaryExpectation);
        setTargetTimeline(data.targetTimeline);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await fetch("/api/career-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          dreamCompany,
          salaryExpectation,
          targetTimeline,
          milestones: goal?.milestones || []
        })
      });
      if (response.ok) {
        const result = await response.json();
        setGoal(result.data);
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleMilestone = async (id: string) => {
    if (!goal) return;
    const updatedMilestones = goal.milestones.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    );

    // Optimistic:
    setGoal({ ...goal, milestones: updatedMilestones });

    try {
      await fetch("/api/career-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...goal, milestones: updatedMilestones })
      });
    } catch (err) {
      console.error("Failed to sync milestone status:", err);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !newMilestoneText.trim()) return;

    const newMilestone = {
      id: "m_" + Date.now().toString(36),
      title: newMilestoneText.trim(),
      completed: false
    };

    const updatedMilestones = [...goal.milestones, newMilestone];
    setGoal({ ...goal, milestones: updatedMilestones });
    setNewMilestoneText("");

    try {
      await fetch("/api/career-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...goal, milestones: updatedMilestones })
      });
    } catch (err) {
      console.error("Failed to add milestone:", err);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!goal) return;
    const updatedMilestones = goal.milestones.filter(m => m.id !== id);
    setGoal({ ...goal, milestones: updatedMilestones });

    try {
      await fetch("/api/career-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...goal, milestones: updatedMilestones })
      });
    } catch (err) {
      console.error("Failed to delete milestone:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-xs text-zinc-500 font-mono">Accessing Career Gateway Vault...</span>
        </div>
      </div>
    );
  }

  const completedCount = goal?.milestones.filter(m => m.completed).length || 0;
  const totalCount = goal?.milestones.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div id="career-goal-engine" className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      {/* Target Focus Setup Column */}
      <div className="lg:col-span-1 space-y-4">
        {editing || !goal?.role ? (
          <form onSubmit={handleSaveGoal} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500 animate-pulse" />
              CONSTITUTE YOUR PATHWAY
            </h3>
            <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
              Define your target role, dream company, salary expectation, and timeline to form your dynamic checklist of benchmarks.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">TARGET ROLE</label>
                <input
                  type="text"
                  value={role}
                  placeholder="Full-Stack Engineer"
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white rounded font-sans focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">DREAM COMPANY</label>
                <input
                  type="text"
                  value={dreamCompany}
                  placeholder="Google, Vercel"
                  onChange={(e) => setDreamCompany(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white rounded font-sans focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">TIMELINE</label>
                  <input
                    type="text"
                    value={targetTimeline}
                    placeholder="Dec 2026"
                    onChange={(e) => setTargetTimeline(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white rounded font-sans focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">SALARY TARGET</label>
                  <input
                    type="text"
                    value={salaryExpectation}
                    placeholder="$125,000"
                    onChange={(e) => setSalaryExpectation(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white rounded font-sans focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={updating}
                className="flex-1 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
              >
                {updating ? "SYNCING..." : "COMMIT GOALS"}
              </button>
              {goal?.role && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs cursor-pointer"
                >
                  BACK
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-850 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-blue-400 font-bold uppercase bg-blue-950/40 border border-blue-900/30 px-2 py-0.5 rounded">
                  Active Career Spec
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-2">{goal?.role}</h3>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="p-1 px-2.5 rounded bg-zinc-950/80 border border-zinc-800 hover:bg-zinc-800 text-[10px] font-mono text-zinc-400 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                EDIT
              </button>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-xs">
                <div className="p-2 rounded bg-blue-950/30 border border-blue-900/45 text-blue-400">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Dream Employer</span>
                  <span className="text-white font-medium">{goal?.dreamCompany}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Salary Target</span>
                  <span className="text-white font-medium">{goal?.salaryExpectation}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="p-2 rounded bg-amber-950/30 border border-amber-900/40 text-amber-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-zinc-500 block">Target Timeline</span>
                  <span className="text-white font-medium">{goal?.targetTimeline}</span>
                </div>
              </div>
            </div>

            {/* Target Gauge */}
            <div className="pt-2 border-t border-zinc-850/60 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-400">Job-Ready Progress:</span>
                <span className="font-bold font-mono text-blue-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850/20">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[9px] text-zinc-500 font-mono block">
                {completedCount} of {totalCount} readiness benchmarks achieved.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Target Milestone Checklist Column */}
      <div className="lg:col-span-2 p-5 rounded-xl bg-zinc-900 border border-zinc-850 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-850/80">
            <div>
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                SENSENSITIVE INTERNSHIP GATEWAYS
              </h3>
              <p className="text-[10px] text-zinc-500 mt-0.5 font-sans">
                A checklist of technical benchmarks demanded by technical interviewers.
              </p>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              {completedCount}/{totalCount} COMPLETED
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {goal?.milestones.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                  m.completed 
                    ? "bg-emerald-950/10 border-emerald-900/35 text-zinc-400" 
                    : "bg-zinc-950/40 border-zinc-850/80 hover:bg-zinc-900/80 text-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggleMilestone(m.id)}
                  className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    m.completed 
                      ? "bg-emerald-500 border-emerald-400 text-white" 
                      : "border-zinc-700 hover:border-zinc-500"
                  }`}>
                    {m.completed && <Check className="w-3 h-3" />}
                  </div>
                  <span className={`text-xs ${m.completed ? "line-through text-zinc-500" : ""}`}>
                    {m.title}
                  </span>
                </button>

                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  className="p-1.5 text-zinc-600 hover:text-red-400 rounded transition-all cursor-pointer"
                  title="Remove milestone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            
            {totalCount === 0 && (
              <div className="text-center py-6 text-zinc-550 font-mono text-[11px] border border-dashed border-zinc-800 rounded">
                No active milestones registered. Code your checklist below.
              </div>
            )}
          </div>
        </div>

        {/* Add milestone form */}
        <form onSubmit={handleAddMilestone} className="mt-4 pt-4 border-t border-zinc-850/60 flex gap-2">
          <input
            type="text"
            placeholder="Add new custom career benchmark objective..."
            value={newMilestoneText}
            onChange={(e) => setNewMilestoneText(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white rounded font-sans placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 font-mono text-xs font-bold text-white rounded flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            ADD
          </button>
        </form>
      </div>
    </div>
  );
}
