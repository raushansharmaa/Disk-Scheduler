import { useEffect, useState, useMemo } from 'react';
import { SchedulingResult } from '@/lib/diskSchedulingAlgorithms';

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

  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate positions
  const xScale = (cylinder: number) => padding.left + (cylinder / maxCylinder) * chartWidth;
  const yScale = (step: number) => padding.top + (step / Math.max(requests.length, 1)) * chartHeight;

  // Build path data
  const pathData = useMemo(() => {
    if (!result || result.seekOperations.length === 0) return '';
    
    let path = `M ${xScale(initialHead)} ${yScale(0)}`;
    result.seekOperations.forEach((op, index) => {
      path += ` L ${xScale(op.to)} ${yScale(index + 1)}`;
    });
    return path;
  }, [result, initialHead, maxCylinder, requests.length]);

  // Animated path
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

  // Generate tick marks
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
    <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
      <h3 className="text-lg font-mono font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
        Disk Head Movement
      </h3>
      
      <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
        {/* Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(220 15% 15% / 0.5)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(180 100% 50%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(280 80% 60%)" stopOpacity="1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="url(#grid)" />
        
        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
        
        {/* Y-axis */}
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
              y2={height - padding.bottom + 5}
              stroke="hsl(var(--muted-foreground))"
            />
            <text
              x={xScale(tick)}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="12"
              fontFamily="JetBrains Mono"
            >
              {tick}
            </text>
          </g>
        ))}
        
        {/* X-axis title */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize="14"
          fontFamily="JetBrains Mono"
        >
          Cylinder Number
        </text>
        
        {/* Y-axis title */}
        <text
          x={15}
          y={height / 2}
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize="14"
          fontFamily="JetBrains Mono"
          transform={`rotate(-90, 15, ${height / 2})`}
        >
          Time Steps
        </text>

        {/* Ghost path (full path) */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
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
          return (
            <g key={`req-${index}`}>
              <circle
                cx={xScale(req)}
                cy={yScale(result?.sequence.indexOf(req) ?? index + 1) + 1}
                r="8"
                fill={visited ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'}
                stroke={visited ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                strokeWidth="2"
                className="transition-all duration-300"
                filter={visited ? 'url(#glow)' : undefined}
              />
              <text
                x={xScale(req)}
                y={yScale(result?.sequence.indexOf(req) ?? index + 1) - 12}
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="10"
                fontFamily="JetBrains Mono"
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
            r="10"
            fill="hsl(var(--success))"
            stroke="hsl(var(--success))"
            strokeWidth="2"
            filter="url(#glow)"
          />
          <text
            x={xScale(initialHead)}
            y={yScale(0) - 15}
            textAnchor="middle"
            fill="hsl(var(--success))"
            fontSize="11"
            fontWeight="bold"
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
              r="12"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              className="animate-pulse-glow"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
