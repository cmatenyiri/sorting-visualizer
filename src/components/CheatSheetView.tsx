import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { ALGORITHMS, type AlgorithmId } from '../algorithms';
import { Tracer } from '../algorithms/tracer';
import { generateArray, PRESETS, type ArrayPreset } from '../engine/arrays';
import { ALGORITHM_ICONS } from './algorithmIcons';
import { Panel } from './Panel';

const BEST_FOR: Record<AlgorithmId, string> = {
  bubble: 'Teaching, tiny inputs',
  insertion: 'Small or nearly sorted data',
  merge: 'Stable sorts, linked lists, huge files',
  quick: 'General-purpose in-memory sorting',
  heap: 'Worst-case guarantees with O(1) memory',
  radix: 'Integers and fixed-length keys',
  tidal: 'A tiny in-place sort that is fast in practice',
};

const BENCH_SIZE = 256;

interface BenchRow {
  id: AlgorithmId;
  name: string;
  comparisons: number;
  writes: number;
  reads: number;
  total: number;
}

function benchmark(preset: ArrayPreset): BenchRow[] {
  const input = generateArray(BENCH_SIZE, preset);
  return ALGORITHMS.map((algo) => {
    const tracer = new Tracer(input);
    algo.run(tracer);
    const last = tracer.steps[tracer.steps.length - 1];
    const reads = tracer.steps.filter((s) => s.kind === 'read').length;
    const comparisons = last?.comparisons ?? 0;
    const writes = last?.writes ?? 0;
    return {
      id: algo.id,
      name: algo.name,
      comparisons,
      writes,
      reads,
      total: comparisons + writes + reads,
    };
  }).sort((a, b) => a.total - b.total);
}

/** A clean tick step (1, 2, 2.5 or 5 × 10ⁿ) giving roughly `count` intervals up to `value`. */
function niceStep(value: number, count = 4): number {
  const raw = Math.max(1, value) / count;
  const exp = 10 ** Math.floor(Math.log10(raw));
  const f = raw / exp;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * exp;
}

function Yes({ on }: { on: boolean }) {
  return on ? (
    <CheckRounded sx={{ fontSize: 18, color: 'success.main' }} aria-label="Yes" />
  ) : (
    <RemoveRounded sx={{ fontSize: 18, color: 'text.disabled' }} aria-label="No" />
  );
}

interface CheatSheetViewProps {
  onOpenTutorial: () => void;
  onPick: (id: AlgorithmId) => void;
}

