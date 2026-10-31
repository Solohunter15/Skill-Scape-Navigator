import React from "react";
import { TelemetryEvent } from "../../types/career";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  GitCommit,
  GitPullRequest,
  Clock,
  Sparkles,
  Zap,
  Play,
} from "lucide-react";

interface LiveTelemetryStreamProps {
  telemetry: TelemetryEvent[];
  onSimulateEvent: () => void;
}

export function LiveTelemetryStream({
  telemetry,
  onSimulateEvent,
}: LiveTelemetryStreamProps) {
  const getEventIcon = (type: TelemetryEvent["type"]) => {
    switch (type) {
      case "commit":
        return <GitCommit className="w-4 h-4 text-cyan-400" />;
      case "review":
        return <GitPullRequest className="w-4 h-4 text-purple-400" />;
      case "deepwork":
        return <Clock className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl p-5 text-slate-100 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              Passive Telemetry Ingestion Stream
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            </h3>
            <p className="text-xs text-slate-400">
              Live event stream synthesized from connected developer workflows
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={onSimulateEvent}
          className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs h-8"
        >
          <Play className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Simulate Activity Spike
        </Button>
      </div>

      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 font-mono text-xs">
        {telemetry.map((event) => (
          <div
            key={event.id}
            className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                {getEventIcon(event.type)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-slate-700 text-slate-300">
                    {event.source}
                  </Badge>
                  <span className="text-[10px] text-slate-500">{event.timestamp}</span>
                </div>
                <div className="text-slate-200 truncate">{event.message}</div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" /> +{event.xpEarned} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

