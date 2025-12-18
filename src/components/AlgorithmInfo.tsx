import { Algorithm } from '@/lib/diskSchedulingAlgorithms';
import { Info } from 'lucide-react';

interface AlgorithmInfoProps {
  algorithm: Algorithm;
}

const algorithmDetails: Record<Algorithm, { name: string; description: string; pros: string[]; cons: string[] }> = {
  'FCFS': {
    name: 'First Come First Serve',
    description: 'Processes requests in the order they arrive. Simple but may result in high seek times.',
    pros: ['Simple implementation', 'Fair scheduling', 'No starvation'],
    cons: ['High average seek time', 'Wild arm movement', 'Not efficient'],
  },
  'SSTF': {
    name: 'Shortest Seek Time First',
    description: 'Always services the request closest to the current head position.',
    pros: ['Better than FCFS', 'Reduces total seek time', 'More efficient'],
    cons: ['May cause starvation', 'Not optimal', 'Overhead in calculating'],
  },
  'SCAN': {
    name: 'SCAN (Elevator)',
    description: 'Moves in one direction servicing requests until reaching the end, then reverses.',
    pros: ['No starvation', 'Uniform wait time', 'Better than SSTF'],
    cons: ['Long wait for recently visited', 'Not optimal for clustered requests'],
  },
  'C-SCAN': {
    name: 'Circular SCAN',
    description: 'Like SCAN but jumps back to the start after reaching the end, providing uniform wait time.',
    pros: ['Uniform wait time', 'No starvation', 'Predictable'],
    cons: ['More movement than SCAN', 'Not optimal for all patterns'],
  },
};

export function AlgorithmInfo({ algorithm }: AlgorithmInfoProps) {
  const info = algorithmDetails[algorithm];

  return (
    <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-primary" />
        <h3 className="font-mono font-semibold text-foreground">{info.name}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{info.description}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-mono text-success mb-2">Advantages</h4>
          <ul className="space-y-1">
            {info.pros.map((pro, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-success" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-mono text-destructive mb-2">Disadvantages</h4>
          <ul className="space-y-1">
            {info.cons.map((con, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-destructive" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
