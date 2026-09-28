import { useEffect, useState } from 'react';

function read<T>(key: string, fallback: T, validate?: (value: unknown) => value is T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (validate) return validate(parsed) ? parsed : fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

/** `useState` that mirrors its value to localStorage (best effort). */
export function usePersistentState<T>(
  key: string,
  fallback: T,
  validate?: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => read(key, fallback, validate));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable (private mode, quotas) — persistence is optional.
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
