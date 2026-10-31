import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const velocityData = [
  { month: "May", xp: 12400, baseline: 10000 },
  { month: "Jun", xp: 15800, baseline: 13000 },
  { month: "Jul", xp: 19500, baseline: 16500 },
  { month: "Aug", xp: 22100, baseline: 20000 },
  { month: "Sep", xp: 25400, baseline: 23500 },
  { month: "Oct", xp: 28450, baseline: 26000 },
];

export function VelocityChart() {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" stroke="#64748b" fontSize={11} fontFamily="monospace" />
          <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="xp"
            name="Earned XP"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorXp)"
          />
          <Area
            type="monotone"
            dataKey="baseline"
            name="Target Pace"
            stroke="#8b5cf6"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorBase)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
