import { describe, it, expect } from "vitest";
import { initialSkills, initialRoleBenchmarks, initialQuests } from "./career-mock-data";

describe("Career Logic & Calculations", () => {
  it("should have comprehensive skill categories represented", () => {
    const categories = new Set(initialSkills.map((s) => s.category));
    expect(categories.has("Frontend")).toBe(true);
    expect(categories.has("Backend")).toBe(true);
    expect(categories.has("Cloud & DevOps")).toBe(true);
    expect(categories.has("AI & Data")).toBe(true);
    expect(categories.has("System Architecture")).toBe(true);
    expect(categories.has("Leadership")).toBe(true);
  });

  it("should accurately compute readiness score against role benchmark", () => {
    const targetRole = initialRoleBenchmarks.find((r) => r.id === "role-staff-architect")!;
    expect(targetRole).toBeDefined();

    const reqs = targetRole.requiredSkills;
    let totalWeight = 0;
    let earnedWeight = 0;

    initialSkills.forEach((s) => {
      const targetLvl = reqs[s.id];
      if (targetLvl !== undefined) {
        totalWeight += targetLvl;
        earnedWeight += Math.min(s.level, targetLvl);
      }
    });

    const calculatedScore = Math.round((earnedWeight / totalWeight) * 100);
    expect(calculatedScore).toBeGreaterThanOrEqual(50);
    expect(calculatedScore).toBeLessThanOrEqual(100);
  });

  it("should identify deficit skills correctly", () => {
    const targetRole = initialRoleBenchmarks.find((r) => r.id === "role-staff-architect")!;
    const reqs = targetRole.requiredSkills;

    const gaps: { id: string; deficit: number }[] = [];
    initialSkills.forEach((s) => {
      const targetLvl = reqs[s.id];
      if (targetLvl !== undefined && s.level < targetLvl) {
        gaps.push({ id: s.id, deficit: targetLvl - s.level });
      }
    });

    expect(gaps.length).toBeGreaterThan(0);
    // arch-dist level is 60 and requires 90 => deficit of 30
    const archDistGap = gaps.find((g) => g.id === "arch-dist");
    expect(archDistGap?.deficit).toBe(30);
  });

  it("should validate scenario quests have optimal choices and XP rewards", () => {
    initialQuests.forEach((quest) => {
      const optimalChoices = quest.choices.filter((c) => c.isOptimal);
      expect(optimalChoices.length).toBe(1);
      expect(quest.xpReward).toBeGreaterThan(100);
      expect(optimalChoices[0].xpReward).toBe(quest.xpReward);
    });
  });
});

