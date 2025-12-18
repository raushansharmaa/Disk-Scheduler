import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Plus, X, Shuffle, Settings2, CircleDot, Disc } from 'lucide-react';
import { Algorithm } from '@/lib/diskSchedulingAlgorithms';

interface ControlPanelProps {
  requests: number[];
  setRequests: (requests: number[]) => void;
  initialHead: number;
  setInitialHead: (head: number) => void;
  maxCylinder: number;
  setMaxCylinder: (max: number) => void;
  algorithm: Algorithm;
  setAlgorithm: (algo: Algorithm) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export function ControlPanel({
  requests,
  setRequests,
  initialHead,
  setInitialHead,
  maxCylinder,
  setMaxCylinder,
  algorithm,
  setAlgorithm,
  onRun,
  onReset,
  isRunning,
}: ControlPanelProps) {
  const [newRequest, setNewRequest] = useState('');

  const addRequest = () => {
    const value = parseInt(newRequest);
    if (!isNaN(value) && value >= 0 && value <= maxCylinder && !requests.includes(value)) {
      setRequests([...requests, value]);
      setNewRequest('');
    }
  };

  const removeRequest = (index: number) => {
    setRequests(requests.filter((_, i) => i !== index));
  };

  const generateRandom = () => {
    const count = Math.floor(Math.random() * 6) + 5;
    const randomRequests: number[] = [];
    while (randomRequests.length < count) {
      const value = Math.floor(Math.random() * (maxCylinder + 1));
      if (!randomRequests.includes(value) && value !== initialHead) {
        randomRequests.push(value);
      }
    }
    setRequests(randomRequests);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 hover-lift card-shine">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <Settings2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Control Panel</h2>
          <p className="text-xs text-muted-foreground">Configure simulation parameters</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Algorithm Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Algorithm
          </Label>
          <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
            <SelectTrigger className="bg-secondary/50 border-border/50 h-11 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="FCFS">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  FCFS (First Come First Serve)
                </span>
              </SelectItem>
              <SelectItem value="SSTF">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  SSTF (Shortest Seek Time First)
                </span>
              </SelectItem>
              <SelectItem value="SCAN">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  SCAN (Elevator)
                </span>
              </SelectItem>
              <SelectItem value="C-SCAN">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  C-SCAN (Circular SCAN)
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Disk Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <CircleDot className="w-3 h-3" />
              Initial Head
            </Label>
            <Input
              type="number"
              value={initialHead}
              onChange={(e) => setInitialHead(Math.max(0, Math.min(maxCylinder, parseInt(e.target.value) || 0)))}
              className="bg-secondary/50 border-border/50 font-mono h-11"
              min={0}
              max={maxCylinder}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Disc className="w-3 h-3" />
              Max Cylinder
            </Label>
            <Input
              type="number"
              value={maxCylinder}
              onChange={(e) => setMaxCylinder(Math.max(100, parseInt(e.target.value) || 199))}
              className="bg-secondary/50 border-border/50 font-mono h-11"
              min={100}
            />
          </div>
        </div>

        {/* Request Input */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Add Request <span className="text-muted-foreground/60">(0-{maxCylinder})</span>
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={newRequest}
              onChange={(e) => setNewRequest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRequest()}
              placeholder="Enter cylinder number"
              className="bg-secondary/50 border-border/50 font-mono flex-1 h-11"
              min={0}
              max={maxCylinder}
            />
            <Button 
              onClick={addRequest} 
              variant="outline" 
              size="icon" 
              className="h-11 w-11 shrink-0 border-border/50 hover:bg-primary/10 hover:border-primary/50 hover:text-primary"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button 
              onClick={generateRandom} 
              variant="outline" 
              size="icon" 
              className="h-11 w-11 shrink-0 border-border/50 hover:bg-accent/10 hover:border-accent/50 hover:text-accent"
              title="Generate Random"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Request Queue */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Request Queue
            </Label>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {requests.length} items
            </span>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[80px] p-4 bg-secondary/30 rounded-xl border border-border/30">
            {requests.length === 0 ? (
              <span className="text-muted-foreground text-sm">No requests added yet</span>
            ) : (
              requests.map((req, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="font-mono text-sm bg-background/50 border-primary/30 text-foreground hover:bg-destructive/20 hover:border-destructive/50 hover:text-destructive cursor-pointer transition-all duration-200 group px-3 py-1.5"
                  onClick={() => removeRequest(index)}
                >
                  {req}
                  <X className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Badge>
              ))
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onRun}
            disabled={requests.length === 0 || isRunning}
            variant="glow"
            className="flex-1 h-12 text-base font-semibold"
          >
            <Play className="w-5 h-5" />
            {isRunning ? 'Running...' : 'Run Simulation'}
          </Button>
          <Button 
            onClick={onReset} 
            variant="outline"
            className="h-12 px-5 border-border/50 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
