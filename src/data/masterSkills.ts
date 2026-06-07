import { Skill } from "../types";

export const masterSkills: Omit<Skill, "xp" | "level">[] = [
  // --- Languages ---
  { key: "TypeScript", name: "TypeScript & ESM", category: "Languages", color: "bg-blue-500 text-blue-500" },
  { key: "JavaScript", name: "JavaScript (ES6+)", category: "Languages", color: "bg-yellow-500 text-yellow-500" },
  { key: "Python", name: "Python Core & PySpark", category: "Languages", color: "bg-emerald-500 text-emerald-500" },
  { key: "Go", name: "Go Lang (Golang)", category: "Languages", color: "bg-cyan-500 text-cyan-500" },
  { key: "Rust", name: "Rust Systems Core", category: "Languages", color: "bg-rose-500 text-rose-500" },
  { key: "Java", name: "Java & Enterprise Spring", category: "Languages", color: "bg-red-500 text-red-500" },
  { key: "CPP", name: "C++ Systems Development", category: "Languages", color: "bg-indigo-500 text-indigo-500" },
  { key: "Ruby", name: "Ruby & ActiveSupport", category: "Languages", color: "bg-darkred-700 text-red-700" },
  { key: "HTMLCSS", name: "HTML5, CSS3 & Tailwind", category: "Languages", color: "bg-orange-500 text-orange-500" },

  // --- Frontend ---
  { key: "React", name: "React 19 & State Flow", category: "Frontend", color: "bg-cyan-400 text-cyan-400" },
  { key: "Vue", name: "Vue.js & Composition API", category: "Frontend", color: "bg-emerald-400 text-emerald-400" },
  { key: "Svelte", name: "Svelte & SvelteKit Compiler", category: "Frontend", color: "bg-orange-600 text-orange-600" },
  { key: "Nextjs", name: "Next.js & Server Components", category: "Frontend", color: "bg-zinc-300 text-zinc-300" },
  { key: "Angular", name: "Angular & RxJS States", category: "Frontend", color: "bg-red-650 text-red-650" },
  { key: "D3", name: "D3.js Data Visualizations", category: "Frontend", color: "bg-pink-500 text-pink-500" },

  // --- Backend ---
  { key: "Node.js", name: "Node.js & Express API", category: "Backend", color: "bg-green-500 text-green-500" },
  { key: "FastAPI", name: "FastAPI & Python Async", category: "Backend", color: "bg-teal-400 text-teal-400" },
  { key: "Django", name: "Django MVT & Web Framework", category: "Backend", color: "bg-green-800 text-green-800" },
  { key: "Spring", name: "Spring Boot Enterprise Services", category: "Backend", color: "bg-emerald-600 text-emerald-600" },
  { key: "GraphQL", name: "GraphQL & Apollo Graph", category: "Backend", color: "bg-pink-600 text-pink-600" },
  { key: "NestJS", name: "NestJS Dependency Injection", category: "Backend", color: "bg-red-500 text-red-600" },

  // --- Database ---
  { key: "PostgreSQL", name: "PostgreSQL & Database DDL", category: "Database", color: "bg-indigo-500 text-indigo-500" },
  { key: "MySQL", name: "MySQL & Transaction Isolation", category: "Database", color: "bg-sky-600 text-sky-600" },
  { key: "Redis", name: "Redis Cache & Memory PubSub", category: "Database", color: "bg-rose-600 text-rose-600" },
  { key: "MongoDB", name: "MongoDB NoSQL Collections", category: "Database", color: "bg-green-600 text-green-600" },
  { key: "DynamoDB", name: "DynamoDB AWS Persistence", category: "Database", color: "bg-blue-700 text-blue-700" },
  { key: "SQLite", name: "Local SQLite Embedding", category: "Database", color: "bg-slate-400 text-slate-400" },

  // --- DevOps & Cloud ---
  { key: "DevOps", name: "DevOps & Docker Containers", category: "DevOps", color: "bg-amber-500 text-amber-500" },
  { key: "Kubernetes", name: "Kubernetes Pod Orchestration", category: "DevOps", color: "bg-indigo-600 text-indigo-650" },
  { key: "AWS", name: "Amazon Web Services (AWS)", category: "DevOps", color: "bg-orange-400 text-orange-400" },
  { key: "GCP", name: "Google Cloud Platform (GCP)", category: "DevOps", color: "bg-blue-400 text-blue-450" },
  { key: "GitHubActions", name: "CI / CD Pipelines (GitHub Actions)", category: "DevOps", color: "bg-purple-500 text-purple-500" },
  { key: "Terraform", name: "Terraform Infrastructure-as-code", category: "DevOps", color: "bg-purple-600 text-purple-650" },
  { key: "Linux", name: "Linux System Administration", category: "DevOps", color: "bg-zinc-400 text-zinc-450" },

  // --- Systems & General ---
  { key: "Git", name: "Git Versioning & Rebasing", category: "Systems", color: "bg-amber-600 text-amber-650" },
  { key: "DSAlgos", name: "Data Structures & Algorithms", category: "Systems", color: "bg-fuchsia-500 text-fuchsia-500" },
  { key: "SysDesign", name: "Distributed System Design", category: "Systems", color: "bg-sky-500 text-sky-500" },
  { key: "Cybersecurity", name: "Application Security & OIDC", category: "Systems", color: "bg-emerald-500 text-emerald-555" }
];
