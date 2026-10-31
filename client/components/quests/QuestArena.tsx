import React, { useState, useMemo } from "react";
import { useCareer } from "../../context/CareerContext";
import { ScenarioCard } from "./ScenarioCard";
import { SkillCategory } from "../../types/career";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Award, Target, Filter, Search, CheckCircle2 } from "lucide-react";

const QUEST_CATEGORIES: ("All" | SkillCategory)[] = [
  "All",
  "System Architecture",
  "AI & Data",
  "Cloud & DevOps",
  "Frontend",
  "Backend",
  "Leadership",
];

interface QuestArenaProps {
  initialSkillId?: string | null;
}

export function QuestArena({ initialSkillId }: QuestArenaProps) {
  const { quests, completeQuest, profile } = useCareer();
  const [selectedCategory, setSelectedCategory] = useState<"All" | SkillCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unsolved" | "solved">("all");

  const filteredQuests = useMemo(() => {
    return quests.filter((q) => {
      if (initialSkillId && q.skillId !== initialSkillId) return false;
      const matchCat = selectedCategory === "All" || q.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.scenario.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "solved" && q.completed) ||
        (statusFilter === "unsolved" && !q.completed);

      return matchCat && matchSearch && matchStatus;
    });
  }, [quests, initialSkillId, selectedCategory, searchQuery, statusFilter]);

  const solvedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="space-y-6">
      {/* Header Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-mono">Quests Completed</div>
            <div className="text-xl font-bold font-mono text-cyan-300">
              {solvedCount} / {quests.length}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-mono">Total XP Accumulated</div>
            <div className="text-xl font-bold font-mono text-amber-400">
              {profile.totalXp.toLocaleString()} XP
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-mono">Active Navigator Level</div>
            <div className="text-xl font-bold font-mono text-purple-400">
              Tier {profile.level} (Streak: {profile.streakDays}d)
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {QUEST_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Status */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 h-8 w-full rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-[11px] font-mono">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2 py-1 rounded ${
                statusFilter === "all" ? "bg-slate-800 text-white" : "text-slate-400"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("unsolved")}
              className={`px-2 py-1 rounded ${
                statusFilter === "unsolved" ? "bg-slate-800 text-white" : "text-slate-400"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("solved")}
              className={`px-2 py-1 rounded ${
                statusFilter === "solved" ? "bg-slate-800 text-white" : "text-slate-400"
              }`}
            >
              Solved
            </button>
          </div>
        </div>
      </div>

      {/* Quests Grid */}
      {filteredQuests.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-slate-800 bg-slate-900/40">
          <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h4 className="font-bold text-slate-300">No matching scenarios found</h4>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredQuests.map((quest) => (
            <ScenarioCard key={quest.id} quest={quest} onSolve={completeQuest} />
          ))}
        </div>
      )}
    </div>
  );
}
