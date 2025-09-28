import { X, Car, Bus, Train, Zap, Flame, UtensilsCrossed } from 'lucide-react';

interface FactorsDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export function FactorsDialog({ open, onOpenChange }: FactorsDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="relative glass-card max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-sora">Emission Factors</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Transport */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Transportation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="flex items-center space-x-2">
                    <Car className="h-4 w-4" />
                    <span>Car</span>
                  </span>
                  <span className="font-mono">0.404 kg/mi</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="flex items-center space-x-2">
                    <Bus className="h-4 w-4" />
                    <span>Bus</span>
                  </span>
                  <span className="font-mono">0.089 kg/mi</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="flex items-center space-x-2">
                    <Train className="h-4 w-4" />
                    <span>Rail</span>
                  </span>
                  <span className="font-mono">0.041 kg/mi</span>
                </div>
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold">Energy</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Electricity</span>
                  </span>
                  <span className="font-mono">0.38 kg/kWh</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="flex items-center space-x-2">
                    <Flame className="h-4 w-4" />
                    <span>Natural Gas</span>
                  </span>
                  <span className="font-mono">5.3 kg/therm</span>
                </div>
              </div>
            </div>

            {/* Diet */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <UtensilsCrossed className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">Diet (per 100g)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span>Beef</span>
                  <span className="font-mono">2.70 kg</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span>Pork</span>
                  <span className="font-mono">1.21 kg</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                  <span>Chicken</span>
                  <span className="font-mono">0.69 kg</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <p className="text-sm text-warning-foreground">
                <strong>Note:</strong> Emission factors can vary by ±20–30% based on region, 
                energy grid mix, and specific methodologies. These values represent typical averages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}