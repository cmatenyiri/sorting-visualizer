import type { AlgorithmMeta } from './types';

export const mergeSort: AlgorithmMeta = {
  id: 'merge',
  name: 'Merge Sort',
  technique: 'Divide & conquer',
  tagline: 'Split in half, sort each half, zip them back together.',
  summary:
    'Merge Sort recursively splits the array into halves until every piece holds a single element — which is trivially sorted. It then merges neighbouring pieces back together, repeatedly taking the smaller front element of the two runs, so every merge produces a longer sorted run.',
  steps: [
    'Divide: split the range at its midpoint.',
    'Conquer: recursively sort the left half and the right half.',
    'Combine: merge the two sorted halves by repeatedly taking the smaller of their front elements.',
    'Recursion bottoms out at single elements, so merges build sorted runs of 2, 4, 8… until the whole array is one run.',
  ],
  goodFor:
    'Guaranteed O(n log n) on any input, and stable. The classic choice for linked lists and for sorting files too big for memory. The price is O(n) extra memory for the merge buffer.',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  growth: 'nlogn',
  stable: true,
  inPlace: false,
  pseudocode: [
    'procedure mergeSort(A, lo, hi)',
    '  if lo ≥ hi: return',
    '  mid ← ⌊(lo + hi) ÷ 2⌋',
    '  mergeSort(A, lo, mid)',
    '  mergeSort(A, mid + 1, hi)',
    '  merge(A, lo, mid, hi)',
    '',
    'procedure merge(A, lo, mid, hi)',
    '  B ← copy of A[lo..hi]',
    '  i ← lo;  j ← mid + 1',
    '  for k ← lo to hi',
    '    if j > hi or (i ≤ mid and B[i] ≤ B[j])',
    '      A[k] ← B[i];  i ← i + 1',
    '    else',
    '      A[k] ← B[j];  j ← j + 1',
  ],
  run(t) {
    const a = t.a;
    const n = t.length;

    const merge = (lo: number, mid: number, hi: number) => {
      const final = lo === 0 && hi === n - 1;
      const buffer = a.slice(lo, hi + 1);
      t.range = [lo, hi];
      t.info(8, `Merge the sorted runs [${lo}–${mid}] and [${mid + 1}–${hi}]`);
      let i = lo;
      let j = mid + 1;
      for (let k = lo; k <= hi; k++) {
        if (i > mid) {
          // The rest of the right run is already sitting in its final slots.
          if (final)
            t.markSorted(range(k, hi), 11, 'Left run is empty — the rest is already in place');
          break;
        }
        const x = buffer[i - lo];
        if (j > hi) {
          t.write(k, x, 12, `Right run is empty — copy ${x} down`, final);
          i++;
          continue;
        }
        const y = buffer[j - lo];
        if (t.compareValues(i, j, x, y, 11, `Front of runs: ${x} vs ${y}`) <= 0) {
          t.write(k, x, 12, `${x} ≤ ${y} — take ${x} from the left run`, final);
          i++;
        } else {
          t.write(k, y, 14, `${y} < ${x} — take ${y} from the right run`, final);
          j++;
        }
      }
    };

    const sort = (lo: number, hi: number) => {
      if (lo >= hi) return;
      const mid = (lo + hi) >> 1;
      t.range = [lo, hi];
      t.info(2, `Split [${lo}–${hi}] into [${lo}–${mid}] and [${mid + 1}–${hi}]`);
      sort(lo, mid);
      sort(mid + 1, hi);
      merge(lo, mid, hi);
    };

    sort(0, n - 1);
    t.finish(5);
  },
};

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}
