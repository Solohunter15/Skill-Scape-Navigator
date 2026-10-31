import React, { useState } from "react";
import { SkillCategory, SkillNode } from "../../types/career";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { X, Plus, Sparkles } from "lucide-react";

interface CustomSkillModalProps {
  onClose: () => void;
  onAddSkill: (skill: Omit<SkillNode, "id" | "growth" | "xp" | "xpToNextLevel">) => void;
}

const CATEGORIES: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Cloud & DevOps",
  "AI & Data",
  "System Architecture",
  "Leadership",
];

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  Frontend: "#06b6d4",
  Backend: "#8b5cf6",
  "Cloud & DevOps": "#3b82f6",
  "AI & Data": "#10b981",
  "System Architecture": "#f59e0b",
  Leadership: "#f43f5e",
};

export function CustomSkillModal({ onClose, onAddSkill }: CustomSkillModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SkillCategory>("Frontend");
  const [level, setLevel] = useState(65);
  const [targetLevel, setTargetLevel] = useState(85);
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Generate random 3D position in the category quadrant
    const radius = 35 + Math.random() * 25;
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 60;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const status: SkillNode["status"] =
      level >= 80 ? "mastered" : level >= 50 ? "in_progress" : "gap";

    onAddSkill({
      name: name.trim(),
      category,
      level,
      targetLevel,
      status,
      prerequisites: [],
      description: description.trim() || `Custom competency in ${category}.`,
      position3D: [Math.round(x), Math.round(y), Math.round(z)],
      color: CATEGORY_COLORS[category],
      marketDemandPercentile: 90,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 text-slate-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Add Custom Skill to Galaxy</h3>
              <p className="text-xs text-slate-400">Position a new celestial node in your universe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <Label htmlFor="skill-name" className="text-slate-300">
              Skill Name
            </Label>
            <Input
              id="skill-name"
              placeholder="e.g. Rust, WebAssembly, Neo4j, GraphQL"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-slate-950 border-slate-800 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-select" className="text-slate-300">
              Category Cluster
            </Label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as SkillCategory)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Current Level</span>
              <span className="text-cyan-400 font-bold">{level} / 100</span>
            </div>
            <Slider
              value={[level]}
              min={0}
              max={100}
              step={1}
              onValueChange={([val]) => setLevel(val)}
              className="py-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Target Role Goal</span>
              <span className="text-purple-400 font-bold">{targetLevel} / 100</span>
            </div>
            <Slider
              value={[targetLevel]}
              min={0}
              max={100}
              step={1}
              onValueChange={([val]) => setTargetLevel(val)}
              className="py-1"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="skill-desc" className="text-slate-300">
              Description / Context
            </Label>
            <Textarea
              id="skill-desc"
              placeholder="Describe what mastery entails in your projects..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-950 border-slate-800 text-xs text-white h-20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-700 bg-slate-900 text-slate-300 text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs h-9 px-4"
            >
              Ignite Skill Star
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
