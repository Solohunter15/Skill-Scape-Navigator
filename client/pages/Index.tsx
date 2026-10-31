import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ArrowRight,
  Compass,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  BarChart3,
  Swords,
  ChevronRight,
  Layers,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Navigation Header */}
      <nav className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-black text-lg text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <span>
              SkillScape <span className="text-cyan-400">Navigator</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs text-slate-300 hover:text-white"
            >
              <Link to="/quests">Decision Quests</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/40"
            >
              <Link to="/dashboard" className="flex items-center gap-1.5">
                Launch Command Center <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
        {/* Subtle Cosmic Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl space-y-6">
          <Badge
            variant="outline"
            className="px-3.5 py-1.5 text-xs font-mono font-medium border-cyan-500/40 text-cyan-300 bg-cyan-950/40 backdrop-blur-md shadow-sm shadow-cyan-500/20 mx-auto"
          >
            🚀 Next-Gen 3D Skill Constellation & Career Intelligence OS
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Navigate Your Tech Career In{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Three Dimensions
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SkillScape Navigator transforms abstract professional growth into an interactive 3D WebGL Constellation. Benchmark against Staff and Principal engineering roles, solve high-stakes architectural decision scenarios, and earn verified XP.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm h-12 px-8 shadow-xl shadow-cyan-500/25"
            >
              <Link to="/onboarding" className="flex items-center gap-2">
                Explore Your Constellation <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm h-12 px-6"
            >
              <Link to="/dashboard">Instant Live Demo</Link>
            </Button>
          </div>

          {/* Metrics Ticker */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto font-mono text-center">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-black text-cyan-400">3D WebGL</div>
              <div className="text-xs text-slate-400 mt-1">Celestial Starscape</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-black text-purple-400">+$65,000</div>
              <div className="text-xs text-slate-400 mt-1">Median Promotion Delta</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-black text-emerald-400">100% Real-Time</div>
              <div className="text-xs text-slate-400 mt-1">Scenario XP Level-Up</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-2xl font-black text-amber-400">Zero Fatigue</div>
              <div className="text-xs text-slate-400 mt-1">Passive Telemetry Sync</div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Features Grid */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-900">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Four Pillars of Next-Gen Career Navigation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Engineered for ambitious software engineers, systems architects, and technical leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Compass className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-bold text-white">
                3D Celestial Skill Galaxy
              </CardTitle>
              <CardDescription className="text-xs text-slate-300 leading-relaxed">
                Experience your skills as an orbiting celestial universe. Watch stars grow in size and luminosity as you master competencies, complete with cross-discipline constellation links.
              </CardDescription>
            </Card>

            <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Target className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-bold text-white">
                Executive Career Gap Matrix
              </CardTitle>
              <CardDescription className="text-xs text-slate-300 leading-relaxed">
                Benchmark your proficiencies against verified Staff Architect, Principal AI, and Director standards. Know your exact readiness score and dollar compensation upside.
              </CardDescription>
            </Card>

            <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Swords className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-bold text-white">
                Incident & Architecture Quests
              </CardTitle>
              <CardDescription className="text-xs text-slate-300 leading-relaxed">
                Practice high-stakes decisions: Cache stampedes, Kubernetes cascades, and RAG hallucinations. Gain instant architectural feedback and level up your constellation stars in real time.
              </CardDescription>
            </Card>

            <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-bold text-white">
                Verified Career Passport
              </CardTitle>
              <CardDescription className="text-xs text-slate-300 leading-relaxed">
                Export and share your cryptographic Career Passport detailing verified competencies, category radar scores, and promotion velocity.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 border-t border-slate-900">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Take Flight?
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Take control of your engineering trajectory today. Setup takes under 60 seconds.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm h-12 px-8 shadow-xl shadow-cyan-900/50"
          >
            <Link to="/onboarding" className="flex items-center gap-2">
              Launch SkillScape Navigator <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs font-mono text-slate-500">
        SkillScape Navigator • Next-Gen Career Intelligence & 3D Constellation
      </footer>
    </div>
  );
}
