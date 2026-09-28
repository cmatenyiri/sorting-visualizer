import type { AlgorithmMeta } from './types';

export const bubbleSort: AlgorithmMeta = {
  id: 'bubble',
  name: 'Bubble Sort',
  technique: 'Exchange',
  tagline: 'Neighbours swap until the biggest values float to the top.',
  summary:
    'Bubble Sort walks through the array comparing each pair of neighbours and swapping them when they are out of order. After every pass the largest remaining value has “bubbled” to the end, so the unsorted region shrinks by one. It is the simplest sorting algorithm to understand — and one of the slowest.',
  steps: [
    'Start at the left edge and compare the first two neighbours.',
    'If the left one is bigger, swap them. Move one position to the right and repeat.',
    'When the pass reaches the end, the largest value is locked into its final place.',
    'Repeat on the shrinking unsorted region. If a whole pass makes no swaps, stop early — the array is already sorted.',
  ],
  goodFor:
    'Teaching, tiny arrays and data that is already almost sorted (thanks to the early exit). Hopeless for large inputs.',
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  growth: 'n2',
  stable: true,
  inPlace: true,
  pseudocode: [
    'procedure bubbleSort(A)',
    '  for end ← n − 1 down to 1',
    '    swapped ← false',
    '    for i ← 0 to end − 1',
    '      if A[i] > A[i + 1]',
    '        swap A[i] and A[i + 1]',
    '        swapped ← true',
    '    A[end] is now in its final place',
    '    if not swapped: stop early',
  ],
  run(t) {
    const a = t.a;
    const n = t.length;
    for (let end = n - 1; end >= 1; end--) {
      t.range = [0, end];
      let swapped = false;
      for (let i = 0; i < end; i++) {
        const x = a[i];
        const y = a[i + 1];
        if (t.compare(i, i + 1, 4, `Is ${x} > ${y}?`) > 0) {
          t.swap(i, i + 1, 5, `${x} > ${y} — swap the neighbours`);
          swapped = true;
        }
      }
      t.markSorted(end, 7, `${a[end]} has bubbled up to its final place`);
      if (!swapped) {
        t.range = undefined;
        t.info(8, 'No swaps during this pass — everything left is already in order');
        break;
      }
    }
    t.finish(8);
  },
};
