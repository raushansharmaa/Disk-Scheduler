import { SchedulingResult, Algorithm } from '@/lib/diskSchedulingAlgorithms';
import { Activity, Clock, Gauge, TrendingDown } from 'lucide-react';

interface MetricsPanelProps {
  result: SchedulingResult | null;
  algorithm: Algorithm;
  requestCount: number;
}

export function MetricsPanel({ result, algorithm, requestCount }: MetricsPanelProps) {
  const metrics = [
    {
      label: 'Total Seek Time',
      value: result ? `${result.totalSeekTime}` : '-',
      unit: 'cylinders',
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Average Seek Time',
      value: result ? result.averageSeekTime.toFixed(2) : '-',
      unit: 'cylinders/req',
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Throughput',
      value: result && result.totalSeekTime > 0 
        ? ((requestCount / result.totalSeekTime) * 100).toFixed(2) 
        : '-',
      unit: 'req/100 cyl',
      icon: Gauge,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Seek Operations',
      value: result ? result.seekOperations.length.toString() : '-',
      unit: 'operations',
      icon: TrendingDown,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 animate-fade-in">
      <h3 className="text-lg font-mono font-semibold text-foreground mb-4">
        Performance Metrics
        <span className="ml-2 text-sm font-normal text-muted-foreground">({algorithm})</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${metric.bgColor} border border-border/50 transition-all hover:scale-[1.02]`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className="text-xs text-muted-foreground">{metric.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-mono font-bold ${metric.color}`}>
                {metric.value}
              </span>
              <span className="text-xs text-muted-foreground">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Seek Operations Log */}
      {result && result.seekOperations.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-mono text-muted-foreground mb-3">Seek Operations Log</h4>
          <div className="max-h-40 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
            {result.seekOperations.map((op, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs font-mono p-2 bg-secondary/50 rounded border border-border/30"
              >
                <span className="text-muted-foreground">Step {index + 1}:</span>
                <span className="text-foreground">
                  {op.from} → {op.to}
                </span>
                <span className="text-primary">+{op.seek}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
