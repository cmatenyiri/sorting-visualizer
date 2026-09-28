import { useEffect, useRef } from 'react';

export type HotkeyMap = Record<string, (event: KeyboardEvent) => void>;

const TYPING =
  'input:not([type="range"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]';
const OWNS_ARROWS =
  'input[type="range"], [role="slider"], [role="tab"], [role="radio"], [role="option"], [role="menuitem"]';
const OWNS_SPACE = 'button, a[href], input, [role="button"], [role="checkbox"], [role="switch"]';

/**
 * Global keyboard shortcuts. Keys are matched against `event.key`
 * (case-insensitive for letters). Shortcuts are ignored while typing and never
 * steal keys from focused controls that already use them.
 */
export function useHotkeys(map: HotkeyMap, enabled = true) {
  const mapRef = useRef(map);
  useEffect(() => {
    mapRef.current = map;
  });

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(TYPING)) return;
      if (event.key.startsWith('Arrow') && target?.closest(OWNS_ARROWS)) return;
      // Let keyboard users activate the focused control; after a mouse click, the shortcut wins.
      if (
        (event.key === ' ' || event.key === 'Enter') &&
        target?.closest(OWNS_SPACE) &&
        target.matches(':focus-visible')
      ) {
        return;
      }

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const handler = mapRef.current[key];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}
