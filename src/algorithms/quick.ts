import type { AlgorithmMeta } from './types';

export const quickSort: AlgorithmMeta = {
  id: 'quick',
  name: 'Quick Sort',
  technique: 'Divide & conquer · partitioning',
  tagline: 'Pick a pivot, split around it, recurse on both sides.',
  summary:
    'Quick Sort chooses a pivot value and partitions the array so that everything smaller lands to its left and everything larger to its right. The pivot is then in its final position, and the same trick is applied recursively to both sides. This version picks the median of the first, middle and last values as pivot to dodge the classic worst case on already-sorted input.',
  steps: [
    'Choose a pivot — here, the median of the first, middle and last values — and park it at the end of the range.',
    'Sweep through the range, moving every value smaller than the pivot into a growing “small” zone on the left.',
    'Swap the pivot onto the boundary between the zones. It is now exactly where it belongs.',
    'Recursively quick-sort the zone on the left and the zone on the right.',
  ],
  goodFor:
    'The go-to general-purpose sort: in-place, cache-friendly and usually the fastest in practice. Consistently bad pivot choices degrade it to O(n²).',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
  growth: 'nlogn',
  stable: false,
  inPlace: true,
  pseudocode: [
    'procedure quickSort(A, lo, hi)',
    '  if lo ≥ hi: return',
    '  p ← partition(A, lo, hi)',
    '  quickSort(A, lo, p − 1)',
    '  quickSort(A, p + 1, hi)',
    '',
    'procedure partition(A, lo, hi)',
    '  move median of A[lo], A[mid], A[hi] to A[hi]',
    '  pivot ← A[hi];  i ← lo',
    '  for j ← lo to hi − 1',
    '    if A[j] < pivot',
    '      swap A[i] and A[j];  i ← i + 1',
    '  swap A[i] and A[hi]    ▹ pivot is final',
    '  return i',
  ],
  run(t) {
    const a = t.a;

    const cmp = (i: number, j: number) =>
      t.compare(i, j, 7, `Median-of-three: compare ${a[i]} and ${a[j]}`);

    const medianOfThree = (x: number, y: number, z: number): number => {
      if (cmp(x, y) < 0) {
        if (cmp(y, z) <= 0) return y;
        return cmp(x, z) <= 0 ? z : x;
      }
      if (cmp(x, z) <= 0) return x;
      return cmp(y, z) <= 0 ? z : y;
    };

    const partition = (lo: number, hi: number): number => {
      t.range = [lo, hi];
      t.pivot = undefined;
      if (hi - lo >= 2) {
        const m = medianOfThree(lo, (lo + hi) >> 1, hi);
        if (m !== hi) t.swap(m, hi, 7, `Move the median ${a[m]} to the end to act as pivot`);
      }
      const pivot = a[hi];
      t.pivot = hi;
      t.info(8, `Pivot is ${pivot} — partition [${lo}–${hi}] around it`, hi);
      let i = lo;
      for (let j = lo; j < hi; j++) {
        const v = a[j];
        if (t.compare(j, hi, 10, `Is ${v} < pivot ${pivot}?`) < 0) {
          if (i !== j) t.swap(i, j, 11, `${v} < ${pivot} — move it into the small zone`);
          i++;
        }
      }
      if (i !== hi) t.swap(i, hi, 12, `Drop pivot ${pivot} onto the boundary at #${i}`);
      t.pivot = i;
      t.markSorted(i, 12, `Pivot ${pivot} is in its final position`);
      t.pivot = undefined;
      return i;
    };

    const sort = (lo: number, hi: number) => {
      if (lo > hi) return;
      if (lo === hi) {
        t.range = [lo, hi];
        t.markSorted(lo, 1, `${a[lo]} stands alone — already in place`);
        return;
      }
      const p = partition(lo, hi);
      sort(lo, p - 1);
      sort(p + 1, hi);
    };

    sort(0, t.length - 1);
    t.finish(1);
  },
};
