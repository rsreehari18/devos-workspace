import React, { useState, useTransition } from "react";
import { architectDeliverables } from "../architectData";
import { PlayCircle, ShieldCheck, Terminal, Layers, Database, Code, FolderGit2, CheckSquare, CalendarDays, Loader2, Sparkles, Check, Send } from "lucide-react";
import { motion } from "motion/react";

export default function ArchitectConsole() {
  const [activeTab, setActiveTab] = useState("srs");
  
  // Interactive API Client Sandbox state
  const [sandboxRoute, setSandboxRoute] = useState("GET /api/projects");
  const [sandboxBody, setSandboxBody] = useState(`{
  "title": "OAuth Security Handler",
  "category": "Backend",
  "description": "Authenticate OAuth tokens dynamically."
}`);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  const handleSandboxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);
    setApiResponse(null);
    setApiStatus(null);

    const [method, pathStr] = sandboxRoute.split(" ");
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json"
        }
      };

      if (method === "POST" || method === "PATCH") {
        options.body = sandboxBody;
      }

      const response = await fetch(pathStr, options);
      setApiStatus(response.status);
      const data = await response.json();
      setApiResponse(data);
    } catch (err: any) {
      console.error(err);
      setApiResponse({ error: "Failed to connect to the Express Port 3000 container backend service. Please try again." });
    } finally {
      setApiLoading(false);
    }
  };

  const handleRoutePreset = (route: string) => {
    setSandboxRoute(route);
    setApiResponse(null);
    setApiStatus(null);
    if (route.includes("register")) {
      setSandboxBody(`{
  "email": "innovator@devos.io",
  "username": "codeninja",
  "password": "Password99"
}`);
    } else if (route.includes("login")) {
      setSandboxBody(`{
  "username": "codemaster",
  "password": "SecurePassword123"
}`);
    } else if (route === "POST /api/projects") {
      setSandboxBody(`{
  "title": "React 19 Concurrent Renderer",
  "category": "Frontend",
  "description": "Migrate the dashboard widgets into React 19 fibers."
}`);
    } else if (route === "POST /api/practice") {
      setSandboxBody(`{
  "durationMinutes": 45,
  "skillAttributed": "PostgreSQL",
  "sessionNotes": "Debugged connection parameters and vacuum triggers."
}`);
    } else if (route.includes("generate")) {
      setSandboxBody(`{
  "topic": "Docker Containerization"
}`);
    } else {
      setSandboxBody("");
    }
  };

  const getTabIcon = (id: string) => {
    switch (id) {
      case "srs": return <ShieldCheck className="w-4 h-4" />;
      case "user-stories": return <Terminal className="w-4 h-4" />;
      case "functional-requirements": return <CheckSquare className="w-4 h-4" />;
      case "nfr": return <Layers className="w-4 h-4" />;
      case "system-architecture": return <Layers className="w-4 h-4" />;
      case "database-schema": return <Database className="w-4 h-4" />;
      case "api-design": return <Code className="w-4 h-4" />;
      case "folder-structure": return <FolderGit2 className="w-4 h-4" />;
      default: return <CalendarDays className="w-4 h-4" />;
    }
  };

  const activeDeliverable = architectDeliverables.find(d => d.id === activeTab) || architectDeliverables[0];

  return (
    <div id="architect-console" className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800/80 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Layers className="w-40 h-40" />
        </div>
        
        <div className="max-w-3xl space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-blue-400 font-bold uppercase py-1 px-2.5 rounded bg-blue-950/40 border border-blue-900/30">
            Senior Software Architect Cockpit
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
            System Design & Scaling Blueprints
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Review detailed production-grade specifications, interactive database maps, or use the live REST sandbox client to trigger and monitor HTTP packet flow reaching our Node/Express backend.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="xl:col-span-1 space-y-4 text-left">
          <div className="p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider px-2 block mb-2">
              Deliverables Matrix
            </span>
            {architectDeliverables.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg font-mono tracking-wide transition-all ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {getTabIcon(item.id)}
                <span className="truncate">{item.title.substring(3)}</span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-zinc-900/40 border border-zinc-850/60 rounded-xl space-y-1 text-xs text-zinc-500 font-mono">
            <div className="flex items-center gap-1 text-zinc-400 uppercase font-bold mb-1.5 text-[9px] px-2 tracking-widest">
              <span>Host Node Status</span>
            </div>
            <div className="flex justify-between px-2 py-0.5">
              <span>Port Bind:</span>
              <span className="text-zinc-300">3000 / ingress-ssl</span>
            </div>
            <div className="flex justify-between px-2 py-0.5">
              <span>Database Engine:</span>
              <span className="text-zinc-300">PostgreSQL 16 CLI</span>
            </div>
            <div className="flex justify-between px-2 py-0.5">
              <span>Server Language:</span>
              <span className="text-zinc-300">ESM TypeScript 5.8</span>
            </div>
            <div className="flex justify-between px-2 py-0.5">
              <span>Auth Middleware:</span>
              <span className="text-zinc-300">HS256 SHA-Signed JWT</span>
            </div>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="xl:col-span-3 space-y-6">
          {/* Main detailed docs viewer */}
          <div className="p-5 md:p-7 rounded-xl bg-zinc-900 border border-zinc-800 text-left min-h-[400px] flex flex-col justify-between">
            <div className="prose prose-invert max-w-none text-zinc-300 space-y-4 text-xs select-text">
              <h3 className="text-lg font-bold text-white tracking-tight border-b border-zinc-800 pb-3 mb-4 font-mono flex items-center gap-2">
                {getTabIcon(activeDeliverable.id)}
                {activeDeliverable.title}
              </h3>
              
              <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed leading-6 border border-zinc-850 p-4 rounded-xl bg-zinc-950/40 select-text max-h-[600px] overflow-y-auto">
                {activeDeliverable.markdown}
              </div>
            </div>

            {/* Custom visual expansions for database tab */}
            {activeTab === "database-schema" && (
              <div className="mt-6 pt-5 border-t border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold font-mono tracking-wider text-blue-400 uppercase flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  Interactive PostgreSQL Schema ERD Node Relationship Graphic
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-[10px]">
                  {/* Users */}
                  <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-left space-y-2">
                    <span className="text-xs font-bold text-white block border-b border-zinc-800 pb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      1. users
                    </span>
                    <div className="text-zinc-400 space-y-0.5">
                      <div className="text-zinc-300"><span className="text-blue-500 font-bold">id</span> SERIAL [PK]</div>
                      <div>email: VARCHAR(255)</div>
                      <div>username: VARCHAR(100)</div>
                      <div>password_hash: VARCHAR(255)</div>
                      <div className="text-[9px] text-zinc-500">created_at: TIMESTAMP</div>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-left space-y-2">
                    <span className="text-xs font-bold text-white block border-b border-zinc-800 pb-1 flex items-center gap-1.5 align-middle">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      2. projects
                    </span>
                    <div className="text-zinc-400 space-y-0.5">
                      <div className="text-zinc-300"><span className="text-blue-500">id</span> SERIAL [PK]</div>
                      <div className="text-zinc-300"><span className="text-amber-500">user_id</span> INT [FK Users]</div>
                      <div>title: VARCHAR(255)</div>
                      <div>category: VARCHAR(50)</div>
                      <div>status: VARCHAR(20)</div>
                      <div className="text-[9px] text-zinc-500">Constraint: progress &lt;= 100</div>
                    </div>
                  </div>

                  {/* PracticeLogs */}
                  <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-left space-y-2">
                    <span className="text-xs font-bold text-white block border-b border-zinc-800 pb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      3. practice_logs
                    </span>
                    <div className="text-zinc-400 space-y-0.5">
                      <div className="text-zinc-300"><span className="text-blue-500">id</span> SERIAL [PK]</div>
                      <div className="text-zinc-300"><span className="text-amber-500">user_id</span> INT [FK Users]</div>
                      <div>duration_minutes: INT</div>
                      <div>skill_attributed: VARCHAR(50)</div>
                      <div className="text-[9px] text-zinc-500">logged_at: TIMESTAMP</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom interactive sandbox for API tab */}
            {activeTab === "api-design" && (
              <div className="mt-6 pt-5 border-t border-zinc-800 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                  <div className="text-left">
                    <h4 className="text-xs font-bold font-mono tracking-wider text-green-400 uppercase flex items-center gap-1.5">
                      <PlayCircle className="w-3.5 h-3.5" />
                      DevOS Real-Time REST Sandbox Client (Port 3000 Loop)
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-sans mt-0.5">
                      Send actual queries down to the running Express applet container. Review incoming raw results.
                    </p>
                  </div>
                  
                  {/* Endpoint selectors */}
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleRoutePreset("GET /api/projects")}
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-mono hover:bg-zinc-800 text-zinc-300 rounded"
                    >
                      GET Projects
                    </button>
                    <button
                      onClick={() => handleRoutePreset("POST /api/projects")}
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-mono hover:bg-zinc-800 text-zinc-300 rounded"
                    >
                      POST Project
                    </button>
                    <button
                      onClick={() => handleRoutePreset("GET /api/practice")}
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-mono hover:bg-zinc-800 text-zinc-300 rounded"
                    >
                      GET Logs
                    </button>
                    <button
                      onClick={() => handleRoutePreset("POST /api/practice")}
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-mono hover:bg-zinc-800 text-zinc-300 rounded"
                    >
                      POST Log
                    </button>
                    <button
                      onClick={() => handleRoutePreset("POST /api/auth/register")}
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-mono hover:bg-zinc-800 text-zinc-300 rounded"
                    >
                      POST Register
                    </button>
                    <button
                      onClick={() => handleRoutePreset("POST /api/auth/login")}
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-mono hover:bg-zinc-800 text-zinc-300 rounded"
                    >
                      POST Login
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSandboxSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400">Target Request Path URL</label>
                      <input
                        type="text"
                        value={sandboxRoute}
                        onChange={(e) => setSandboxRoute(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded font-mono text-[11px] text-white focus:outline-none focus:border-green-500"
                      />
                    </div>

                    {(sandboxRoute.startsWith("POST") || sandboxRoute.startsWith("PATCH")) && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                          <span>Payload Schema (JSON)</span>
                          <span className="text-zinc-600">application/json</span>
                        </div>
                        <textarea
                          rows={6}
                          value={sandboxBody}
                          onChange={(e) => setSandboxBody(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 rounded font-mono text-[10px] text-green-500 placeholder-zinc-700 focus:outline-none focus:border-green-500"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={apiLoading}
                      className="w-full py-2 bg-green-700 hover:bg-green-600 text-white font-mono text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-40"
                    >
                      {apiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      EXECUTE SANDBOX DISPATCH
                    </button>
                  </div>

                  {/* Sandbox Response Output */}
                  <div className="rounded-lg bg-zinc-950 border border-zinc-850 p-4 flex flex-col">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-2 flex-shrink-0 text-[10px] font-mono">
                      <span className="text-zinc-400 font-bold uppercase tracking-wider">REST Session Response</span>
                      {apiStatus !== null && (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          apiStatus >= 200 && apiStatus < 300
                            ? "bg-emerald-950 border border-emerald-900 text-emerald-400"
                            : "bg-rose-950 border border-rose-900 text-rose-400"
                        }`}>
                          HTTP_{apiStatus}
                        </span>
                      )}
                    </div>

                    <div className="flex-grow font-mono overflow-auto max-h-[220px] text-[10px] leading-relaxed p-2 text-zinc-300">
                      {apiLoading ? (
                        <div className="flex items-center justify-center h-full text-zinc-500 animate-pulse">
                          Awaiting packet resolving...
                        </div>
                      ) : apiResponse ? (
                        <pre className="text-left text-green-400 whitespace-pre">
                          {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-zinc-650">Dispatch a test query using credentials or CRUD operations above to evaluate live payload structures.</span>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
