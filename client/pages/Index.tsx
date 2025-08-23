import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, BarChart3, Target, Zap, Shield, Smartphone, TrendingUp, Users, Calendar, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
        
        <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            <Badge variant="outline" className="mx-auto px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
              🚀 AI-Powered Career Intelligence
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Meet Your{" "}
              <span className="bg-gradient-to-r from-skillscape-primary via-skillscape-secondary to-skillscape-tertiary bg-clip-text text-transparent">
                AI Career Agent
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              SkillScape Navigator passively analyzes your digital footprint to identify skill gaps,
              deliver precision nudges, and accelerate your professional growth—all without the overwhelming effort.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90">
                <Link to="/onboarding" className="flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Watch Demo
              </Button>
            </div>
            
            <div className="pt-8">
              <p className="text-sm text-muted-foreground mb-4">Trusted by early-career professionals at</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-lg font-semibold">Google</div>
                <div className="text-lg font-semibold">Microsoft</div>
                <div className="text-lg font-semibold">Amazon</div>
                <div className="text-lg font-semibold">Meta</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Effortless Professional Growth
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI analyzes your work patterns to deliver personalized insights and actionable recommendations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="relative group hover:shadow-lg transition-all duration-200 border-0 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-skillscape-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-skillscape-primary" />
                </div>
                <CardTitle>Passive Analysis</CardTitle>
                <CardDescription>
                  Non-intrusive monitoring of your digital footprint across calendars, project tools, and workflows.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="relative group hover:shadow-lg transition-all duration-200 border-0 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-skillscape-secondary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-skillscape-secondary" />
                </div>
                <CardTitle>Precision Nudging</CardTitle>
                <CardDescription>
                  Hyper-personalized micro-interventions delivered at the perfect moment to accelerate your learning.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="relative group hover:shadow-lg transition-all duration-200 border-0 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-skillscape-tertiary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-skillscape-tertiary" />
                </div>
                <CardTitle>Real-time Insights</CardTitle>
                <CardDescription>
                  Dynamic dashboard showing skill progression, gap analysis, and impact measurement over time.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="relative group hover:shadow-lg transition-all duration-200 border-0 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-skillscape-accent/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-skillscape-accent" />
                </div>
                <CardTitle>Smart Integrations</CardTitle>
                <CardDescription>
                  Seamless connections with your existing tools: calendars, project management, and learning platforms.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="relative group hover:shadow-lg transition-all duration-200 border-0 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Privacy First</CardTitle>
                <CardDescription>
                  Your data stays secure with explicit consent, transparent processing, and complete control over your information.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="relative group hover:shadow-lg transition-all duration-200 border-0 bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Career Acceleration</CardTitle>
                <CardDescription>
                  Track your professional growth with metrics that matter: skill development, opportunity recognition, and goal achievement.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              How SkillScape Navigator Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your career trajectory with AI-powered insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-skillscape-primary to-skillscape-secondary flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold">Connect Your Tools</h3>
              <p className="text-muted-foreground">
                Securely link your calendar, project management tools, and learning platforms with one-click integrations.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-skillscape-secondary to-skillscape-tertiary flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI passively analyzes your work patterns, identifies skill usage, and maps gaps against your career goals.
              </p>
              <div className="flex justify-center pt-2">
                <Brain className="h-8 w-8 text-skillscape-secondary" />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-skillscape-tertiary to-skillscape-accent flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold">Get Nudged</h3>
              <p className="text-muted-foreground">
                Receive perfectly timed, personalized micro-interventions that accelerate your learning and growth.
              </p>
              <div className="flex justify-center pt-2">
                <Target className="h-8 w-8 text-skillscape-tertiary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-skillscape-primary/5 via-skillscape-secondary/5 to-skillscape-tertiary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of professionals already using AI to accelerate their growth. 
              Start your personalized career journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90">
                <Link to="/onboarding" className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Schedule Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Mobile Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Instant Setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
