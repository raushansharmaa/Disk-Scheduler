import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Plus, X, Shuffle, HardDrive } from 'lucide-react';
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
    const count = Math.floor(Math.random() * 6) + 5; // 5-10 requests
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
    <div className="space-y-6 p-6 bg-card rounded-lg border border-border animate-fade-in">
      <div className="flex items-center gap-3">
        <HardDrive className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-mono font-semibold text-foreground">Control Panel</h2>
      </div>

      {/* Algorithm Selection */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Algorithm</Label>
        <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FCFS">FCFS (First Come First Serve)</SelectItem>
            <SelectItem value="SSTF">SSTF (Shortest Seek Time First)</SelectItem>
            <SelectItem value="SCAN">SCAN (Elevator)</SelectItem>
            <SelectItem value="C-SCAN">C-SCAN (Circular SCAN)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Disk Configuration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Initial Head Position</Label>
          <Input
            type="number"
            value={initialHead}
            onChange={(e) => setInitialHead(Math.max(0, Math.min(maxCylinder, parseInt(e.target.value) || 0)))}
            className="bg-secondary border-border font-mono"
            min={0}
            max={maxCylinder}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Max Cylinder</Label>
          <Input
            type="number"
            value={maxCylinder}
            onChange={(e) => setMaxCylinder(Math.max(100, parseInt(e.target.value) || 199))}
            className="bg-secondary border-border font-mono"
            min={100}
          />
        </div>
      </div>

      {/* Request Input */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Add Request (0-{maxCylinder})</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={newRequest}
            onChange={(e) => setNewRequest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addRequest()}
            placeholder="Enter cylinder number"
            className="bg-secondary border-border font-mono flex-1"
            min={0}
            max={maxCylinder}
          />
          <Button onClick={addRequest} variant="outline" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
          <Button onClick={generateRandom} variant="outline" size="icon" title="Generate Random">
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Request Queue */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Request Queue ({requests.length})</Label>
        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-secondary/50 rounded-md border border-border">
          {requests.length === 0 ? (
            <span className="text-muted-foreground text-sm">No requests added</span>
          ) : (
            requests.map((req, index) => (
              <Badge
                key={index}
                variant="outline"
                className="font-mono bg-background border-primary/30 text-foreground hover:bg-destructive/20 hover:border-destructive cursor-pointer transition-all group"
                onClick={() => removeRequest(index)}
              >
                {req}
                <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={onRun}
          disabled={requests.length === 0 || isRunning}
          variant="glow"
          className="flex-1"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running...' : 'Run Simulation'}
        </Button>
        <Button onClick={onReset} variant="outline">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
