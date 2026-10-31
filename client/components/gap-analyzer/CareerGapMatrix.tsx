import React, { useState } from "react";
import { useCareer } from "../../context/CareerContext";
import { RoleBenchmarkCard } from "./RoleBenchmarkCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Zap,
  Target,
  ArrowRight,
  Sparkles,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

export function CareerGapMatrix() {
  const {
    roles,
    targetRole,
    setTargetRoleId,
    readinessScore,
    gapSkills,
    masteredSkills,
    addXp,
    setSelectedSkill,
  } = useCareer();

  const [activeTab, setActiveTab] = useState("gaps");

  if (!targetRole) return null;

  return (
    <div className="space-y-6">
      {/* Target Role Selector & Executive Summary */}
      <RoleBenchmarkCard
        roles={roles}
        activeRole={targetRole}
        onSelectRole={setTargetRoleId}
        readinessScore={readinessScore}
      />

      {/* Dynamic Gap Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl p-6 text-slate-100">
        {/* Top Readiness Score Meter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Career Fit Algorithm
              </span>
              <Badge
                className={`text-xs font-mono ${
                  readinessScore >= 80
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : readinessScore >= 60
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {readinessScore >= 80
                  ? "Promotion Ready"
                  : readinessScore >= 60
                  ? "Advancing Trajectory"
                  : "Bridging Core Gaps"}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Role Competency Gap Matrix
            </h3>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 font-mono">Deficit Skills</div>
              <div className="text-xl font-mono font-bold text-amber-400">
                {gapSkills.length}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono">Mastered Skills</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                {masteredSkills.length}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-400 font-mono">Readiness</div>
              <div className="text-xl font-mono font-bold text-cyan-400">
                {readinessScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Gaps vs Mastered vs Salary Delta */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5">
          <TabsList className="bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <TabsTrigger
              value="gaps"
              className="text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Skill Gaps ({gapSkills.length})
            </TabsTrigger>
            <TabsTrigger
              value="mastered"
              className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Target Strengths ({masteredSkills.length})
            </TabsTrigger>
            <TabsTrigger
              value="compensation"
              className="text-xs data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
            >
              <DollarSign className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              Compensation Delta
            </TabsTrigger>
          </TabsList>

          {/* 1. Gaps List */}
          <TabsContent value="gaps" className="space-y-3 mt-4">
            {gapSkills.length === 0 ? (
              <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-slate-800/60">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-white">All Role Competencies Mastered!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  You meet or exceed every required proficiency benchmark for {targetRole.title}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gapSkills.map(({ skill, targetLevel, deficit }) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: skill.color }}
                          />
                          <button
                            onClick={() => setSelectedSkill(skill)}
                            className="font-bold text-sm text-slate-100 hover:text-cyan-300 transition-colors text-left"
                          >
                            {skill.name}
                          </button>
                        </div>
                        <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-[11px] font-mono">
                          -{deficit} pts gap
                        </Badge>
                      </div>

                      <div className="text-xs text-slate-400 mb-2 font-mono flex items-center justify-between">
                        <span>Current: <strong className="text-slate-200">{skill.level}</strong></span>
                        <span>Target: <strong className="text-cyan-400">{targetLevel}</strong></span>
                      </div>

                      {/* Stacked comparison bar */}
                      <div className="space-y-1">
                        <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-cyan-500 rounded-full transition-all"
                            style={{ width: `${(skill.level / 100) * 100}%` }}
                          />
                          <div
                            className="absolute top-0 bottom-0 border-r-2 border-amber-400"
                            style={{ left: `${(targetLevel / 100) * 100}%` }}
                            title={`Target: ${targetLevel}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-850">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => addXp(skill.id, 100)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 h-8 px-2"
                      >
                        <Zap className="w-3.5 h-3.5 mr-1" /> +100 XP Practice
                      </Button>

                      <Button
                        asChild
                        size="sm"
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs h-8 px-3"
                      >
                        <Link to={`/quests?skill=${skill.id}`}>
                          Solve Quest <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 2. Mastered Strengths */}
          <TabsContent value="mastered" className="space-y-3 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {masteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">{skill.name}</h5>
                      <span className="text-xs text-slate-400 font-mono">
                        Level {skill.level} / 100 • {skill.category}
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-mono">
                    Benchmarked
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 3. Compensation Delta Analysis */}
          <TabsContent value="compensation" className="mt-4">
            <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Projected Career Compensation Value
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Closing the remaining {gapSkills.length} competencies unlocks the salary band
                    for {targetRole.title}.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">Estimated Upside Delta</div>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    +$65,000 / yr
                  </div>
                </div>
              </div>

              {/* Percentile bars */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>25th Percentile Base</span>
                    <span>${(targetRole.salaryPercentiles.p25 / 1000).toFixed(0)}k</span>
                  </div>
                  <Progress value={65} className="h-2 bg-slate-800" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-cyan-300">
                    <span>Median Market Target</span>
                    <span>${(targetRole.salaryPercentiles.p50 / 1000).toFixed(0)}k</span>
                  </div>
                  <Progress value={80} className="h-2 bg-slate-800" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-purple-300">
                    <span>90th Percentile Top Band</span>
                    <span>${(targetRole.salaryPercentiles.p90 / 1000).toFixed(0)}k+</span>
                  </div>
                  <Progress value={95} className="h-2 bg-slate-800" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

