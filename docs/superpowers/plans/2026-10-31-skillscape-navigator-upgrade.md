# SkillScape Navigator Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform SkillScape Navigator into an industry-leading, gamified 3D Skill Constellation & Enterprise Career Intelligence Command Center with Three.js 3D visualizations, interactive scenario quests, live career gap analysis, and real-time XP level-ups.

**Architecture:** Client-side SPA built on React 18, TypeScript, TailwindCSS, and Three.js. State is orchestrated via a comprehensive `CareerContext` providing reactive management of skills, role benchmarks, quests, precision nudges, XP progression, and integration telemetry with LocalStorage persistence.

**Tech Stack:** React 18, TypeScript, Three.js, Lucide React, Recharts, Framer Motion, TailwindCSS 3, Vitest.

---

### Task 1: Career Context, Data Types & State Engine

**Files:**
- Create: `client/types/career.ts`
- Create: `client/context/CareerContext.tsx`
- Create: `client/context/career-mock-data.ts`
- Test: `client/context/CareerContext.spec.ts`

- [ ] **Step 1: Define comprehensive Career types**
  - Define `SkillCategory`, `SkillNode`, `CareerRoleBenchmark`, `ScenarioQuest`, `CareerNudge`, `CareerProfile`, `IntegrationStatus`.
- [ ] **Step 2: Create mock seed data and presets**
  - Multi-discipline skill nodes across Frontend, Backend, AI/ML, Cloud/DevOps, Architecture, and Leadership.
  - Archetype roles: "Senior Full-Stack Engineer", "Staff Platform Architect", "Principal AI Engineer", "Director of Engineering".
  - Realistic scenario quests with multiple choice options, rationale explanations, and XP rewards.
  - Active precision nudges with actionable advice.
- [ ] **Step 3: Implement `CareerContext` and custom hook `useCareer`**
  - Methods: `addXp(skillId, amount)`, `completeQuest(questId, optionId)`, `dismissNudge(id)`, `updateSkill(skillId, updates)`, `setTargetRole(roleId)`, `toggleIntegration(key)`, `resetToDefaults()`.
- [ ] **Step 4: Write unit tests verifying XP calculation, level-up threshold logic, and gap score calculation**
- [ ] **Step 5: Run tests and commit**

---

### Task 2: Interactive 3D Celestial Skill Constellation (Three.js WebGL)

**Files:**
- Create: `client/components/galaxy/SkillGalaxy.tsx`
- Create: `client/components/galaxy/SkillNodeHUD.tsx`
- Modify: `client/pages/Dashboard.tsx`

- [ ] **Step 1: Build the 3D Canvas engine with Three.js**
  - Rotating particle starfield with depth fog and cosmic color gradients.
  - Compute 3D spherical constellation coordinates for each skill categorized by nebula quadrant.
  - Render glowing orbital nodes with level-proportional particle halos and connection lines between dependent skills.
- [ ] **Step 2: Add interactive raycasting & controls**
  - Smooth OrbitControls (rotate, zoom, pan) with boundary constraints.
  - Hover detection highlighting constellation links.
  - Click-to-focus camera animation zooming into the selected skill.
- [ ] **Step 3: Implement `SkillNodeHUD` popover**
  - Displays skill mastery level, category badge, XP progress bar, prerequisites, and quick-launch button to practice the skill in Quest Arena.
- [ ] **Step 4: Verify 3D rendering and commit**

---

### Task 3: Dynamic Career Gap Matrix & Target Role Simulator

**Files:**
- Create: `client/components/gap-analyzer/CareerGapMatrix.tsx`
- Create: `client/components/gap-analyzer/RoleBenchmarkCard.tsx`
- Modify: `client/pages/Dashboard.tsx`

- [ ] **Step 1: Implement role readiness math & benchmark comparison**
  - Calculate percentage readiness vs target role requirements.
  - Compute salary projection delta curve based on market percentiles.
- [ ] **Step 2: Build the Gap Matrix UI**
  - Visual breakdown of "Mastered Skills", "In-Progress Gap Skills", and "Target Deficits".
  - One-click "Boost Skill" triggering relevant quests.
- [ ] **Step 3: Add role switcher & custom target creator**
- [ ] **Step 4: Verify calculations with unit tests and commit**

---

### Task 4: Interactive Scenario Quests & XP Arena

**Files:**
- Create: `client/components/quests/QuestArena.tsx`
- Create: `client/components/quests/ScenarioCard.tsx`
- Create: `client/components/quests/LevelUpCelebration.tsx`
- Create: `client/pages/QuestsPage.tsx`

- [ ] **Step 1: Build `ScenarioCard` component**
  - Renders the scenario problem statement, difficulty tag, reward XP, and 4 decision choices.
  - Interactive choice selection revealing immediate architectural/engineering explanation.
- [ ] **Step 2: Build `LevelUpCelebration` modal**
  - Plays celebratory particles/animation when skill level increases or milestone is achieved.
- [ ] **Step 3: Implement `QuestArena` filtering by category and difficulty**
- [ ] **Step 4: Wire to `CareerContext` so completing questions rewards XP and levels up the skill in real-time**
- [ ] **Step 5: Verify and commit**

