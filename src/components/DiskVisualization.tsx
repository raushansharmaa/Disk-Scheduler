import { useEffect, useState, useMemo } from 'react';
import { SchedulingResult } from '@/lib/diskSchedulingAlgorithms';
import { Monitor } from 'lucide-react';

interface DiskVisualizationProps {
  result: SchedulingResult | null;
  requests: number[];
  initialHead: number;
  maxCylinder: number;
  currentStep: number;
  isAnimating: boolean;
}

export function DiskVisualization({
  result,
  requests,
  initialHead,
  maxCylinder,
  currentStep,
  isAnimating,
}: DiskVisualizationProps) {
  const [animatedHead, setAnimatedHead] = useState(initialHead);

  const width = 850;
  const height = 420;
  const padding = { top: 50, right: 50, bottom: 70, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xScale = (cylinder: number) => padding.left + (cylinder / maxCylinder) * chartWidth;
  const yScale = (step: number) => padding.top + (step / Math.max(requests.length, 1)) * chartHeight;

  const pathData = useMemo(() => {
    if (!result || result.seekOperations.length === 0) return '';
    
    let path = `M ${xScale(initialHead)} ${yScale(0)}`;
    result.seekOperations.forEach((op, index) => {
      path += ` L ${xScale(op.to)} ${yScale(index + 1)}`;
    });
    return path;
  }, [result, initialHead, maxCylinder, requests.length]);

  const animatedPath = useMemo(() => {
    if (!result || currentStep <= 0) return '';
    
    let path = `M ${xScale(initialHead)} ${yScale(0)}`;
    for (let i = 0; i < currentStep && i < result.seekOperations.length; i++) {
      path += ` L ${xScale(result.seekOperations[i].to)} ${yScale(i + 1)}`;
    }
    return path;
  }, [result, currentStep, initialHead, maxCylinder]);

  useEffect(() => {
    if (result && currentStep > 0 && currentStep <= result.seekOperations.length) {
      setAnimatedHead(result.seekOperations[currentStep - 1].to);
    } else {
      setAnimatedHead(initialHead);
    }
  }, [currentStep, result, initialHead]);

  const xTicks = useMemo(() => {
    const ticks = [];
    const step = Math.ceil(maxCylinder / 10);
    for (let i = 0; i <= maxCylinder; i += step) {
      ticks.push(i);
    }
    if (ticks[ticks.length - 1] !== maxCylinder) {
      ticks.push(maxCylinder);
    }
    return ticks;
  }, [maxCylinder]);

  return (
    <div className="glass-panel rounded-2xl p-6 hover-lift card-shine">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Monitor className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Disk Head Movement</h3>
            <p className="text-xs text-muted-foreground">Real-time visualization of seek operations</p>
          </div>
        </div>
        
        {isAnimating && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">Processing</span>
          </div>
        )}
      </div>
      
      <div className="bg-secondary/30 rounded-xl p-4 border border-border/30">
        <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(222 30% 15% / 0.5)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(173 80% 40%)" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(262 83% 58%)" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="url(#grid)" rx="8" />
          
          {/* Axes */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
          
          {/* X-axis labels */}
          {xTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={xScale(tick)}
                y1={height - padding.bottom}
                x2={xScale(tick)}
                y2={height - padding.bottom + 8}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
              />
              <text
                x={xScale(tick)}
                y={height - padding.bottom + 24}
                textAnchor="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="11"
                fontFamily="JetBrains Mono"
              >
                {tick}
              </text>
            </g>
          ))}
          
          {/* Axis titles */}
          <text
            x={width / 2}
            y={height - 15}
            textAnchor="middle"
            fill="hsl(var(--foreground))"
            fontSize="13"
            fontFamily="Space Grotesk"
            fontWeight="500"
          >
            Cylinder Number
          </text>
          <text
            x={20}
            y={height / 2}
            textAnchor="middle"
            fill="hsl(var(--foreground))"
            fontSize="13"
            fontFamily="Space Grotesk"
            fontWeight="500"
            transform={`rotate(-90, 20, ${height / 2})`}
          >
            Time Steps
          </text>

          {/* Ghost path */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.25"
            />
          )}

          {/* Animated path */}
          {animatedPath && (
            <path
              d={animatedPath}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              className="transition-all duration-300"
            />
          )}

          {/* Request points */}
          {requests.map((req, index) => {
            const visited = result?.sequence.slice(0, currentStep).includes(req);
            const yPos = result?.sequence.indexOf(req) ?? index + 1;
            return (
              <g key={`req-${index}`}>
                <circle
                  cx={xScale(req)}
                  cy={yScale(yPos) + 1}
                  r="10"
                  fill={visited ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'}
                  stroke={visited ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                  strokeWidth="2"
                  className="transition-all duration-300"
                  filter={visited ? 'url(#softGlow)' : undefined}
                />
                <text
                  x={xScale(req)}
                  y={yScale(yPos) - 16}
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="11"
                  fontFamily="JetBrains Mono"
                  fontWeight="500"
                >
                  {req}
                </text>
              </g>
            );
          })}

          {/* Initial head position */}
          <g>
            <circle
              cx={xScale(initialHead)}
              cy={yScale(0)}
              r="12"
              fill="hsl(var(--success))"
              stroke="hsl(var(--success-foreground))"
              strokeWidth="2"
              filter="url(#glow)"
            />
            <text
              x={xScale(initialHead)}
              y={yScale(0) - 20}
              textAnchor="middle"
              fill="hsl(var(--success))"
              fontSize="11"
              fontWeight="600"
              fontFamily="JetBrains Mono"
            >
              HEAD: {initialHead}
            </text>
          </g>

          {/* Current head position indicator */}
          {isAnimating && currentStep > 0 && (
            <g>
              <circle
                cx={xScale(animatedHead)}
                cy={yScale(currentStep)}
                r="16"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                className="animate-pulse-glow"
              />
              <circle
                cx={xScale(animatedHead)}
                cy={yScale(currentStep)}
                r="6"
                fill="hsl(var(--primary))"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
