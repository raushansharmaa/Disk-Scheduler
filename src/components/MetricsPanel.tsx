import { SchedulingResult, Algorithm } from '@/lib/diskSchedulingAlgorithms';
import { Activity, Clock, Gauge, TrendingDown, BarChart3 } from 'lucide-react';

interface MetricsPanelProps {
  result: SchedulingResult | null;
  algorithm: Algorithm;
  requestCount: number;
}

export function MetricsPanel({ result, algorithm, requestCount }: MetricsPanelProps) {
  const metrics = [
    {
      label: 'Total Seek Time',
      value: result ? `${result.totalSeekTime}` : '—',
      unit: 'cylinders',
      icon: Activity,
      colorClass: 'text-primary',
      bgClass: 'bg-primary/10',
      borderClass: 'border-primary/20',
    },
    {
      label: 'Average Seek Time',
      value: result ? result.averageSeekTime.toFixed(2) : '—',
      unit: 'cyl/req',
      icon: Clock,
      colorClass: 'text-accent',
      bgClass: 'bg-accent/10',
      borderClass: 'border-accent/20',
    },
    {
      label: 'Throughput',
      value: result && result.totalSeekTime > 0 
        ? ((requestCount / result.totalSeekTime) * 100).toFixed(2) 
        : '—',
      unit: 'req/100cyl',
      icon: Gauge,
      colorClass: 'text-success',
      bgClass: 'bg-success/10',
      borderClass: 'border-success/20',
    },
    {
      label: 'Seek Operations',
      value: result ? result.seekOperations.length.toString() : '—',
      unit: 'ops',
      icon: TrendingDown,
      colorClass: 'text-warning',
      bgClass: 'bg-warning/10',
      borderClass: 'border-warning/20',
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 hover-lift card-shine h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
            <p className="text-xs text-muted-foreground">{algorithm} Algorithm</p>
          </div>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl ${metric.bgClass} border ${metric.borderClass} transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 ${metric.colorClass}`} />
              <span className="text-xs text-muted-foreground font-medium">{metric.label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-bold font-mono ${metric.colorClass}`}>
                {metric.value}
              </span>
              <span className="text-xs text-muted-foreground">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Seek Operations Log */}
      {result && result.seekOperations.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Seek Operations Log
          </h4>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin">
            {result.seekOperations.map((op, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs font-mono p-2.5 bg-secondary/50 rounded-lg border border-border/30 hover:bg-secondary/70 transition-colors"
              >
                <span className="text-muted-foreground">Step {index + 1}</span>
                <span className="text-foreground font-medium">
                  {op.from} → {op.to}
                </span>
                <span className="text-primary font-semibold">+{op.seek}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
