import type { Step } from './types';

type StepInput = Omit<
  Step,
  'comparisons' | 'swaps' | 'writes' | 'range' | 'pivot' | 'digit' | 'heapSize'
>;

/**
 * Records every operation an algorithm performs on its working copy of the
 * array. Algorithms are written as ordinary imperative code against the tracer,
 * which keeps them readable while producing a replayable timeline of steps.
 */
export class Tracer {
  readonly a: number[];
  readonly steps: Step[] = [];

  /** Context attached to every step until changed. */
  range: readonly [number, number] | undefined;
  pivot: number | undefined;
  digit: number | undefined;
  heapSize: number | undefined;

  private comparisons = 0;
  private swaps = 0;
  private writes = 0;
  private readonly sortedFlags: Uint8Array;

  constructor(input: readonly number[]) {
    this.a = [...input];
    this.sortedFlags = new Uint8Array(input.length);
  }

  get length(): number {
    return this.a.length;
  }

  private push(step: StepInput): void {
    this.steps.push({
      ...step,
      range: this.range,
      pivot: this.pivot,
      digit: this.digit,
      heapSize: this.heapSize,
      comparisons: this.comparisons,
      swaps: this.swaps,
      writes: this.writes,
    });
  }

  /** Records a comparison of A[i] and A[j] and returns A[i] − A[j]. */
  compare(i: number, j: number, line: number, message?: string): number {
    this.comparisons++;
    const x = this.a[i];
    const y = this.a[j];
    this.push({
      kind: 'compare',
      a: i,
      b: j,
      line,
      message: message ?? `Compare ${x} and ${y}`,
    });
    return x - y;
  }

  /** Records a comparison of A[i] against a value held outside the array. */
  compareValue(i: number, value: number, line: number, message: string, other?: number): number {
    this.comparisons++;
    this.push({ kind: 'compare', a: i, b: other, line, message });
    return this.a[i] - value;
  }

  /** Records a comparison of two values that live in a buffer at positions i and j. */
  compareValues(i: number, j: number, x: number, y: number, line: number, message: string): number {
    this.comparisons++;
    this.push({ kind: 'compare', a: i, b: j, line, message });
    return x - y;
  }

  swap(i: number, j: number, line: number, message?: string): void {
    const x = this.a[i];
    const y = this.a[j];
    this.a[i] = y;
    this.a[j] = x;
    this.swaps++;
    this.writes += 2;
    this.push({ kind: 'swap', a: i, b: j, line, message: message ?? `Swap ${x} and ${y}` });
  }

  /** Overwrites A[i]. With `settle`, the position is also marked as final. */
  write(i: number, value: number, line: number, message?: string, settle = false): void {
    this.a[i] = value;
    this.writes++;
    const sorted = settle && !this.sortedFlags[i] ? [i] : undefined;
    if (sorted) this.sortedFlags[i] = 1;
    this.push({
      kind: 'write',
      a: i,
      value,
      sorted,
      line,
      message: message ?? `Write ${value} to #${i}`,
    });
  }

  /** Highlights A[i] without changing it; `value` is recorded for visual aids. */
  read(i: number, line: number, message: string): void {
    this.push({ kind: 'read', a: i, value: this.a[i], line, message });
  }

  info(line: number, message: string, a?: number, b?: number): void {
    this.push({ kind: 'info', a, b, line, message });
  }

  markSorted(indices: number | number[], line: number, message: string): void {
    const list = (Array.isArray(indices) ? indices : [indices]).filter((i) => !this.sortedFlags[i]);
    if (list.length === 0) return;
    for (const i of list) this.sortedFlags[i] = 1;
    this.push({
      kind: 'sorted',
      sorted: list,
      a: list.length === 1 ? list[0] : undefined,
      line,
      message,
    });
  }

  /** Marks every remaining index as sorted and closes the timeline. */
  finish(line: number, message = 'Array is sorted'): void {
    this.range = undefined;
    this.pivot = undefined;
    this.digit = undefined;
    this.heapSize = undefined;
    const rest: number[] = [];
    for (let i = 0; i < this.a.length; i++) if (!this.sortedFlags[i]) rest.push(i);
    for (const i of rest) this.sortedFlags[i] = 1;
    this.push({ kind: 'done', sorted: rest, line, message });
  }
}
