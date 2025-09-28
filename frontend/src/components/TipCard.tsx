import { ComponentState } from '../types';
import { Lightbulb, Copy, ExternalLink, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRecommendation } from '@/lib/api';
import { useState } from 'react';
import { RecommendationList } from '@/types';

interface TipCardProps {
  tip: string;
  savingsKg?: number;
  badges?: string[];
  state?: ComponentState;
}

export function TipCard({ tip, savingsKg, badges = [], state = 'success' }: TipCardProps) {

  const { user } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const [tips, setTips] = useState<RecommendationList>(null)

  const handleSubmit = async () => {
    setIsLoading(true);
    const recommendation_list = await getRecommendation(user.username, user.token);
    console.log(recommendation_list)
    setTips(recommendation_list)
    setIsLoading(false);
  }

  if (state === 'loading') {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="glass-card p-6 text-center">
        <div className="h-32 flex flex-col items-center justify-center">
          <Lightbulb className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground mb-4">No insights available yet</p>
          <button className="text-primary hover:underline">Add more data for insights</button>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="glass-card p-6 text-center">
        <div className="h-32 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-error mb-2" />
          <p className="text-muted-foreground mb-4">Failed to load insight</p>
          <button className="flex items-center space-x-2 text-primary hover:underline">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-primary-accent/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <span className="font-semibold">AI Insight</span>
        </div>
        
        <div className="flex space-x-2">
          {badges.map((badge, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Render recommendations */}
      <div className="">
        {tips != null ? (
          tips.recommendations.map((t, idx) => (
            <div className="bg-success/10 border border-success/20 rounded-lg p-5 mb-4">
            <p key={idx} className="text-success font-semibold">
              • <strong>Recommendation</strong> {t.recommendation} <br></br>
              <strong>Impact:</strong> {t.impact}
            </p>
              </div>
          ))
        ) : (
          <p className="text-sm mb-4 leading-relaxed">{tip || "No tips yet. Fetch recommendations!"}</p>
        )}
      </div>


      <div className="flex space-x-2">
        <button className="flex items-center space-x-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors"
        onClick={handleSubmit} >
          <span>Get Recommendations</span>
        </button>
      </div>
    </div>
  );
}