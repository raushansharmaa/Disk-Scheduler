import { SchedulingResult } from '@/lib/diskSchedulingAlgorithms';
import { ArrowRight, Route } from 'lucide-react';

interface SequenceDisplayProps {
  result: SchedulingResult | null;
  initialHead: number;
  currentStep: number;
}

export function SequenceDisplay({ result, initialHead, currentStep }: SequenceDisplayProps) {
  if (!result || result.sequence.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel rounded-2xl p-5 hover-lift card-shine">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
          <Route className="w-4 h-4 text-warning" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Service Sequence</h3>
          <p className="text-xs text-muted-foreground">Order of disk requests processed</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        {/* Start position */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-success/15 rounded-lg border border-success/30">
          <span className="text-sm font-mono font-semibold text-success">{initialHead}</span>
          <span className="text-[10px] text-success/70 uppercase tracking-wider">start</span>
        </div>
        
        {result.sequence.map((cylinder, index) => {
          const isVisited = index < currentStep;
          const isCurrent = index === currentStep - 1;
          
          return (
            <div key={index} className="flex items-center gap-2">
              <ArrowRight className={`w-4 h-4 transition-colors duration-300 ${isVisited ? 'text-primary' : 'text-muted-foreground/30'}`} />
              <div
                className={`px-3 py-2 rounded-lg border font-mono text-sm font-medium transition-all duration-300
                  ${isCurrent 
                    ? 'bg-primary text-primary-foreground border-primary glow-primary scale-110' 
                    : isVisited 
                      ? 'bg-primary/15 text-primary border-primary/30' 
                      : 'bg-secondary/50 text-muted-foreground border-border/50'
                  }`}
              >
                {cylinder}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
