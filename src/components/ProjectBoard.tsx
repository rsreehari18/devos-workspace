import React, { useState, useTransition } from "react";
import { Project, Skill } from "../types";
import { Plus, Trash2, ArrowRight, ArrowLeft, Check, AlertCircle, Sparkles, Database } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectBoardProps {
  projects: Project[];
  skills: Skill[];
  onAddProject: (title: string, description: string, category: Project["category"]) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  onGrantXp: (skillKey: string, amount: number) => void;
}

const CATEGORIES: Project["category"][] = ["Frontend", "Backend", "DevOps", "Database", "Mobile", "General"];

const COLUMN_HEADERS: { key: Project["status"]; label: string; bg: string; border: string; text: string }[] = [
  { key: "Backlog", label: "Backlog Stack", bg: "bg-zinc-950/40", border: "border-zinc-800/80", text: "text-zinc-400" },
  { key: "Active", label: "Sprint Active", bg: "bg-blue-950/20", border: "border-blue-900/40", text: "text-blue-400" },
  { key: "Testing", label: "Staging & QA", bg: "bg-amber-950/20", border: "border-amber-900/40", text: "text-amber-400" },
  { key: "Done", label: "Shipped & Live", bg: "bg-emerald-950/20", border: "border-emerald-900/40", text: "text-emerald-400" }
];

export default function ProjectBoard({
  projects,
  skills,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onGrantXp
}: ProjectBoardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<Project["category"]>("Frontend");
  const [showToast, setShowToast] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    startTransition(() => {
      onAddProject(newTitle.trim(), newDesc.trim(), newCategory);
      setNewTitle("");
      setNewDesc("");
      setShowAddForm(false);
      triggerToast("New project successfully initialized on the DevOS micro-ledger.");
    });
  };

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleStatusShift = (project: Project, direction: "forward" | "back") => {
    const sequence: Project["status"][] = ["Backlog", "Active", "Testing", "Done"];
    const currentIdx = sequence.indexOf(project.status);
    let nextIdx = currentIdx;

    if (direction === "forward" && currentIdx < sequence.length - 1) {
      nextIdx = currentIdx + 1;
    } else if (direction === "back" && currentIdx > 0) {
      nextIdx = currentIdx - 1;
    }

    if (nextIdx !== currentIdx) {
      const nextStatus = sequence[nextIdx];
      const updates: Partial<Project> = { status: nextStatus };
      
      // Auto upgrade completion levels on status modification
      if (nextStatus === "Done") {
        updates.progressPercentage = 100;
        // Auto grant XP to mapped skill on completion
        const matchedSkill = mapCategoryToSkill(project.category);
        onGrantXp(matchedSkill, 150);
        triggerToast(`Project Shipped! +150 XP granted directly to your "${matchedSkill}" skill matrix.`);
      } else if (nextStatus === "Testing") {
        updates.progressPercentage = 80;
      } else if (nextStatus === "Active") {
        updates.progressPercentage = 25;
      } else {
        updates.progressPercentage = 0;
      }

      onUpdateProject(project.id, updates);
    }
  };

  const mapCategoryToSkill = (category: Project["category"]): string => {
    switch (category) {
      case "Frontend": return "React";
      case "Backend": return "Node.js";
      case "Database": return "PostgreSQL";
      case "DevOps": return "DevOps";
      default: return "TypeScript";
    }
  };

  return (
    <div id="project-board" className="space-y-6">
      {/* HUD Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            Project Control Room
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Status: Active | Total Nodes: {projects.length} | Completed: {projects.filter(p => p.status === "Done").length}
          </p>
        </div>

        <button
          id="btn-toggle-add-project"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs font-mono tracking-wide transition-all shadow-md active:scale-95"
        >
          {showAddForm ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showAddForm ? "CLOSE MANIFEST" : "CREATE PROJECT CARD"}
        </button>
      </div>

      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-mono rounded-lg flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 flex-shrink-0 animate-spin" />
          <span>{showToast}</span>
        </motion.div>
      )}

      {/* Slideout/Dropdown Creation Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={handleCreate}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Project Name / Repository</label>
                <input
                  type="text"
                  required
                  placeholder="Secure Payment Gateway Router"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Category Vector</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Project["category"])}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-400 tracking-wider">System Specifications / Description</label>
              <textarea
                placeholder="Declare requirements, design patterns, or engineering constraints for this sprint stage..."
                value={newDesc}
                rows={2}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-sans"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 font-mono text-xs hover:bg-zinc-800"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs rounded-lg flex items-center gap-1.5 font-bold"
              >
                <Database className="w-3.5 h-3.5" />
                COMMIT TO LEDGER
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMN_HEADERS.map((column) => {
          const colProjects = projects.filter((p) => p.status === column.key);

          return (
            <div
              key={column.key}
              className={`rounded-xl border ${column.border} ${column.bg} p-3.5 space-y-4 min-h-[450px] flex flex-col`}
            >
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2 flex-shrink-0">
                <span className={`text-xs font-bold font-mono tracking-wide ${column.text} uppercase`}>
                  {column.label}
                </span>
                <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                  {colProjects.length}
                </span>
              </div>

              {/* Cards Collection */}
              <div className="space-y-3 flex-grow overflow-y-auto max-h-[500px] scrollbar-thin">
                {colProjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-zinc-800/60 rounded-xl bg-zinc-950/20 p-4">
                    <AlertCircle className="w-5 h-5 text-zinc-600 mb-1.5" />
                    <span className="text-[10px] font-mono text-zinc-500">NULL_STATE_READY</span>
                  </div>
                ) : (
                  colProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700/80 transition-all font-sans relative group text-left"
                    >
                      {/* Delete action */}
                      <button
                        onClick={() => onDeleteProject(project.id)}
                        className="absolute top-2 right-2 text-zinc-600 hover:text-rose-500 p-1 rounded hover:bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[9px] font-mono tracking-wider font-bold uppercase py-0.5 px-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                          {project.category}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500">
                          XP Skill: {mapCategoryToSkill(project.category)}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-white tracking-tight leading-snug pr-4">
                        {project.title}
                      </h4>

                      {project.description && (
                        <p className="text-[11px] text-zinc-400 mt-1.5 leading-snug line-clamp-3">
                          {project.description}
                        </p>
                      )}

                      {/* Progress Line */}
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                          <span>SYSTEM_INTEGRATION</span>
                          <span>{project.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${project.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Controls Area */}
                      <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between">
                        <button
                          disabled={column.key === "Backlog"}
                          onClick={() => handleStatusShift(project, "back")}
                          className="p-1.5 hover:bg-zinc-800/80 rounded border border-zinc-800 disabled:opacity-20 text-zinc-400 disabled:hover:bg-transparent"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <span className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest">
                          SHIFT_STU
                        </span>
                        <button
                          disabled={column.key === "Done"}
                          onClick={() => handleStatusShift(project, "forward")}
                          className="p-1.5 hover:bg-zinc-800/80 rounded border border-zinc-800 disabled:opacity-20 text-zinc-400 disabled:hover:bg-transparent"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
