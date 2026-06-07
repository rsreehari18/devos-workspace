import { useState, useEffect, useTransition } from "react";
import { Project, PracticeLog, Skill, Roadmap, User } from "./types";
import { defaultSkills } from "./data/defaultSkills";
import ProjectBoard from "./components/ProjectBoard";
import PracticeLogComponent from "./components/PracticeLog";
import RoadmapWizard from "./components/RoadmapWizard";
// Removed ArchitectConsole import
import CareerGoalPanel from "./components/CareerGoalPanel";
import GithubContributionGrid from "./components/GithubContributionGrid";
import ResumeBuilderPanel from "./components/ResumeBuilderPanel";
import AuthInterface from "./components/AuthInterface";
import DeveloperSkillsMatrix from "./components/DeveloperSkillsMatrix";

import {
  Terminal,
  Layers,
  Clock,
  Cpu,
  Shield,
  Zap,
  LayoutDashboard,
  Kanban,
  Flame,
  Award,
  BookOpen,
  Github,
  Computer,
  CheckCircle,
  TrendingUp,
  LogOut,
  Sliders,
  Sparkles,
  RefreshCw,
  Search,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation active tab State
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "practice" | "github" | "resume" | "roadmaps">("dashboard");
  
  // Workspace entities state:
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<PracticeLog[]>([]);
  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem("devos_skills");
    return saved ? JSON.parse(saved) : defaultSkills;
  });
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([
    {
      id: "r_demo",
      topic: "React 19 & Concurrent State Flows",
      generatedBy: "DevOS Architect Blueprint",
      completed: false,
      createdAt: new Date().toISOString(),
      steps: [
        { step_order: 1, title: "Server Components & Client Handshakes", description: "Learn structural boundaries separating static rendering nodes from interactive client modules.", timeEstimate: "4 Hours", isCompleted: true },
        { step_order: 2, title: "Optimistic State UI Updates", description: "Practice implementation of useOptimistic hooks to give fast visual user responses during network transits.", timeEstimate: "5 Hours", isCompleted: false },
        { step_order: 3, title: "The Form Action Standard", description: "Wire forms directly to server queries, using useActionState to manage wait thresholds seamlessly.", timeEstimate: "6 Hours", isCompleted: false },
        { step_order: 4, title: "The 'use' API Context Resolver", description: "Unify promise resolving and context extraction directly inside loops without mounting separate contexts.", timeEstimate: "4 Hours", isCompleted: false }
      ]
    }
  ]);

  // Auth User verification status
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState<string>(() => localStorage.getItem("devos_github_username") || "");

  // Platform Logo Boot sequence Loading configuration (Max 2-seconds)
  const [isBooting, setIsBooting] = useState(true);
  const [bootLogLines, setBootLogLines] = useState<string[]>([]);

  // Dashboard customization controls state:
  const [showSkillMatrix, setShowSkillMatrix] = useState(true);
  const [showLogsModule, setShowLogsModule] = useState(true);
  const [showSprintWidget, setShowSprintWidget] = useState(true);
  const [showCustomizerPanel, setShowCustomizerPanel] = useState(false);

  // Experience level attributes
  const [level, setLevel] = useState<number>(() => {
    const saved = localStorage.getItem("devos_study_level");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [globalXp, setGlobalXp] = useState<number>(() => {
    const saved = localStorage.getItem("devos_study_xp");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem("devos_study_streak");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("devos_study_level", level.toString());
  }, [level]);

  useEffect(() => {
    localStorage.setItem("devos_study_xp", globalXp.toString());
  }, [globalXp]);

  useEffect(() => {
    localStorage.setItem("devos_study_streak", streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("devos_skills", JSON.stringify(skills));
  }, [skills]);

  const [currentTime, setCurrentTime] = useState(new Date().toUTCString());
  const [, startTransition] = useTransition();

  // Run dynamic UT clocks representing UTC timestamps
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Run Startup boot loader sequence (complete under 1.6s)
  useEffect(() => {
    const logs = [
      "⚡ INITIATING DEVOS SYSTEM DIAGNOSTICS...",
      "🔍 DISCOVERING CPU VIRTUAL PROCESSORS... OK",
      "📦 COMPILING RELATIONAL DATABASE MODELS... OK",
      "🔐 BCRYPT PASSWORD CRYPTO SALTING... COMPLIANT",
      "🌐 MOUNTING GMAIL NODEMAILER SMTP SOCKETS... ENGAGED",
      "🤖 COUPLING GOOGLE GEMINI FLASH ENGINES... TUNED",
      "🚀 DEVOS WORKSPACE COMPREHENSIVE SHELL LOAD SUCCESS!"
    ];

    let currentLogIdx = 0;
    const interval = setInterval(() => {
      if (currentLogIdx < logs.length) {
        setBootLogLines(prev => [...prev, logs[currentLogIdx]]);
        currentLogIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsBooting(false);
        }, 150);
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  // Fetch initial records and active JWT session from storage on startup
  useEffect(() => {
    const token = localStorage.getItem("devos_token");
    const userRaw = localStorage.getItem("devos_user_raw");
    
    if (token && userRaw) {
      try {
        const parsed = JSON.parse(userRaw);
        setCurrentUser(parsed);
        setAuthToken(token);
      } catch {
        localStorage.removeItem("devos_token");
        localStorage.removeItem("devos_user_raw");
      }
    }
    setAuthChecked(true);
  }, []);

  const fetchWorkspaceData = async () => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (githubUsername) {
        headers["x-github-username"] = githubUsername;
      }
      
      const [projRes, logRes] = await Promise.all([
        fetch("/api/projects", { headers }),
        fetch("/api/practice", { headers })
      ]);
      
      if (projRes.ok) {
        const projs = await projRes.json();
        setProjects(projs);
      }
      if (logRes.ok) {
        const loadedLogs = await logRes.json();
        setLogs(loadedLogs);
      }
    } catch (err) {
      console.warn("Express server standby.");
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [githubUsername]);

  // Handle successful login or validation handshakes
  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
  };

  // Sign out and erase local JWT variables securely
  const handleLogout = () => {
    localStorage.removeItem("devos_token");
    localStorage.removeItem("devos_user_raw");
    localStorage.removeItem("devos_github_username");
    setCurrentUser(null);
    setAuthToken(null);
    setGithubUsername("");
    setProjects([]);
    setLogs([]);
    setActiveTab("dashboard");
  };

  const handleLinkGithubUsername = (username: string) => {
    localStorage.setItem("devos_github_username", username);
    setGithubUsername(username);
  };

  const handleDisconnectGithub = () => {
    localStorage.removeItem("devos_github_username");
    setGithubUsername("");
  };

  // Add Project helper
  const handleAddProject = async (title: string, description: string, category: Project["category"]) => {
    const headers: Record<string, string> = { "Content-Type font-mono": "application/json", "Content-Type": "application/json" };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    if (githubUsername) {
      headers["x-github-username"] = githubUsername;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({ title, description, category })
      });
      if (response.ok) {
        const freshProject = await response.json();
        setProjects((prev) => [freshProject, ...prev]);
      } else {
        throw new Error();
      }
    } catch {
      const fallbackProject: Project = {
        id: "p_" + Date.now().toString(36),
        title,
        description,
        category,
        status: "Backlog",
        progressPercentage: 0,
        createdAt: new Date().toISOString()
      };
      setProjects((prev) => [fallbackProject, ...prev]);
    }
  };

  // Update Project helper
  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    if (githubUsername) {
      headers["x-github-username"] = githubUsername;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const updated = await response.json();
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } else {
        throw new Error();
      }
    } catch {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    }
  };

  // Delete Project helper
  const handleDeleteProject = async (id: string) => {
    const headers: Record<string, string> = {};
    if (githubUsername) {
      headers["x-github-username"] = githubUsername;
    }
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers
      });
      if (response.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        throw new Error();
      }
    } catch {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Add Practice Log helper
  const handleAddLog = async (durationMinutes: number, skillAttributed: string, sessionNotes: string) => {
    const headers: Record<string, string> = { "Content-Type font-mono": "application/json", "Content-Type": "application/json" };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    if (githubUsername) {
      headers["x-github-username"] = githubUsername;
    }

    // Increment study streak when starting to study
    setStreak((prev) => (prev === 0 ? 1 : prev + 1));

    try {
      const response = await fetch("/api/practice", {
        method: "POST",
        headers,
        body: JSON.stringify({ durationMinutes, skillAttributed, sessionNotes })
      });
      if (response.ok) {
        const freshLog = await response.json();
        setLogs((prev) => [freshLog, ...prev]);
      } else {
        throw new Error();
      }
    } catch {
      const fallbackLog: PracticeLog = {
        id: "l_" + Date.now().toString(36),
        durationMinutes,
        skillAttributed,
        sessionNotes,
        loggedAt: new Date().toISOString()
      };
      setLogs((prev) => [fallbackLog, ...prev]);
    }
  };

  // Dynamic skill registration handler
  const handleActivateSkill = (newSkill: Skill) => {
    setSkills((prev) => {
      if (prev.some((sk) => sk.key === newSkill.key)) {
        return prev;
      }
      return [...prev, newSkill];
    });
  };

  // Skill progression XP update logic
  const handleGrantXp = (skillKey: string, amount: number) => {
    setSkills((prevSkills) => {
      let isLevelUpOccurred = false;
      const updatedSkills = prevSkills.map((sk) => {
        if (sk.key === skillKey) {
          const nextXp = sk.xp + amount;
          const currentThresh = sk.level * 1000;
          if (nextXp >= currentThresh) {
            isLevelUpOccurred = true;
            return {
              ...sk,
              xp: nextXp - currentThresh,
              level: sk.level + 1
            };
          }
          return { ...sk, xp: nextXp };
        }
        return sk;
      });

      if (isLevelUpOccurred) {
        setGlobalXp((prev) => prev + 500);
        setLevel((prev) => prev + 1);
        setStreak((prev) => prev + 1);
      } else {
        setGlobalXp((prev) => prev + amount);
      }

      return updatedSkills;
    });
  };

  // Roadmap list sync helpers
  const handleAddRoadmap = (roadmap: Roadmap) => {
    setRoadmaps((prev) => [roadmap, ...prev]);
  };

  const handleUpdateRoadmap = (id: string, updates: Partial<Roadmap>) => {
    setRoadmaps((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  // Computed metrics
  const totalPracticeHours = Math.round(logs.reduce((sum, log) => sum + log.durationMinutes, 0) / 60 * 10) / 10;
  const completedProjectsCount = projects.filter(p => p.status === "Done").length;
  const activeProjectsCount = projects.filter(p => p.status === "Active").length;

  // Render booting experience screen
  if (isBooting) {
    const progressPercent = Math.min(Math.round((bootLogLines.length / 7) * 100), 100);
    return (
      <div className="min-h-screen bg-[#040508] flex flex-col items-center justify-center p-6 text-zinc-300 relative overflow-hidden select-none">
        {/* Subtle ambient blur backdrops */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full space-y-8 z-10"
        >
          {/* Header area with animated system logo */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              {/* Outer spinning ring */}
              <div className="absolute -inset-2 rounded-full border border-blue-500/20 border-t-blue-500 border-r-emerald-500 animate-spin duration-1000"></div>
              
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-mono font-black text-2xl tracking-tighter shadow-xl shadow-blue-500/20 relative">
                D
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#040508]"></span>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <h2 className="text-base font-black text-white tracking-[0.25em] leading-none uppercase font-mono">
                DEVOS WORKSTATION
              </h2>
              <span className="text-[9px] text-zinc-500 block tracking-[0.3em] font-mono font-bold mt-1.5 uppercase">
                Secure Bootloader v2.4 (Active Shell)
              </span>
            </div>
          </div>

          {/* Cinematic Neon Progress Gauge Card */}
          <div className="bg-[#090a10]/95 border border-zinc-850/80 p-6 rounded-xl shadow-2xl relative space-y-5">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>

            {/* Circular Load Meter & Percentage */}
            <div className="flex items-center justify-between font-mono">
              <div className="space-y-1 text-left">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">Core State Connection</span>
                <span className="text-xs text-white font-bold tracking-tight">Synchronizing clusters...</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-mono tracking-tighter">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Micro Linear Progress bar */}
            <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Diagnostics compiling output block */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-900/60 font-mono text-[9.5px] leading-relaxed space-y-1.5 text-zinc-400 min-h-[140px] flex flex-col justify-end">
              {bootLogLines.map((line, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="text-zinc-600 font-bold select-none">[0x{idx}]</span>
                  <span className={idx === bootLogLines.length - 1 ? "text-emerald-400 font-bold animate-pulse" : "text-zinc-400"}>
                    {line}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-blue-400 text-[8px] pt-1.5 border-t border-zinc-900/40 mt-1 select-none font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                <span>SYSTEM_COMPILE_THREAD_PENDING_OK</span>
              </div>
            </div>
          </div>

          {/* Secure gateway notice footer */}
          <p className="text-center font-mono text-[9px] tracking-wider text-zinc-650 font-bold select-none uppercase">
            STRICT RSA SIGNED SHELL AUTHENTICATOR
          </p>
        </motion.div>
      </div>
    );
  }

  // If unauthenticated or unverified, redirect to the secure authorization and verification card
  if (!currentUser || !currentUser.isVerified) {
    return (
      <div className="min-h-screen bg-[#07080b] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Ambient Blur */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-900/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <AuthInterface 
          onAuthSuccess={handleAuthSuccess} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-zinc-300 font-sans flex flex-col antialiased">
      {/* Root HUD Terminal Line */}
      <div className="w-full bg-[#0d0e12] border-b border-zinc-850 px-4 py-1.5 flex justify-between items-center text-[10px] font-mono tracking-wider text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SECURITY_STATUS: VERIFIED
          </span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline text-zinc-400">DEVELOPER: {currentUser.username} ({currentUser.email})</span>
          <span className="hidden lg:inline">|</span>
          <span className="hidden lg:inline">SESSION_SECRET: JWT_SIGNED_COOKIE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>UTC: {currentTime}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-red-400 transition-all font-mono font-bold uppercase border border-zinc-800 hover:border-red-900 bg-zinc-950 px-2 py-0.5 rounded cursor-pointer"
          >
            <LogOut className="w-3 h-3 text-red-400" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Structural Operating Rail */}
      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Sidebar Space-Saving Controller Navigation */}
        <nav className="w-full lg:w-64 bg-[#0d0e12] border-b lg:border-b-0 lg:border-r border-zinc-850 p-4 space-y-6 flex-shrink-0 flex flex-col justify-between">
          <div className="space-y-6 text-left">
            {/* Logo area */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-lg select-none shadow-md">
                D
              </div>
              <div className="text-left leading-none">
                <span className="font-bold text-sm text-white tracking-widest block font-mono">DEVOS</span>
                <span className="text-[9px] text-zinc-500 block tracking-widest font-mono mt-0.5">OPERATING SYSTEM</span>
              </div>
            </div>

            {/* Profile Level XP HUD */}
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-900/80 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-400">DEV_LVL:</span>
                <span className="font-bold text-blue-400 font-mono">0{level}</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${Math.min(100, (globalXp % 1000) / 10)}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-zinc-500 tracking-wider">
                <span>XP: {globalXp % 1000}/1000</span>
                <span>TOTAL: {globalXp} XP</span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-650 px-2.5 block mb-2 tracking-widest uppercase">
                Console Panels
              </span>
              
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-medium rounded-lg tracking-wide transition-all ${
                  activeTab === "dashboard"
                    ? "bg-blue-600/10 text-blue-400 border border-blue-900/30"
                    : "text-zinc-400 hover:text-white border border-transparent hover:bg-zinc-950/50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                HUD Dashboard
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-medium rounded-lg tracking-wide transition-all ${
                  activeTab === "projects"
                    ? "bg-blue-600/10 text-blue-400 border border-blue-900/30"
                    : "text-zinc-400 hover:text-white border border-transparent hover:bg-zinc-950/50"
                }`}
              >
                <Kanban className="w-4 h-4" />
                Project Board
              </button>

              <button
                onClick={() => setActiveTab("practice")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-medium rounded-lg tracking-wide transition-all ${
                  activeTab === "practice"
                    ? "bg-blue-600/10 text-blue-400 border border-blue-900/30"
                    : "text-zinc-400 hover:text-white border border-transparent hover:bg-zinc-950/50"
                }`}
              >
                <Clock className="w-4 h-4" />
                Practice Clock
              </button>

              <button
                onClick={() => setActiveTab("github")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-medium rounded-lg tracking-wide transition-all ${
                  activeTab === "github"
                    ? "bg-blue-600/10 text-blue-400 border border-blue-900/30"
                    : "text-zinc-400 hover:text-white border border-transparent hover:bg-zinc-950/50"
                }`}
              >
                <Github className="w-4 h-4" />
                GitHub Analytics
              </button>

              <button
                onClick={() => setActiveTab("resume")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-medium rounded-lg tracking-wide transition-all ${
                  activeTab === "resume"
                    ? "bg-blue-600/10 text-blue-400 border border-blue-900/30"
                    : "text-zinc-400 hover:text-white border border-transparent hover:bg-zinc-950/50"
                }`}
              >
                <Zap className="w-4 h-4" />
                AI Career Optimizer
              </button>

              <button
                onClick={() => setActiveTab("roadmaps")}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-medium rounded-lg tracking-wide transition-all ${
                  activeTab === "roadmaps"
                    ? "bg-blue-600/10 text-blue-400 border border-blue-900/30"
                    : "text-zinc-400 hover:text-white border border-transparent hover:bg-zinc-950/50"
                }`}
              >
                <Cpu className="w-4 h-4" />
                AI Study Agent
              </button>

              {/* Removed Architect Specs navigation button */}
            </div>
          </div>

          {/* User Email Info / Footer controls */}
          <div className="pt-4 border-t border-zinc-850/80 text-left font-mono text-[10px] text-zinc-550 space-y-1.5 hidden lg:block">
            <div className="flex items-center gap-1.5 text-zinc-450 uppercase">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>JWT AUTH COUPLING</span>
            </div>
            <div>STAGING: DEPLOY_READY</div>
            <div className="text-[9px] text-blue-500/80 font-bold tracking-widest uppercase flex items-center gap-1">
              <span>SYSTEM_STABLE</span>
            </div>
          </div>
        </nav>

        {/* Core Workspace Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* HUD Stats Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  {/* Streak Card */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850/80 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">STUDY_STREAK</span>
                      <span className="text-2xl font-bold font-mono text-amber-500">{streak} Days</span>
                      <span className="text-[10px] text-zinc-550 block leading-tight">Consistent performance active.</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-900/30 flex items-center justify-center text-amber-400">
                      <Flame className="w-5 h-5 flex-shrink-0 animate-pulse" />
                    </div>
                  </div>

                  {/* Practice Hours Card */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850/80 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">PRACTICE_HRS</span>
                      <span className="text-2xl font-bold font-mono text-green-500">{totalPracticeHours} Hrs</span>
                      <span className="text-[10px] text-zinc-550 block leading-tight">{logs.length} logged target sessions.</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-green-950/60 border border-green-900/30 flex items-center justify-center text-green-400">
                      <Clock className="w-5 h-5 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Completed Projects Card */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850/80 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">SHIPPED_PRJS</span>
                      <span className="text-2xl font-bold font-mono text-cyan-500">{completedProjectsCount} Cards</span>
                      <span className="text-[10px] text-zinc-550 block leading-tight">{activeProjectsCount} active runs on sprint.</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-900/30 flex items-center justify-center text-cyan-400">
                      <Award className="w-5 h-5 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Current AI Roadmaps Card */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850/80 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">AI_CURRICULA</span>
                      <span className="text-2xl font-bold font-mono text-blue-500">{roadmaps.length} Tracks</span>
                      <span className="text-[10px] text-zinc-550 block leading-tight">Interactive learning checkmarks.</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-900/30 flex items-center justify-center text-blue-400">
                      <Cpu className="w-5 h-5 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Dashboard Customizer Toggler */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850/80 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-blue-400" />
                      Dashboard Layout Module Customizer
                    </h3>
                    <p className="text-[10px] text-zinc-500">
                      Rearrange, toggle, and configure physical dashboard panels to maximize recruitment study focus.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCustomizerPanel(!showCustomizerPanel)}
                    className="p-1 px-3 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 font-mono rounded hover:bg-zinc-800 cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Sliders className="w-3 h-3 text-blue-500" />
                    {showCustomizerPanel ? "HIDE CONTROLS" : "TOGGLE LAYOUTS"}
                  </button>
                </div>

                {/* Customizer Panel Drawer */}
                {showCustomizerPanel && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-4 text-left grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="space-y-2 p-3 bg-zinc-900 border border-zinc-850 rounded-lg">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 block pb-1 border-b border-zinc-850">SKILL_MATRIX</span>
                      <div className="flex items-center justify-between gap-2.5 pt-1.5">
                        <span className="text-xs font-semibold text-white">Render Skill Progress Grid</span>
                        <input
                          type="checkbox"
                          checked={showSkillMatrix}
                          onChange={(e) => setShowSkillMatrix(e.target.checked)}
                          className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 p-3 bg-zinc-900 border border-zinc-850 rounded-lg">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 block pb-1 border-b border-zinc-850">LOGS_SHELL</span>
                      <div className="flex items-center justify-between gap-2.5 pt-1.5">
                        <span className="text-xs font-semibold text-white">Show System Operating Logs</span>
                        <input
                          type="checkbox"
                          checked={showLogsModule}
                          onChange={(e) => setShowLogsModule(e.target.checked)}
                          className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 p-3 bg-zinc-900 border border-zinc-850 rounded-lg">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 block pb-1 border-b border-zinc-850">SPRINT_WIDGET</span>
                      <div className="flex items-center justify-between gap-2.5 pt-1.5">
                        <span className="text-xs font-semibold text-white">Active Sprint Summary List</span>
                        <input
                          type="checkbox"
                          checked={showSprintWidget}
                          onChange={(e) => setShowSprintWidget(e.target.checked)}
                          className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
                      <div className="space-y-2 p-3 bg-zinc-900 border border-zinc-850 rounded-lg">
                        <span className="text-[10px] font-mono font-bold text-amber-500 block pb-1 border-b border-zinc-850 uppercase">SPECIFY_CURRENT_STREAK</span>
                        <div className="flex items-center justify-between gap-3 pt-2">
                          <span className="text-xs font-semibold text-white">Specify Active Streak Days</span>
                          <input
                            type="number"
                            min="0"
                            value={streak}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setStreak(isNaN(val) ? 0 : val);
                            }}
                            className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white font-mono w-24 text-center focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <p className="text-[9px] text-zinc-500 mt-1">Overriding consistency values here registers directly to active character statistics.</p>
                      </div>

                      <div className="space-y-2 p-3 bg-zinc-900 border border-zinc-850 rounded-lg">
                        <span className="text-[10px] font-mono font-bold text-blue-400 block pb-1 border-b border-zinc-850 uppercase">SPECIFY_CHARACTER_LEVEL</span>
                        <div className="flex items-center justify-between gap-3 pt-2">
                          <span className="text-xs font-semibold text-white">Specify Baseline Level</span>
                          <input
                            type="number"
                            min="1"
                            value={level}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setLevel(isNaN(val) ? 1 : val);
                            }}
                            className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white font-mono w-24 text-center focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <p className="text-[9px] text-zinc-500 mt-1">Manually configure the baseline rank displayed on HUD widgets.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Dedicated Career Goals Engine Module */}
                <div id="dashboard-goals-panel" className="space-y-3.5">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <h2 className="text-sm font-extrabold tracking-widest text-white uppercase font-mono">
                      Phase 1 — Career Goal Engine (PostgreSQL Sync)
                    </h2>
                  </div>
                  <CareerGoalPanel />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Skill Matrix Progress */}
                  {showSkillMatrix && (
                    <div className="lg:col-span-2 space-y-4 text-left">
                      <DeveloperSkillsMatrix
                        skills={skills}
                        logs={logs}
                        projects={projects}
                        onActivateSkill={handleActivateSkill}
                        onGrantXp={handleGrantXp}
                      />
                    </div>
                  )}

                  {/* Right Column: Mini Dashboard Panels */}
                  <div className="space-y-4 text-left">
                    {/* Architectural shell logs */}
                    {showLogsModule && (
                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850 text-left space-y-3.5">
                        <h3 className="text-xs font-bold font-mono text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
                          <Terminal className="w-4 h-4 text-blue-500" />
                          Operating System Shell Logs
                        </h3>
                        <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg text-[9px] font-mono text-green-500 leading-relaxed font-semibold max-h-[170px] overflow-auto whitespace-pre space-y-1 scrollbar-none">
                          <div>[system] DevOS Workspace Handshake: ok</div>
                          <div>[session] Active Developer: {currentUser.username}</div>
                          <div>[github] Status: {githubUsername ? `Connected as @${githubUsername}` : "Disconnect / Off"}</div>
                          <div>[metrics] Active Kanban cards: {projects.length}</div>
                          <div>[metrics] Clock logs recorded: {logs.length}</div>
                        </div>
                        
                        <button
                          onClick={() => setActiveTab("github")}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 hover:border-zinc-750 font-mono text-[9px] text-zinc-400 hover:text-white transition-all uppercase font-bold cursor-pointer"
                        >
                          Configure GitHub Sync
                          <Github className="w-3 text-purple-400" />
                        </button>
                      </div>
                    )}

                    {/* Active checklist sprint summary */}
                    {showSprintWidget && (
                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850 space-y-3">
                        <h3 className="text-xs font-bold font-mono text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                          Active Sprint Summary
                        </h3>
                        <div className="space-y-2.5">
                          {projects.slice(0, 3).map(p => (
                            <div key={p.id} className="flex justify-between items-center text-xs border-b border-zinc-900 pb-1.5">
                              <span className="text-zinc-300 font-medium truncate max-w-[120px]">{p.title}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold ${
                                p.status === "Done" ? "bg-emerald-950 text-emerald-400 border border-emerald-900" :
                                p.status === "Testing" ? "bg-amber-950 text-amber-400 border border-amber-900" :
                                "bg-zinc-805 text-zinc-400 border border-zinc-800"
                              }`}>{p.status}</span>
                            </div>
                          ))}
                          {projects.length === 0 && (
                            <div className="text-center py-2 text-[10px] font-mono text-zinc-650">No sprint cards found.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ProjectBoard
                  projects={projects}
                  skills={skills}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  onGrantXp={handleGrantXp}
                />
              </motion.div>
            )}

            {activeTab === "practice" && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PracticeLogComponent
                  logs={logs}
                  skills={skills}
                  onAddLog={handleAddLog}
                  onGrantXp={handleGrantXp}
                />
              </motion.div>
            )}

            {activeTab === "github" && (
              <motion.div
                key="github"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-purple-400" />
                    <h2 className="text-sm font-extrabold tracking-widest text-white uppercase font-mono">
                      Phase 3 — GitHub Analytics Connector
                    </h2>
                  </div>
                  <GithubContributionGrid
                    linkedUsername={githubUsername}
                    onLinkGithub={handleLinkGithubUsername}
                    onDisconnectGithub={handleDisconnectGithub}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "resume" && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                    <h2 className="text-sm font-extrabold tracking-widest text-white uppercase font-mono">
                      Phase 3/4 — AI Resume Builder & Bio Builder
                    </h2>
                  </div>
                  <ResumeBuilderPanel />
                </div>
              </motion.div>
            )}

            {activeTab === "roadmaps" && (
              <motion.div
                key="roadmaps"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <RoadmapWizard
                  roadmaps={roadmaps}
                  skills={skills}
                  onAddRoadmap={handleAddRoadmap}
                  onUpdateRoadmap={handleUpdateRoadmap}
                  onGrantXp={handleGrantXp}
                />
              </motion.div>
            )}

            {/* Deleted Architect Console rendering tab */}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
