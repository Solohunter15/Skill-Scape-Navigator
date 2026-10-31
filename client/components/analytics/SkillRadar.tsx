import React, { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useCareer } from "../../context/CareerContext";
import { SkillCategory } from "../../types/career";

const ALL_CATEGORIES: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Cloud & DevOps",
  "AI & Data",
  "System Architecture",
  "Leadership",
];

export function SkillRadar() {
  const { skills, targetRole } = useCareer();

  const data = useMemo(() => {
    return ALL_CATEGORIES.map((cat) => {
      const catSkills = skills.filter((s) => s.category === cat);
      const avgCurrent =
        catSkills.length > 0
          ? Math.round(
              catSkills.reduce((acc, s) => acc + s.level, 0) / catSkills.length
            )
          : 0;

      // Target benchmark avg for this category
      let targetSum = 0;
      let targetCount = 0;
      catSkills.forEach((s) => {
        const req = targetRole?.requiredSkills[s.id];
        if (req !== undefined) {
          targetSum += req;
          targetCount++;
        }
      });
      const avgTarget = targetCount > 0 ? Math.round(targetSum / targetCount) : 85;

      return {
        category: cat,
        current: avgCurrent,
        target: avgTarget,
      };
    });
  }, [skills, targetRole]);

  return (
    <div className="w-full h-[320px] sm:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <Radar
            name="Your Competency"
            dataKey="current"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.45}
          />
          <Radar
            name="Target Role"
            dataKey="target"
            stroke="#a855f7"
            fill="#a855f7"
            fillOpacity={0.25}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
