import React from "react";
import { SkillNode } from "../../types/career";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  X,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SkillNodeHUDProps {
  skill: SkillNode;
  onClose: () => void;
  onBoostXp: (skillId: string, amount: number) => void;
}

export function SkillNodeHUD({ skill, onClose, onBoostXp }: SkillNodeHUDProps) {
  const getStatusBadge = (status: SkillNode["status"]) => {
    switch (status) {
      case "mastered":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 border">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Mastered
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 border">
            <Clock className="w-3 h-3 mr-1" /> In Progress
          </Badge>
        );
      case "gap":
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 border">
            <AlertCircle className="w-3 h-3 mr-1" /> Career Gap
          </Badge>
        );
      default:
        return <Badge variant="outline">Locked</Badge>;
    }
  };

  const percentToNext = Math.min(
    100,
    Math.round((skill.xp / (skill.xpToNextLevel || 1)) * 100)
  );

  return (
    <div className="absolute top-4 right-4 z-20 w-80 md:w-96 rounded-xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-5 text-slate-100 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: skill.color }}
            />
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
              {skill.category}
            </span>
          </div>
          <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            {skill.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Close skill details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="space-y-4 py-4">
        {/* Status & Level */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-0.5">Mastery Level</div>
            <div className="text-2xl font-black font-mono flex items-baseline gap-1 text-white">
              {skill.level}
              <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
          </div>
          <div>
            {getStatusBadge(skill.status)}
            <div className="text-right text-xs text-emerald-400 font-mono mt-1 flex items-center justify-end">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +{skill.growth}% growth
            </div>
          </div>
        </div>

        {/* Progress to Next Tier */}
        <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">XP Progress</span>
            <span className="text-cyan-400 font-semibold">
              {skill.xp} / {skill.xpToNextLevel} XP ({percentToNext}%)
            </span>
          </div>
          <Progress value={percentToNext} className="h-2 bg-slate-800" />
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {skill.description}
        </p>

        {/* Market demand */}
        {skill.marketDemandPercentile && (
          <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-md bg-purple-950/20 border border-purple-800/30">
            <span className="text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Market Demand
            </span>
            <span className="font-mono font-bold text-purple-200">
              Top {100 - skill.marketDemandPercentile}%
            </span>
          </div>
        )}

        {/* Prerequisites */}
        {skill.prerequisites.length > 0 && (
          <div className="text-xs">
            <span className="text-slate-400 block mb-1">Prerequisites:</span>
            <div className="flex flex-wrap gap-1.5">
              {skill.prerequisites.map((preId) => (
                <span
                  key={preId}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]"
                >
                  {preId}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
        <Button
          onClick={() => onBoostXp(skill.id, 150)}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs h-9 shadow-lg shadow-cyan-900/30"
        >
          <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" /> Fast Practice (+150 XP)
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 text-xs h-9"
        >
          <Link to={`/quests?skill=${skill.id}`} className="flex items-center justify-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" /> Launch Decision Quest
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

