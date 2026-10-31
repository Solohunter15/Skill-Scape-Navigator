import React from "react";
import Navigation from "../components/Navigation";
import { LiveTelemetryStream } from "../components/integrations/LiveTelemetryStream";
import { useCareer } from "../context/CareerContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Shield,
  RefreshCw,
  GitBranch,
  Calendar as CalendarIcon,
  CheckSquare,
  BookOpen,
  MessageSquare,
} from "lucide-react";

export default function Integrations() {
  const { integrations, toggleIntegration, telemetry, addXp } = useCareer();

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "github":
        return <GitBranch className="w-5 h-5 text-cyan-400" />;
      case "calendar":
        return <CalendarIcon className="w-5 h-5 text-emerald-400" />;
      case "jira":
        return <CheckSquare className="w-5 h-5 text-blue-400" />;
      case "coursera":
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      default:
        return <MessageSquare className="w-5 h-5 text-purple-400" />;
    }
  };

  const simulateActivity = () => {
    const randomSkillId = "arch-cache";
    addXp(randomSkillId, 50);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-mono">
                <Shield className="w-3.5 h-3.5 mr-1" /> Passive Career Intelligence
              </Badge>
              <span className="text-xs text-slate-400 font-mono">Zero Overhead Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Connected Developer Ecosystem
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              SkillScape Navigator passively reads telemetry from your tools to map your growing competencies, unlock new stars in the 3D Constellation, and deliver targeted career nudges.
            </p>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {integrations.map((item) => (
            <Card
              key={item.id}
              className={`border-slate-800 bg-slate-900/80 backdrop-blur-md transition-all ${
                item.connected ? "border-cyan-500/40" : "opacity-80"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      {getProviderIcon(item.provider)}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-white">
                        {item.name}
                      </CardTitle>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <Switch
                    checked={item.connected}
                    onCheckedChange={() => toggleIntegration(item.id)}
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-1">
                <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {item.connected ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-emerald-300">Live Telemetry Active</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-slate-600" />
                        <span>Disconnected</span>
                      </>
                    )}
                  </div>

                  <span>Synced: {item.lastSync}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Telemetry Stream */}
        <LiveTelemetryStream
          telemetry={telemetry}
          onSimulateEvent={simulateActivity}
        />
      </main>
    </div>
  );
}
