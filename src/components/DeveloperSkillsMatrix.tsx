import { useState, useMemo } from "react";
import { Skill, PracticeLog, Project } from "../types";
import { masterSkills } from "../data/masterSkills";
import {
  Search,
  BookOpen,
  Clock,
  Plus,
  Compass,
  CheckCircle,
  TrendingUp,
  Cpu,
  ChevronRight,
  Sparkles,
  Layers,
  Award,
  BookMarked
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DeveloperSkillsMatrixProps {
  skills: Skill[];
  logs: PracticeLog[];
  projects: Project[];
  onActivateSkill: (skill: Skill) => void;
  onGrantXp: (skillKey: string, amount: number) => void;
}

export default function DeveloperSkillsMatrix({
  skills,
  logs,
  projects,
  onActivateSkill,
  onGrantXp
}: DeveloperSkillsMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSkillKey, setSelectedSkillKey] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "active">("all");

  const categories = ["All", "Languages", "Frontend", "Backend", "Database", "DevOps", "Systems"];

  // Helper dictionary to look up active skills by key
  const activeSkillMap = useMemo(() => {
    return new Map<string, Skill>(skills.map((s) => [s.key, s]));
  }, [skills]);

  // Combine masterSkills and active states to map ALL software developer skills
  const fullyMappedDeveloperSkills = useMemo(() => {
    return masterSkills.map((m) => {
      const active = activeSkillMap.get(m.key);
      return {
        ...m,
        isActivated: !!active,
        xp: active ? active.xp : 0,
        level: active ? active.level : 1,
      };
    });
  }, [activeSkillMap]);

  // Filter skills based on search, category tab, and filter mode (all vs active-only)
  const filteredSkills = useMemo(() => {
    return fullyMappedDeveloperSkills.filter((s) => {
      // Category filter
      if (selectedCategory !== "All" && s.category !== selectedCategory) {
        return false;
      }
      // Filter active mode
      if (filterMode === "active" && !s.isActivated) {
        return false;
      }
      // Search matching name / key / category
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesKey = s.key.toLowerCase().includes(query);
        const matchesCat = s.category.toLowerCase().includes(query);
        return matchesName || matchesKey || matchesCat;
      }
      return true;
    });
  }, [fullyMappedDeveloperSkills, selectedCategory, filterMode, searchQuery]);

  // Active skill chosen for full deep details
  const currentSkillDetail = useMemo(() => {
    if (!selectedSkillKey) return null;
    const found = fullyMappedDeveloperSkills.find((s) => s.key === selectedSkillKey);
    return found || null;
  }, [selectedSkillKey, fullyMappedDeveloperSkills]);

  // Get practice log history of this individual skill
  const skillLogs = useMemo(() => {
    if (!selectedSkillKey) return [];
    return logs.filter(
      (l) => l.skillAttributed?.toLowerCase() === selectedSkillKey.toLowerCase()
    );
  }, [selectedSkillKey, logs]);

  // Get active projects or sprint tasks associated with the category of this individual skill
  const relatedProjects = useMemo(() => {
    if (!currentSkillDetail) return [];
    return projects.filter(
      (p) => p.category?.toLowerCase() === currentSkillDetail.category?.toLowerCase()
    );
  }, [currentSkillDetail, projects]);

  const handleActivate = (skillTemplate: typeof masterSkills[0]) => {
    const newSkill: Skill = {
      key: skillTemplate.key,
      name: skillTemplate.name,
      category: skillTemplate.category,
      xp: 0,
      level: 1,
      color: skillTemplate.color
    };
    onActivateSkill(newSkill);
  };

  return (
    <div id="developer-skills-matrix-module" className="p-5 rounded-xl bg-[#0e0f13] border border-zinc-850 space-y-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-500" />
            Software Developer Skills Matrix Explorer
          </h3>
          <p className="text-[10px] text-zinc-550 font-mono mt-0.5">
            Search, activate and track any developer skill. Select individual skills to view comprehensive training telemetry & log history.
          </p>
        </div>

        {/* Mode Toggle filters */}
        <div className="flex bg-zinc-950 border border-zinc-900 rounded p-0.5 text-[10px] font-mono">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              filterMode === "all"
                ? "bg-zinc-900 text-white font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            All Skills Directory ({masterSkills.length})
          </button>
          <button
            onClick={() => setFilterMode("active")}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
              filterMode === "active"
                ? "bg-zinc-900 text-blue-400 font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            My Active Skills ({skills.length})
          </button>
        </div>
      </div>

      {/* Control bar: Search + Category filter buttons */}
      <div className="space-y-3 pt-1">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search any software developer skill, technology, framework, database..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-sans transition-all"
          />
        </div>

        {/* Category filtering buttons */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-[10px] font-mono transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-blue-600/15 text-blue-400 border-blue-900/40 font-bold"
                  : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:border-zinc-800 hover:text-white"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main split grid: list of cards on left, active individual skill details panel on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Left Column(s): Filtered Skills Grid */}
        <div className="lg:col-span-2 space-y-3.5">
          {filteredSkills.length === 0 ? (
            <div className="p-8 text-center bg-zinc-950 rounded-xl border border-zinc-900">
              <Compass className="w-8 h-8 text-zinc-650 mx-auto mb-2 animate-bounce" />
              <p className="text-xs font-mono text-zinc-400">0 Matching developer competencies detected.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-3 text-[10px] font-bold font-mono text-blue-500 hover:underline"
              >
                Clear all query strings and filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredSkills.map((s) => {
                const thresh = s.level * 1000;
                const perc = (s.xp / thresh) * 100;
                const isSelected = selectedSkillKey === s.key;

                return (
                  <div
                    key={s.key}
                    onClick={() => {
                      if (s.isActivated) {
                        setSelectedSkillKey(s.key);
                      }
                    }}
                    className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-950/15 border-blue-900/80 shadow-md ring-1 ring-blue-900/30"
                        : "bg-zinc-950 border-zinc-900/70 hover:border-zinc-800"
                    }`}
                  >
                    {/* Level Badge / activation overlay */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="truncate">
                        <span className="text-xs font-bold text-white block truncate leading-tight">
                          {s.name}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-wide block mt-0.5">
                          {s.category}
                        </span>
                      </div>

                      {s.isActivated ? (
                        <span className="text-[9px] font-mono bg-blue-950 border border-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded font-bold shrink-0">
                          LVL {s.level}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivate(s);
                          }}
                          className="text-[9px] font-bold font-mono bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded cursor-pointer shrink-0 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          Track
                        </button>
                      )}
                    </div>

                    {/* Progress details if activated, otherwise callout */}
                    <div className="mt-4 space-y-1">
                      {s.isActivated ? (
                        <>
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${s.color} transition-all duration-300`}
                              style={{ width: `${perc}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                            <span>{s.xp} / {thresh} XP</span>
                            <span>{Math.round(perc)}%</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest pt-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                          Inactive competency node
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Individual Skill Operator Dashboard */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {currentSkillDetail ? (
              <motion.div
                key={currentSkillDetail.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-left space-y-4 h-full flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Title banner */}
                  <div className="border-b border-zinc-900 pb-3 flex justify-between items-start">
                    <div>
                      <span className="text-[8.5px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">
                        INDIVIDUAL_SKILL_HUD
                      </span>
                      <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
                        {currentSkillDetail.name}
                      </h4>
                      <span className="text-[9px] font-mono text-zinc-400 uppercase mt-0.5 inline-block px-1.5 py-0.5 bg-zinc-900 border border-zinc-850 rounded">
                        {currentSkillDetail.category}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedSkillKey(null)}
                      className="text-[9px] font-mono font-bold text-zinc-500 hover:text-zinc-300 border border-zinc-900 hover:border-zinc-800 bg-zinc-950 px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      CLEAR
                    </button>
                  </div>

                  {/* Level gauge block */}
                  <div className="bg-zinc-900/50 border border-zinc-900 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-zinc-405 font-bold">CURRENT_STAGE:</span>
                      <span className="font-bold font-mono text-blue-400">LEVEL 0{currentSkillDetail.level}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${currentSkillDetail.color}`}
                        style={{
                          width: `${(currentSkillDetail.xp / (currentSkillDetail.level * 1000)) * 100}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                      <span>{currentSkillDetail.xp} XP acumulado</span>
                      <span>{currentSkillDetail.level * 1000} XP Level cap</span>
                    </div>
                  </div>

                  {/* Manual Study Drills XP Booster */}
                  <div className="space-y-1.5">
                    <h5 className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                      Study Drills & Practice
                    </h5>
                    <button
                      onClick={() => onGrantXp(currentSkillDetail.key, 100)}
                      className="w-full py-1.5 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-350" />
                      COMPLETE TRAINING WORK: +100 XP
                    </button>
                  </div>

                  {/* Attributed Study Logs list */}
                  <div className="space-y-2">
                    <h5 className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                      <span>STUDY PRACTICE HISTORY</span>
                      <span className="text-zinc-600">({skillLogs.length} LOGS)</span>
                    </h5>

                    <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1 font-mono text-[9px]">
                      {skillLogs.length === 0 ? (
                        <div className="text-zinc-600 py-1 italic font-sans">No dedicated logged hours recorded yet for this active skill.</div>
                      ) : (
                        skillLogs.map((log) => (
                          <div
                            key={log.id}
                            className="p-2 rounded bg-zinc-900 border border-zinc-850 flex flex-col text-left space-y-0.5"
                          >
                            <div className="flex justify-between items-center text-zinc-400">
                              <span className="font-bold uppercase text-green-400">
                                {log.durationMinutes} MINUTES SESSION
                              </span>
                              <span>{new Date(log.loggedAt).toLocaleDateString()}</span>
                            </div>
                            <span className="text-zinc-500 line-clamp-1">{log.sessionNotes || "Routine study/coding practice."}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Related sprint projects context */}
                  <div className="space-y-2">
                    <h5 className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                      RELATED SPRINT PROJECTS
                    </h5>
                    <div className="max-h-[100px] overflow-y-auto space-y-1 font-mono text-[9px]">
                      {relatedProjects.length === 0 ? (
                        <div className="text-zinc-650 py-1 italic font-sans leading-tight">No active roadmap project boards mapped to category: {currentSkillDetail.category}</div>
                      ) : (
                        relatedProjects.slice(0, 3).map((p) => (
                          <div
                            key={p.id}
                            className="p-1.5 rounded border border-zinc-900 bg-zinc-900/30 flex justify-between items-center text-zinc-400"
                          >
                            <span className="font-semibold truncate max-w-[125px]">{p.title}</span>
                            <span className="text-[8px] bg-zinc-950 px-1 py-0.5 rounded border border-zinc-850 uppercase text-zinc-550 font-bold shrink-0">
                              {p.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-900 text-center font-mono text-[8px] text-zinc-600">
                  DEVELOPER EXPERIENCE REGISTER: OK
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-500 space-y-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center animate-pulse text-zinc-450">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-450 block">INDIVIDUAL HUD</span>
                  <p className="text-[10px] text-zinc-600 font-sans max-w-[180px] leading-relaxed">
                    Select any active skill card from the listing to inspect deep training logs, associate tasks and complete drills.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
