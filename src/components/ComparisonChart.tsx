import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { getAllResults, Algorithm } from '@/lib/diskSchedulingAlgorithms';
import { GitCompare, Trophy } from 'lucide-react';

interface ComparisonChartProps {
  requests: number[];
  initialHead: number;
  maxCylinder: number;
  currentAlgorithm: Algorithm;
}

const COLORS: Record<Algorithm, string> = {
  'FCFS': 'hsl(173, 80%, 40%)',
  'SSTF': 'hsl(262, 83%, 58%)',
  'SCAN': 'hsl(160, 84%, 39%)',
  'C-SCAN': 'hsl(43, 96%, 56%)',
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

  const bestAlgorithm = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((best, curr) => curr.totalSeekTime < best.totalSeekTime ? curr : best);
  }, [data]);

  if (requests.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 hover-lift card-shine h-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-info/10 border border-info/20">
            <GitCompare className="w-5 h-5 text-info" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Algorithm Comparison</h3>
            <p className="text-xs text-muted-foreground">Compare performance across algorithms</p>
          </div>
        </div>
        <div className="h-[280px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Add requests to see comparison</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel-strong p-4 rounded-xl shadow-2xl border border-border/50">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Total Seek:</span>{' '}
              <span className="font-mono text-primary font-semibold">{payload[0].value}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Avg Seek:</span>{' '}
              <span className="font-mono text-accent font-semibold">{payload[1].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 hover-lift card-shine h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-info/10 border border-info/20">
          <GitCompare className="w-5 h-5 text-info" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Algorithm Comparison</h3>
          <p className="text-xs text-muted-foreground">Compare performance across algorithms</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
          <XAxis 
            dataKey="algorithm" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontFamily: 'JetBrains Mono', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontFamily: 'JetBrains Mono', fontSize: 10 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
          <Legend 
            wrapperStyle={{ fontFamily: 'Inter', fontSize: 11, paddingTop: 10 }}
          />
          <Bar 
            dataKey="totalSeekTime" 
            name="Total Seek" 
            radius={[6, 6, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={COLORS[entry.algorithm as Algorithm]}
                opacity={entry.isActive ? 1 : 0.5}
                stroke={entry.isActive ? 'hsl(var(--foreground))' : 'transparent'}
                strokeWidth={entry.isActive ? 2 : 0}
              />
            ))}
          </Bar>
          <Bar 
            dataKey="avgSeekTime" 
            name="Avg Seek" 
            radius={[6, 6, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-avg-${index}`}
                fill={COLORS[entry.algorithm as Algorithm]}
                opacity={entry.isActive ? 0.6 : 0.25}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Best Algorithm Indicator */}
      {bestAlgorithm && (
        <div className="mt-4 p-3 rounded-xl bg-success/10 border border-success/30 flex items-center gap-3">
          <Trophy className="w-4 h-4 text-success shrink-0" />
          <p className="text-sm">
            <span className="font-semibold text-success">{bestAlgorithm.algorithm}</span>
            <span className="text-muted-foreground ml-2">
              Lowest seek time: <span className="font-mono text-foreground">{bestAlgorithm.totalSeekTime}</span> cylinders
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
