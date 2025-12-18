import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { getAllResults, Algorithm } from '@/lib/diskSchedulingAlgorithms';

interface ComparisonChartProps {
  requests: number[];
  initialHead: number;
  maxCylinder: number;
  currentAlgorithm: Algorithm;
}

const COLORS: Record<Algorithm, string> = {
  'FCFS': 'hsl(180, 100%, 50%)',
  'SSTF': 'hsl(280, 80%, 60%)',
  'SCAN': 'hsl(145, 80%, 42%)',
  'C-SCAN': 'hsl(38, 92%, 50%)',
};

export function ComparisonChart({ requests, initialHead, maxCylinder, currentAlgorithm }: ComparisonChartProps) {
  const data = useMemo(() => {
    if (requests.length === 0) return [];
    
    const results = getAllResults(requests, initialHead, maxCylinder);
    
    return Object.entries(results).map(([algorithm, result]) => ({
      algorithm,
      totalSeekTime: result.totalSeekTime,
      avgSeekTime: parseFloat(result.averageSeekTime.toFixed(2)),
      isActive: algorithm === currentAlgorithm,
    }));
  }, [requests, initialHead, maxCylinder, currentAlgorithm]);

  if (requests.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 animate-fade-in">
        <h3 className="text-lg font-mono font-semibold text-foreground mb-4">
          Algorithm Comparison
        </h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Add requests to see comparison
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-mono font-semibold text-foreground mb-2">{label}</p>
          <p className="text-sm text-primary">
            Total Seek: <span className="font-mono">{payload[0].value}</span>
          </p>
          <p className="text-sm text-accent">
            Avg Seek: <span className="font-mono">{payload[1].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 animate-fade-in">
      <h3 className="text-lg font-mono font-semibold text-foreground mb-4">
        Algorithm Comparison
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="algorithm" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontFamily: 'JetBrains Mono', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontFamily: 'JetBrains Mono', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}
          />
          <Bar 
            dataKey="totalSeekTime" 
            name="Total Seek Time" 
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={COLORS[entry.algorithm as Algorithm]}
                opacity={entry.isActive ? 1 : 0.5}
                stroke={entry.isActive ? 'white' : 'transparent'}
                strokeWidth={entry.isActive ? 2 : 0}
              />
            ))}
          </Bar>
          <Bar 
            dataKey="avgSeekTime" 
            name="Avg Seek Time" 
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-avg-${index}`}
                fill={COLORS[entry.algorithm as Algorithm]}
                opacity={entry.isActive ? 0.7 : 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Best Algorithm Indicator */}
      {data.length > 0 && (
        <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/30">
          <p className="text-sm font-mono text-success">
            Best: {data.reduce((best, curr) => curr.totalSeekTime < best.totalSeekTime ? curr : best).algorithm}
            <span className="text-muted-foreground ml-2">
              (Lowest seek time: {Math.min(...data.map(d => d.totalSeekTime))} cylinders)
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
