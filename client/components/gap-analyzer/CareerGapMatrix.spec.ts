import { describe, it, expect } from "vitest";
import { initialRoleBenchmarks, initialSkills } from "../../context/career-mock-data";

describe("CareerGapMatrix Calculations & Benchmarks", () => {
  it("should verify all initial roles have valid benchmarks and percentiles", () => {
    initialRoleBenchmarks.forEach((role) => {
      expect(role.id).toBeDefined();
      expect(role.title).toBeTruthy();
      expect(role.salaryPercentiles.p25).toBeLessThan(role.salaryPercentiles.p50);
      expect(role.salaryPercentiles.p50).toBeLessThan(role.salaryPercentiles.p75);
      expect(role.salaryPercentiles.p75).toBeLessThan(role.salaryPercentiles.p90);
      expect(Object.keys(role.requiredSkills).length).toBeGreaterThan(3);
      expect(role.milestones.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("should calculate target role salary gap correctly", () => {
    const staffRole = initialRoleBenchmarks.find((r) => r.id === "role-staff-architect")!;
    const seniorRole = initialRoleBenchmarks.find((r) => r.id === "role-senior-fullstack")!;

    const delta = staffRole.salaryPercentiles.p50 - seniorRole.salaryPercentiles.p50;
    expect(delta).toBe(65000); // 245,000 - 180,000 = $65k
  });

  it("should verify 3D coordinates are bounded and non-overlapping", () => {
    const positions = new Set<string>();
    initialSkills.forEach((skill) => {
      expect(skill.position3D).toHaveLength(3);
      const [x, y, z] = skill.position3D;
      expect(Math.abs(x)).toBeLessThanOrEqual(150);
      expect(Math.abs(y)).toBeLessThanOrEqual(150);
      expect(Math.abs(z)).toBeLessThanOrEqual(150);

      const key = `${x},${y},${z}`;
      expect(positions.has(key)).toBe(false);
      positions.add(key);
    });
  });
});
