import CheckRounded from '@mui/icons-material/CheckRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { AlgorithmMeta } from '../algorithms';
import { Panel } from './Panel';

export function ComplexityGrid({ algorithm }: { algorithm: AlgorithmMeta }) {
  const cells: [string, string][] = [
    ['Best', algorithm.complexity.best],
    ['Average', algorithm.complexity.average],
    ['Worst', algorithm.complexity.worst],
    ['Memory', algorithm.complexity.space],
  ];
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 0.75 }}>
      {cells.map(([label, value]) => (
        <Box
          key={label}
          sx={(theme) => ({
            px: 1.25,
            py: 1,
            borderRadius: 2,
            backgroundColor: theme.vars.palette.surface.sunken,
            border: `1px solid ${theme.vars.palette.surface.border}`,
            minWidth: 0,
          })}
        >
          <Typography
            variant="eyebrow"
            component="div"
            sx={{ color: 'text.disabled', fontSize: 9.5 }}
          >
            {label}
          </Typography>
          <Typography
            variant="mono"
            component="div"
            noWrap
            sx={{ fontWeight: 600, fontSize: 12.5 }}
          >
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export function TraitBadge({ label, on }: { label: string; on: boolean }) {
  return (
    <Box
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        pl: 0.75,
        pr: 1.1,
        py: 0.35,
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        color: on ? theme.vars.palette.success.main : theme.vars.palette.text.disabled,
        backgroundColor: on
          ? theme.alpha(theme.vars.palette.success.main, 0.1)
          : theme.vars.palette.surface.sunken,
        border: `1px solid ${on ? theme.alpha(theme.vars.palette.success.main, 0.3) : theme.vars.palette.surface.border}`,
      })}
    >
      {on ? <CheckRounded sx={{ fontSize: 15 }} /> : <CloseRounded sx={{ fontSize: 15 }} />}
      {label}
    </Box>
  );
}

export function AlgorithmDetails({ algorithm }: { algorithm: AlgorithmMeta }) {
  return (
    <Panel eyebrow="How it works" title={algorithm.tagline}>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {algorithm.summary}
      </Typography>

      <Box component="ol" sx={{ m: 0, mb: 2, p: 0, listStyle: 'none', display: 'grid', gap: 1 }}>
        {algorithm.steps.map((text, i) => (
          <Box component="li" key={i} sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
            <Box
              sx={(theme) => ({
                flexShrink: 0,
                width: 22,
                height: 22,
                mt: '1px',
                borderRadius: 1.5,
                display: 'grid',
                placeItems: 'center',
                fontFamily: theme.typography.mono.fontFamily,
                fontSize: 11,
                fontWeight: 700,
                color: theme.vars.palette.primary.light,
                backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.14),
                ...theme.applyStyles('light', { color: theme.vars.palette.primary.main }),
              })}
            >
              {i + 1}
            </Box>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {text}
            </Typography>
          </Box>
        ))}
      </Box>

      <ComplexityGrid algorithm={algorithm} />

      <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
        <TraitBadge label="Stable" on={algorithm.stable} />
        <TraitBadge label="In-place" on={algorithm.inPlace} />
        <TraitBadge label="Comparison-based" on={algorithm.id !== 'radix'} />
      </Box>

      <Typography
        variant="body2"
        sx={(theme) => ({
          mt: 2,
          p: 1.5,
          borderRadius: 2.5,
          color: 'text.secondary',
          backgroundColor: theme.alpha(theme.vars.palette.secondary.main, 0.06),
          border: `1px solid ${theme.alpha(theme.vars.palette.secondary.main, 0.18)}`,
        })}
      >
        <Box component="strong" sx={{ color: 'text.primary' }}>
          When to use it —{' '}
        </Box>
        {algorithm.goodFor}
      </Typography>
    </Panel>
  );
}
