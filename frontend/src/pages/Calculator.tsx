import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calculator as CalculatorIcon, Loader2 } from 'lucide-react';
import { DiaryInput } from '@/types';
import { postDiary, FACTORS } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Calculator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<DiaryInput>({
    date: new Date().toISOString().slice(0, 10),
    trips: [],
    power_use: [],
    meals: []
  });

  // Form state for inputs
  const [inputs, setInputs] = useState({
    carMiles: 0,
    busMiles: 0,
    railMiles: 0,
    electricity: 0,
    beefServings: 0,
    porkServings: 0,
    chickenServings: 0
  });

  // Live preview calculation
  const livePreview = {
    transport: (inputs.carMiles * FACTORS.transport.car) + 
                (inputs.busMiles * FACTORS.transport.bus) + 
                (inputs.railMiles * FACTORS.transport.rail),
    energy: inputs.electricity * FACTORS.energy.electricity,
    diet: (inputs.beefServings * FACTORS.diet.beef) + 
          (inputs.porkServings * FACTORS.diet.pork) + 
          (inputs.chickenServings * FACTORS.diet.chicken)
  };
  const totalPreview = livePreview.transport + livePreview.energy + livePreview.diet;

  const handleInputChange = (field: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: Math.max(0, value) }));
  };

  const handleClear = () => {
    setInputs({
      carMiles: 0,
      busMiles: 0,
      railMiles: 0,
      electricity: 0,
      beefServings: 0,
      porkServings: 0,
      chickenServings: 0
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const diaryData: DiaryInput = {
        date: formData.date,
        trips: [
          ...(inputs.carMiles > 0 ? [{ miles: inputs.carMiles, mode: 'car' as const }] : []),
          ...(inputs.busMiles > 0 ? [{ miles: inputs.busMiles, mode: 'bus' as const }] : []),
          ...(inputs.railMiles > 0 ? [{ miles: inputs.railMiles, mode: 'rail' as const }] : [])
        ],
        power_use: [
          ...(inputs.electricity > 0 ? [{ usage: inputs.electricity, device: 'computer' as const }] : [])
        ],
        meals: [
          ...(inputs.beefServings > 0 ? [{ servings: inputs.beefServings, meat: 'beef' as const }] : []),
          ...(inputs.porkServings > 0 ? [{ servings: inputs.porkServings, meat: 'pork' as const }] : []),
          ...(inputs.chickenServings > 0 ? [{ servings: inputs.chickenServings, meat: 'chicken' as const }] : [])
        ]
      };

      const result = await postDiary(diaryData);
      navigate('/results', { state: { calc: result } });
    } catch (error) {
      toast({
        title: 'Calculation Error',
        description: 'Failed to calculate emissions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-sora">Carbon Calculator</h1>
            <p className="text-muted-foreground">Calculate your weekly carbon emissions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="transport" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transport">Transport</TabsTrigger>
                <TabsTrigger value="energy">Energy</TabsTrigger>
                <TabsTrigger value="diet">Diet</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transport" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Transportation</CardTitle>
                    <CardDescription>Enter your weekly travel miles by mode</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="car-miles">Car (miles)</Label>
                        <Input
                          id="car-miles"
                          type="number"
                          min="0"
                          value={inputs.carMiles}
                          onChange={(e) => handleInputChange('carMiles', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bus-miles">Bus (miles)</Label>
                        <Input
                          id="bus-miles"
                          type="number"
                          min="0"
                          value={inputs.busMiles}
                          onChange={(e) => handleInputChange('busMiles', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rail-miles">Rail (miles)</Label>
                        <Input
                          id="rail-miles"
                          type="number"
                          min="0"
                          value={inputs.railMiles}
                          onChange={(e) => handleInputChange('railMiles', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="energy" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Energy Usage</CardTitle>
                    <CardDescription>Enter your weekly electricity consumption</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="electricity">Electricity (kWh)</Label>
                      <Input
                        id="electricity"
                        type="number"
                        min="0"
                        value={inputs.electricity}
                        onChange={(e) => handleInputChange('electricity', Number(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="diet" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Diet</CardTitle>
                    <CardDescription>Enter servings of meat (100g each)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="beef">Beef (servings)</Label>
                        <Input
                          id="beef"
                          type="number"
                          min="0"
                          value={inputs.beefServings}
                          onChange={(e) => handleInputChange('beefServings', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pork">Pork (servings)</Label>
                        <Input
                          id="pork"
                          type="number"
                          min="0"
                          value={inputs.porkServings}
                          onChange={(e) => handleInputChange('porkServings', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="chicken">Chicken (servings)</Label>
                        <Input
                          id="chicken"
                          type="number"
                          min="0"
                          value={inputs.chickenServings}
                          onChange={(e) => handleInputChange('chickenServings', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8">
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || totalPreview === 0}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <CalculatorIcon className="h-4 w-4 mr-2" />
                    Calculate
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>Real-time emissions calculation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold font-sora text-primary">
                    {totalPreview.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">kg CO₂e this week</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Transport</span>
                    <span className="text-sm font-medium">{livePreview.transport.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Energy</span>
                    <span className="text-sm font-medium">{livePreview.energy.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Diet</span>
                    <span className="text-sm font-medium">{livePreview.diet.toFixed(1)} kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}