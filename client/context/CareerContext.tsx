import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import {
  SkillNode,
  CareerRoleBenchmark,
  ScenarioQuest,
  CareerNudge,
  CareerProfile,
  IntegrationItem,
  TelemetryEvent,
} from "../types/career";
import {
  initialSkills,
  initialRoleBenchmarks,
  initialQuests,
  initialNudges,
  initialProfile,
  initialIntegrations,
  initialTelemetry,
} from "./career-mock-data";

export interface CelebrationData {
  skillName: string;
  oldLevel: number;
  newLevel: number;
  xpGained: number;
}

interface CareerContextType {
  skills: SkillNode[];
  roles: CareerRoleBenchmark[];
  targetRole: CareerRoleBenchmark | undefined;
  selectedSkill: SkillNode | null;
  quests: ScenarioQuest[];
  nudges: CareerNudge[];
  profile: CareerProfile;
  integrations: IntegrationItem[];
  telemetry: TelemetryEvent[];
  activeCelebration: CelebrationData | null;
  readinessScore: number;
  gapSkills: { skill: SkillNode; targetLevel: number; deficit: number }[];
  masteredSkills: SkillNode[];
  setSelectedSkill: (skill: SkillNode | null) => void;
  setTargetRoleId: (roleId: string) => void;
  addXp: (skillId: string, amount: number) => void;
  completeQuest: (
    questId: string,
    choiceId: string
  ) => { isOptimal: boolean; xpEarned: number; feedback: string };
  dismissNudge: (nudgeId: string) => void;
  completeNudge: (nudgeId: string) => void;
  toggleIntegration: (integrationId: string) => void;
  addCustomSkill: (skill: Omit<SkillNode, "id" | "growth" | "xp" | "xpToNextLevel">) => void;
  updateSkill: (skillId: string, updates: Partial<SkillNode>) => void;
  updateProfile: (updates: Partial<CareerProfile>) => void;
  closeCelebration: () => void;
  resetToDefaults: () => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

const STORAGE_KEY = "skillscape_career_state_v1";

export function CareerProvider({ children }: { children: ReactNode }) {
  const [skills, setSkills] = useState<SkillNode[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_skills`);
      return saved ? JSON.parse(saved) : initialSkills;
    } catch {
      return initialSkills;
    }
  });

  const [roles, setRoles] = useState<CareerRoleBenchmark[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_roles`);
      return saved ? JSON.parse(saved) : initialRoleBenchmarks;
    } catch {
      return initialRoleBenchmarks;
    }
  });

  const [targetRoleId, setTargetRoleIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_targetRole`);
      return saved || initialProfile.targetRoleId;
    } catch {
      return initialProfile.targetRoleId;
    }
  });

  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);

  const [quests, setQuests] = useState<ScenarioQuest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_quests`);
      return saved ? JSON.parse(saved) : initialQuests;
    } catch {
      return initialQuests;
    }
  });

  const [nudges, setNudges] = useState<CareerNudge[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_nudges`);
      return saved ? JSON.parse(saved) : initialNudges;
    } catch {
      return initialNudges;
    }
  });

  const [profile, setProfile] = useState<CareerProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [integrations, setIntegrations] = useState<IntegrationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_integrations`);
      return saved ? JSON.parse(saved) : initialIntegrations;
    } catch {
      return initialIntegrations;
    }
  });

  const [telemetry, setTelemetry] = useState<TelemetryEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_telemetry`);
      return saved ? JSON.parse(saved) : initialTelemetry;
    } catch {
      return initialTelemetry;
    }
  });

  const [activeCelebration, setActiveCelebration] = useState<CelebrationData | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_skills`, JSON.stringify(skills));
      localStorage.setItem(`${STORAGE_KEY}_roles`, JSON.stringify(roles));
      localStorage.setItem(`${STORAGE_KEY}_targetRole`, targetRoleId);
      localStorage.setItem(`${STORAGE_KEY}_quests`, JSON.stringify(quests));
      localStorage.setItem(`${STORAGE_KEY}_nudges`, JSON.stringify(nudges));
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
      localStorage.setItem(`${STORAGE_KEY}_integrations`, JSON.stringify(integrations));
      localStorage.setItem(`${STORAGE_KEY}_telemetry`, JSON.stringify(telemetry));
    } catch (e) {
      console.warn("Could not save to LocalStorage:", e);
    }
  }, [skills, roles, targetRoleId, quests, nudges, profile, integrations, telemetry]);

  const targetRole = useMemo(() => {
    return roles.find((r) => r.id === targetRoleId) || roles[0];
  }, [roles, targetRoleId]);

  // Compute Career Readiness score and Gap Skills
  const { readinessScore, gapSkills, masteredSkills } = useMemo(() => {
    if (!targetRole) {
      return { readinessScore: 100, gapSkills: [], masteredSkills: skills };
    }

    const reqs = targetRole.requiredSkills;
    const reqKeys = Object.keys(reqs);
    if (reqKeys.length === 0) {
      return { readinessScore: 100, gapSkills: [], masteredSkills: skills };
    }

    let totalWeight = 0;
    let earnedWeight = 0;
    const gaps: { skill: SkillNode; targetLevel: number; deficit: number }[] = [];
    const mastered: SkillNode[] = [];

    skills.forEach((s) => {
      const targetLvl = reqs[s.id];
      if (targetLvl !== undefined) {
        totalWeight += targetLvl;
        const currentMatch = Math.min(s.level, targetLvl);
        earnedWeight += currentMatch;

        if (s.level < targetLvl) {
          gaps.push({
            skill: s,
            targetLevel: targetLvl,
            deficit: targetLvl - s.level,
          });
        } else {
          mastered.push(s);
        }
      } else if (s.level >= 80) {
        mastered.push(s);
      }
    });

    // Sort gaps by deficit descending
    gaps.sort((a, b) => b.deficit - a.deficit);

    const calculatedScore = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 80;

    return {
      readinessScore: Math.min(Math.max(calculatedScore, 10), 100),
      gapSkills: gaps,
      masteredSkills: mastered,
    };
  }, [skills, targetRole]);

  const setTargetRoleId = (roleId: string) => {
    setTargetRoleIdState(roleId);
    setProfile((prev) => ({ ...prev, targetRoleId: roleId }));
  };

  const addXp = (skillId: string, amount: number) => {
    setSkills((prevSkills) =>
      prevSkills.map((s) => {
        if (s.id !== skillId) return s;

        const newXp = s.xp + amount;
        let newLevel = s.level;
        let newXpToNext = s.xpToNextLevel;

        if (newXp >= s.xpToNextLevel && s.level < 100) {
          const levelGain = Math.floor(newXp / s.xpToNextLevel);
          newLevel = Math.min(100, s.level + levelGain);
          newXpToNext = Math.round(s.xpToNextLevel * 1.2);

          // Trigger level-up celebration
          setActiveCelebration({
            skillName: s.name,
            oldLevel: s.level,
            newLevel: newLevel,
            xpGained: amount,
          });
        }

        const newStatus = newLevel >= 80 ? "mastered" : newLevel >= 50 ? "in_progress" : "gap";

        return {
          ...s,
          xp: newXp,
          level: newLevel,
          xpToNextLevel: newXpToNext,
          status: newStatus,
          growth: s.growth + 2,
        };
      })
    );

    setProfile((prev) => {
      const newTotalXp = prev.totalXp + amount;
      const computedLevel = Math.floor(newTotalXp / 2000) + 1;
      return {
        ...prev,
        totalXp: newTotalXp,
        level: computedLevel,
      };
    });

    // Record Telemetry
    const skillName = skills.find((s) => s.id === skillId)?.name || "Technical";
    const newEvent: TelemetryEvent = {
      id: `telemetry-${Date.now()}`,
      timestamp: "Just now",
      source: "Agent",
      message: `Completed challenge in ${skillName}: +${amount} XP credited`,
      xpEarned: amount,
      type: "nudge",
    };
    setTelemetry((prev) => [newEvent, ...prev.slice(0, 20)]);
  };

  const completeQuest = (questId: string, choiceId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return { isOptimal: false, xpEarned: 0, feedback: "Quest not found" };

    const choice = quest.choices.find((c) => c.id === choiceId);
    if (!choice) return { isOptimal: false, xpEarned: 0, feedback: "Choice not found" };

    const xpEarned = choice.xpReward;

    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, completed: true, userSelectedChoiceId: choiceId }
          : q
      )
    );

    addXp(quest.skillId, xpEarned);

    return {
      isOptimal: choice.isOptimal,
      xpEarned,
      feedback: choice.feedback,
    };
  };

  const dismissNudge = (nudgeId: string) => {
    setNudges((prev) => prev.filter((n) => n.id !== nudgeId));
  };

  const completeNudge = (nudgeId: string) => {
    setNudges((prev) =>
      prev.map((n) => (n.id === nudgeId ? { ...n, completed: true } : n))
    );
    // Give bonus XP
    setProfile((prev) => ({ ...prev, totalXp: prev.totalXp + 75 }));
  };

  const toggleIntegration = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === integrationId
          ? {
              ...item,
              connected: !item.connected,
              lastSync: !item.connected ? "Just now" : item.lastSync,
            }
          : item
      )
    );
  };

  const addCustomSkill = (skillData: Omit<SkillNode, "id" | "growth" | "xp" | "xpToNextLevel">) => {
    const newId = `custom-${Date.now()}`;
    const newSkill: SkillNode = {
      ...skillData,
      id: newId,
      growth: 5,
      xp: skillData.level * 25,
      xpToNextLevel: Math.max(1000, skillData.level * 35),
    };

    setSkills((prev) => [...prev, newSkill]);
  };

  const updateSkill = (skillId: string, updates: Partial<SkillNode>) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, ...updates } : s))
    );
  };

  const updateProfile = (updates: Partial<CareerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const closeCelebration = () => {
    setActiveCelebration(null);
  };

  const resetToDefaults = () => {
    setSkills(initialSkills);
    setRoles(initialRoleBenchmarks);
    setTargetRoleIdState(initialProfile.targetRoleId);
    setQuests(initialQuests);
    setNudges(initialNudges);
    setProfile(initialProfile);
    setIntegrations(initialIntegrations);
    setTelemetry(initialTelemetry);
    setSelectedSkill(null);
    localStorage.clear();
  };

  return (
    <CareerContext.Provider
      value={{
        skills,
        roles,
        targetRole,
        selectedSkill,
        quests,
        nudges,
        profile,
        integrations,
        telemetry,
        activeCelebration,
        readinessScore,
        gapSkills,
        masteredSkills,
        setSelectedSkill,
        setTargetRoleId,
        addXp,
        completeQuest,
        dismissNudge,
        completeNudge,
        toggleIntegration,
        addCustomSkill,
        updateSkill,
        updateProfile,
        closeCelebration,
        resetToDefaults,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error("useCareer must be used within a CareerProvider");
  }
  return context;
}