export function CheatSheetView({ onOpenTutorial, onPick }: CheatSheetViewProps) {
  const theme = useTheme();
  const [preset, setPreset] = useState<ArrayPreset>('random');
  const [seed, setSeed] = useState(0);
  // `seed` only exists to force a fresh random input when the user asks for one.
  const rows = useMemo(() => (seed >= 0 ? benchmark(preset) : []), [preset, seed]);
  const largest = Math.max(...rows.map((r) => r.total));
  const tickStep = niceStep(largest);
  const max = Math.ceil(largest / tickStep) * tickStep;
  const ticks = Array.from({ length: Math.round(max / tickStep) + 1 }, (_, i) => i * tickStep);

  const cell = {
    px: 1.5,
    py: 1.25,
    borderBottom: `1px solid ${theme.vars.palette.surface.border}`,
  };
  const head = {
    ...cell,
    py: 1,
    textAlign: 'left' as const,
    fontFamily: theme.typography.eyebrow.fontFamily,
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: theme.vars.palette.text.secondary,
    whiteSpace: 'nowrap' as const,
  };

  return (
    <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: 'minmax(0, 1fr)' }}>
      <Panel
        eyebrow="Cheat sheet"
        title="Every algorithm at a glance"
        action={
          <Button
            size="small"
            variant="outlined"
            startIcon={<SchoolRounded />}
            onClick={onOpenTutorial}
          >
            Replay tutorial
          </Button>
        }
      >
        <Box sx={{ overflowX: 'auto', mx: { xs: -2, sm: 0 } }}>
          <Box
            component="table"
            sx={{ width: '100%', minWidth: 860, borderCollapse: 'collapse', fontSize: 14 }}
          >
            <thead>
              <tr>
                <Box component="th" sx={head}>
                  Algorithm
                </Box>
                <Box component="th" sx={head}>
                  Best
                </Box>
                <Box component="th" sx={head}>
                  Average
                </Box>
                <Box component="th" sx={head}>
                  Worst
                </Box>
                <Box component="th" sx={head}>
                  Memory
                </Box>
                <Box component="th" sx={{ ...head, textAlign: 'center' }}>
                  Stable
                </Box>
                <Box component="th" sx={{ ...head, textAlign: 'center' }}>
                  In-place
                </Box>
                <Box component="th" sx={head}>
                  Reach for it when…
                </Box>
                <Box component="th" sx={head} aria-label="Open in visualizer" />
              </tr>
            </thead>
            <tbody>
              {ALGORITHMS.map((algo) => {
                const Icon = ALGORITHM_ICONS[algo.id];
                const mono = {
                  ...cell,
                  fontFamily: theme.typography.mono.fontFamily,
                  fontSize: 12.5,
                  whiteSpace: 'nowrap' as const,
                };
                return (
                  <Box
                    component="tr"
                    key={algo.id}
                    sx={{
                      '&:hover td': {
                        backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <Box component="td" sx={cell}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 2,
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                            color: theme.vars.palette.primary.light,
                            backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.12),
                          }}
                        >
                          <Icon sx={{ fontSize: 17 }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>
                            {algo.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                            {algo.technique}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box component="td" sx={mono}>
                      {algo.complexity.best}
                    </Box>
                    <Box component="td" sx={mono}>
                      {algo.complexity.average}
                    </Box>
                    <Box component="td" sx={mono}>
                      {algo.complexity.worst}
                    </Box>
                    <Box component="td" sx={mono}>
                      {algo.complexity.space}
                    </Box>
                    <Box component="td" sx={{ ...cell, textAlign: 'center' }}>
                      <Yes on={algo.stable} />
                    </Box>
                    <Box component="td" sx={{ ...cell, textAlign: 'center' }}>
                      <Yes on={algo.inPlace} />
                    </Box>
                    <Box component="td" sx={{ ...cell, color: 'text.secondary', fontSize: 13.5 }}>
                      {BEST_FOR[algo.id]}
                    </Box>
                    <Box component="td" sx={{ ...cell, textAlign: 'right' }}>
                      <Tooltip title={`Visualize ${algo.name}`}>
                        <IconButton
                          size="small"
                          aria-label={`Visualize ${algo.name}`}
                          onClick={() => onPick(algo.id)}
                        >
                          <ArrowForwardRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                );
              })}
            </tbody>
          </Box>
        </Box>
      </Panel>

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          alignItems: 'start',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.5fr) minmax(0, 1fr)' },
        }}
      >
        <Panel
          eyebrow={`Measured in your browser · ${BENCH_SIZE} items`}
          title="Operations needed to sort"
          action={
            <Tooltip title="Run again on a new array">
              <IconButton
                aria-label="Run the benchmark again"
                onClick={() => setSeed((s) => s + 1)}
              >
                <RefreshRounded />
              </IconButton>
            </Tooltip>
          }
        >
          <ToggleButtonGroup
            exclusive
            size="small"
            value={preset}
            onChange={(_, v: ArrayPreset | null) => v && setPreset(v)}
            aria-label="Benchmark starting order"
            sx={{ mb: 2.5, flexWrap: 'wrap' }}
          >
            {PRESETS.map((p) => (
              <ToggleButton key={p.id} value={p.id}>
                {p.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box role="list" aria-label="Operations per algorithm" sx={{ position: 'relative' }}>
            {/* Recessive hairline gridlines at clean ticks. */}
            <Box
              aria-hidden
              sx={{ position: 'absolute', inset: 0, left: 124, right: 72, pointerEvents: 'none' }}
            >
              {ticks.map((t) => (
                <Box
                  key={t}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 24,
                    left: `${(t / max) * 100}%`,
                    borderLeft: `1px solid ${theme.vars.palette.viz.grid}`,
                  }}
                />
              ))}
            </Box>
            {rows.map((row) => (
              <Tooltip
                key={row.id}
                placement="top"
                followCursor
                title={
                  <Box sx={{ fontFamily: 'mono.fontFamily', fontSize: 11.5, lineHeight: 1.6 }}>
                    <Box sx={{ fontWeight: 700, mb: 0.25 }}>{row.name}</Box>
                    <div>comparisons {row.comparisons.toLocaleString()}</div>
                    <div>writes {row.writes.toLocaleString()}</div>
                    {row.reads > 0 && <div>digit reads {row.reads.toLocaleString()}</div>}
                  </Box>
                }
              >
                <Box
                  role="listitem"
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '124px 1fr 72px',
                    alignItems: 'center',
                    height: 34,
                    cursor: 'default',
                    borderRadius: 1.5,
                    '&:hover': {
                      backgroundColor: theme.alpha(theme.vars.palette.text.primary, 0.03),
                    },
                    '&:hover .bench-bar': { backgroundColor: theme.vars.palette.primary.light },
                  }}
                >
                  <Typography variant="body2" noWrap sx={{ color: 'text.secondary', pr: 1.5 }}>
                    {row.name}
                  </Typography>
                  <Box sx={{ position: 'relative', height: 14 }}>
                    <Box
                      className="bench-bar"
                      sx={{
                        height: '100%',
                        width: `max(2px, ${(row.total / max) * 100}%)`,
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: theme.vars.palette.primary.main,
                        transition: 'width 500ms cubic-bezier(.2,.7,.2,1), background-color 120ms',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="mono"
                    sx={{ textAlign: 'right', fontSize: 12, color: 'text.primary' }}
                  >
                    {row.total.toLocaleString()}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
            <Box sx={{ display: 'grid', gridTemplateColumns: '124px 1fr 72px', height: 24 }}>
              <span />
              <Box sx={{ position: 'relative' }}>
                {ticks.map((t) => (
                  <Typography
                    key={t}
                    variant="mono"
                    sx={{
                      position: 'absolute',
                      top: 6,
                      left: `${(t / max) * 100}%`,
                      transform: t === 0 ? 'none' : 'translateX(-50%)',
                      fontSize: 10.5,
                      color: 'text.disabled',
                    }}
                  >
                    {t >= 1000 ? `${(t / 1000).toLocaleString()}k` : t}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
          <Typography variant="caption" component="p" sx={{ color: 'text.disabled', mt: 1.5 }}>
            Operations = comparisons + array writes (+ digit reads for Radix Sort), counted by
            running each algorithm on the same {BENCH_SIZE}-item array. Hover a bar for the
            breakdown.
          </Typography>
        </Panel>

        <Panel eyebrow="Rules of thumb" title="Which one should I use?">
          <Box sx={{ display: 'grid', gap: 1.25 }}>
            {(
              [
                [
                  'Just sort it',
                  'Use your language’s built-in sort — usually a tuned hybrid of Quick, Heap and Insertion Sort (Introsort) or Merge and Insertion Sort (Timsort).',
                ],
                [
                  'Small or almost sorted',
                  'Insertion Sort. Its overhead is tiny and it runs in near-linear time on nearly ordered data.',
                ],
                [
                  'Need stability',
                  'Merge Sort keeps equal items in their original order with a guaranteed O(n log n).',
                ],
                [
                  'Tight memory, hard deadlines',
                  'Heap Sort: O(n log n) in the worst case with O(1) extra memory.',
                ],
                [
                  'Integers or fixed-width keys',
                  'Radix Sort skips comparisons entirely and scales linearly with n.',
                ],
              ] as const
            ).map(([title, text]) => (
              <Box
                key={title}
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  backgroundColor: theme.vars.palette.surface.sunken,
                  border: `1px solid ${theme.vars.palette.surface.border}`,
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 0.25 }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Panel>
      </Box>
    </Box>
  );
}
