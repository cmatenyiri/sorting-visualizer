import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { AlgorithmMeta } from '../algorithms';
import type { Frame, Timeline } from '../engine/timeline';

const fmt = (n: number) => Math.round(n).toLocaleString();

function Tile({
  label,
  value,
  hint,
  accent,
  children,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent: string;
  children?: ReactNode;
}) {
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        p: 2,
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: theme.alpha(theme.vars.palette.surface.base, 0.72),
        border: `1px solid ${theme.vars.palette.surface.border}`,
        backdropFilter: 'blur(14px)',
        '&::before': {
          content: '""',
          position: 'absolute',
          insetInline: 0,
          top: 0,
          height: 2,
          background: `linear-gradient(90deg, ${accent}, transparent 80%)`,
        },
      })}
    >
      <Typography variant="eyebrow" component="div" sx={{ color: 'text.secondary', mb: 0.75 }}>
        {label}
      </Typography>
      <Typography
        component="div"
        sx={{
          fontFamily: 'mono.fontFamily',
          fontWeight: 600,
          fontSize: { xs: '1.35rem', sm: '1.6rem' },
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
      {hint && (
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.disabled', mt: 0.75, fontSize: 11.5 }}
        >
          {hint}
        </Typography>
      )}
      {children}
    </Box>
  );
}

interface StatsPanelProps {
  algorithm: AlgorithmMeta;
  timeline: Timeline;
  frame: Frame;
}

export function StatsPanel({ algorithm, timeline, frame }: StatsPanelProps) {
  const viz = useTheme().vars.palette.viz;
  const n = timeline.input.length;
  const step = frame.step;
  const final = timeline.steps[timeline.steps.length - 1];
  const progress = frame.total === 0 ? 100 : (frame.index / frame.total) * 100;
  const nlogn = n * Math.log2(Math.max(2, n));
  const digits = String(timeline.maxValue).length;

  const reference =
    algorithm.growth === 'nk' ? (
      <>n·k = {fmt(n * digits)} digit reads · no comparisons needed</>
    ) : (
      <>
        n log₂ n ≈ {fmt(nlogn)} · n² = {fmt(n * n)}
      </>
    );

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
      }}
    >
      <Tile
        label="Comparisons"
        value={fmt(step?.comparisons ?? 0)}
        hint={reference}
        accent={viz.compare}
      />
      <Tile
        label="Swaps"
        value={fmt(step?.swaps ?? 0)}
        hint={`of ${fmt(final?.swaps ?? 0)} in total`}
        accent={viz.swap}
      />
      <Tile
        label="Array writes"
        value={fmt(step?.writes ?? 0)}
        hint={algorithm.inPlace ? 'swap = 2 writes' : 'buffer copies back into the array'}
        accent={viz.write}
      />
      <Tile
        label="Progress"
        value={`${progress.toFixed(progress === 100 || progress === 0 ? 0 : 1)}%`}
        accent={viz.sorted}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          aria-label="Sorting progress"
          sx={{ mt: 1.25, '& .MuiLinearProgress-bar': { transition: 'none' } }}
        />
      </Tile>
    </Box>
  );
}
