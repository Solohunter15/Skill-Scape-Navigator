import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { SkillGalaxy } from "../components/galaxy/SkillGalaxy";
import { CareerGapMatrix } from "../components/gap-analyzer/CareerGapMatrix";
import { NudgeCenter } from "../components/nudges/NudgeCenter";
import { ScenarioCard } from "../components/quests/ScenarioCard";
import { LevelUpCelebration } from "../components/quests/LevelUpCelebration";
import { CareerPassportModal } from "../components/analytics/CareerPassportModal";
import { useCareer } from "../context/CareerContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  Target,
  Award,
  TrendingUp,
  ShieldCheck,
  Flame,
  ArrowRight,
  Compass,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const {
    profile,
    targetRole,
    readinessScore,
    activeCelebration,
    closeCelebration,
    quests,
    completeQuest,
  } = useCareer();

  const [showPassport, setShowPassport] = useState(false);

  // Featured daily quest
  const featuredQuest = quests.find((q) => !q.completed) || quests[0];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Welcome & Top Profile Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-purple-950/20 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.firstName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-950">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Welcome back, {profile.firstName}
                </h1>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[11px] font-mono">
                  Tier {profile.level}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                {profile.currentTitle} →{" "}
                <span className="text-cyan-400 font-bold">{targetRole?.title}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Readiness</div>
                <div className="text-lg font-bold text-cyan-400">{readinessScore}%</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Career XP</div>
                <div className="text-lg font-bold text-amber-400">
                  {profile.totalXp.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Streak</div>
                <div className="text-lg font-bold text-rose-400">{profile.streakDays} Days</div>
              </div>
            </div>

            <Button
              onClick={() => setShowPassport(true)}
              variant="outline"
              className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs h-12 px-4 shrink-0"
            >
              <ShieldCheck className="w-4 h-4 mr-2 text-cyan-400" /> Career Passport
            </Button>
          </div>
        </div>

        {/* 3D Celestial Skill Constellation Viewport */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                3D Celestial Skill Constellation
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              WebGL Powered Universe • Click node to inspect details
            </span>
          </div>

          <SkillGalaxy />
        </div>

        {/* Featured Daily Decision Quest */}
        {featuredQuest && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Daily Architectural Decision Quest
                </h2>
              </div>
              <Button
                asChild
                variant="ghost"
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                <Link to="/quests">
                  View All Quests <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>

            <ScenarioCard quest={featuredQuest} onSolve={completeQuest} />
          </div>
        )}

        {/* AI Precision Nudges */}
        <NudgeCenter />

        {/* Role Competency Gap Matrix & Target Simulator */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Executive Career Gap Matrix & Promotion Path
            </h2>
          </div>

          <CareerGapMatrix />
        </div>
      </main>

      {/* Level Up Celebration Modal */}
      {activeCelebration && (
        <LevelUpCelebration
          data={activeCelebration}
          onClose={closeCelebration}
        />
      )}

      {/* Career Passport Modal */}
      {showPassport && (
        <CareerPassportModal onClose={() => setShowPassport(false)} />
      )}
    </div>
  );
}
