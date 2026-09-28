import { bubbleSort } from './bubble';
import { heapSort } from './heap';
import { insertionSort } from './insertion';
import { mergeSort } from './merge';
import { quickSort } from './quick';
import { radixSort } from './radix';
import { tidalSort } from './tidal';
import type { AlgorithmId, AlgorithmMeta } from './types';

export const ALGORITHMS: readonly AlgorithmMeta[] = [
  bubbleSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  radixSort,
  tidalSort,
];

export const ALGORITHM_IDS = ALGORITHMS.map((a) => a.id);

const BY_ID = new Map(ALGORITHMS.map((a) => [a.id, a]));

export function getAlgorithm(id: AlgorithmId): AlgorithmMeta {
  const algo = BY_ID.get(id);
  if (!algo) throw new Error(`Unknown algorithm: ${id}`);
  return algo;
}

export function isAlgorithmId(value: unknown): value is AlgorithmId {
  return typeof value === 'string' && BY_ID.has(value as AlgorithmId);
}

export type { AlgorithmId, AlgorithmMeta, Step, StepKind } from './types';
