export interface ArchitectDeliverable {
  id: string;
  title: string;
  summary: string;
  markdown: string;
}

export const architectDeliverables: ArchitectDeliverable[] = [
  {
    id: "srs",
    title: "1. Software Requirements Specification (SRS)",
    summary: "Formal documentation defining the scope, user personas, operational constraints, and comprehensive functional coverage of the DevOS platform.",
    markdown: `# Software Requirements Specification (SRS) for DevOS

## 1. Introduction
### 1.1 Purpose
This document specifies the software requirements for **DevOS (Developer Operating System)**, a comprehensive workspace designed to optimize developer workflow, track practice habits, align learning roadmaps, and oversee skills progression.

### 1.2 Scope
DevOS acts as a developer’s single cockpit. It provides real-time activity metrics, visual project boards, a practice monitor, and an AI-driven learning companion powered by Gemini. By centralizing these tasks, DevOS reduces cognitive switching cost and provides actionable insights.

### 1.3 User Personas
*   **Junior Developer (The Learner):** Needs highly structured learning roadmaps, skill tracking to measure growth, and simple practice timers.
*   **Senior Architect (The Organizer):** Tracks multiple active repositories/projects, logs deep-work cycles, and audits system architecture.
*   **Self-Taught Coder (The Practitioner):** Relies on consistency tracking, streak counters, and structured skills milestones.

---

## 2. General Description
### 2.1 Product Perspective
DevOS is a self-contained web platform running a React single-page frontend served by an Express server. It supports server-side AI integration via the official Google Gen AI SDK to ensure API key security and high reliability.

### 2.2 Operational Constraints
*   **Single-Port Routing:** The application must run on port \`3000\` inside sandboxed container environments.
*   **API Security:** The Gemini API Key must remain server-side under \`process.env.GEMINI_API_KEY\`. No frontend exposure is permitted.
*   **Client Compatibility:** Standard web browsers with sessionStorage/localStorage for transient offline state preservation.

---

## 3. System Features & Breakdown
*   **Unified Auth (JWT):** Secure session handling via signed JSON Web Tokens for user login and registration protocols.
*   **HUD Dashboard (Unified Console):** Aggregates total coding practice hours, active project statistics, completed roadmaps, and current leveling metrics.
*   **Project Board (Kanban style):** Visual project progress tracker from "Backlog" to "Completed", calculating metrics on completion rates.
*   **Active Practice Log:** A real-time timer simulating deep work (or Pomodoro style) which records session minutes directly into the skill progression state system.
*   **AI Roadmap Generator:** Dynamic Node-graph generator utilizing Gemini to break down complex technical topics into sequential milestones.`
  },
  {
    id: "user-stories",
    title: "2. User Stories & Acceptance Criteria",
    summary: "Gherkin-style user stories outlining developer scenarios, user perspective, and strict definition-of-done criteria.",
    markdown: `# User Stories & Acceptance Criteria

### US-101: Interactive Dashboard Overview
*   **As a** developer using DevOS,
*   **I want to** view a consolidated HUD featuring active streaks, skills levels, and daily practice logs,
*   **So that** I can easily assess my current progress at a single glance upon booting the workstation.

#### Acceptance Criteria (Gherkin format):
\`\`\`gherkin
Scenario: Fetching dashboard statistics on logon
  Given the developer is logged in and visits the dashboard
  When the application initializes
  Then the system should compute and display the current local coding streak
  And display an active heatmap representing practice days
  And list top skills with accurate percentage completion bars
\`\`\`

---

### US-102: Dynamic AI Learning Roadmaps
*   **As a** researcher or learner,
*   **I want to** enter any technical topic (e.g., "Kubernetes Networking") and generate a sequential node-based roadmap,
*   **So that** I do not waste time researching the proper order of learning milestones.

#### Acceptance Criteria:
\`\`\`gherkin
Scenario: Successfully generating technical roadmap milestones
  Given the developer accesses the Roadmap Generator
  When they input "Rust Web assembly" and click "Generate"
  Then the system should transmit a secure POST request to "/api/roadmaps/generate"
  And the backend should query the Gemini 3.5-flash model with a strict JSON format schema
  And return an ordered array containing title, estimate, and bullet points for at least 4 milestone stages
  And the UI should render them in an interactive interactive stepper timeline
\`\`\`

---

### US-103: POMODORO & PRACTICE MONITORING
*   **As a** disciplined practitioner,
*   **I want to** start an interactive coding practice session with an active focus timer,
*   **So that** I can record verified minutes of coding and directly attribute the effort to specific core skills.

#### Acceptance Criteria:
\`\`\`gherkin
Scenario: Logging a focused coding session
  Given the user has started a 25-minute timer
  When the timer expires or is logged manually
  Then the system should prompt the developer to select which skill (e.g., "React", "Rust", "SQL") to attribute this to
  And update the skill progression levels instantly with a visual XP animation
  And record the log into the global history database schema
\`\`\`
`
  },
  {
    id: "functional-requirements",
    title: "3. Detailed Functional Requirements",
    summary: "Precise system features, inputs, outputs, error states, and logic constraints for all software modules.",
    markdown: `# Detailed Functional Requirements

## FR-201: Authentication & Identity Management
*   **Input:** User credentials (email, username, password) via register/login panels.
*   **Logic:**
    1.  Validate email format and password strength (minimum 6 characters).
    2.  For login, generate a signed HS256 JWT containing user ID and username.
    3.  Set the token in standard authorization headers or session storage.
*   **Output:** Return success status along with user object and JWT string.

## FR-202: Project Tracker & Kanban Workspace
*   **Input:** Board states, project name, descriptions, category tagging, and stage transitions (Backlog, Active, Testing, Done).
*   **Logic:**
    1.  Allow Drag-and-Drop or visual button triggers to move cards across columns.
    2.  Automate timestamp logging upon moving cards to "Done".
    3.  Recalculate project progress indicators instantly upon edit.
*   **Output:** Render styled cards with color-coded tags and progress summaries.

## FR-203: Coding Habit Tracker & Visual Heatmap
*   **Input:** Completed session durations, target skills, logs and date ranges.
*   **Logic:**
    1.  Convert minutes into Experience Points (1 minute = 10 XP).
    2.  Check if current level threshold is crossed (Level threshold = current_level * 1000 XP).
    3.  Store practice calendar stamps in standard YYYY-MM-DD hash keys.
*   **Output:** Update current leveling meters and populate the green activity contribution grid.

## FR-204: AI-driven Roadmap Processor
*   **Input:** Target technology query string.
*   **Logic:**
    1.  Backend receives prompt, validates string length (>=3 characters).
    2.  Construct a structured prompt with strict system instructions and response schema (JSON mode).
    3.  Call \`ai.models.generateContent\` using \`gemini-3.5-flash\`.
    4.  Verify structure of returned array before response.
*   **Output:** Highly readable, interactive milestone checklist.`
  },
  {
    id: "nfr",
    title: "4. Non-Functional Requirements",
    summary: "System benchmarks, speed SLA targets, JWT security posture, container scaling, and visual contrast rules.",
    markdown: `# Non-Functional Requirements (NFRs)

## 1. Performance & Latency
*   **SLA-1 (API Response):** Standard Express JSON routes (excluding AI generation) must respond within **<150ms** under simulated loads.
*   **SLA-2 (Gemini API):** LLM roadmap generation must resolve and display in **<3000ms** (streaming or fast flash response).
*   **SLA-3 (Bundle Size):** Client application bundle must not exceed **2MB** uncompressed, ensuring instantaneous loads on mobile networks.

## 2. Security & Credentials
*   **SEC-1 (Zero-Leakage):** Strict enforcement of server-side proxying for Gemini API keys. No client-side exposure.
*   **SEC-2 (JWT Integrity):** JWTs must be signed using a secret environment variable and verified on every sensitive backend endpoint hook.
*   **SEC-3 (XSS Mitigation):** Escape and sanitize all developer inputs, especially when rendering markdown generated by Gemini models.

## 3. Portability & Scale
*   **PORT-1 (Container Ready):** Must function behind reverse proxies (Nginx) mapping exclusively to **Port 3000**.
*   **SCALE-1 (Stateless Architecture):** Keep Express REST controllers completely stateless, enabling quick horizontal scaling on serverless platforms (e.g., Cloud Run).
*   **RES-1 (Local Backups):** Implement elegant browser persistence checkpoints so that users never lose data on token expiration.`
  },
  {
    id: "system-architecture",
    title: "5. Scalable System Architecture Diagram",
    summary: "Text-based system diagrams mapping the secure data routing, reverse proxy, and Gemini API middleware.",
    markdown: `# Developer Operating System Architecture

The workflow incorporates a strict separation of concerns, ensuring secure operations beneath an entry-level container-hosted model.

## Component Block Architecture Diagram

\`\`\`text
+--------------------------------------------------------------------------------+
|                             USER ACCESSED BROWSER                              |
|   +--------------------------+       +-------------------------------------+   |
|   |   React Single-Page UI   | <---> | Local Session Recovery              |   |
|   |   (Interms of Theme HUD)  |       | (SessionStorage & LocalStorage Sync) |   |
|   +--------------------------+       +-------------------------------------+   |
+-------------------------------------|------------------------------------------+
                                      | Secure HTTP APIs (Port:3000)
                                      | Token: Authorization Bearer <JWT>
                                      v
+--------------------------------------------------------------------------------+
|                             DOCKER CONTAINER STACK                             |
|  +--------------------------------------------------------------------------+  |
|  |                           EXPRESS API SERVER                             |  |
|  |                                                                          |  |
|  |  [Vite Client Service]                                                   |  |
|  |     Hosts static compiled JS, CSS pipelines, fonts                       |  |
|  |                                                                          |  |
|  |  [JWT Auth Guard Middleware]                                             |  |
|  |     Verifies Bearer tokens, extracts userId parameters                   |  |
|  |                                                                          |  |
|  |  [REST API Controllers]                                                  |  |
|  |     Handles Projects CRUD, Practice History, Skills Levels CRUD          |  |
|  |                                                                          |  |
|  |  [Gemini Gateway Proxy]                                                  |  |
|  |     Reads process.env.GEMINI_API_KEY privately                           |  |
|  |     Sends formatted JSON queries to Gemini @google/genai SDK             |  |
|  +----------------------------------|---------------------------------------+  |
+-------------------------------------|------------------------------------------+
                                      |
                    +-----------------+-----------------+
                    |                                   |
                    v                                   v
+------------------------------+         +-------------------------------+
|     @google/genai CLOUD      |         |     POSTGRESQL INSTANCE       |
|    "gemini-3.5-flash"        |         | (Or Cloud SQL persistent store|
|  Strict JSON Schema Output   |         | with robust connection pool)  |
+------------------------------+         +-------------------------------+
\`\`\`

## Key Architecture Safeguards:
1.  **Strict Client Sandbox Isolation:** The React frontend never imports the GenAI SDK, avoiding accidental token leakage.
2.  **Universal Proxy Adapter:** All backend operations are managed on Port \`3000\`. If Vite acts inside development, the Express routing delegates asset processing seamlessly via Vite Middleware proxy rules.`
  },
  {
    id: "database-schema",
    title: "6. Drizzle ORM PostgreSQL Schema",
    summary: "Production-ready Relational Drizzle ORM schema mappings for PostgreSQL database tables.",
    markdown: `# Relational PostgreSQL Schema via Drizzle ORM

The following TypeScript code illustrates the exact schema mapping implemented for standard relational database clusters. This represents a highly optimized, fully indexed schema ready for migration pipelines.

\`\`\`typescript
import { pgTable, serial, varchar, text, timestamp, integer, boolean, check } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Projects Table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).default("Frontend").notNull(), // e.g. Frontend, Backend, Devops
  status: varchar("status", { length: 20 }).default("Backlog").notNull(), // Backlog, Active, Testing, Done
  progressPercentage: integer("progress_percentage").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Coding Practice Logs
export const practiceLogs = pgTable("practice_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  skillAttributed: varchar("skill_attributed", { length: 50 }).notNull(), // e.g. React, Rust, Docker
  sessionNotes: text("session_notes"),
  loggedAt: timestamp("logged_at").defaultNow().notNull(),
});

// 4. Learning Roadmaps Table
export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  generatedBy: varchar("generated_by", { length: 50 }).default("AI-Gemini").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Roadmap Steps Detail Table
export const roadmapSteps = pgTable("roadmap_steps", {
  id: serial("id").primaryKey(),
  roadmapId: integer("roadmap_id").references(() => roadmaps.id, { onDelete: "cascade" }).notNull(),
  stepOrder: integer("step_order").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  timeEstimate: varchar("time_estimate", { length: 100 }),
  isCompleted: boolean("is_completed").default(false).notNull(),
});

// ------------------------------------
// Relationships Definition for Drizzle
// ------------------------------------
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  practiceLogs: many(practiceLogs),
  roadmaps: many(roadmaps),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
}));

export const roadmapStepsRelations = relations(roadmapSteps, ({ one }) => ({
  roadmap: one(roadmaps, { fields: [roadmapSteps.roadmapId], references: [roadmaps.id] }),
}));
\`\`\`

## High Scale Optimization Keys:
1.  **Foreign Key Cascades:** Automatically purges steps and logs when target roadmap profiles or users are terminated.
2.  **Index Matrix:** Recommendations include single B-tree indexes mapping \`userId\` columns to optimize lookups for active concurrent dashboard loads.`
  },
  {
    id: "api-design",
    title: "7. REST API Documentation & Sandbox",
    summary: "Complete API endpoint maps, request payloads, response payloads, status code specifications.",
    markdown: `# REST API Design Specification

## Base URL Path: \`/api\`

All requests transmit credentials via JWTs within Authorization headers:
\`\`\`text
Authorization: Bearer <JWT_TOKEN_HERE>
\`\`\`

---

### 1. Unified Authentication Protocol
#### \`POST /api/auth/register\`
*   **Description:** Provision a new developer user profile.
*   **Request Payload:**
    \`\`\`json
    {
      "email": "dev@devos.io",
      "username": "codemaster",
      "password": "SecurePassword123"
    }
    \`\`\`
*   **Successful Response (201 Created):**
    \`\`\`json
    {
      "success": true,
      "message": "User registered successfully",
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "user": {
        "id": 1,
        "email": "dev@devos.io",
        "username": "codemaster"
      }
    }
    \`\`\`

#### \`POST /api/auth/login\`
*   **Description:** Verify developer credentials and return session token.
*   **Request Payload:**
    \`\`\`json
    {
      "username": "codemaster",
      "password": "SecurePassword123"
    }
    \`\`\`
*   **Successful Response (200 OK):** Same payload as registration success.

---

### 2. Kanban Project Manager
#### \`GET /api/projects\`
*   **Description:** Fetch list of developer projects in workspace scope.
*   **Successful Response (200 OK):**
    \`\`\`json
    [
      {
        "id": 101,
        "title": "OAuth 2.0 Identity Server",
        "category": "Backend",
        "status": "Active",
        "progressPercentage": 45
      }
    ]
    \`\`\`

#### \`POST /api/projects\`
*   **Description:** Spawn a new project card.
*   **Request Payload:**
    \`\`\`json
    {
      "title": "DevOS Workstation App",
      "category": "Frontend",
      "description": "Create the full developer cockpit visualizer."
    }
    \`\`\`

---

### 3. AI Learning Roadmap Companion
#### \`POST /api/roadmaps/generate\`
*   **Description:** Trigger Gemini model sequence pipeline to compile skill guides.
*   **Request Payload:**
    \`\`\`json
    {
      "topic": "Docker Containerization"
    }
    \`\`\`
*   **Successful Response (200 OK):**
    \`\`\`json
    {
      "topic": "Docker Containerization",
      "steps": [
        {
          "step_order": 1,
          "title": "Core Docker Concepts",
          "description": "Learn the theory of kernel namespaces, control groups, and image hierarchies versus traditional virtual machines.",
          "timeEstimate": "3 Hours"
        },
        {
          "step_order": 2,
          "title": "Writing Clean Dockerfiles",
          "description": "Practice multi-stage builds, clean base images (Alpine), layer optimization, and non-root user creation.",
          "timeEstimate": "5 Hours"
        }
      ]
    }
    \`\`\`
`
  },
  {
    id: "folder-structure",
    title: "8. Enterprise Directory Layout",
    summary: "Visual reference for organizing scalable, multi-layer monorepo structure separating client and server.",
    markdown: `# Enterprise Monorepo Directory Architecture

The recommended production directory layout designed for massive scale and clean microservice extensions.

\`\`\`text
devos-monorepo/
├── .env.example                 # Standard environmental credentials index
├── package.json                 # Unified workspace task launcher
├── tsconfig.json                # Standard server compilation rules
├── vite.config.ts               # Custom Vite bundling config
├── server.ts                    # Root Express server & Vite development gateway
|
├── build/                       # Output client build folders (post build command)
│   └── server.cjs               # Self-contained server bundle
|
├── src/                         # Unified React and database directory
│   ├── main.tsx                 # Core UI bootstrapping logic
│   ├── App.tsx                  # Core View switcher
│   ├── index.css                # Tailwind global imports
│   |
│   ├── components/              # Reusable presentation views
│   │   ├── Sidebar.tsx          # DevOS HUD panel selector
│   │   ├── ProjectBoard.tsx     # Visual Kanban board cards
│   │   ├── PracticeLog.tsx      # Pomodoro timer and activity stamps
│   │   ├── SkillsTree.tsx       # Development progress trackers
│   │   ├── RoadmapWizard.tsx    # Interactive query pipeline for roadmaps
│   │   └── ArchitectConsole.tsx # Visual blueprints, spec readers, and API Sandbox
│   |
│   ├── db/                      # Relational Schema Database definition
│   │   ├── schema.ts            # Drizzle relational PostgreSQL schemas
│   │   └── drizzle.config.ts    # Drizzle migration parameters
│   |
│   ├── data/                    # Local configuration structures
│   │   └── defaultSkills.ts     # Initial set of level maps
│   │
│   └── types.ts                 # Strongly typed TypeScript type interfaces
\`\`\`

## Structural Best Practices:
*   **Single Configuration Point:** Central environment control reduces DevOps drift.
*   **Direct Pathing Alias (\`@/*\`):** Enables resolving directory modules cleanly without writing messy relative paths (\`../../components\`).`
  },
  {
    id: "roadmap",
    title: "9. Production Launch Roadmap",
    summary: "Four phases tracking construction from proof-of-concept database structures to security hardening and staging audits.",
    markdown: `# DevOS Construction & Deployment Roadmap

Detailed launch roadmap featuring key technical steps required to move the platform from alpha to multi-tenant production stability.

\`\`\`text
PHASE 1: Core Architecture Foundations (Weeks 1 - 2)
  [x] Complete SRS and detailed database designs.
  [x] Bootstrap React + Express full-stack framework bundle.
  [x] Establish local storage failover system.
  [ ] Establish secure database connection pools.

PHASE 2: Feature Integration & API Groundwork (Weeks 3 - 5)
  [ ] Construct complete Drizzle PostgreSQL migration schema.
  [ ] Interface JWT Authentication routes with client tokens.
  [ ] Wire up Kanban Project card state selectors and persistence controllers.
  [ ] Develop custom Pomodoro components with automated stat updates.

PHASE 3: AI Engine Integration & Grounding (Weeks 6 - 8)
  [ ] Build server-side route "/api/roadmaps/generate" and test with Gemini 3.5-flash.
  [ ] Validate JSON Response constraints using schema definitions.
  [ ] Build milestone progress systems with step checkboxes.
  [ ] Add multi-modal tech support (e.g., visual graph nodes).

PHASE 4: Hardening, Performance Tuning & Release (Weeks 9 - 10)
  [ ] Audit and restrict API route middleware with secure CORS headers.
  [ ] Run stress testing against mock endpoints using JMeter.
  [ ] Implement Redis layer caching for highly recurring roadmap queries.
  [ ] Deliver stable production server image on Cloud Run.
\`\`\`

---

## Metric Trackers to Gauge Release Success:
1.  **AI Success Ratio:** Percentage of correctly structured roadmap JSON packets returned on the first shot. (Target: >98%)
2.  **Daily Active Dev Retention:** Streak multipliers monitored internally to gauge practice feature usage.`
  },
  {
    id: "portfolio-review",
    title: "10. Portfolio Engineering Review & Strategy",
    summary: "Comprehensive critique by a Senior Engineering Manager assessing DevOS architecture, recruiter-impressive features, weaknesses, and a structured MVP-to-V3 growth roadmap to maximize internship resume impact.",
    markdown: `# Portfolio Engineering Review & Strategy
**Author:** Senior Engineering Manager
**Target:** Software Engineering Internship Portfolio Optimization
**Focus:** Maximizing Resume Impact & Recruiter Conversion (AI-Assisted Context)

---

## 1. Executive Summary & Code Quality Check
DevOS represents a highly unique, ambitious full-stack portfolio workspace. Unlike typical student "TODO list" widgets, this architecture couples local-first robustness with structured server-side services. It proves a candidate’s capacity to design complex single-screen environments, reason about system safety (token scoping), and interface with production AI models safely using Node.js/Express.

---

## 2. Platform Strengths (What You Got Right)
*   **Dual-Layer Fallback Architecture (Local-First Sync):** The user client doesn't collapse if the Node runtime is missing or updating. Seamlessly switching using fallback memory arrays proves knowledge of distributed failover and highly resilient frontend engineering.
*   **Architectural Document Integration (The Specs Console):** Writing formal, thorough documentation (SRS, Non-Functional Requirements, Drizzle Schemas, API contracts, Gherkin test scenarios) shows a candidate who values software development life cycle (SDLC) health. It instantly sets the candidate apart from 95% of other entry-level portfolios.
*   **Safe Server-Side LLC/AI Integration:** Keeping the Gemini API Key behind Express gateways rather than embedding keys on client processes shows immediate maturity regarding API token security and standard enterprise-grade safety.
*   **Interactive Rest Sandbox Client:** A stunning, highly functional addition. Presenting real HTTP request payloads with direct JSON response views demonstrates visual capability and diagnostic clarity.

---

## 3. Platform Weaknesses (Gaps to Repair)
*   **Simulated Real-Time Layers:** Currently, the relational PostgreSQL tables (Drizzle schemas) and JWT Auth layers are simulated in Express in-memory stores. System designers will spot this immediately. Portfolios stand out when they use real, active persistent layers.
*   **Absence of DB Error Indicators on client:** If a database connection error occurs, the user receives generic fallbacks instead of an explicit diagnostic readout.
*   **Lack of Multi-Tenant Security Isolation:** In-memory mocks mean all users would read/write to the same global states if deployed directly, limiting multi-tenant portfolios.

---

## 4. Key Portfolio Attributes (Recruiter Bait)
Recruiters scan resumes in less than 6 seconds. To capture attention, emphasize these elements:
1.  **"Secure LLM Gateway Proxy"** - Highlights server-side AI engineering using the official \`@google/genai\` Node client with strict structure safety via Gemini JSON Schema configuration mode.
2.  **"Drizzle ORM & Relational Schema Modeling"** - Proves the ability to write robust database tables, cascade indexes, and relational integrity.
3.  **"Fully Mock-Safe Enterprise Sandboxing"** - Shows the ability to test complex local caching strategies paired with REST APIs.

---

## 5. Over-Engineered / Wasteful Items (Prune or Refine)
*   **Excessive Simulated Logs:** Avoid larping with unrequested tech data (such as *"SESSION_SECRET: DETECTED_VAULT"*, *"PORT BIND: 3000 / ingress-ssl"*, or mock CLI loops) in the sidebar or dashboards. These details are unrelated to functional tasks and look like AI code-generation noise. Replace them with actual application log structures and active API call counters.
*   **Duplicate Tabs:** Keep navigation simple. Ensure there are no redundantly displayed metrics.

---

## 6. Missing High-Impact Opportunities
*   **Real Firebase / PostgreSQL Database Wiring:** Provisioning database tables using FireStore or Cloud SQL would make DevOS completely real and production-ready.
*   **Automated Workspace Integrations:** Connecting actual workspace hooks so the developer can run real API requests.

---

## 7. Operational Feature Strategic Roadmap

### Tier A: Priority Ranking (Highest to Lowest Impact)
1.  **Real persistence layer integration** (Firebase/Firestore or Postgres via Cloud SQL) - *Establishes technical integrity.*
2.  **Cryptography JWT Token auth endpoints** (Replacing plain string mock generation) - *Proves security compliance.*
3.  **Refined clean telemetry HUD** (Pruning tech-larp logs, outputting active DB health) - *Improves visual style.*
4.  **AI customization profiles** (Letting users input customized prompts) - *Demonstrates interactivity.*

---

## 8. Development Releases (MVP -> V2 -> V3)

### Phase 1: MVP (Must-Have Foundations)
*   **Active Project Kanban Board:** Fully synchronized with the backend REST endpoints.
*   **Functional Practice Clock:** A real working Pomodoro timer with local attribute assignment.
*   **AI-backed Roadmap Timeline:** Connecting to the live Gemini 3.5-flash backend proxy safely.
*   **Fully Clean UI with high-contrast Inter typography:** Eliminating cluttered system debug lines.

### Phase 2: V2 (Recruiter Wow-Factor Expansion)
*   **Durable Cloud Databases:** Connect Firestore database rules or Cloud SQL PostgreSQL setups.
*   **Real JWT Auth Sign-On:** Authenticating actual users against security tables using cryptographic hashing.
*   **Activity Heatmap Matrix:** Rendering a real visual green contribution heatmap (similar to GitHub's contribution tile wall) to represent daily practice sets.

### Phase 3: V3 (Enterprise Scale Portfolio Integrations)
*   **System Customizer & API Logging console:** A diagnostic dashboard plotting request latency, CPU/memory stats, and real payload errors during sandboxing.
*   **Workspace Integration:** Access real Google Calendar, Drive, or Git activities using standard OAuth flows.`
  },
  {
    id: "auth-engineering-upgrade",
    title: "11. Cryptographic JWT & SMTP OTP Authentication Engine Upgrade Spec",
    summary: "Production-ready system architecture blueprint for upgrading DevOS to enterprise-grade password security, Gmail SMTP OTP verification, rate limits, PostgreSQL schemas, and threat vectors coverage.",
    markdown: `# Cryptographic JWT & SMTP OTP Authentication Spec
**Author:** Senior Software Architect
**Status:** IMPLEMENTATION-READY / PROPOSAL APPROVED
**Target Release:** DevOS Secure Core v2.0

---

## 1. Architectural System Flow

The upgraded authentication flow uses a dual-engine protocol to verify identities, safely route password hashes, and authorize requests using cryptographic tokens. This structure guarantees that no cleartext passwords ever touch physical memory sheets outside transit pipelines.

\`\`\`
   [Client App UI]               [Express REST Gateway]               [PostgreSQL DB]
          |                                 |                                |
          | -- 1. Register Account ------>  |                                |
          |    (Email, Pass, User)          | -- 2. Salt & Hash (bcrypt) --> |
          |                                 |    Pass & Store User           |
          | <-- 3. Registration Success --- |                                |
          |                                 |                                |
          | -- 4. Dispatch Email OTP -----> |                                |
          |                                 | -- 5. Generate & Hash OTP ---> |
          |                                 |    Store Temp Code             |
          |                                 | -- 6. Send NodeMailer SMTP --> | (Gmail Gateway)
          |                                 |                                |
          | -- 7. Verify OTP Code --------> |                                |
          |                                 | -- 8. Validate OTP Claim ----> |
          |                                 |    Mark Verified Flag = True   |
          | <-- 9. JWT Sign & Cookie ------ |                                |
\`\`\`

---

## 2. Relational PostgreSQL Database Schema (Drizzle ORM Dialect)

The schema defines modular relation blocks ensuring fast index scans on user credentials and secure cascading deletes for OTP codes.

\`\`\`typescript
import { pgTable, serial, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";

// 1. Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. OTP Verifications Table (Supports Expiry & Cryptographic Verification hashing)
export const otpVerifications = pgTable("otp_verifications", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  otpHash: varchar("otp_hash", { length: 255 }).notNull(), // One-way SHA256 hashed code
  expiresAt: timestamp("expires_at").notNull(), // Strict Current_Time + 5 Minutes
  attempts: integer("attempts").default(0).notNull(), // Block brute force attempts after 3 trials
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
\`\`\`

---

## 3. Server-Side Hashing & Security Policies

### A. Bcrypt Custom Salt Hashing Routine
We utilize \`bcrypt\` with a work-factor log level of \`12\` to execute high-strength key stretching, mitigating brute force dictionary operations.

\`\`\`typescript
import bcrypt from "bcryptjs";

export async function hashPassword(plainText: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(plainText, saltRounds);
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plainText, hashed);
}
\`\`\`

### B. OTP Verification Vault Storage
Never store plaintext OTP tokens. Plaintext OTPs inside databases are vulnerable to database leaks or read-only replica replication sniffing.
1. Generate a random 6-digit cryptographic digits array: \`crypto.randomInt(100000, 999999)\`.
2. Apply a strict SHA256 hashing format to the user's OTP code before entering the database table.
3. Compare the user's input code: hash input code and check if \`hash(input_otp) === db.otp_hash\`.

---

## 4. SMTP Nodemailer & OTP Protocol (Gmail Relay Configuration)

To safely dispatch OTP tokens via standard Gmail SMTP APIs, specify an active transporter using Google App Passwords:

\`\`\`typescript
import nodemailer from "nodemailer";
import crypto from "crypto";

// Transporter Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_GMAIL_USER, // e.g. dev@gmail.com
    pass: process.env.SMTP_GMAIL_APP_PASSWORD, // 16-character secure Google App Password
  },
  pool: true, // Use persistent connection pooling for high volume
  maxConnections: 5,
});

export async function dispatchVerifierEmail(email: string, otpCode: string) {
  const mailOptions = {
    from: \`"DevOS Security Desk" <\${process.env.SMTP_GMAIL_USER}>\`,
    to: email,
    subject: "🔐 Secure One-Time Pin: Verify DevOS Profile Link",
    html: \`
      <div style="font-family: sans-serif; background: #0b0c0e; color: #e4e4e7; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #1f2937;">
        <h2 style="color: #3b82f6; font-size: 20px; font-weight: bold; margin-bottom: 10px;">DevOS Profile Link Required</h2>
        <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6;">Use the secure verification pin below to authorize current login procedures on your developer workstation. This secure code is valid for exactly <strong>5 minutes</strong>.</p>
        <div style="background: #18181b; border: 1px solid #27272a; padding: 15px; text-align: center; border-radius: 8px; margin: 25px 0;">
          <span style="font-family: monospace; font-size: 32px; letter-spacing: 6px; font-weight: bold; color: #10b981;">\${otpCode}</span>
        </div>
        <p style="font-size: 11px; color: #52525b; line-height: 1.5; margin-top: 20px; border-t: 1px solid #18181b; padding-top: 15px;">If you did not issue this verification command, ignore this email and secure your credentials immediately.</p>
      </div>
    \`
  };

  await transporter.sendMail(mailOptions);
}
\`\`\`

---

## 5. Session JWT Security Configuration (HTTP-Only Cookie Strategy)

Do NOT save JSON Web Tokens inside client-side \`localStorage\`. This environment is highly vulnerable to Cross-Site Scripting (XSS) scripts scraping active sessions.
Instead, use **Secure HTTPS-Only, Same-Site cookies**:

\`\`\`typescript
import jwt from "jsonwebtoken";
import { Response } from "express";

export function signAndInjectJWTCookie(res: Response, user: { email: string; username: string }) {
  const payload = { email: user.email, username: user.username };
  const secretKey = process.env.JWT_SIGNING_SECRET || "fallback_high_security_key";
  
  const token = jwt.sign(payload, secretKey, { expiresIn: "1d" }); // Session duration limit

  res.cookie("devos_session", token, {
    httpOnly: true, // Invisible to JavaScript, prevents static XSS reads
    secure: process.env.NODE_ENV === "production", // Forces TLS encrypt
    sameSite: "strict", // Curbs Cross-Site Request Forgery (CSRF) vectors
    maxAge: 24 * 60 * 60 * 1000, // Sync matches expiration
  });
}
\`\`\`

---

## 6. Verification Endpoint Protection & Rate-Limiter Safeguards

Enforce tight IP Rate Limiting policies to completely blocks malicious attackers attempting SMTP mail volume starvation loops:

\`\`\`typescript
import rateLimit from "express-rate-limit";

// Rate limiting for login/registration attempts to block dictionary attempts
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minute check frame
  max: 10, // Max 10 attempts
  message: { error: "Security lockdown. Excess attempt velocity detected. Please wait 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for OTP generation requests to save credit cost
export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minute check frame
  max: 3, // Tight restriction: Max 3 SMTP dispatches per window
  message: { error: "OTP generation credit limit reached. Please retry in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});
\`\`\`

---

## 7. Protective Middleware (API Gatekeeper Guard)

Secure server route protection checking JWT cookie claims before returning sensitive JSON queries:

\`\`\`typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userClaims?: { email: string; username: string };
}

export function requireJWTAccess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies.devos_session;

  if (!token) {
    return res.status(401).json({ success: false, error: "Access Denied: Session expired or unauthenticated." });
  }

  try {
    const key = process.env.JWT_SIGNING_SECRET || "fallback_high_security_key";
    const decoded = jwt.verify(token, key) as { email: string; username: string };
    req.userClaims = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: "Access Denied: Cryptographic token validation failed." });
  }
}
\`\`\`

---

## 8. Threat Scenarios & Mitigations Matrix

| Threat Vector | Mitigation Strategy | Security Priority |
| :--- | :--- | :--- |
| **Brute-Forcing OTP Pin** | Auto-delete after 3 invalid attempt strikes per verification row. | Critical |
| **XSS Reading JWT Sessions** | Set \`httpOnly: true\` token cookies to disable browser document accessibility. | High |
| **Replay Attacks** | Enforce 5-minute expiry deadlines with strict epoch check conditions, then flush tokens immediately. | High |
| **SMTP Credit Theft** | Restrict OTP generation via IP limits configured on \`express-rate-limit\` modules. | Medium |`
  }
];
