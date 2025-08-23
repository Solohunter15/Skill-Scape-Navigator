import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Target, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Shield,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentRole: "",
    careerGoals: "",
    experience: "",
    calendarConsent: false,
    projectToolsConsent: false,
    learningPlatformConsent: false
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Welcome to SkillScape Navigator</h2>
              <p className="text-muted-foreground">Let's set up your personalized AI career agent</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentRole">Current Role</Label>
                <Input
                  id="currentRole"
                  value={formData.currentRole}
                  onChange={(e) => handleInputChange("currentRole", e.target.value)}
                  placeholder="e.g., Software Engineer, Product Manager"
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Tell Us About Your Goals</h2>
              <p className="text-muted-foreground">Help us understand where you want to go</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <select 
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                >
                  <option value="">Select your experience level</option>
                  <option value="0-1">0-1 years (Entry Level)</option>
                  <option value="2-4">2-4 years (Junior)</option>
                  <option value="5-7">5-7 years (Mid-Level)</option>
                  <option value="8+">8+ years (Senior)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="careerGoals">Career Goals</Label>
                <textarea
                  id="careerGoals"
                  className="w-full p-2 border border-input rounded-md bg-background min-h-[100px] resize-none"
                  value={formData.careerGoals}
                  onChange={(e) => handleInputChange("careerGoals", e.target.value)}
                  placeholder="Describe your short and long-term career aspirations..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <Card className="p-4 border-2 hover:border-primary cursor-pointer transition-colors">
                  <div className="text-center space-y-2">
                    <Briefcase className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="font-medium">Leadership Role</h3>
                    <p className="text-sm text-muted-foreground">Manage teams and projects</p>
                  </div>
                </Card>
                <Card className="p-4 border-2 hover:border-primary cursor-pointer transition-colors">
                  <div className="text-center space-y-2">
                    <Target className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="font-medium">Technical Expert</h3>
                    <p className="text-sm text-muted-foreground">Deepen technical skills</p>
                  </div>
                </Card>
                <Card className="p-4 border-2 hover:border-primary cursor-pointer transition-colors">
                  <div className="text-center space-y-2">
                    <GraduationCap className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="font-medium">Career Change</h3>
                    <p className="text-sm text-muted-foreground">Transition to new field</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Connect Your Digital Footprint</h2>
              <p className="text-muted-foreground">
                Grant access to analyze your work patterns (you maintain full control)
              </p>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-start space-x-4">
                  <Calendar className="h-6 w-6 text-primary mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Calendar Integration</h3>
                        <p className="text-sm text-muted-foreground">
                          Analyze meeting patterns and time allocation
                        </p>
                      </div>
                      <Checkbox
                        checked={formData.calendarConsent}
                        onCheckedChange={(checked) => handleInputChange("calendarConsent", checked)}
                      />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Read-only access
                    </Badge>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-start space-x-4">
                  <Users className="h-6 w-6 text-primary mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Project Management Tools</h3>
                        <p className="text-sm text-muted-foreground">
                          Track task completion and collaboration patterns
                        </p>
                      </div>
                      <Checkbox
                        checked={formData.projectToolsConsent}
                        onCheckedChange={(checked) => handleInputChange("projectToolsConsent", checked)}
                      />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Metadata only
                    </Badge>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-start space-x-4">
                  <BookOpen className="h-6 w-6 text-primary mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Learning Platforms</h3>
                        <p className="text-sm text-muted-foreground">
                          Understand learning preferences and progress
                        </p>
                      </div>
                      <Checkbox
                        checked={formData.learningPlatformConsent}
                        onCheckedChange={(checked) => handleInputChange("learningPlatformConsent", checked)}
                      />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Progress data only
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Privacy Guarantee</p>
                  <p className="text-muted-foreground">
                    Your data is encrypted, never shared with third parties, and you can revoke access anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
              <h2 className="text-2xl font-bold">You're All Set!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your AI career agent is now analyzing your digital footprint. 
                You'll start receiving personalized insights within 24 hours.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-success/10 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold">What happens next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="font-medium">🔍 Analysis</div>
                  <div className="text-muted-foreground">AI reviews your patterns</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">📊 Insights</div>
                  <div className="text-muted-foreground">Skill gaps identified</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">🎯 Nudges</div>
                  <div className="text-muted-foreground">Personalized recommendations</div>
                </div>
              </div>
            </div>
            
            <Button asChild size="lg" className="h-12 px-8">
              <Link to="/dashboard" className="flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="mb-4" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <CardContent className="p-0">
              {renderStep()}
              
              {/* Navigation */}
              <div className="flex justify-between pt-8 mt-8 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} className="flex items-center gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button asChild className="flex items-center gap-2">
                    <Link to="/dashboard">
                      Complete Setup
                      <CheckCircle2 className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
