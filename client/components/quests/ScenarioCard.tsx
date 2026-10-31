import React, { useState } from "react";
import { ScenarioQuest, ScenarioChoice } from "../../types/career";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
} from "lucide-react";

interface ScenarioCardProps {
  quest: ScenarioQuest;
  onSolve: (
    questId: string,
    choiceId: string
  ) => { isOptimal: boolean; xpEarned: number; feedback: string };
}

export function ScenarioCard({ quest, onSolve }: ScenarioCardProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(
    quest.userSelectedChoiceId || null
  );
  const [feedbackState, setFeedbackState] = useState<{
    isOptimal: boolean;
    xpEarned: number;
    feedback: string;
  } | null>(() => {
    if (quest.completed && quest.userSelectedChoiceId) {
      const choice = quest.choices.find((c) => c.id === quest.userSelectedChoiceId);
      if (choice) {
        return {
          isOptimal: choice.isOptimal,
          xpEarned: choice.xpReward,
          feedback: choice.feedback,
        };
      }
    }
    return null;
  });

  const handleSelect = (choice: ScenarioChoice) => {
    if (quest.completed) return;
    setSelectedChoiceId(choice.id);
    const result = onSolve(quest.id, choice.id);
    setFeedbackState(result);
  };

  const getDifficultyBadge = (difficulty: ScenarioQuest["difficulty"]) => {
    switch (difficulty) {
      case "Architect":
        return (
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[11px] font-mono">
            {difficulty}
          </Badge>
        );
      case "Master":
        return (
          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[11px] font-mono">
            {difficulty}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[11px] font-mono">
            {difficulty}
          </Badge>
        );
    }
  };

  return (
    <Card
      className={`border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-xl text-slate-100 transition-all duration-300 ${
        quest.completed ? "border-emerald-500/40" : "hover:border-slate-700"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {getDifficultyBadge(quest.difficulty)}
            <Badge variant="outline" className="border-slate-700 text-slate-300 text-[11px]">
              {quest.category}
            </Badge>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-current" /> +{quest.xpReward} XP
            </span>
            {quest.completed && (
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px]">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Solved
              </Badge>
            )}
          </div>
        </div>

        <CardTitle className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
          {quest.title}
        </CardTitle>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-850">
          {quest.scenario}
        </p>

        <div className="text-xs font-semibold text-cyan-300 pt-1 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          {quest.context}
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-1">
        {/* Choices */}
        <div className="space-y-2">
          {quest.choices.map((choice, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = selectedChoiceId === choice.id;
            const showCorrect = quest.completed && choice.isOptimal;
            const showIncorrect = isSelected && !choice.isOptimal;

            let choiceClasses =
              "w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 relative ";

            if (showCorrect) {
              choiceClasses += "border-emerald-500/60 bg-emerald-950/30 text-emerald-200";
            } else if (showIncorrect) {
              choiceClasses += "border-rose-500/60 bg-rose-950/30 text-rose-200";
            } else if (isSelected) {
              choiceClasses += "border-cyan-500/60 bg-cyan-950/30 text-cyan-200";
            } else if (quest.completed) {
              choiceClasses += "border-slate-800/60 bg-slate-950/40 text-slate-500 opacity-60";
            } else {
              choiceClasses +=
                "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-850 cursor-pointer";
            }

            return (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice)}
                disabled={quest.completed}
                className={choiceClasses}
              >
                <span
                  className={`w-5 h-5 rounded-md font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    showCorrect
                      ? "bg-emerald-500 text-slate-950"
                      : showIncorrect
                      ? "bg-rose-500 text-white"
                      : isSelected
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {letter}
                </span>

                <span className="leading-relaxed flex-1">{choice.text}</span>

                {showCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                )}
                {showIncorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Rationale Box */}
        {feedbackState && (
          <div
            className={`p-3.5 rounded-xl border text-xs mt-3 animate-in fade-in ${
              feedbackState.isOptimal
                ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                : "border-amber-500/40 bg-amber-950/40 text-amber-200"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1">
              {feedbackState.isOptimal ? (
                <>
                  <Award className="w-4 h-4 text-emerald-400" /> Optimal Architectural Solution! (+
                  {feedbackState.xpEarned} XP)
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" /> Learning Point (+
                  {feedbackState.xpEarned} XP Awarded)
                </>
              )}
            </div>
            <p className="leading-relaxed">{feedbackState.feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

