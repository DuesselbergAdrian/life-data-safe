import { useState, useEffect, useRef } from 'react';

export type Phase = 'sync' | 'analyzing' | 'overview';

export function usePhase(initialPhase: Phase = 'sync') {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const scheduleTransition = (toPhase: Phase, delayMs: number) => {
    const timer = setTimeout(() => {
      setPhase(toPhase);
    }, delayMs);
    timersRef.current.push(timer);
  };

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return { phase, setPhase, scheduleTransition };
}
