import CheckRounded from '@mui/icons-material/CheckRounded';
import Box from '@mui/material/Box';
import { keyframes, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Kbd } from '../ShortcutsDialog';

const CARDS = [42, 7, 88, 19, 63, 3, 55, 29];
const RANK = new Map([...CARDS].sort((a, b) => a - b).map((v, i) => [v, i]));

/** Eight numbered cards that shuffle into sorted order and back. */
export function ShuffleCards() {
  const theme = useTheme();
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSorted((s) => !s), 2600);
    return () => clearInterval(id);
  }, []);

  const slot = 100 / CARDS.length;
  return (
    <Box sx={{ width: '100%', maxWidth: 520 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          variant="eyebrow"
          sx={{ color: sorted ? 'text.disabled' : 'text.primary', transition: 'color 300ms' }}
        >
          Unsorted input
        </Typography>
        <Typography
          variant="eyebrow"
          sx={{ color: sorted ? 'success.main' : 'text.disabled', transition: 'color 300ms' }}
        >
          Sorted output
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', height: 150 }}>
        {CARDS.map((value, i) => {
          const at = sorted ? (RANK.get(value) ?? i) : i;
          return (
            <Box
              key={value}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `calc(${slot}% - 8px)`,
                height: '100%',
                transform: `translateX(calc(${at * 100}% + ${at * 8}px))`,
                transition: `transform 900ms cubic-bezier(.65,0,.25,1) ${i * 40}ms`,
                borderRadius: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                p: 0.75,
                gap: 0.75,
                backgroundColor: theme.vars.palette.surface.raised,
                border: `1px solid ${sorted ? theme.alpha(theme.vars.palette.viz.sorted, 0.5) : theme.vars.palette.surface.borderStrong}`,
                boxShadow: '0 10px 24px -14px rgba(0,0,0,0.6)',
              }}
            >
              <Box
                sx={{
                  width: '70%',
                  height: `${(value / 88) * 80}px`,
                  borderRadius: 1,
                  backgroundColor: sorted
                    ? theme.vars.palette.viz.sorted
                    : `color-mix(in oklab, ${theme.vars.palette.viz.barHigh} ${Math.round((value / 88) * 100)}%, ${theme.vars.palette.viz.barLow})`,
                  transition: 'background-color 500ms',
                }}
              />
              <Typography variant="mono" sx={{ fontWeight: 700, fontSize: 14 }}>
                {value}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          color: sorted ? 'success.main' : 'text.secondary',
          transition: 'color 300ms',
        }}
      >
        {sorted && <CheckRounded fontSize="small" />}
        <Typography variant="mono" sx={{ fontSize: 12.5 }}>
          {sorted ? 'a₀ ≤ a₁ ≤ a₂ ≤ … ≤ aₙ₋₁' : 'same values, any order'}
        </Typography>
      </Box>
    </Box>
  );
}

const draw = keyframes`
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
`;

/** n, n log n and n² plotted together to show how quickly quadratic work explodes. */
export function GrowthChart() {
  const theme = useTheme();
  const W = 460;
  const H = 280;
  const pad = { l: 36, r: 64, t: 16, b: 32 };
  const maxN = 40;
  const maxY = 420;
  const x = (n: number) => pad.l + (n / maxN) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (Math.min(v, maxY) / maxY) * (H - pad.t - pad.b);

  const curve = (f: (n: number) => number) => {
    const pts: string[] = [];
    for (let n = 1; n <= maxN; n += 0.25) {
      const v = f(n);
      pts.push(`${x(n).toFixed(1)},${y(v).toFixed(1)}`);
      if (v > maxY) break;
    }
    return `M ${pts.join(' L ')}`;
  };

  const { series1, series2, series3 } = theme.vars.palette.viz;
  const series = [
    { label: 'n²', f: (n: number) => n * n, color: series2, delay: 0.5 },
    { label: 'n log n', f: (n: number) => n * Math.log2(n), color: series1, delay: 0.25 },
    { label: 'n', f: (n: number) => n, color: series3, delay: 0 },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 520 }}>
      <Box
        component="svg"
        viewBox={`0 0 ${W} ${H}`}
        sx={{ width: '100%', display: 'block' }}
        role="img"
        aria-label="Growth of n, n log n and n squared"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={pad.l}
            x2={W - pad.r}
            y1={y(t * maxY)}
            y2={y(t * maxY)}
            stroke={theme.vars.palette.viz.grid}
            strokeWidth={1}
          />
        ))}
        <line
          x1={pad.l}
          x2={pad.l}
          y1={pad.t}
          y2={H - pad.b}
          stroke={theme.vars.palette.surface.borderStrong}
        />
        <line
          x1={pad.l}
          x2={W - pad.r}
          y1={H - pad.b}
          y2={H - pad.b}
          stroke={theme.vars.palette.surface.borderStrong}
        />
        <text
          x={W - pad.r}
          y={H - 10}
          textAnchor="end"
          fontSize={11}
          fill={theme.vars.palette.text.secondary}
          fontFamily={theme.typography.mono.fontFamily}
        >
          input size n →
        </text>
        <text
          x={pad.l - 8}
          y={pad.t + 4}
          textAnchor="end"
          fontSize={11}
          fill={theme.vars.palette.text.secondary}
          fontFamily={theme.typography.mono.fontFamily}
        >
          ops
        </text>
        {series.map((s) => {
          const d = curve(s.f);
          const last = d.split(' L ').pop()?.replace('M ', '').split(',') ?? ['0', '0'];
          return (
            <g key={s.label}>
              <Box
                component="path"
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                sx={{
                  strokeDasharray: 1,
                  strokeDashoffset: 1,
                  animation: `${draw} 1.4s ${s.delay}s cubic-bezier(.3,.7,.3,1) forwards`,
                }}
              />
              <circle
                cx={Number(last[0])}
                cy={Number(last[1])}
                r={4}
                fill={s.color}
                stroke={theme.vars.palette.surface.sunken}
                strokeWidth={2}
              />
              <text
                x={Number(last[0]) + 10}
                y={Number(last[1]) + 4}
                fontSize={12.5}
                fontWeight={700}
                fill={theme.vars.palette.text.primary}
                fontFamily={theme.typography.mono.fontFamily}
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </Box>
      <Box
        sx={{
          mt: 1.5,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
        }}
      >
        {[
          ['n', '1 million', series3],
          ['n log₂ n', '≈ 20 million', series1],
          ['n²', '1 trillion', series2],
        ].map(([label, value, color]) => (
          <Box
            key={label}
            sx={{
              p: 1.25,
              borderRadius: 2,
              backgroundColor: theme.vars.palette.surface.sunken,
              border: `1px solid ${theme.vars.palette.surface.border}`,
            }}
          >
            <Typography
              variant="mono"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              <Box
                component="span"
                sx={{ width: 12, height: 2, borderRadius: 1, backgroundColor: color }}
              />
              {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography
        variant="caption"
        component="p"
        sx={{ color: 'text.secondary', mt: 1, textAlign: 'center' }}
      >
        Operations needed to sort one million items
      </Typography>
    </Box>
  );
}

const KEYS: [string[], string][] = [
  [['Space'], 'Play / pause'],
  [['←', '→'], 'Step through operations'],
  [['1', '–', '7'], 'Switch algorithm'],
  [['S'], 'Shuffle new data'],
  [['R'], 'Rewind to start'],
  [['M'], 'Toggle sound'],
  [['T'], 'Reopen this tour'],
  [['?'], 'All shortcuts'],
];

export function KeyboardMap() {
  return (
    <Box sx={{ width: '100%', maxWidth: 440, display: 'grid', gap: 1.25 }}>
      {KEYS.map(([keys, label]) => (
        <Box
          key={label}
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: 1.75,
            py: 1.1,
            borderRadius: 2.5,
            backgroundColor: theme.alpha(theme.vars.palette.surface.raised, 0.7),
            border: `1px solid ${theme.vars.palette.surface.border}`,
          })}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            {keys.map((k) => (
              <Kbd key={k}>{k}</Kbd>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
