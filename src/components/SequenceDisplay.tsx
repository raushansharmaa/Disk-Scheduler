import { SchedulingResult } from '@/lib/diskSchedulingAlgorithms';
import { ArrowRight } from 'lucide-react';

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
    <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
      <h3 className="text-sm font-mono text-muted-foreground mb-3">Service Sequence</h3>
      
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-1.5 bg-success/20 rounded-md border border-success/30">
          <span className="text-sm font-mono text-success">{initialHead}</span>
          <span className="text-xs text-success/70">(start)</span>
        </div>
        
        {result.sequence.map((cylinder, index) => {
          const isVisited = index < currentStep;
          const isCurrent = index === currentStep - 1;
          
          return (
            <div key={index} className="flex items-center gap-2">
              <ArrowRight className={`w-4 h-4 ${isVisited ? 'text-primary' : 'text-muted-foreground/30'}`} />
              <div
                className={`px-3 py-1.5 rounded-md border font-mono text-sm transition-all duration-300
                  ${isCurrent 
                    ? 'bg-primary text-primary-foreground border-primary glow-primary scale-110' 
                    : isVisited 
                      ? 'bg-primary/20 text-primary border-primary/30' 
                      : 'bg-secondary text-muted-foreground border-border'
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
