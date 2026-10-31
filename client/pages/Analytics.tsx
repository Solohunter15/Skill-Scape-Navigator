import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { SkillRadar } from "../components/analytics/SkillRadar";
import { VelocityChart } from "../components/analytics/VelocityChart";
import { CareerPassportModal } from "../components/analytics/CareerPassportModal";
import { useCareer } from "../context/CareerContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
  Target,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function Analytics() {
  const { skills, targetRole, readinessScore, profile, masteredSkills, gapSkills } = useCareer();
  const [showPassport, setShowPassport] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs font-mono">
                <BarChart3 className="w-3.5 h-3.5 mr-1" /> Executive Analytics
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                Predictive Competency Modeling
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Career Trajectory & Competency Diagnostics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time radar diagnostics, historical learning velocity, and market benchmarking against the {targetRole?.title} tier.
            </p>
          </div>

          <Button
            onClick={() => setShowPassport(true)}
            className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs h-10 px-4 shadow-lg shadow-cyan-900/40 shrink-0"
          >
            <ShieldCheck className="w-4 h-4 mr-2" /> View Career Passport
          </Button>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">Target Readiness</div>
                <div className="text-2xl font-black font-mono text-cyan-400">
                  {readinessScore}%
                </div>
                <div className="text-[11px] text-slate-500 font-mono">vs {targetRole?.title}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">Mastered Skills</div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {masteredSkills.length}
                </div>
                <div className="text-[11px] text-emerald-500/80 font-mono">Above 80% benchmark</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">Competency Velocity</div>
                <div className="text-2xl font-black font-mono text-purple-400">
                  +18.4%
                </div>
                <div className="text-[11px] text-purple-400/80 font-mono">Past 30 days growth</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">Total Career XP</div>
                <div className="text-2xl font-black font-mono text-amber-400">
                  {profile.totalXp.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">Level {profile.level} Navigator</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" /> Cross-Domain Skill Radar
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Comparing your current profile (cyan) with the {targetRole?.title} target model (purple)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SkillRadar />
            </CardContent>
          </Card>

          {/* Velocity Area Chart */}
          <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" /> XP Velocity Trajectory
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Monthly skill acquisition rate tracked across git commits, scenarios, and focus hours
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <VelocityChart />
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown Table */}
        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-white">
              Domain Competency Inventory
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Detailed distribution of proficiencies across all 6 celestial clusters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Domain Cluster</th>
                    <th className="pb-3 font-semibold">Tracked Skills</th>
                    <th className="pb-3 font-semibold">Average Level</th>
                    <th className="pb-3 font-semibold">Dominant Skill</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {[
                    "Frontend",
                    "Backend",
                    "Cloud & DevOps",
                    "AI & Data",
                    "System Architecture",
                    "Leadership",
                  ].map((category) => {
                    const catSkills = skills.filter((s) => s.category === category);
                    const avg =
                      catSkills.length > 0
                        ? Math.round(
                            catSkills.reduce((acc, s) => acc + s.level, 0) /
                              catSkills.length
                          )
                        : 0;
                    const topSkill = [...catSkills].sort((a, b) => b.level - a.level)[0];

                    return (
                      <tr key={category} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3 font-bold text-slate-200">{category}</td>
                        <td className="py-3 text-slate-400">{catSkills.length} competencies</td>
                        <td className="py-3 font-bold text-cyan-400">{avg} / 100</td>
                        <td className="py-3 text-slate-300">
                          {topSkill ? `${topSkill.name} (Lvl ${topSkill.level})` : "N/A"}
                        </td>
                        <td className="py-3">
                          <Badge
                            className={`text-[10px] ${
                              avg >= 80
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : avg >= 60
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {avg >= 80 ? "Mastered" : avg >= 60 ? "Proficient" : "Active Gap"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Career Passport Modal */}
      {showPassport && (
        <CareerPassportModal onClose={() => setShowPassport(false)} />
      )}
    </div>
  );
}
