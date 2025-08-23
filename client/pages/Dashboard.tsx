import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import {
  BarChart3,
  TrendingUp,
  Target,
  Lightbulb,
  Clock,
  Award,
  ArrowUp,
  ArrowDown,
  Calendar,
  BookOpen,
  Users,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// Mock data for demonstration
const skillData = [
  { name: "React/Frontend", level: 85, growth: +12, category: "Technical" },
  { name: "Project Management", level: 72, growth: +8, category: "Leadership" },
  { name: "Data Analysis", level: 45, growth: +15, category: "Technical" },
  {
    name: "Team Communication",
    level: 88,
    growth: +3,
    category: "Soft Skills",
  },
  { name: "Cloud Architecture", level: 35, growth: +22, category: "Technical" },
  {
    name: "Strategic Planning",
    level: 58,
    growth: +18,
    category: "Leadership",
  },
];

const recentNudges = [
  {
    id: 1,
    type: "learning",
    title: "Advanced React Patterns",
    description:
      "Based on your recent project work, explore React Context optimization",
    time: "2 hours ago",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    type: "skill",
    title: "Cloud Security Best Practices",
    description: "Your calendar shows upcoming cloud architecture meetings",
    time: "1 day ago",
    priority: "medium",
    completed: true,
  },
  {
    id: 3,
    type: "networking",
    title: "Connect with DevOps Engineers",
    description: "Expand your network in areas where you're growing",
    time: "2 days ago",
    priority: "low",
    completed: false,
  },
];

const weeklyActivity = [
  { day: "Mon", coding: 6, meetings: 2, learning: 1 },
  { day: "Tue", coding: 7, meetings: 3, learning: 0.5 },
  { day: "Wed", coding: 5, meetings: 4, learning: 1.5 },
  { day: "Thu", coding: 8, meetings: 1, learning: 2 },
  { day: "Fri", coding: 6, meetings: 3, learning: 1 },
];

export default function Dashboard() {
  const [animatedValues, setAnimatedValues] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    // Animate progress bars on load
    const timer = setTimeout(() => {
      const values: { [key: string]: number } = {};
      skillData.forEach((skill) => {
        values[skill.name] = skill.level;
      });
      setAnimatedValues(values);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getSkillColor = (level: number) => {
    if (level >= 80) return "bg-success";
    if (level >= 60) return "bg-primary";
    if (level >= 40) return "bg-warning";
    return "bg-destructive";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-success/5 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
              <p className="text-muted-foreground">
                Here's your professional growth overview
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Zap className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Last sync: 5 min ago
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Skills Developed
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +3 this month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Learning Hours
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47.5</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +12% vs last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Precision Nudges
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">Completion rate</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Career Score
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">762</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +45 this week
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            <TabsTrigger value="nudges">Recent Nudges</TabsTrigger>
            <TabsTrigger value="activity">Activity Pattern</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skill Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Skill Development
                  </CardTitle>
                  <CardDescription>
                    Your current skill levels and recent growth
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillData.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {skill.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {animatedValues[skill.name] || 0}%
                          </span>
                          {skill.growth > 0 && (
                            <span className="text-xs text-success flex items-center">
                              <ArrowUp className="h-3 w-3" />+{skill.growth}%
                            </span>
                          )}
                        </div>
                      </div>
                      <Progress
                        value={animatedValues[skill.name] || 0}
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skill Gaps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Priority Skill Gaps
                  </CardTitle>
                  <CardDescription>
                    Areas where focused improvement will accelerate your goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg bg-destructive/5 border-destructive/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">
                          Cloud Architecture
                        </h4>
                        <Badge variant="destructive" className="text-xs">
                          Critical
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Your calendar shows 40% more cloud-related meetings, but
                        skill level is only 35%
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                      >
                        Start Learning Path
                      </Button>
                    </div>

                    <div className="p-3 border rounded-lg bg-warning/5 border-warning/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">Data Analysis</h4>
                        <Badge
                          variant="outline"
                          className="text-xs border-warning text-warning"
                        >
                          Medium
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Growing demand in your role, quick wins available
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                      >
                        View Resources
                      </Button>
                    </div>

                    <div className="p-3 border rounded-lg bg-primary/5 border-primary/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">
                          Strategic Planning
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-xs border-primary text-primary"
                        >
                          Low
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Leadership growth opportunity for next quarter
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                      >
                        Explore Options
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nudges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Precision Nudges
                </CardTitle>
                <CardDescription>
                  Personalized micro-interventions based on your current context
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentNudges.map((nudge) => (
                    <div
                      key={nudge.id}
                      className={`p-4 border rounded-lg ${nudge.completed ? "bg-muted/30 opacity-60" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{nudge.title}</h4>
                          <Badge
                            variant={getPriorityColor(nudge.priority)}
                            className="text-xs"
                          >
                            {nudge.priority}
                          </Badge>
                          {nudge.completed && (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {nudge.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {nudge.description}
                      </p>
                      {!nudge.completed && (
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 text-xs">
                            Take Action
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                          >
                            Learn More
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Activity Pattern
                </CardTitle>
                <CardDescription>
                  Your work patterns analyzed from connected platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyActivity.map((day) => (
                    <div key={day.day} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium w-12">
                          {day.day}
                        </span>
                        <div className="flex-1 flex gap-1 mx-4">
                          <div
                            className="bg-primary h-6 rounded"
                            style={{ width: `${(day.coding / 10) * 100}%` }}
                            title={`Coding: ${day.coding}h`}
                          />
                          <div
                            className="bg-secondary h-6 rounded"
                            style={{ width: `${(day.meetings / 10) * 100}%` }}
                            title={`Meetings: ${day.meetings}h`}
                          />
                          <div
                            className="bg-success h-6 rounded"
                            style={{ width: `${(day.learning / 10) * 100}%` }}
                            title={`Learning: ${day.learning}h`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-16 text-right">
                          {day.coding + day.meetings + day.learning}h total
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-6 pt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-primary rounded" />
                      <span>Coding</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-secondary rounded" />
                      <span>Meetings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-success rounded" />
                      <span>Learning</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">
                      Focus Area: Cloud Skills
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Your meeting patterns suggest increasing cloud
                      responsibilities. Prioritize AWS/Azure certifications over
                      the next 2 months.
                    </p>
                  </div>
                  <div className="p-3 bg-success/10 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">
                      Strength: Team Collaboration
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Your communication skills are consistently strong.
                      Consider mentoring opportunities to leverage this
                      strength.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Growth Trajectory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Level</span>
                      <span className="font-medium">Mid-Level Engineer</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Projected (6 months)</span>
                      <span className="font-medium text-primary">
                        Senior Engineer
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Key Milestone</span>
                      <span className="font-medium text-success">
                        Cloud Architecture Cert
                      </span>
                    </div>
                  </div>
                  <Progress value={68} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    68% progress toward senior role based on current trajectory
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
