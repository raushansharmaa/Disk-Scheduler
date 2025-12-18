import { Algorithm } from '@/lib/diskSchedulingAlgorithms';
import { Info, CheckCircle2, XCircle } from 'lucide-react';

interface AlgorithmInfoProps {
  algorithm: Algorithm;
}

const algorithmDetails: Record<Algorithm, { name: string; description: string; pros: string[]; cons: string[] }> = {
  'FCFS': {
    name: 'First Come First Serve',
    description: 'Processes requests in the order they arrive. Simple but may result in high seek times due to random head movement.',
    pros: ['Simple implementation', 'Fair scheduling', 'No starvation'],
    cons: ['High average seek time', 'Wild arm movement', 'Not efficient'],
  },
  'SSTF': {
    name: 'Shortest Seek Time First',
    description: 'Always services the request closest to the current head position, minimizing seek time for each operation.',
    pros: ['Better than FCFS', 'Reduces total seek time', 'More efficient'],
    cons: ['May cause starvation', 'Not optimal', 'Overhead in calculating'],
  },
  'SCAN': {
    name: 'SCAN (Elevator)',
    description: 'Moves in one direction servicing requests until reaching the end, then reverses direction like an elevator.',
    pros: ['No starvation', 'Uniform wait time', 'Better than SSTF'],
    cons: ['Long wait for recently visited', 'Not optimal for clustered requests'],
  },
  'C-SCAN': {
    name: 'Circular SCAN',
    description: 'Like SCAN but jumps back to the start after reaching the end, providing more uniform wait time distribution.',
    pros: ['Uniform wait time', 'No starvation', 'Predictable'],
    cons: ['More movement than SCAN', 'Not optimal for all patterns'],
  },
};

export function AlgorithmInfo({ algorithm }: AlgorithmInfoProps) {
  const info = algorithmDetails[algorithm];

  return (
    <div className="glass-panel rounded-2xl p-6 hover-lift card-shine">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-info/10 border border-info/20">
          <Info className="w-5 h-5 text-info" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{info.name}</h3>
          <p className="text-xs text-muted-foreground">Algorithm Details</p>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{info.description}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-success uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Advantages
          </h4>
          <ul className="space-y-2">
            {info.pros.map((pro, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-destructive uppercase tracking-wider flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5" />
            Disadvantages
          </h4>
          <ul className="space-y-2">
            {info.cons.map((con, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
