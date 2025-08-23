import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { ArrowLeft, Construction, Lightbulb } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  features?: string[];
}

export default function PlaceholderPage({ 
  title, 
  description, 
  features = [] 
}: PlaceholderPageProps) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-warning/10 flex items-center justify-center">
              <Construction className="h-8 w-8 text-warning" />
            </div>
            
            <Badge variant="outline" className="mx-auto">
              Coming Soon
            </Badge>
            
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          </div>

          {features.length > 0 && (
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Planned Features
                </CardTitle>
                <CardDescription>
                  Here's what we're building for this section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-success/10 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Want to see this feature next?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Let us know what you'd like to see prioritized in development.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" size="sm">
                Request Feature
              </Button>
              <Button size="sm">
                Provide Feedback
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/">
                Back to Home
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
