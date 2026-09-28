import type { Tracer } from './tracer';

export type AlgorithmId = 'bubble' | 'insertion' | 'merge' | 'quick' | 'heap' | 'radix' | 'tidal';

export type StepKind = 'compare' | 'swap' | 'write' | 'read' | 'sorted' | 'info' | 'done';

/**
 * A single recorded operation. Steps are applied in order to reconstruct the
 * array at any point in time, so only `swap`, `write` and `sorted` mutate state;
 * every other field is transient highlighting for the frame the step is shown in.
 */
export interface Step {
  kind: StepKind;
  /** Primary index (compare/swap left side, write/read target). */
  a?: number;
  /** Secondary index (compare/swap right side). */
  b?: number;
  /** New value for `write` steps; the inspected value for `read` steps. */
  value?: number;
  /** Indices that become permanently sorted with this step. */
  sorted?: number[];
  /** Active sub-array [lo, hi] (inclusive) the algorithm is working on. */
  range?: readonly [number, number];
  /** Index of the current pivot / key element. */
  pivot?: number;
  /** Radix sort: the place value (1, 10, 100…) currently being inspected. */
  digit?: number;
  /** Heap sort: number of elements that still form the heap. */
  heapSize?: number;
  /** Line in the algorithm's pseudocode this step corresponds to. */
  line: number;
  message: string;
  /** Running totals after this step. */
  comparisons: number;
  swaps: number;
  writes: number;
}

export interface Complexity {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export interface AlgorithmMeta {
  id: AlgorithmId;
  name: string;
  /** Short family name of the technique, e.g. "Divide & conquer". */
  technique: string;
  tagline: string;
  /** One-paragraph explanation of the core idea. */
  summary: string;
  /** Plain-language walkthrough, one entry per stage. */
  steps: string[];
  /** Where it shines and where it struggles. */
  goodFor: string;
  complexity: Complexity;
  /** Growth class used for the "expected operations" hint. */
  growth: 'n2' | 'nlogn' | 'nk';
  stable: boolean;
  inPlace: boolean;
  pseudocode: string[];
  /** Marked true for algorithms designed specifically for this app. */
  original?: boolean;
  run: (tracer: Tracer) => void;
}
