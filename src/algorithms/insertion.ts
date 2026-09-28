import type { AlgorithmMeta } from './types';

export const insertionSort: AlgorithmMeta = {
  id: 'insertion',
  name: 'Insertion Sort',
  technique: 'Insertion',
  tagline: 'Builds a sorted hand one card at a time.',
  summary:
    'Insertion Sort works the way most people sort a hand of playing cards. The left part of the array is kept sorted; each new element is picked up and slid leftwards past every larger element until it drops into its correct spot.',
  steps: [
    'Treat the first element as a sorted prefix of length one.',
    'Pick up the next element — the key.',
    'Compare the key with its left neighbour. While the neighbour is larger, swap them so the key moves left.',
    'When the neighbour is smaller (or the start is reached) the key is in place. The sorted prefix grows by one — repeat until every element has been inserted.',
  ],
  goodFor:
    'Small or nearly-sorted arrays, where it runs in almost linear time. Fast hybrid sorts such as Timsort and Introsort switch to it for short runs.',
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  growth: 'n2',
  stable: true,
  inPlace: true,
  pseudocode: [
    'procedure insertionSort(A)',
    '  for i ← 1 to n − 1',
    '    j ← i                ▹ A[0..i − 1] is sorted',
    '    while j > 0 and A[j − 1] > A[j]',
    '      swap A[j − 1] and A[j]',
    '      j ← j − 1',
    '    the key has found its spot',
  ],
  run(t) {
    const a = t.a;
    const n = t.length;
    for (let i = 1; i < n; i++) {
      t.range = [0, i];
      t.pivot = i;
      t.info(2, `Pick up ${a[i]} and insert it into the sorted prefix`, i);
      let j = i;
      while (j > 0) {
        t.pivot = j;
        const left = a[j - 1];
        const key = a[j];
        if (t.compare(j - 1, j, 3, `Is ${left} > ${key}?`) <= 0) break;
        t.swap(j - 1, j, 4, `${left} is larger — slide ${key} one step left`);
        j--;
      }
      t.pivot = j;
      t.info(6, `${a[j]} settles at position ${j}`, j);
    }
    t.pivot = undefined;
    t.finish(6);
  },
};
