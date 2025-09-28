import { X } from 'lucide-react';
import { useState } from 'react';

interface SeasonalBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function SeasonalBanner({ message, onDismiss }: SeasonalBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 mb-8">
      <div className="glass-card bg-gradient-to-r from-warning/10 to-primary/10 border-warning/20 p-4 flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-muted rounded-full transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}