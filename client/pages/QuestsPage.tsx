import React from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import { QuestArena } from "../components/quests/QuestArena";
import { LevelUpCelebration } from "../components/quests/LevelUpCelebration";
import { useCareer } from "../context/CareerContext";
import { Badge } from "@/components/ui/badge";
import { Swords, Sparkles } from "lucide-react";

export default function QuestsPage() {
  const [searchParams] = useSearchParams();
  const skillParam = searchParams.get("skill");
  const { activeCelebration, closeCelebration } = useCareer();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs font-mono">
                <Swords className="w-3.5 h-3.5 mr-1" /> Decision Battleground
              </Badge>
              <span className="text-xs text-slate-400 font-mono">
                Real-Time XP Simulator
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              Architectural Quests & Skill Arenas
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Test your engineering intuition against real-world production incidents, system design bottlenecks, and high-stakes leadership dilemmas. Earn verifiable XP to ignite your 3D Constellation.
            </p>
          </div>
        </div>

        {/* Quest Arena */}
        <QuestArena initialSkillId={skillParam} />
      </main>

      {/* Level Up Celebration Modal */}
      {activeCelebration && (
        <LevelUpCelebration
          data={activeCelebration}
          onClose={closeCelebration}
        />
      )}
    </div>
  );
}
