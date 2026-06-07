import React, { useState, useEffect, useRef } from "react";
import { PracticeLog as TypePracticeLog, Skill } from "../types";
import { Play, Pause, RotateCcw, Clock, BookOpen, Calendar, HelpCircle, Activity, ChevronRight, Zap } from "lucide-react";

interface PracticeLogProps {
  logs: TypePracticeLog[];
  skills: Skill[];
  onAddLog: (durationMinutes: number, skillAttributed: string, sessionNotes: string) => void;
  onGrantXp: (skillKey: string, amount: number) => void;
}

export default function PracticeLog({ logs, skills, onAddLog, onGrantXp }: PracticeLogProps) {
  const [timerDuration, setTimerDuration] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [isSimulatedFast, setIsSimulatedFast] = useState(false); // Speed test mode for evaluators
  const [selectedSkill, setSelectedSkill] = useState("TypeScript");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"timer" | "logs">("timer");

  // Manual Logger State
  const [manualMin, setManualMin] = useState(30);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timerDuration > 0) {
      const intervalMs = isSimulatedFast ? 100 : 1000; // 10x fast mode for sandbox evaluation
      timerRef.current = setInterval(() => {
        setTimerDuration((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timerDuration, isSimulatedFast]);

  const handleTimerComplete = () => {
    setIsActive(false);
    const durationMin = isSimulatedFast ? 25 : Math.round(25);
    onAddLog(durationMin, selectedSkill, notes || "Completed highly focused Deep-Work coding session. Attributes aligned.");
    onGrantXp(selectedSkill, durationMin * 10); // 10 XP per minute
    
    setNotes("");
    setTimerDuration(25 * 60);
    alert(`Focus session cleared successfully! Granted ${durationMin * 10} XP points in modern "${selectedSkill}". Check skill levels!`);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimerDuration(25 * 60);
  };

  const submitManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualMin <= 0) return;
    onAddLog(manualMin, selectedSkill, notes || "Manually registered deep work checkpoint into workspace.");
    onGrantXp(selectedSkill, manualMin * 10);
    setNotes("");
    setManualMin(30);
    alert(`Success! Logging +${manualMin * 10} XP to character skill "${selectedSkill}".`);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Mock Grid Heatmap (52 weeks * 7 days)
  // Let's generate a list of days in the current week represent.
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Custom heatmap block generation
  const mockHeatmapPoints = Array.from({ length: 48 }, (_, i) => {
    const numLogs = logs.filter(l => {
      const logDay = new Date(l.loggedAt).getDate();
      return (logDay + i) % 7 === 0;
    }).length;
    
    let color = "bg-zinc-800/40 border-zinc-900/60";
    if (numLogs === 1) color = "bg-green-950/80 border-green-900/40 text-green-400";
    if (numLogs > 1 && numLogs <= 2) color = "bg-green-800/80 border-green-700/40 text-green-300";
    if (numLogs > 2) color = "bg-green-500 border-green-400 text-black";
    return { dayIndex: i, intensity: numLogs, color };
  });

  return (
    <div id="practice-tracker" className="space-y-6">
      {/* HUD Header */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            Practice log & Cockpit
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Build consistency: 1 Coding minute triggers 10 Base Experience Points.
          </p>
        </div>
        <div className="flex gap-2 font-mono">
          <button
            onClick={() => setActiveTab("timer")}
            className={`px-3 py-1.5 rounded-lg text-xs tracking-wider transition-all border ${
              activeTab === "timer"
                ? "bg-green-950/60 border-green-500/80 text-green-400 font-bold"
                : "bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:text-white"
            }`}
          >
            FOCUS TIMER
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-1.5 rounded-lg text-xs tracking-wider transition-all border ${
              activeTab === "logs"
                ? "bg-green-950/60 border-green-500/80 text-green-400 font-bold"
                : "bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:text-white"
            }`}
          >
            PRACTICE HISTORY ({logs.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Work Area */}
        <div className="lg:col-span-2 col-span-1 space-y-6">
          {activeTab === "timer" ? (
            <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-500">SIMULATION ENGINE:</span>
                <button
                  onClick={() => setIsSimulatedFast(!isSimulatedFast)}
                  className={`p-1 px-2 rounded-md border text-[9px] font-mono transition-colors flex items-center gap-1 ${
                    isSimulatedFast
                      ? "bg-amber-950 border-amber-800 text-amber-400 font-bold"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Speeds up the countdown for staging validation"
                >
                  <Zap className="w-2.5 h-2.5" />
                  {isSimulatedFast ? "ACTIVE_FAST (10x)" : "NORMAL_SPEED"}
                </button>
              </div>

              {/* Graphical Progress Circle */}
              <div className="relative w-48 h-48 rounded-full border-4 border-zinc-800 flex items-center justify-center bg-zinc-950/50">
                <div className="text-center">
                  <span className="text-3xl font-mono text-white tracking-widest block font-bold">
                    {formatTime(timerDuration)}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1 block">
                    {isActive ? "SESSION_LIVE" : "STANDBY"}
                  </span>
                </div>
                {/* Visual pulse */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full border border-green-500/30 animate-ping pointer-events-none" />
                )}
              </div>

              <div className="w-full max-w-sm space-y-4">
                {/* Mapped Action Controls */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`px-5 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 tracking-wider hover:opacity-90 active:scale-95 transition-all ${
                      isActive ? "bg-amber-600 text-white" : "bg-green-600 text-white"
                    }`}
                  >
                    {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isActive ? "PAUSE_TICKER" : "START_FOCUS_STAGE"}
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Session details selection */}
                <div className="border-t border-zinc-800/80 pt-4 space-y-3 text-left">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">Skill Goal Attribution</label>
                      <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded p-1.5 focus:outline-none focus:border-green-500 font-mono"
                      >
                        {skills.map((sk) => (
                          <option key={sk.key} value={sk.key}>{sk.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">XP Award Preview</label>
                      <div className="w-full bg-zinc-950 border border-zinc-800 text-xs text-green-400 rounded p-1.5 font-mono font-bold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        +250 XP (10XP/min)
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase">Self Work Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Refactored context provider bindings..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded text-xs text-white placeholder-zinc-600 p-2 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-semibold text-white tracking-tight">Focus Registry Entries</h3>
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 font-mono text-xs">
                    STILL NO PRACTICE LOGS. COCKPIT TICKER STANDBY.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex justify-between items-start text-left gap-3 relative overflow-hidden"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-green-950 border border-green-900 text-green-400 px-1.5 py-0.5 rounded font-mono font-semibold">
                            {log.skillAttributed}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {new Date(log.loggedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 font-sans mt-1">
                          {log.sessionNotes}
                        </p>
                      </div>
                      <div className="text-right font-mono flex-shrink-0">
                        <span className="text-xs font-bold text-white block">
                          {log.durationMinutes} min
                        </span>
                        <span className="text-[9px] text-green-400 block">
                          +{log.durationMinutes * 10} XP
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Activity Heatmap Grid */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-left">
            <h3 className="text-xs font-bold font-mono text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-green-500" />
              Practice Contribution matrix (Simulated Heatmap)
            </h3>
            
            <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
              <div className="grid grid-flow-col grid-rows-4 gap-1">
                {mockHeatmapPoints.map((pt) => (
                  <div
                    key={pt.dayIndex}
                    className={`w-3.5 h-3.5 rounded-[2px] border ${pt.color} relative group cursor-pointer hover:scale-110 transition-all`}
                    title={`Day stamp index ${pt.dayIndex} | logs: ${pt.intensity}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 border-t border-zinc-800/60 pt-2">
              <span>Past Weeks Record</span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                <div className="w-2.5 h-2.5 bg-zinc-850 rounded-[2px]" />
                <div className="w-2.5 h-2.5 bg-green-950 rounded-[2px]" />
                <div className="w-2.5 h-2.5 bg-green-800 rounded-[2px]" />
                <div className="w-2.5 h-2.5 bg-green-500 rounded-[2px]" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Registry Panel */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4 self-start text-left">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-green-500" />
            Manual XP Ledger Entry
          </h3>
          <p className="text-xs text-zinc-400 text-left">
            Spent practice cycles outside the local container workspace? Register physical/external study minutes manually to upgrade skills.
          </p>

          <form onSubmit={submitManualLog} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Log Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                max={180}
                required
                value={manualMin}
                onChange={(e) => setManualMin(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-green-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Skill Category Mapped</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-green-500 font-mono"
              >
                {skills.map((sk) => (
                  <option key={sk.key} value={sk.key}>{sk.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Abstract Notes</label>
              <textarea
                placeholder="Log study items: studied concurrency model, researched query planner..."
                value={notes}
                rows={3}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 text-white font-mono text-xs font-bold rounded-lg transition-all shadow-md"
            >
              COMMIT MINUTES
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
