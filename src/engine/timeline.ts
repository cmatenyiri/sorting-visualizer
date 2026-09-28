import { getAlgorithm, type AlgorithmId, type Step } from '../algorithms';
import { Tracer } from '../algorithms/tracer';

const CHECKPOINT_INTERVAL = 256;

interface Checkpoint {
  values: number[];
  sorted: Uint8Array;
}

export interface Timeline {
  algorithm: AlgorithmId;
  input: readonly number[];
  steps: readonly Step[];
  maxValue: number;
  checkpoints: readonly Checkpoint[];
}

export interface Frame {
  /** Number of steps applied so far (0 … steps.length). */
  index: number;
  total: number;
  values: number[];
  sorted: Uint8Array;
  /** The most recently applied step, used for highlighting. */
  step: Step | undefined;
  done: boolean;
}

function apply(values: number[], sorted: Uint8Array, step: Step): void {
  if (step.kind === 'swap' && step.a !== undefined && step.b !== undefined) {
    const tmp = values[step.a];
    values[step.a] = values[step.b];
    values[step.b] = tmp;
  } else if (step.kind === 'write' && step.a !== undefined && step.value !== undefined) {
    values[step.a] = step.value;
  }
  if (step.sorted) for (const i of step.sorted) sorted[i] = 1;
}

export function buildTimeline(algorithm: AlgorithmId, input: readonly number[]): Timeline {
  const tracer = new Tracer(input);
  getAlgorithm(algorithm).run(tracer);
  const steps = tracer.steps;

  const values = [...input];
  const sorted = new Uint8Array(input.length);
  const checkpoints: Checkpoint[] = [{ values: [...values], sorted: sorted.slice() }];
  for (let i = 0; i < steps.length; i++) {
    apply(values, sorted, steps[i]);
    if ((i + 1) % CHECKPOINT_INTERVAL === 0) {
      checkpoints.push({ values: [...values], sorted: sorted.slice() });
    }
  }

  return {
    algorithm,
    input,
    steps,
    maxValue: Math.max(...input, 1),
    checkpoints,
  };
}

/**
 * Reconstructs the array at any step. Moving forward replays steps
 * incrementally; jumping backwards restores the nearest checkpoint first.
 */
export class TimelineCursor {
  readonly timeline: Timeline;
  private values: number[];
  private sorted: Uint8Array;
  private position = 0;

  constructor(timeline: Timeline) {
    this.timeline = timeline;
    this.values = [...timeline.input];
    this.sorted = new Uint8Array(timeline.input.length);
  }

  get index(): number {
    return this.position;
  }

  get total(): number {
    return this.timeline.steps.length;
  }

  seek(target: number): Frame {
    const { steps, checkpoints } = this.timeline;
    const index = Math.max(0, Math.min(steps.length, Math.round(target)));
    if (index < this.position || index - this.position > CHECKPOINT_INTERVAL) {
      const cp = Math.min(checkpoints.length - 1, Math.floor(index / CHECKPOINT_INTERVAL));
      this.values = [...checkpoints[cp].values];
      this.sorted = checkpoints[cp].sorted.slice();
      this.position = cp * CHECKPOINT_INTERVAL;
    }
    while (this.position < index) {
      apply(this.values, this.sorted, steps[this.position]);
      this.position++;
    }
    return this.frame();
  }

  frame(): Frame {
    const total = this.timeline.steps.length;
    return {
      index: this.position,
      total,
      values: [...this.values],
      sorted: this.sorted.slice(),
      step: this.position > 0 ? this.timeline.steps[this.position - 1] : undefined,
      done: this.position >= total,
    };
  }
}

/** Steps that represent real work; bookkeeping steps are free in race mode. */
export const isCostlyStep = (step: Step) =>
  step.kind === 'compare' || step.kind === 'swap' || step.kind === 'write' || step.kind === 'read';
