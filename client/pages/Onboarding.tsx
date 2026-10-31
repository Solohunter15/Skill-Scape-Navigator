import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Sparkles,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Briefcase,
  Zap,
  Compass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCareer } from "../context/CareerContext";

export default function Onboarding() {
  const navigate = useNavigate();
  const { roles, setTargetRoleId, updateProfile } = useCareer();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState({
    firstName: "Alex",
    lastName: "Vance",
    email: "alex.vance@techfleet.io",
    currentTitle: "Senior Full-Stack Engineer",
    targetRoleId: "role-staff-architect",
    githubSync: true,
    calendarSync: true,
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalize onboarding
      updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        currentTitle: formData.currentTitle,
        targetRoleId: formData.targetRoleId,
      });
      setTargetRoleId(formData.targetRoleId);
      navigate("/dashboard");
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Top Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Compass className="w-3.5 h-3.5" /> Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-slate-800" />
        </div>

        {/* Wizard Card */}
        <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl text-slate-100">
          <CardHeader className="text-center pb-4">
            <Badge
              variant="outline"
              className="mx-auto mb-2 border-cyan-500/40 text-cyan-300 bg-cyan-500/10 text-xs font-mono"
            >
              🚀 AI Career Setup Engine
            </Badge>

            {currentStep === 1 && (
              <>
                <CardTitle className="text-2xl font-bold text-white">
                  Initialize Your Navigator Identity
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Tell us who you are and what role you currently execute
                </CardDescription>
              </>
            )}

            {currentStep === 2 && (
              <>
                <CardTitle className="text-2xl font-bold text-white">
                  Define Your Career Target Milestone
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Select the high-leverage benchmark role you aspire to reach
                </CardDescription>
              </>
            )}

            {currentStep === 3 && (
              <>
                <CardTitle className="text-2xl font-bold text-white">
                  Baseline Proficiency Matrix
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Calibrate your starting competencies across primary tech domains
                </CardDescription>
              </>
            )}

            {currentStep === 4 && (
              <>
                <CardTitle className="text-2xl font-bold text-white">
                  Activate Passive Digital Footprint
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Enable non-intrusive telemetry to power real-time AI nudges
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Step 1: Identity */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs text-slate-300">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, firstName: e.target.value }))
                      }
                      className="bg-slate-950 border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs text-slate-300">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, lastName: e.target.value }))
                      }
                      className="bg-slate-950 border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-slate-300">
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, email: e.target.value }))
                    }
                    className="bg-slate-950 border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="currentRole" className="text-xs text-slate-300">
                    Current Professional Role
                  </Label>
                  <Input
                    id="currentRole"
                    value={formData.currentTitle}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, currentTitle: e.target.value }))
                    }
                    placeholder="e.g. Senior Software Engineer"
                    className="bg-slate-950 border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Target Role */}
            {currentStep === 2 && (
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, targetRoleId: role.id }))
                    }
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      formData.targetRoleId === role.id
                        ? "border-cyan-500 bg-cyan-950/30 text-white shadow-md shadow-cyan-950/40"
                        : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                        {role.title}
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px] font-mono">
                          {role.tier}
                        </Badge>
                      </div>
                      <div className="text-emerald-400 font-mono font-bold text-xs">
                        {role.averageSalary}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {role.description}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Proficiency Calibration */}
            {currentStep === 3 && (
              <div className="space-y-4 text-xs font-mono">
                <p className="text-slate-400 text-xs mb-3 font-sans">
                  Use the sliders to adjust your starting baseline levels. You can update these anytime in your 3D Constellation.
                </p>

                {[
                  { name: "Frontend & Web Performance", val: 85, color: "#06b6d4" },
                  { name: "Backend & Distributed Databases", val: 75, color: "#8b5cf6" },
                  { name: "Cloud Infrastructure & Kubernetes", val: 65, color: "#3b82f6" },
                  { name: "LLM Agents & Modern AI", val: 60, color: "#10b981" },
                  { name: "System Architecture & Resilience", val: 70, color: "#f59e0b" },
                  { name: "Leadership & Architectural Governance", val: 65, color: "#f43f5e" },
                ].map((s) => (
                  <div key={s.name} className="space-y-1.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 font-sans font-semibold text-slate-200">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.name}
                      </span>
                      <span className="text-cyan-400 font-bold">{s.val} / 100</span>
                    </div>
                    <Progress value={s.val} className="h-1.5 bg-slate-800" />
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Digital Footprint Permissions */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-cyan-300">
                    <Shield className="w-4 h-4" /> Privacy-First Intelligence
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    SkillScape operates with zero-knowledge passive monitoring. Telemetry is used exclusively to calibrate your career roadmap and is never shared.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-white">GitHub Activity Telemetry</div>
                      <div className="text-[11px] text-slate-400">
                        Analyze PR reviews, merged code complexity, and language velocity
                      </div>
                    </div>
                    <Switch
                      checked={formData.githubSync}
                      onCheckedChange={(val) =>
                        setFormData((p) => ({ ...p, githubSync: val }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-white">Calendar Deep Work Audit</div>
                      <div className="text-[11px] text-slate-400">
                        Detect meeting fatigue and schedule protected architecture slots
                      </div>
                    </div>
                    <Switch
                      checked={formData.calendarSync}
                      onCheckedChange={(val) =>
                        setFormData((p) => ({ ...p, calendarSync: val }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="border-slate-800 bg-slate-950 text-slate-300 text-xs h-9"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
              </Button>

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs h-9 px-5 shadow-lg shadow-cyan-900/30"
              >
                {currentStep === totalSteps ? (
                  <>
                    Launch 3D Constellation <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
