import type { Theme } from '@mui/material/styles';
import type { Step } from '../algorithms';

export type Role = 'compare' | 'swap' | 'write' | 'read' | 'pivot' | 'settle';

/** Which indices to highlight for a step, and how. */
export function rolesFor(step: Step | undefined): Map<number, Role> {
  const roles = new Map<number, Role>();
  if (!step) return roles;
  if (step.pivot !== undefined) roles.set(step.pivot, 'pivot');
  const set = (i: number | undefined, role: Role, keepPivot = false) => {
    if (i === undefined) return;
    if (keepPivot && i === step.pivot) return;
    roles.set(i, role);
  };
  switch (step.kind) {
    case 'compare':
      // Comparing against the pivot/key: keep the pivot's own colour so it stays recognisable.
      set(step.a, 'compare', true);
      set(step.b, 'compare', true);
      break;
    case 'swap':
      set(step.a, 'swap');
      set(step.b, 'swap');
      break;
    case 'write':
      set(step.a, 'write');
      break;
    case 'read':
    case 'info':
      set(step.a, 'read', true);
      set(step.b, 'read', true);
      break;
    case 'sorted':
      for (const i of step.sorted ?? []) roles.set(i, 'settle');
      break;
    case 'done':
      break;
  }
  return roles;
}

export function roleColor(theme: Theme, role: Role): string {
  const viz = theme.vars.palette.viz;
  switch (role) {
    case 'compare':
      return viz.compare;
    case 'swap':
      return viz.swap;
    case 'write':
      return viz.write;
    case 'read':
      return viz.read;
    case 'pivot':
      return viz.pivot;
    case 'settle':
      return viz.sorted;
  }
}
