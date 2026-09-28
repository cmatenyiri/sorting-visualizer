import { useCallback, useEffect, useRef, useState } from 'react';
import { TimelineCursor, type Frame, type Timeline } from '../engine/timeline';

export interface PlayerOptions {
  /** Playback rate in steps per second. */
  sps: number;
  autoPlay?: boolean;
  /** Restart from the beginning after finishing (used by tutorial illustrations). */
  loop?: boolean;
  loopDelay?: number;
  onAdvance?: (frame: Frame) => void;
  onFinish?: () => void;
}

export interface Player {
  frame: Frame;
  playing: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepBy: (delta: number) => void;
  seek: (index: number) => void;
  reset: () => void;
  skipToEnd: () => void;
}

/**
 * Drives a timeline with requestAnimationFrame. The owning component should be
 * keyed by the timeline so a new timeline starts from a fresh cursor.
 */
export function usePlayer(timeline: Timeline, options: PlayerOptions): Player {
  const { sps, autoPlay = false, loop = false, loopDelay = 1800, onAdvance, onFinish } = options;
  const [cursor] = useState(() => new TimelineCursor(timeline));
  const [frame, setFrame] = useState<Frame>(() => cursor.frame());
  const [playing, setPlaying] = useState(autoPlay);

  const callbacks = useRef({ onAdvance, onFinish });
  useEffect(() => {
    callbacks.current = { onAdvance, onFinish };
  });

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let last = performance.now();
    // Start with a full step banked so playback responds immediately, even at slow speeds.
    let bank = 1;

    const tick = (now: number) => {
      bank += (Math.min(100, now - last) / 1000) * sps;
      last = now;
      const count = Math.floor(bank);
      if (count > 0) {
        bank -= count;
        const next = cursor.seek(cursor.index + count);
        setFrame(next);
        callbacks.current.onAdvance?.(next);
        if (next.done) {
          callbacks.current.onFinish?.();
          if (!loop) {
            setPlaying(false);
            return;
          }
          timer = setTimeout(() => {
            setFrame(cursor.seek(0));
            last = performance.now();
            bank = 1;
            raf = requestAnimationFrame(tick);
          }, loopDelay);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [playing, sps, cursor, loop, loopDelay]);

  const pause = useCallback(() => setPlaying(false), []);

  const play = useCallback(() => {
    if (cursor.index >= cursor.total) setFrame(cursor.seek(0));
    setPlaying(true);
  }, [cursor]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, pause, play]);

  const stepBy = useCallback(
    (delta: number) => {
      setPlaying(false);
      const next = cursor.seek(cursor.index + delta);
      setFrame(next);
      if (delta > 0) callbacks.current.onAdvance?.(next);
    },
    [cursor],
  );

  const seek = useCallback((index: number) => setFrame(cursor.seek(index)), [cursor]);

  const reset = useCallback(() => {
    setPlaying(false);
    setFrame(cursor.seek(0));
  }, [cursor]);

  const skipToEnd = useCallback(() => {
    setPlaying(false);
    setFrame(cursor.seek(cursor.total));
  }, [cursor]);

  return { frame, playing, play, pause, toggle, stepBy, seek, reset, skipToEnd };
}
