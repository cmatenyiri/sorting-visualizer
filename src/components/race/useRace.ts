import { useCallback, useEffect, useState } from 'react';
import { isCostlyStep, TimelineCursor, type Frame, type Timeline } from '../../engine/timeline';

interface Lane {
  cursor: TimelineCursor;
  /** costAt[k] = number of costly operations among the first k steps. */
  costAt: Int32Array;
  totalCost: number;
}

function makeLane(timeline: Timeline): Lane {
  const steps = timeline.steps;
  const costAt = new Int32Array(steps.length + 1);
  for (let k = 0; k < steps.length; k++)
    costAt[k + 1] = costAt[k] + (isCostlyStep(steps[k]) ? 1 : 0);
  return { cursor: new TimelineCursor(timeline), costAt, totalCost: costAt[steps.length] };
}

/** Largest step index whose cost fits within `ticks` operations. */
function indexAt(lane: Lane, ticks: number): number {
  const { costAt } = lane;
  if (ticks >= lane.totalCost) return costAt.length - 1;
  let lo = 0;
  let hi = costAt.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (costAt[mid] <= ticks) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export interface RaceLaneState {
  frame: Frame;
  /** Operations performed so far. */
  ops: number;
  totalOps: number;
  finished: boolean;
}

/**
 * Advances several timelines in lock-step: every tick, each lane performs one
 * real operation (compare, swap, write or read). The owner should be keyed by
 * the set of timelines.
 */
export function useRace(timelines: readonly Timeline[], sps: number) {
  const [lanes] = useState(() => timelines.map(makeLane));
  const [ticks, setTicks] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [frames, setFrames] = useState<Frame[]>(() => lanes.map((l) => l.cursor.frame()));
  const finishTicks = Math.max(0, ...lanes.map((l) => l.totalCost));

  const moveTo = useCallback(
    (t: number) => {
      const next = Math.max(0, Math.min(finishTicks, t));
      setTicks(next);
      setFrames(lanes.map((lane) => lane.cursor.seek(indexAt(lane, next))));
      return next;
    },
    [lanes, finishTicks],
  );

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    let bank = 1;
    let t = ticks;
    const tick = (now: number) => {
      bank += (Math.min(100, now - last) / 1000) * sps;
      last = now;
      const count = Math.floor(bank);
      if (count > 0) {
        bank -= count;
        t = moveTo(t + count);
        if (t >= finishTicks) {
          setPlaying(false);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `ticks` is only read when playback (re)starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, sps, moveTo, finishTicks]);

  const play = useCallback(() => {
    if (ticks >= finishTicks) moveTo(0);
    setPlaying(true);
  }, [ticks, finishTicks, moveTo]);

  const pause = useCallback(() => setPlaying(false), []);

  const reset = useCallback(() => {
    setPlaying(false);
    moveTo(0);
  }, [moveTo]);

  const finish = useCallback(() => {
    setPlaying(false);
    moveTo(finishTicks);
  }, [moveTo, finishTicks]);

  const states: RaceLaneState[] = lanes.map((lane, i) => ({
    frame: frames[i],
    ops: Math.min(ticks, lane.totalCost),
    totalOps: lane.totalCost,
    finished: ticks >= lane.totalCost,
  }));

  return { lanes: states, ticks, finishTicks, playing, play, pause, reset, finish };
}
