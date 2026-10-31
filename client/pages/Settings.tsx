import React, { useState } from "react";
import Navigation from "../components/Navigation";
import { CustomSkillModal } from "../components/settings/CustomSkillModal";
import { useCareer } from "../context/CareerContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  Plus,
  Trash2,
  RotateCcw,
  User,
  Sliders,
  Shield,
  Check,
} from "lucide-react";

export default function Settings() {
  const {
    profile,
    updateProfile,
    roles,
    targetRole,
    setTargetRoleId,
    skills,
    addCustomSkill,
    resetToDefaults,
  } = useCareer();

  const [savedMessage, setSavedMessage] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [nudgeSensitivity, setNudgeSensitivity] = useState<"subtle" | "balanced" | "proactive">("proactive");

  const [formProfile, setFormProfile] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    currentTitle: profile.currentTitle,
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formProfile);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs font-mono">
                <SettingsIcon className="w-3.5 h-3.5 mr-1" /> Preferences & Config
              </Badge>
              <span className="text-xs text-slate-400 font-mono">Profile Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Navigator Settings & Skill Configuration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Fine-tune your identity, career aspirations, AI nudging sensitivity, and expand your 3D Galaxy with custom skills.
            </p>
          </div>

          <Button
            onClick={() => setShowSkillModal(true)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-10 px-4 shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Custom Skill
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" /> Professional Identity & Career Goals
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Used across your Career Passport and target role gap calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fname" className="text-xs text-slate-300">
                    First Name
                  </Label>
                  <Input
                    id="fname"
                    value={formProfile.firstName}
                    onChange={(e) =>
                      setFormProfile((p) => ({ ...p, firstName: e.target.value }))
                    }
                    className="bg-slate-950 border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lname" className="text-xs text-slate-300">
                    Last Name
                  </Label>
                  <Input
                    id="lname"
                    value={formProfile.lastName}
                    onChange={(e) =>
                      setFormProfile((p) => ({ ...p, lastName: e.target.value }))
                    }
                    className="bg-slate-950 border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs text-slate-300">
                    Current Professional Title
                  </Label>
                  <Input
                    id="title"
                    value={formProfile.currentTitle}
                    onChange={(e) =>
                      setFormProfile((p) => ({ ...p, currentTitle: e.target.value }))
                    }
                    className="bg-slate-950 border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="target-role" className="text-xs text-slate-300">
                    Target Role Benchmark
                  </Label>
                  <select
                    id="target-role"
                    value={targetRole?.id}
                    onChange={(e) => setTargetRoleId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500 h-9"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.tier})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedMessage ? (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Profile successfully saved!
                  </span>
                ) : (
                  <span />
                )}
                <Button
                  type="submit"
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-8 px-4"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* AI Agent Sensitivity */}
        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" /> AI Nudge Engine Sensitivity
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Determines how aggressively the AI agent creates precision interventions based on calendar & git activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "subtle",
                  name: "Subtle & Low Frequency",
                  desc: "Only highlights critical skill gaps and promotional blocks.",
                },
                {
                  id: "balanced",
                  name: "Balanced Advisor",
                  desc: "Daily digest of high-leverage scenario recommendations.",
                },
                {
                  id: "proactive",
                  name: "Proactive Executive Coach",
                  desc: "Real-time calendar focus audit, code review signals, and instant quest recommendations.",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setNudgeSensitivity(opt.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    nudgeSensitivity === opt.id
                      ? "border-purple-500 bg-purple-950/30 text-white shadow-md shadow-purple-950/50"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="font-bold text-xs text-slate-200 mb-1">{opt.name}</div>
                  <div className="text-[11px] leading-relaxed text-slate-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone / Factory Reset */}
        <Card className="border-rose-900/30 bg-rose-950/10 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-rose-300 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" /> Reset & Data Control
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Clear your local state and reset all skills, XP, and benchmarks to default seed data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-400 max-w-md">
                Resetting will restore the default 18 skills, seed scenario quests, and clear any custom skills added to localStorage.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="border-rose-800 text-rose-300 hover:bg-rose-950/40 text-xs h-9 shrink-0"
              >
                Reset to Default State
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Custom Skill Modal */}
      {showSkillModal && (
        <CustomSkillModal
          onClose={() => setShowSkillModal(false)}
          onAddSkill={addCustomSkill}
        />
      )}
    </div>
  );
}

