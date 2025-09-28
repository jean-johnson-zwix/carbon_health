import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Leaf, Target, BarChart3, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-sora">About Emiscope</h1>
            <p className="text-muted-foreground">AI-assisted personal carbon footprint tracking</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="glass-card p-8 mb-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold font-sora mb-4">
              Track. Understand. Reduce.
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Emiscope helps individuals understand and reduce their carbon footprint through 
              intelligent tracking, personalized insights, and actionable recommendations.
            </p>
            <Button onClick={() => navigate('/calculator')} size="lg">
              Start Tracking Today
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Comprehensive Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Monitor emissions across transport, energy, and diet with detailed breakdowns 
                and weekly trends to understand your impact patterns.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Receive personalized recommendations based on your usage patterns, 
                with quantified savings potential and actionable steps.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Goal Setting</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Set weekly emission targets and track your progress with visual indicators 
                and streak tracking to stay motivated.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Impact Visualization</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                See your environmental impact in relatable terms like tree equivalents 
                and understand the broader context of your actions.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Methodology Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Our Methodology</CardTitle>
            <CardDescription>
              How we calculate your carbon footprint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Transportation</h4>
              <p className="text-muted-foreground">
                Based on EPA emission factors: Car (0.404 kg CO₂/mile), Bus (0.089 kg CO₂/mile), 
                Rail (0.041 kg CO₂/mile). Walking and cycling are calculated as zero emissions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Energy Consumption</h4>
              <p className="text-muted-foreground">
                Electricity usage calculated at 0.38 kg CO₂/kWh based on average US grid emissions. 
                Regional variations may apply.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Diet</h4>
              <p className="text-muted-foreground">
                Meat consumption emissions per 100g serving: Beef (2.70 kg CO₂), Pork (1.21 kg CO₂), 
                Chicken (0.69 kg CO₂). Based on lifecycle assessment studies.
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> All values are typical averages with ±20–30% variation by region 
                and methodology. Results should be used as estimates for relative comparison and improvement tracking.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mission Statement */}
        <div className="glass-card p-8 text-center">
          <h3 className="text-xl font-bold font-sora mb-4">Our Mission</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We believe that individual actions, when informed and guided by data, 
            can collectively make a significant impact on climate change. Emiscope 
            makes carbon tracking accessible, understandable, and actionable for everyone.
          </p>
        </div>
    </div>
  );
}