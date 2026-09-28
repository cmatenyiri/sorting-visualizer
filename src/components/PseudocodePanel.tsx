import Box from '@mui/material/Box';
import type { AlgorithmMeta } from '../algorithms';
import { Panel } from './Panel';

interface PseudocodePanelProps {
  algorithm: AlgorithmMeta;
  activeLine: number | undefined;
}

export function PseudocodePanel({ algorithm, activeLine }: PseudocodePanelProps) {
  return (
    <Panel eyebrow="Live trace" title="Pseudocode">
      <Box
        component="ol"
        aria-label={`${algorithm.name} pseudocode`}
        sx={(theme) => ({
          m: 0,
          p: 1,
          listStyle: 'none',
          borderRadius: 2.5,
          overflowX: 'auto',
          backgroundColor: theme.vars.palette.surface.sunken,
          border: `1px solid ${theme.vars.palette.surface.border}`,
          fontFamily: theme.typography.mono.fontFamily,
          fontSize: 12.5,
          lineHeight: 1.75,
        })}
      >
        {algorithm.pseudocode.map((line, i) => {
          const active = i === activeLine;
          const isHeader = line.startsWith('procedure');
          const commentAt = line.indexOf('▹');
          const code = commentAt >= 0 ? line.slice(0, commentAt) : line;
          const comment = commentAt >= 0 ? line.slice(commentAt) : '';
          return (
            <Box
              component="li"
              key={i}
              aria-current={active ? 'step' : undefined}
              sx={(theme) => ({
                display: 'flex',
                gap: 1.5,
                px: 1,
                borderRadius: 1.5,
                whiteSpace: 'pre',
                minHeight: line ? undefined : 10,
                color: isHeader
                  ? theme.vars.palette.primary.light
                  : theme.vars.palette.text.secondary,
                transition: 'background-color 120ms, color 120ms',
                ...theme.applyStyles('light', {
                  color: isHeader
                    ? theme.vars.palette.primary.main
                    : theme.vars.palette.text.secondary,
                }),
                ...(active && {
                  color: theme.vars.palette.text.primary,
                  backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.16),
                  boxShadow: `inset 3px 0 0 ${theme.vars.palette.primary.main}`,
                }),
              })}
            >
              <Box
                component="span"
                aria-hidden
                sx={{
                  color: 'text.disabled',
                  minWidth: 16,
                  textAlign: 'right',
                  userSelect: 'none',
                }}
              >
                {line ? i + 1 : ''}
              </Box>
              <span>
                {code}
                {comment && (
                  <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                    {comment}
                  </Box>
                )}
              </span>
            </Box>
          );
        })}
      </Box>
    </Panel>
  );
}
