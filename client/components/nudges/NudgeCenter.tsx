import React from "react";
import { useCareer } from "../../context/CareerContext";
import { CareerNudge } from "../../types/career";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  Clock,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";

export function NudgeCenter() {
  const { nudges, completeNudge, dismissNudge } = useCareer();

  const getPriorityBadge = (priority: CareerNudge["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[10px] font-mono">
            High Priority
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] font-mono">
            Medium Priority
          </Badge>
        );
      default:
        return (
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px] font-mono">
            Low Priority
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl p-5 text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">AI Precision Nudges</h3>
            <p className="text-xs text-slate-400">
              Proactive micro-interventions derived from your work footprint
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-xs font-mono border-slate-700 text-slate-300">
          {nudges.filter((n) => !n.completed).length} Active Nudges
        </Badge>
      </div>

      <div className="divide-y divide-slate-800/80 mt-2">
        {nudges.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No active nudges at this time. All caught up!
          </div>
        ) : (
          nudges.map((nudge) => (
            <div
              key={nudge.id}
              className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-opacity ${
                nudge.completed ? "opacity-40" : "opacity-100"
              }`}
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getPriorityBadge(nudge.priority)}
                  <span className="text-[11px] text-slate-400 font-mono">
                    Source: {nudge.source} • {nudge.createdAt}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  {nudge.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  {nudge.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {nudge.completed ? (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                  </Badge>
                ) : (
                  <>
                    {nudge.questId ? (
                      <Button
                        asChild
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-8 px-3"
                      >
                        <Link to={`/quests?skill=${nudge.skillId || ""}`}>
                          {nudge.actionLabel} <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => completeNudge(nudge.id)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-8 px-3"
                      >
                        <Zap className="w-3 h-3 mr-1 fill-current" /> {nudge.actionLabel}
                      </Button>
                    )}

                    <button
                      onClick={() => dismissNudge(nudge.id)}
                      className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800/60"
                      title="Dismiss nudge"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
