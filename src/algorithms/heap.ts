import type { AlgorithmMeta } from './types';

export const heapSort: AlgorithmMeta = {
  id: 'heap',
  name: 'Heap Sort',
  technique: 'Selection · binary heap',
  tagline: 'Turn the array into a max-heap, then peel off the top.',
  summary:
    'Heap Sort views the array as a binary tree in which index i has children 2i + 1 and 2i + 2. It first rearranges the values into a max-heap — every parent at least as large as its children — so the maximum sits at the root. It then swaps the root to the end, shrinks the heap by one and sifts the new root down to restore order.',
  steps: [
    'Build the heap: starting from the last parent and moving backwards, sift each node down until it is larger than both of its children.',
    'The root (index 0) now holds the largest value. Swap it with the last element of the heap — it is now in its final position.',
    'Shrink the heap by one and sift the new root down, swapping it with its larger child until the heap property holds again.',
    'Repeat until the heap is empty.',
  ],
  goodFor:
    'Guaranteed O(n log n) with O(1) extra memory — ideal when memory is tight or worst-case timing matters. Not stable, and its jumps around memory usually make it slower than Quick Sort in practice.',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
  growth: 'nlogn',
  stable: false,
  inPlace: true,
  pseudocode: [
    'procedure heapSort(A)',
    '  for i ← ⌊n ÷ 2⌋ − 1 down to 0',
    '    siftDown(A, i, n)        ▹ build a max-heap',
    '  for end ← n − 1 down to 1',
    '    swap A[0] and A[end]    ▹ max goes to the back',
    '    siftDown(A, 0, end)',
    '',
    'procedure siftDown(A, i, size)',
    '  while 2i + 1 < size',
    '    c ← 2i + 1              ▹ left child',
    '    if c + 1 < size and A[c + 1] > A[c]: c ← c + 1',
    '    if A[i] ≥ A[c]: return',
    '    swap A[i] and A[c];  i ← c',
  ],
  run(t) {
    const a = t.a;
    const n = t.length;

    const siftDown = (start: number, size: number) => {
      let i = start;
      t.range = [0, size - 1];
      while (2 * i + 1 < size) {
        t.pivot = i;
        let c = 2 * i + 1;
        if (
          c + 1 < size &&
          t.compare(c + 1, c, 10, `Which child is larger: ${a[c]} or ${a[c + 1]}?`) > 0
        ) {
          c++;
        }
        const parent = a[i];
        const child = a[c];
        if (t.compare(i, c, 11, `Is parent ${parent} ≥ larger child ${child}?`) >= 0) break;
        t.swap(i, c, 12, `${child} > ${parent} — sift ${parent} down`);
        i = c;
      }
      t.pivot = undefined;
    };

    t.heapSize = n;
    t.range = [0, n - 1];
    t.info(1, 'Phase 1 — rearrange the array into a max-heap');
    for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(i, n);

    t.range = [0, n - 1];
    t.info(3, `Heap built — the maximum, ${a[0]}, is at the root`, 0);
    for (let end = n - 1; end >= 1; end--) {
      t.heapSize = end + 1;
      t.swap(0, end, 4, `Move the maximum ${a[0]} to the back (#${end})`);
      t.heapSize = end;
      t.markSorted(end, 4, `${a[end]} is in its final position — the heap shrinks`);
      siftDown(0, end);
    }
    t.heapSize = 0;
    t.finish(5);
  },
};
