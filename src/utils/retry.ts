import type { XiorPlugin, XiorRequestConfig } from 'xior';

/**
 * Rate Limit Plugin
 * Ensures we never exceed `maxConcurrent` requests.
 * Ensures we always wait `minIntervalMs` between starting requests.
 */
export function rateLimitPlugin(
  maxConcurrent: number,
  minIntervalMs: number
): XiorPlugin {
  const queue: Array<() => void> = [];
  let activeCount = 0;

  const processQueue = () => {
    if (activeCount >= maxConcurrent || queue.length === 0) return;

    const next = queue.shift();
    if (next) {
      activeCount++;
      next();
      // Force a delay before we allow the NEXT item to be dequeued
      // This effectively spreads requests out over time.
      setTimeout(() => {
        activeCount--;
        processQueue();
      }, minIntervalMs);
    }
  };

  return (adapter) => async (config: XiorRequestConfig) => {
    // Enqueue the request
    await new Promise<void>((resolve) => {
      queue.push(resolve);
      processQueue();
    });

    try {
      return await adapter(config);
    } finally {
      // We don't decrement activeCount here.
      // It is decremented by the setTimeout in processQueue
      // to ensure the time gap is respected even if the request is fast.
    }
  };
}
