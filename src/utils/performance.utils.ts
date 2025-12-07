/**
 * Simple performance utilities
 */

export const formatProcessingTime = (ms: number): string => {
  if (ms < 1000) return `${ms.toFixed(0)}ms`; 
  return `${(ms / 1000).toFixed(1)}s`;
};

export const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  let timeoutId: number;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const createMemoryProfiler = () => {
  if (typeof window === 'undefined') return;
  
  console.log('🧪 Initializing memory profiler...');
};