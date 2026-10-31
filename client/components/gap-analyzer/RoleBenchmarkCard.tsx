import React from "react";
import { CareerRoleBenchmark } from "../../types/career";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, DollarSign, Award, Target, CheckCircle2 } from "lucide-react";

interface RoleBenchmarkCardProps {
  roles: CareerRoleBenchmark[];
  activeRole: CareerRoleBenchmark;
  onSelectRole: (roleId: string) => void;
  readinessScore: number;
}

export function RoleBenchmarkCard({
  roles,
  activeRole,
  onSelectRole,
  readinessScore,
}: RoleBenchmarkCardProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl text-slate-100">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs font-mono">
                {activeRole.tier} Level
              </Badge>
              <span className="text-xs text-slate-400 font-mono">{activeRole.category}</span>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              {activeRole.title}
            </CardTitle>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-2">
            <label htmlFor="role-select" className="text-xs text-slate-400 font-mono">
              Target Role:
            </label>
            <select
              id="role-select"
              value={activeRole.id}
              onChange={(e) => onSelectRole(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.tier})
                </option>
              ))}
            </select>
          </div>
        </div>
        <CardDescription className="text-xs text-slate-300 mt-1 leading-relaxed">
          {activeRole.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Compensation and Milestones Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Average Salary */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Median Compensation</div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {activeRole.averageSalary}
              </div>
            </div>
          </div>

          {/* Readiness Match */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Benchmark Readiness</div>
              <div className="text-lg font-bold font-mono text-cyan-400">
                {readinessScore}% Match
              </div>
            </div>
          </div>

          {/* Salary Spread */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Top 10% Band</div>
              <div className="text-lg font-bold font-mono text-purple-400">
                ${(activeRole.salaryPercentiles.p90 / 1000).toFixed(0)}k+
              </div>
            </div>
          </div>
        </div>

        {/* Promotion Milestones */}
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Key Promotion Milestones
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {activeRole.milestones.map((m, idx) => (
              <div
                key={idx}
                className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 flex items-start gap-2"
              >
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

