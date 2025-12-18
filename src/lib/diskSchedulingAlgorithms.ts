export interface SchedulingResult {
  sequence: number[];
  seekOperations: { from: number; to: number; seek: number }[];
  totalSeekTime: number;
  averageSeekTime: number;
}

export type Algorithm = 'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN';

// First Come First Serve
export function fcfs(requests: number[], initialHead: number): SchedulingResult {
  const sequence = [...requests];
  const seekOperations: { from: number; to: number; seek: number }[] = [];
  let currentHead = initialHead;
  let totalSeekTime = 0;

  for (const request of sequence) {
    const seek = Math.abs(request - currentHead);
    seekOperations.push({ from: currentHead, to: request, seek });
    totalSeekTime += seek;
    currentHead = request;
  }

  return {
    sequence,
    seekOperations,
    totalSeekTime,
    averageSeekTime: sequence.length > 0 ? totalSeekTime / sequence.length : 0,
  };
}

// Shortest Seek Time First
export function sstf(requests: number[], initialHead: number): SchedulingResult {
  const remaining = [...requests];
  const sequence: number[] = [];
  const seekOperations: { from: number; to: number; seek: number }[] = [];
  let currentHead = initialHead;
  let totalSeekTime = 0;

  while (remaining.length > 0) {
    let minSeek = Infinity;
    let minIndex = 0;

    for (let i = 0; i < remaining.length; i++) {
      const seek = Math.abs(remaining[i] - currentHead);
      if (seek < minSeek) {
        minSeek = seek;
        minIndex = i;
      }
    }

    const nextRequest = remaining.splice(minIndex, 1)[0];
    sequence.push(nextRequest);
    seekOperations.push({ from: currentHead, to: nextRequest, seek: minSeek });
    totalSeekTime += minSeek;
    currentHead = nextRequest;
  }

  return {
    sequence,
    seekOperations,
    totalSeekTime,
    averageSeekTime: sequence.length > 0 ? totalSeekTime / sequence.length : 0,
  };
}

// SCAN (Elevator Algorithm)
export function scan(requests: number[], initialHead: number, maxCylinder: number, direction: 'left' | 'right' = 'right'): SchedulingResult {
  const sequence: number[] = [];
  const seekOperations: { from: number; to: number; seek: number }[] = [];
  let currentHead = initialHead;
  let totalSeekTime = 0;

  const left = requests.filter(r => r < initialHead).sort((a, b) => b - a);
  const right = requests.filter(r => r >= initialHead).sort((a, b) => a - b);

  if (direction === 'right') {
    // Move right first
    for (const request of right) {
      const seek = Math.abs(request - currentHead);
      seekOperations.push({ from: currentHead, to: request, seek });
      totalSeekTime += seek;
      sequence.push(request);
      currentHead = request;
    }
    
    // Go to end if there are requests on the left
    if (left.length > 0) {
      const seek = Math.abs(maxCylinder - currentHead);
      seekOperations.push({ from: currentHead, to: maxCylinder, seek });
      totalSeekTime += seek;
      currentHead = maxCylinder;

      // Move left
      for (const request of left) {
        const seek = Math.abs(request - currentHead);
        seekOperations.push({ from: currentHead, to: request, seek });
        totalSeekTime += seek;
        sequence.push(request);
        currentHead = request;
      }
    }
  } else {
    // Move left first
    for (const request of left) {
      const seek = Math.abs(request - currentHead);
      seekOperations.push({ from: currentHead, to: request, seek });
      totalSeekTime += seek;
      sequence.push(request);
      currentHead = request;
    }
    
    // Go to start if there are requests on the right
    if (right.length > 0) {
      const seek = Math.abs(currentHead - 0);
      seekOperations.push({ from: currentHead, to: 0, seek });
      totalSeekTime += seek;
      currentHead = 0;

      // Move right
      for (const request of right) {
        const seek = Math.abs(request - currentHead);
        seekOperations.push({ from: currentHead, to: request, seek });
        totalSeekTime += seek;
        sequence.push(request);
        currentHead = request;
      }
    }
  }

  return {
    sequence,
    seekOperations,
    totalSeekTime,
    averageSeekTime: sequence.length > 0 ? totalSeekTime / sequence.length : 0,
  };
}

// C-SCAN (Circular SCAN)
export function cscan(requests: number[], initialHead: number, maxCylinder: number): SchedulingResult {
  const sequence: number[] = [];
  const seekOperations: { from: number; to: number; seek: number }[] = [];
  let currentHead = initialHead;
  let totalSeekTime = 0;

  const left = requests.filter(r => r < initialHead).sort((a, b) => a - b);
  const right = requests.filter(r => r >= initialHead).sort((a, b) => a - b);

  // Move right first
  for (const request of right) {
    const seek = Math.abs(request - currentHead);
    seekOperations.push({ from: currentHead, to: request, seek });
    totalSeekTime += seek;
    sequence.push(request);
    currentHead = request;
  }

  if (left.length > 0) {
    // Go to end
    const seekToEnd = Math.abs(maxCylinder - currentHead);
    seekOperations.push({ from: currentHead, to: maxCylinder, seek: seekToEnd });
    totalSeekTime += seekToEnd;
    currentHead = maxCylinder;

    // Jump to start (this is the circular part - no seek time for this)
    const seekToStart = maxCylinder; // Full cylinder travel
    seekOperations.push({ from: currentHead, to: 0, seek: seekToStart });
    totalSeekTime += seekToStart;
    currentHead = 0;

    // Service left requests
    for (const request of left) {
      const seek = Math.abs(request - currentHead);
      seekOperations.push({ from: currentHead, to: request, seek });
      totalSeekTime += seek;
      sequence.push(request);
      currentHead = request;
    }
  }

  return {
    sequence,
    seekOperations,
    totalSeekTime,
    averageSeekTime: sequence.length > 0 ? totalSeekTime / sequence.length : 0,
  };
}

export function runAlgorithm(
  algorithm: Algorithm,
  requests: number[],
  initialHead: number,
  maxCylinder: number
): SchedulingResult {
  switch (algorithm) {
    case 'FCFS':
      return fcfs(requests, initialHead);
    case 'SSTF':
      return sstf(requests, initialHead);
    case 'SCAN':
      return scan(requests, initialHead, maxCylinder);
    case 'C-SCAN':
      return cscan(requests, initialHead, maxCylinder);
    default:
      return fcfs(requests, initialHead);
  }
}

export function getAllResults(
  requests: number[],
  initialHead: number,
  maxCylinder: number
): Record<Algorithm, SchedulingResult> {
  return {
    'FCFS': fcfs(requests, initialHead),
    'SSTF': sstf(requests, initialHead),
    'SCAN': scan(requests, initialHead, maxCylinder),
    'C-SCAN': cscan(requests, initialHead, maxCylinder),
  };
}
