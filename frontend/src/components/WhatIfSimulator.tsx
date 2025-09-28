import { useState } from 'react';
import { Calculator, Zap } from 'lucide-react';

interface WhatIfSimulatorProps {
  bikeMi: number;
  carMi: number;
  kwh: number;
  meatServings: number;
  onChange: (partial: Partial<WhatIfData>) => void;
  projectedSavingsKg: number;
}

interface WhatIfData {
  bikeMi: number;
  carMi: number;
  kwh: number;
  meatServings: number;
}

export function WhatIfSimulator({ 
  bikeMi, 
  carMi, 
  kwh, 
  meatServings, 
  onChange, 
  projectedSavingsKg 
}: WhatIfSimulatorProps) {
  
  const handleSliderChange = (key: keyof WhatIfData, value: number) => {
    onChange({ [key]: value });
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">What-If Simulator</h3>
      </div>
      
      <div className="space-y-6">
        {/* Sliders */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>+ Bike miles</span>
              <span className="text-muted-foreground">{bikeMi} mi</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={bikeMi}
              onChange={(e) => handleSliderChange('bikeMi', Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>– Car miles</span>
              <span className="text-muted-foreground">{carMi} mi</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={carMi}
              onChange={(e) => handleSliderChange('carMi', Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb-error"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>– kWh usage</span>
              <span className="text-muted-foreground">{kwh} kWh</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={kwh}
              onChange={(e) => handleSliderChange('kwh', Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb-warning"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>– Meat servings</span>
              <span className="text-muted-foreground">{meatServings} servings</span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              value={meatServings}
              onChange={(e) => handleSliderChange('meatServings', Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb-warning"
            />
          </div>
        </div>

        {/* Projected Savings */}
        <div className="bg-gradient-to-r from-success/10 to-primary/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-success" />
            <span className="font-semibold text-success">Projected Weekly Savings</span>
          </div>
          <div className="text-2xl font-bold font-sora text-success">
            {projectedSavingsKg.toFixed(1)} kg CO₂e
          </div>
        </div>
      </div>
    </div>
  );
}