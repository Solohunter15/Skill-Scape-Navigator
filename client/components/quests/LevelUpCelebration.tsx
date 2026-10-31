import React from "react";
import { CelebrationData } from "../../context/CareerContext";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Award, ArrowRight } from "lucide-react";

interface LevelUpCelebrationProps {
  data: CelebrationData;
  onClose: () => void;
}

export function LevelUpCelebration({ data, onClose }: LevelUpCelebrationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-2xl border border-cyan-500/50 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl shadow-cyan-500/20 text-center space-y-4">
        {/* Glow ambient */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-cyan-500/40 animate-bounce">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Skill Mastery Level Up!
          </span>
          <h3 className="text-2xl font-black text-white">{data.skillName}</h3>
        </div>

        {/* Level change meter */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-mono">Previous</div>
            <div className="text-2xl font-mono font-bold text-slate-400">
              Lvl {data.oldLevel}
            </div>
          </div>

          <div className="text-cyan-400 font-black text-xl">
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </div>

          <div className="text-left">
            <div className="text-[11px] text-cyan-400 font-mono">Achieved</div>
            <div className="text-3xl font-mono font-black text-emerald-400">
              Lvl {data.newLevel}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 fill-current" />
          <span>+{data.xpGained} XP Credited to Profile Constellation</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Your 3D Constellation star has expanded and career readiness updated. Keep momentum!
        </p>

        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold h-11 text-sm shadow-lg shadow-cyan-500/30"
        >
          Continue Navigating
        </Button>
      </div>
    </div>
  );
}
