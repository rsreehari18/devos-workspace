import { Skill } from "../types";

export const defaultSkills: Skill[] = [
  { key: "TypeScript", name: "TypeScript & ESM", category: "Languages", xp: 0, level: 1, color: "bg-blue-500 text-blue-500" },
  { key: "React", name: "React 19 & State Flow", category: "Frontend", xp: 0, level: 1, color: "bg-cyan-500 text-cyan-500" },
  { key: "Node.js", name: "Node.js & Express", category: "Backend", xp: 0, level: 1, color: "bg-green-500 text-green-500" },
  { key: "PostgreSQL", name: "PostgreSQL & Database DDL", category: "Database", xp: 0, level: 1, color: "bg-indigo-500 text-indigo-500" },
  { key: "DevOps", name: "DevOps & Containers", category: "Infrastructure", xp: 0, level: 1, color: "bg-amber-500 text-amber-500" },
  { key: "Rust", name: "Rust Systems Coder", category: "Systems", xp: 0, level: 1, color: "bg-rose-500 text-rose-500" }
];
