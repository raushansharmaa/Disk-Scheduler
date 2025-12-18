import { useState, useEffect, useCallback } from 'react';
import { ControlPanel } from '@/components/ControlPanel';
import { DiskVisualization } from '@/components/DiskVisualization';
import { MetricsPanel } from '@/components/MetricsPanel';
import { ComparisonChart } from '@/components/ComparisonChart';
import { AlgorithmInfo } from '@/components/AlgorithmInfo';
import { SequenceDisplay } from '@/components/SequenceDisplay';
import { runAlgorithm, Algorithm, SchedulingResult } from '@/lib/diskSchedulingAlgorithms';
import { HardDrive, Activity, Layers, Zap } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [requests, setRequests] = useState<number[]>([98, 183, 37, 122, 14, 124, 65, 67]);
  const [initialHead, setInitialHead] = useState(53);
  const [maxCylinder, setMaxCylinder] = useState(199);
  const [algorithm, setAlgorithm] = useState<Algorithm>('FCFS');
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRun = useCallback(() => {
    if (requests.length === 0) {
      toast.error('Please add at least one disk request');
      return;
    }

    setIsRunning(true);
    setCurrentStep(0);
    setIsAnimating(true);

    const newResult = runAlgorithm(algorithm, requests, initialHead, maxCylinder);
    setResult(newResult);

    toast.success(`Running ${algorithm} algorithm`, {
      description: `Processing ${requests.length} requests`,
    });

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);

      if (step >= newResult.seekOperations.length) {
        clearInterval(interval);
        setIsRunning(false);
        setIsAnimating(false);
        toast.success('Simulation complete!', {
          description: `Total seek time: ${newResult.totalSeekTime} cylinders`,
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [requests, initialHead, maxCylinder, algorithm]);

  const handleReset = useCallback(() => {
    setResult(null);
    setCurrentStep(0);
    setIsRunning(false);
    setIsAnimating(false);
    toast.info('Simulation reset');
  }, []);

  useEffect(() => {
    if (result && !isRunning) {
      const newResult = runAlgorithm(algorithm, requests, initialHead, maxCylinder);
      setResult(newResult);
      setCurrentStep(newResult.seekOperations.length);
    }
  }, [algorithm]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />
      <div className="fixed inset-0 dot-pattern opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-50 border-b border-border/50">
        <div className="glass-panel-strong">
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative p-3 rounded-xl bg-primary/10 glow-primary">
                  <HardDrive className="w-7 h-7 text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">
                    Disk Scheduling Simulator
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Interactive visualization of disk scheduling algorithms
                  </p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50">
                  <Layers className="w-4 h-4 text-info" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Max Cylinder</span>
                    <span className="ml-2 font-mono font-semibold text-foreground">{maxCylinder}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50">
                  <Activity className="w-4 h-4 text-accent" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Requests</span>
                    <span className="ml-2 font-mono font-semibold text-foreground">{requests.length}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/30">
                  <Zap className="w-4 h-4 text-primary" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Algorithm</span>
                    <span className="ml-2 font-mono font-semibold text-primary">{algorithm}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Panel - Controls */}
          <div className="xl:col-span-4 space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
              <ControlPanel
                requests={requests}
                setRequests={setRequests}
                initialHead={initialHead}
                setInitialHead={setInitialHead}
                maxCylinder={maxCylinder}
                setMaxCylinder={setMaxCylinder}
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                onRun={handleRun}
                onReset={handleReset}
                isRunning={isRunning}
              />
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <AlgorithmInfo algorithm={algorithm} />
            </div>
          </div>

          {/* Right Panel - Visualization & Metrics */}
          <div className="xl:col-span-8 space-y-6">
            <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
              <DiskVisualization
                result={result}
                requests={requests}
                initialHead={initialHead}
                maxCylinder={maxCylinder}
                currentStep={currentStep}
                isAnimating={isAnimating}
              />
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <SequenceDisplay
                result={result}
                initialHead={initialHead}
                currentStep={currentStep}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="animate-slide-up" style={{ animationDelay: '250ms' }}>
                <MetricsPanel
                  result={result}
                  algorithm={algorithm}
                  requestCount={requests.length}
                />
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <ComparisonChart
                  requests={requests}
                  initialHead={initialHead}
                  maxCylinder={maxCylinder}
                  currentAlgorithm={algorithm}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/30 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Operating Systems • Disk Scheduling Visualization
            </p>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 text-xs font-mono rounded-full bg-primary/10 text-primary border border-primary/30">FCFS</span>
              <span className="px-3 py-1 text-xs font-mono rounded-full bg-accent/10 text-accent border border-accent/30">SSTF</span>
              <span className="px-3 py-1 text-xs font-mono rounded-full bg-success/10 text-success border border-success/30">SCAN</span>
              <span className="px-3 py-1 text-xs font-mono rounded-full bg-warning/10 text-warning border border-warning/30">C-SCAN</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
