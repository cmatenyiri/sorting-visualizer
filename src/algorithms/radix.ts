import type { AlgorithmMeta } from './types';

const PLACE_NAMES: Record<number, string> = {
  1: 'ones',
  10: 'tens',
  100: 'hundreds',
  1000: 'thousands',
};

export const placeName = (exp: number) => PLACE_NAMES[exp] ?? `×${exp}`;

export const radixSort: AlgorithmMeta = {
  id: 'radix',
  name: 'Radix Sort',
  technique: 'Distribution · non-comparison',
  tagline: 'Never compares two values — sorts digit by digit instead.',
  summary:
    'Radix Sort (least-significant digit first) never compares two elements with each other. It distributes the values into ten buckets by their ones digit and collects the buckets back in order, then repeats for the tens digit, the hundreds digit and so on. Because every pass keeps equal digits in their previous order, earlier work is preserved and the array ends up fully sorted.',
  steps: [
    'Look at the ones digit of every value and drop it into bucket 0–9 accordingly.',
    'Collect the buckets back into the array from bucket 0 to bucket 9, keeping the order within each bucket.',
    'Repeat with the tens digit, then the hundreds, until the largest value has run out of digits.',
    'After the pass on the most significant digit the array is sorted — without a single comparison.',
  ],
  goodFor:
    'Integers and fixed-length keys (IDs, zip codes, dates), where its O(n·k) time beats every comparison sort. It needs O(n + b) extra memory and cannot sort arbitrary objects directly.',
  complexity: { best: 'O(n·k)', average: 'O(n·k)', worst: 'O(n·k)', space: 'O(n + b)' },
  growth: 'nk',
  stable: true,
  inPlace: false,
  pseudocode: [
    'procedure radixSort(A)          ▹ LSD, base 10',
    '  for exp ← 1, 10, 100, … while max ÷ exp ≥ 1',
    '    buckets[0..9] ← empty lists',
    '    for i ← 0 to n − 1',
    '      d ← ⌊A[i] ÷ exp⌋ mod 10',
    '      append A[i] to buckets[d]',
    '    k ← 0',
    '    for d ← 0 to 9',
    '      for each x in buckets[d]',
    '        A[k] ← x;  k ← k + 1',
  ],
  run(t) {
    const a = t.a;
    const n = t.length;
    const max = Math.max(...a);
    let passes = 0;
    for (let e = 1; Math.floor(max / e) > 0; e *= 10) passes++;
    t.info(
      1,
      `Largest value is ${max}, so ${passes === 1 ? 'one digit pass is' : `${passes} digit passes are`} needed`,
    );

    let pass = 0;
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      pass++;
      const last = pass === passes;
      t.digit = exp;
      t.range = [0, n - 1];
      t.info(2, `Pass ${pass}: distribute by the ${placeName(exp)} digit`);
      const buckets: number[][] = Array.from({ length: 10 }, () => []);
      for (let i = 0; i < n; i++) {
        const d = Math.floor(a[i] / exp) % 10;
        t.read(i, 5, `${a[i]} has ${placeName(exp)} digit ${d} → bucket ${d}`);
        buckets[d].push(a[i]);
      }
      let k = 0;
      for (let d = 0; d < 10; d++) {
        for (const x of buckets[d]) {
          t.write(k, x, 9, `Collect bucket ${d}: place ${x} at #${k}`, last);
          k++;
        }
      }
    }
    t.finish(1);
  },
};