---

### Task 5: AI Precision Nudge Center

**Files:**
- Create: `client/components/nudges/NudgeCenter.tsx`
- Modify: `client/pages/Dashboard.tsx`

- [ ] **Step 1: Build `NudgeCenter` UI**
  - Categorized urgency cards (High/Medium/Low priority) with contextual source badges (e.g., "From GitHub commits", "Calendar audit", "Skill gap analysis").
  - Quick action buttons: "Launch Mini-Quest", "Review Resource", "Mark Completed".
- [ ] **Step 2: Add dynamic nudge generator reflecting current skill deficits**
- [ ] **Step 3: Verify and commit**

---

### Task 6: Executive Career Analytics & SkillScape Career Passport

**Files:**
- Create: `client/pages/Analytics.tsx`
- Create: `client/components/analytics/SkillRadar.tsx`
- Create: `client/components/analytics/VelocityChart.tsx`
- Create: `client/components/analytics/CareerPassportModal.tsx`

- [ ] **Step 1: Implement Skill Radar Chart with Recharts**
  - Visualizes domain competency across Frontend, Backend, AI/ML, Cloud/DevOps, Architecture, and Leadership.
- [ ] **Step 2: Implement Growth Velocity Area Chart**
  - Displays monthly XP velocity, trajectory forecasting, and milestones reached.
- [ ] **Step 3: Implement `CareerPassportModal`**
  - High-tech holographic career credentials badge with QR code aesthetic, verified competencies, tier ranking, and download/share JSON export button.
- [ ] **Step 4: Verify and commit**

---

### Task 7: Live Platform Integrations Hub

**Files:**
- Create: `client/pages/Integrations.tsx`
- Create: `client/components/integrations/LiveTelemetryStream.tsx`

- [ ] **Step 1: Build the Integrations management grid**
  - Cards for GitHub, Google Calendar, Jira/Linear, Coursera/Udemy, and Slack.
  - Interactive toggle switches with sync status, last synced time, and permissions overview.
- [ ] **Step 2: Build `LiveTelemetryStream`**
  - Real-time rolling activity ticker simulating passive event capture (e.g. "GitHub: Merged PR #142 (Refactored GraphQL resolvers) -> +15 Backend XP", "Calendar: 4h Deep Work block detected").
- [ ] **Step 3: Verify and commit**

---

### Task 8: Advanced Settings & Custom Skill Builder

**Files:**
- Create: `client/pages/Settings.tsx`
- Create: `client/components/settings/CustomSkillModal.tsx`

- [ ] **Step 1: Build profile and career aspirations settings**
  - Name, current title, target title, target salary expectation.
- [ ] **Step 2: Build Custom Skill Builder**
  - Modal allowing users to add any custom skill to their constellation with category, starting level, and prerequisites.
- [ ] **Step 3: Add AI sensitivity toggles, sound effects toggle, and data backup / reset button**
- [ ] **Step 4: Verify and commit**

---

### Task 9: Landing Page & Onboarding Revamp

**Files:**
- Modify: `client/pages/Index.tsx`
- Modify: `client/pages/Onboarding.tsx`

- [ ] **Step 1: Upgrade `Index.tsx`**
  - Hero section featuring an interactive mini 3D constellation canvas, value props, live stats counter, and "Enter Galaxy" CTA.
  - Interactive feature showcase tabs (3D Constellation, Gap Analyzer, Scenario Quests, Career Passport).
- [ ] **Step 2: Upgrade `Onboarding.tsx`**
  - 4-step wizard: Step 1 (Profile & Title), Step 2 (Career Target Role), Step 3 (Choose Starting Skills or Preset Archetype), Step 4 (Launch Navigator).
- [ ] **Step 3: Verify and commit**

---

### Task 10: Routing, Navigation & Global Styling

**Files:**
- Modify: `client/components/Navigation.tsx`
- Modify: `client/App.tsx`
- Modify: `client/global.css`

- [ ] **Step 1: Update `Navigation.tsx`**
  - Links: Dashboard, 3D Galaxy, Quests, Analytics, Integrations, Settings.
  - Live XP level badge, streak counter, and Career Passport quick launcher in the navbar.
- [ ] **Step 2: Update `App.tsx`**
  - Wrap routes in `CareerProvider`.
  - Connect all routes (`/`, `/onboarding`, `/dashboard`, `/quests`, `/analytics`, `/integrations`, `/settings`).
- [ ] **Step 3: Verify theme and responsive layout**
- [ ] **Step 4: Verify and commit**

---

### Task 11: Comprehensive Test Suite, Vitest & Build Validation

**Files:**
- Create/Modify: `client/context/CareerContext.spec.ts`
- Create: `client/components/gap-analyzer/CareerGapMatrix.spec.ts`

- [ ] **Step 1: Write and run Vitest tests**
- [ ] **Step 2: Run TypeScript typecheck (`npm run typecheck`)**
- [ ] **Step 3: Run production build (`npm run build`)**
- [ ] **Step 4: Final commit and verify running app**

