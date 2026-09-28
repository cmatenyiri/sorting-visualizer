export type ArrayPreset = 'random' | 'nearly' | 'reversed' | 'few';

export const MIN_SIZE = 5;
export const MAX_SIZE = 200;

export const MIN_VALUE = 5;
export const MAX_VALUE = 99;

export const PRESETS: readonly { id: ArrayPreset; label: string; hint: string }[] = [
  { id: 'random', label: 'Random', hint: 'Uniformly shuffled values' },
  { id: 'nearly', label: 'Nearly sorted', hint: 'Sorted, with a few elements out of place' },
  { id: 'reversed', label: 'Reversed', hint: 'Sorted from largest to smallest' },
  { id: 'few', label: 'Few unique', hint: 'Only a handful of distinct values' },
];

const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

function randomValues(size: number): number[] {
  const span = MAX_VALUE - MIN_VALUE + 1;
  if (size > span) return Array.from({ length: size }, () => randInt(MIN_VALUE, MAX_VALUE));
  // Distinct values read better on screen, so sample without replacement when possible.
  const pool = Array.from({ length: span }, (_, i) => MIN_VALUE + i);
  shuffle(pool);
  return pool.slice(0, size);
}

export function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function generateArray(size: number, preset: ArrayPreset): number[] {
  switch (preset) {
    case 'random':
      return randomValues(size);
    case 'reversed':
      return randomValues(size).sort((a, b) => b - a);
    case 'nearly': {
      const values = randomValues(size).sort((a, b) => a - b);
      const swaps = Math.max(1, Math.round(size * 0.06));
      for (let s = 0; s < swaps; s++) {
        const i = randInt(0, size - 1);
        const j = Math.min(size - 1, Math.max(0, i + randInt(-3, 3)));
        [values[i], values[j]] = [values[j], values[i]];
      }
      return values;
    }
    case 'few': {
      const levels = shuffle([18, 38, 58, 78, 96]).slice(0, size < 12 ? 3 : 5);
      return Array.from({ length: size }, () => levels[randInt(0, levels.length - 1)]);
    }
  }
}

/** Parses a comma/space separated list typed by the user. */
export function parseCustomArray(text: string): { values: number[] } | { error: string } {
  const parts = text
    .split(/[\s,;]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return { error: 'Enter at least two numbers.' };
  if (parts.length > 200) return { error: 'At most 200 numbers are supported.' };
  const values: number[] = [];
  for (const part of parts) {
    const value = Number(part);
    if (!Number.isInteger(value) || value < 1 || value > 999) {
      return { error: `“${part}” is not a whole number between 1 and 999.` };
    }
    values.push(value);
  }
  return { values };
}
