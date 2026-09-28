/** Slider position (0–100) mapped exponentially to steps per second. */
export const MIN_SPS = 1;
export const MAX_SPS = 2400;

export const speedToSps = (speed: number) =>
  MIN_SPS * Math.pow(MAX_SPS / MIN_SPS, Math.min(100, Math.max(0, speed)) / 100);

export function speedLabel(speed: number): string {
  if (speed < 25) return 'Slow-mo';
  if (speed < 50) return 'Relaxed';
  if (speed < 72) return 'Brisk';
  if (speed < 90) return 'Fast';
  return 'Ludicrous';
}

export function formatSps(sps: number): string {
  if (sps < 10) return `${sps.toFixed(1)} ops/s`;
  return `${Math.round(sps).toLocaleString()} ops/s`;
}
