import { useState, useEffect, useCallback } from 'react';
import { ControlPanel } from '@/components/ControlPanel';
import { DiskVisualization } from '@/components/DiskVisualization';
import { MetricsPanel } from '@/components/MetricsPanel';
import { ComparisonChart } from '@/components/ComparisonChart';
import { AlgorithmInfo } from '@/components/AlgorithmInfo';
import { SequenceDisplay } from '@/components/SequenceDisplay';
import { runAlgorithm, Algorithm, SchedulingResult } from '@/lib/diskSchedulingAlgorithms';
import { HardDrive, Cpu, Activity } from 'lucide-react';
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

    // Animate through steps
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
    }, 600);

    return () => clearInterval(interval);
  }, [requests, initialHead, maxCylinder, algorithm]);

  const handleReset = useCallback(() => {
    setResult(null);
    setCurrentStep(0);
    setIsRunning(false);
    setIsAnimating(false);
    toast.info('Simulation reset');
  }, []);

  // Run simulation when algorithm changes (if there's already a result)
  useEffect(() => {
    if (result && !isRunning) {
      const newResult = runAlgorithm(algorithm, requests, initialHead, maxCylinder);
      setResult(newResult);
      setCurrentStep(newResult.seekOperations.length);
    }
  }, [algorithm]);

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 glow-primary">
                <HardDrive className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-mono font-bold text-foreground text-glow-primary">
                  Disk Scheduling Simulator
                </h1>
                <p className="text-xs text-muted-foreground">
                  Visualize FCFS, SSTF, SCAN & C-SCAN algorithms
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Cpu className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground font-mono">
                  Max: <span className="text-foreground">{maxCylinder}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground font-mono">
                  Requests: <span className="text-foreground">{requests.length}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-4 space-y-6">
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
            
            <AlgorithmInfo algorithm={algorithm} />
          </div>

          {/* Right Panel - Visualization & Metrics */}
          <div className="lg:col-span-8 space-y-6">
            <DiskVisualization
              result={result}
              requests={requests}
              initialHead={initialHead}
              maxCylinder={maxCylinder}
              currentStep={currentStep}
              isAnimating={isAnimating}
            />
            
            <SequenceDisplay
              result={result}
              initialHead={initialHead}
              currentStep={currentStep}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricsPanel
                result={result}
                algorithm={algorithm}
                requestCount={requests.length}
              />
              
              <ComparisonChart
                requests={requests}
                initialHead={initialHead}
                maxCylinder={maxCylinder}
                currentAlgorithm={algorithm}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-xs text-muted-foreground font-mono">
            Operating Systems Disk Scheduling Visualization • FCFS • SSTF • SCAN • C-SCAN
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
