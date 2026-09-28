import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Step } from '../../algorithms';
import { placeName } from '../../algorithms/radix';

interface BucketState {
  exp: number;
  buckets: number[][];
  /** Bucket that received the latest value, or the one being collected from. */
  active: number | null;
  collecting: boolean;
}

/** Rebuilds the ten buckets of the current radix pass from the recorded steps. */
function bucketsAt(steps: readonly Step[], index: number): BucketState | null {
  let start = -1;
  for (let k = index - 1; k >= 0; k--) {
    const s = steps[k];
    if (s.kind === 'info' && s.line === 2) {
      start = k;
      break;
    }
    if (s.kind === 'done') return null;
  }
  if (start < 0) return null;
  const exp = steps[start].digit ?? 1;
  const buckets: number[][] = Array.from({ length: 10 }, () => []);
  const digitOf = (v: number) => Math.floor(v / exp) % 10;
  let writes = 0;
  let active: number | null = null;
  for (let k = start + 1; k < index; k++) {
    const s = steps[k];
    if (s.kind === 'read' && s.value !== undefined) {
      active = digitOf(s.value);
      buckets[active].push(s.value);
    } else if (s.kind === 'write' && s.value !== undefined) {
      writes++;
      active = digitOf(s.value);
    }
  }
  const collecting = writes > 0;
  // Values leave the buckets in order (bucket 0 first, oldest first).
  for (let d = 0; d < 10 && writes > 0; d++) {
    const take = Math.min(writes, buckets[d].length);
    buckets[d].splice(0, take);
    writes -= take;
  }
  return { exp, buckets, active, collecting };
}

interface RadixBucketsProps {
  steps: readonly Step[];
  index: number;
  /** Max chips per bucket before collapsing into a count. */
  maxChips?: number;
}

export function RadixBuckets({ steps, index, maxChips = 5 }: RadixBucketsProps) {
  const state = bucketsAt(steps, index);
  return (
    <Box>
      <Typography variant="eyebrow" component="div" sx={{ color: 'text.secondary', mb: 1 }}>
        {state
          ? `Buckets · ${placeName(state.exp)} digit · ${state.collecting ? 'collecting' : 'distributing'}`
          : 'Buckets'}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, minmax(0, 1fr))', gap: 0.5 }}>
        {Array.from({ length: 10 }, (_, d) => {
          const items = state?.buckets[d] ?? [];
          const active = state?.active === d;
          return (
            <Box
              key={d}
              sx={(theme) => ({
                minHeight: 92,
                p: 0.5,
                pt: 0.75,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column-reverse',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 0.4,
                position: 'relative',
                backgroundColor: theme.vars.palette.surface.sunken,
                border: `1px solid ${active ? theme.vars.palette.viz.read : theme.vars.palette.surface.border}`,
                transition: 'border-color 140ms',
              })}
            >
              <Typography
                variant="mono"
                component="div"
                sx={{
                  order: -1,
                  fontSize: 11,
                  fontWeight: 700,
                  color: active ? 'text.primary' : 'text.disabled',
                }}
              >
                {d}
              </Typography>
              {items.slice(-maxChips).map((v, k) => (
                <Box
                  key={`${v}-${k}`}
                  sx={(theme) => ({
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: theme.typography.mono.fontFamily,
                    fontSize: 10.5,
                    fontWeight: 600,
                    lineHeight: '16px',
                    borderRadius: 1,
                    color: theme.vars.palette.text.primary,
                    backgroundColor: theme.alpha(theme.vars.palette.viz.read, 0.22),
                  })}
                >
                  {v}
                </Box>
              ))}
              {items.length > maxChips && (
                <Typography variant="caption" sx={{ fontSize: 9.5, color: 'text.disabled' }}>
                  +{items.length - maxChips}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
