import type { AlgorithmMeta } from './types';

const SHRINK = 1.3;

export const tidalSort: AlgorithmMeta = {
  id: 'tidal',
  name: 'Tidal Sort',
  technique: 'Hybrid · gap exchange',
  tagline: 'Waves of shrinking stride wash values back and forth into place.',
  summary:
    'Tidal Sort is a hybrid designed for Sortscape. Like a tide, it sweeps up the array and then back down, comparing elements a gap apart and swapping any that are out of order. The gap shrinks by a factor of 1.3 after every sweep, so the early waves carry far-away values a long distance in a single move. Once the gap reaches 1 it becomes a cocktail-shaker sort, and every wave leaves one settled value on the shore at either end.',
  steps: [
    'Start with a gap of about n ÷ 1.3 and sweep left → right, swapping any pair (i, i + gap) that is out of order.',
    'Shrink the gap by 1.3 and sweep back right → left — the tide turns.',
    'Keep alternating direction while the gap shrinks. Small values stranded near the end (“turtles”) are carried home in a few big jumps instead of crawling one step at a time.',
    'At gap 1 each sweep settles the largest (rising tide) or smallest (falling tide) remaining value at the edge. Stop when a gap-1 sweep makes no swaps.',
  ],
  goodFor:
    'Combines Comb Sort’s long-distance moves with Cocktail Shaker’s two-way sweeps: a tiny in-place algorithm that runs dramatically faster than Bubble Sort in practice.',
  complexity: { best: 'O(n log n)', average: '≈ O(n log n)', worst: 'O(n²)', space: 'O(1)' },
  growth: 'nlogn',
  stable: false,
  inPlace: true,
  original: true,
  pseudocode: [
    'procedure tidalSort(A)',
    '  gap ← n;  lo ← 0;  hi ← n − 1;  flow ← rising',
    '  repeat',
    '    gap ← max(1, ⌊gap ÷ 1.3⌋);  swapped ← false',
    '    sweep i over [lo, hi − gap] in the flow direction',
    '      if A[i] > A[i + gap]',
    '        swap A[i] and A[i + gap];  swapped ← true',
    '    if gap = 1: settle the edge the tide reached',
    '    flow ← opposite(flow)',
    '  until gap = 1 and not swapped',
  ],
  run(t) {
    const a = t.a;
    let gap = t.length;
    let lo = 0;
    let hi = t.length - 1;
    let rising = true;
    let swapped = true;

    const step = (i: number) => {
      const x = a[i];
      const y = a[i + gap];
      if (t.compare(i, i + gap, 5, `Gap ${gap}: is ${x} > ${y}?`) > 0) {
        t.swap(i, i + gap, 6, `${x} > ${y} — the wave carries them past each other`);
        swapped = true;
      }
    };

    while ((gap > 1 || swapped) && lo < hi) {
      gap = Math.max(1, Math.floor(gap / SHRINK));
      swapped = false;
      t.range = [lo, hi];
      t.info(3, `${rising ? 'Rising tide ↑' : 'Falling tide ↓'} with gap ${gap}`);
      if (rising) {
        for (let i = lo; i + gap <= hi; i++) step(i);
      } else {
        for (let i = hi - gap; i >= lo; i--) step(i);
      }
      if (gap === 1) {
        if (rising) {
          t.markSorted(hi, 7, `${a[hi]} washed up at the top edge — settled`);
          hi--;
        } else {
          t.markSorted(lo, 7, `${a[lo]} washed up at the bottom edge — settled`);
          lo++;
        }
      }
      rising = !rising;
    }
    t.finish(9);
  },
};
