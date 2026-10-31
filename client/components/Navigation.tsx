import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCareer } from "../context/CareerContext";
import { CareerPassportModal } from "./analytics/CareerPassportModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  LayoutDashboard,
  Swords,
  BarChart3,
  Zap,
  Settings,
  Menu,
  X,
  Flame,
  ShieldCheck,
} from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const location = useLocation();
  const { profile } = useCareer();

  const navigation = [
    { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
    { name: "Decision Quests", href: "/quests", icon: Swords },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Integrations", href: "/integrations", icon: Zap },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <nav className="bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 font-black text-base sm:text-lg text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <Compass className="w-4 h-4" />
              </div>
              <span>
                SkillScape <span className="text-cyan-400">Navigator</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* User Stat Badges & Passport Quick Launch */}
            <div className="hidden sm:flex items-center gap-2.5">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[11px] font-mono py-1">
                Lvl {profile.level}
              </Badge>

              <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[11px] font-mono py-1 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current text-rose-400" />
                {profile.streakDays}d Streak
              </Badge>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPassport(true)}
                className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs h-8 px-2.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Passport
              </Button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-400 hover:text-white"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2 animate-in fade-in">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                    active
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs font-mono">
                  Lvl {profile.level}
                </Badge>
                <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-xs font-mono">
                  {profile.streakDays}d Streak
                </Badge>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  setShowPassport(true);
                }}
                className="bg-cyan-600 text-white text-xs h-8"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Passport
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Career Passport Modal */}
      {showPassport && (
        <CareerPassportModal onClose={() => setShowPassport(false)} />
      )}
    </>
  );
}
