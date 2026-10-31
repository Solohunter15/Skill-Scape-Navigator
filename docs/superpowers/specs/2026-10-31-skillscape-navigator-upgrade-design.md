# SkillScape Navigator: Next-Gen 3D Skill Constellation & Career Intelligence Platform

**Date:** 2026-10-31  
**Status:** Approved  
**Author:** Antigravity  

## 1. Executive Summary

SkillScape Navigator is upgraded from a prototype into a state-of-the-art **Executive & Gamified AI Career Operating System**. It combines an interactive **3D Celestial Skill Constellation (Three.js / WebGL)** with **Enterprise-Grade Career Intelligence**, **Real-Time Scenario Quests**, **Automated Career Gap Analysis**, and **Precision AI Nudges**.

Users can customize their skills, proficiencies, and career goals via an intuitive manual configurator or quick archetypes, explore their competencies in an orbiting 3D starscape, test their skills against real-world scenario challenges to earn XP, and calculate exact readiness and compensation deltas for target roles (e.g., Senior Full-Stack -> Staff Platform Architect).

---

## 2. Core Architecture & System Modules

### 2.1 State Management & Data Layer (`client/context/CareerContext.tsx`)
- Centralized reactive state storing:
  - User profile (name, title, target role, experience, avatar)
  - Skill inventory (id, name, category, level 0-100, xp, targetLevel, status: `mastered` | `in_progress` | `gap` | `locked`, prerequisites)
  - Target role benchmarks (required skills, expected proficiencies, market salary percentiles)
  - Active quests & scenario challenges (scenario description, options, correct choice explanation, XP reward, target skill)
  - Daily precision nudges (high/medium/low priority, contextual reason, completed status)
  - Activity log & XP history
  - Integrations status (GitHub, Calendar, Jira, Coursera) with live simulated events
- LocalStorage persistence with reset/seed helpers.

### 2.2 3D Celestial Skill Constellation (`client/components/galaxy/SkillGalaxy.tsx`)
- High-performance Three.js / Canvas 3D scene with:
  - Particle starfield background with cosmic nebula gradients.
  - Interactive 3D skill nodes positioned in constellation clusters (Frontend, Backend, AI/ML, Cloud/DevOps, Architecture, Leadership).
  - Glowing node materials: pulsing shaders / glow sprites colored by category and mastery level.
  - Constellation connection lines showing cross-discipline skill relationships and prerequisites.
  - OrbitControls for pan, zoom, and 360-degree rotation.
  - Interactive raycaster: hovering highlights connections; clicking selects the node and brings up the **Skill Diagnostic & Upgrade HUD**.
  - Node search and category filters directly superimposed on the 3D viewport.

### 2.3 Career Path Gap Matrix & Target Simulator (`client/pages/Dashboard.tsx` & `client/components/gap-analyzer/CareerGapMatrix.tsx`)
- Dynamic comparison between user's current proficiencies and desired target roles.
- Computes:
  - **Readiness Score (%)**: Weighted competency match against the benchmark.
  - **Skill Deficit Matrix**: Immediate gaps, near-ready skills, and strengths.
  - **Compensation & Market Intelligence**: Predicted market salary ranges and compensation delta for closing the gaps.
  - **Priority Unlock Roadmap**: Ordered sequence of skills and quests to maximize career advancement velocity.

### 2.4 Interactive Scenario Quests & Precision Nudges (`client/components/quests/QuestArena.tsx`)
- Realistic engineering & leadership scenario challenges:
  - Real-world decision prompts (System Design caching trade-offs, Microservices failure isolation, React re-render optimization, Kubernetes autoscaling, Team conflict resolution, AI model evaluation).
  - Instant interactive feedback with rationale, rewarding real XP.
  - Live XP level-up celebrations that immediately update the user's skill level and illuminate their 3D star in the constellation.
- Daily precision nudges with 1-click micro-actions.

### 2.5 Executive Analytics & Career Passport (`client/pages/Analytics.tsx`)
- Recharts-powered interactive analytics:
  - Skill Radar Chart (cross-domain balance).
  - Monthly XP & Competency Velocity area charts.
  - Industry Benchmark comparisons.
  - **SkillScape Career Passport**: A futuristic verified credentials card displaying tier, top proficiencies, career trajectory, and exportable summary.

### 2.6 Full Suite Pages
- **Home (`client/pages/Index.tsx`)**: Upgraded futuristic landing page with interactive 3D hero preview, live feature tour, and quick launch buttons.
- **Onboarding (`client/pages/Onboarding.tsx`)**: Streamlined interactive skill setup & goal configurator with quick-start archetypes or custom entry.
- **Dashboard (`client/pages/Dashboard.tsx`)**: Command center with the 3D Galaxy, quick stats, active nudges, career gap highlights, and daily quest prompt.
- **Analytics (`client/pages/Analytics.tsx`)**: Deep-dive analytics, radar maps, and Career Passport.
- **Quests Arena (`client/pages/QuestsPage.tsx`)**: Full arcade of scenario challenges across all domains.
- **Integrations (`client/pages/Integrations.tsx`)**: Interactive platform hub (GitHub, Calendar, Jira, Coursera) with live telemetry stream.
- **Settings (`client/pages/Settings.tsx`)**: Configurator for AI nudge sensitivity, career targets, custom skills, and data backup.

---

## 3. Visual Aesthetic & Theme

- **Style:** Orbital Cyber-Observatory.
- **Backgrounds:** `#090d16` (Deep Space Obsidian), `#0f172a` (Card Glass), `#1e293b` (Subtle Borders).
- **Accents:** Electric Cyan (`#06b6d4` / `#38bdf8`), Cyber Purple (`#8b5cf6` / `#c084fc`), Neon Emerald (`#10b981`), Amber Gold (`#f59e0b`).
- **UI Components:** Translucent glassmorphism (`backdrop-blur-md bg-card/70`), glowing badges, animated progress rings, sound/visual celebratory effects on level-up.

---

## 4. Verification & Testing

- Unit tests for CareerContext state transitions (XP additions, skill level calculations, readiness score computations).
- Component tests for Navigation, Quest Arena, and Gap Analyzer.
- Vitest automated test suite verification (`npm test`).
- Type check verification (`npm run typecheck`).
- Production build validation (`npm run build`).
