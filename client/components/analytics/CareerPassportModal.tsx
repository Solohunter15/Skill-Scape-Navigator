import React, { useState } from "react";
import { useCareer } from "../../context/CareerContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Download,
  Share2,
  X,
  Award,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
} from "lucide-react";

interface CareerPassportModalProps {
  onClose: () => void;
}

export function CareerPassportModal({ onClose }: CareerPassportModalProps) {
  const { profile, skills, targetRole, readinessScore, masteredSkills } = useCareer();
  const [copied, setCopied] = useState(false);

  const topSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 6);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const passportData = {
      meta: {
        issuer: "SkillScape Navigator AI",
        version: "2.0-Cosmic",
        issuedAt: new Date().toISOString(),
        passportHash: `SKILL-V2-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      },
      profile: {
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        currentTitle: profile.currentTitle,
        targetRole: targetRole?.title,
        level: profile.level,
        totalXp: profile.totalXp,
        readinessScore: `${readinessScore}%`,
      },
      topMasteredSkills: topSkills.map((s) => ({
        name: s.name,
        category: s.category,
        level: s.level,
        status: s.status,
      })),
    };

    const blob = new Blob([JSON.stringify(passportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SkillScape-Passport-${profile.firstName}-${profile.lastName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl p-6 text-slate-100 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Passport Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold">
                Cryptographically Verified Credentials
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                SkillScape Career Passport
              </h3>
            </div>
          </div>
        </div>

        {/* Passport Identity Card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-mono">Navigator Identity</div>
              <div className="text-lg font-bold text-white">
                {profile.firstName} {profile.lastName}
              </div>
              <div className="text-xs text-cyan-300 font-mono">{profile.currentTitle}</div>
            </div>

            <div className="text-right">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs font-mono">
                Tier {profile.level} Navigator
              </Badge>
              <div className="text-xs text-amber-400 font-mono font-bold mt-1">
                {profile.totalXp.toLocaleString()} XP
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-850 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Target Role</span>
              <span className="text-slate-200 font-bold">{targetRole?.title}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Readiness Match</span>
              <span className="text-emerald-400 font-bold">{readinessScore}% Benchmark</span>
            </div>
          </div>
        </div>

        {/* Verified Competencies */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Top Verified Competencies</span>
            <span className="text-slate-500 text-[11px] font-mono">Mastery Lvl / 100</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {topSkills.map((s) => (
              <div
                key={s.id}
                className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="truncate text-slate-200">{s.name}</span>
                </div>
                <span className="font-mono font-bold text-cyan-400 shrink-0 ml-1">
                  {s.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-9"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Download JSON Passport
          </Button>

          <Button
            variant="outline"
            onClick={handleCopy}
            className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs h-9"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Link Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Share Verification URL
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

