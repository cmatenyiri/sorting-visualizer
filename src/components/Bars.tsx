import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { memo, type CSSProperties } from 'react';
import type { Step } from '../algorithms';
import { roleColor, rolesFor, type Role } from './roles';

export interface BarsProps {
  values: readonly number[];
  maxValue: number;
  sorted: Uint8Array;
  step?: Step;
  done?: boolean;
  /** Draw value labels above the bars. `auto` enables them for small arrays. */
  labels?: boolean | 'auto';
  /** Draw a dashed threshold line at the pivot's height across the active range. */
  pivotLine?: boolean;
  /** Connect far-apart compared/swapped bars with an arc (gap-based algorithms). */
  arcs?: boolean;
  showRange?: boolean;
  /** Highlight this place value (1, 10, 100…) inside labels — used by Radix Sort. */
  digit?: number;
  /** Reduce chrome for small multiples such as race lanes. */
  compact?: boolean;
  /** Height transition in ms; longer looks smoother at slow playback speeds. */
  animMs?: number;
}

function DigitLabel({ value, digit }: { value: number; digit: number }) {
  const text = String(value);
  const place = Math.round(Math.log10(digit));
  const index = text.length - 1 - place;
  if (index < 0) {
    return (
      <>
        <span className="digit">0</span>
        {text}
      </>
    );
  }
  return (
    <>
      {text.slice(0, index)}
      <span className="digit">{text[index]}</span>
      {text.slice(index + 1)}
    </>
  );
}

function BarsImpl({
  values,
  maxValue,
  sorted,
  step,
  done = false,
  labels = 'auto',
  pivotLine = false,
  arcs = false,
  showRange = true,
  digit,
  compact = false,
  animMs = 80,
}: BarsProps) {
  const theme = useTheme();
  const viz = theme.vars.palette.viz;
  const n = values.length;
  const showLabels = labels === 'auto' ? n <= 28 && !compact : labels;
  const roles = done ? new Map<number, Role>() : rolesFor(step);
  const gap = n > 140 ? 0.5 : n > 80 ? 1 : n > 40 ? 2 : compact ? 2 : 4;
  const range = !done && showRange ? step?.range : undefined;
  const pivotValue =
    pivotLine && !done && step?.pivot !== undefined ? values[step.pivot] : undefined;
  const sweep = Math.min(8, 900 / Math.max(1, n));

  const arc =
    arcs &&
    !done &&
    step &&
    (step.kind === 'compare' || step.kind === 'swap') &&
    step.a !== undefined &&
    step.b !== undefined &&
    Math.abs(step.a - step.b) > 1
      ? { a: step.a, b: step.b, color: roleColor(theme, step.kind === 'swap' ? 'swap' : 'compare') }
      : null;

  return (
    <Box sx={{ height: '100%', pt: showLabels ? 3 : 0, boxSizing: 'border-box' }}>
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          '& .slot': {
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            flex: '1 1 0',
            minWidth: 0,
          },
          '& .bar': {
            position: 'relative',
            width: '100%',
            borderRadius: n > 80 ? '1px 1px 0 0' : compact ? '2px 2px 0 0' : '5px 5px 2px 2px',
            transition: `height ${animMs}ms ease-out, background-color 140ms, box-shadow 140ms`,
            willChange: 'height',
          },
          '& .bar.done': {
            transition: `height ${animMs}ms ease-out, background-color 360ms ease-out, box-shadow 360ms`,
            transitionDelay: 'calc(var(--i) * var(--sweep))',
          },
          '& .label': {
            position: 'absolute',
            left: '50%',
            bottom: '100%',
            transform: 'translate(-50%, -4px)',
            fontFamily: theme.typography.mono.fontFamily,
            fontSize: n > 20 ? 10 : 12,
            fontWeight: 600,
            color: theme.vars.palette.text.secondary,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          },
          '& .label.hot': { color: theme.vars.palette.text.primary },
          '& .digit': { color: viz.compare, fontWeight: 800 },
        }}
      >
        {range && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${(range[0] / n) * 100}%`,
              width: `${((range[1] - range[0] + 1) / n) * 100}%`,
              background: viz.range,
              borderInline: `1px dashed ${theme.alpha(theme.vars.palette.primary.main, 0.35)}`,
              borderRadius: 1,
              transition: 'left 120ms ease-out, width 120ms ease-out',
              pointerEvents: 'none',
            }}
          />
        )}
        {range && pivotValue !== undefined && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              left: `${(range[0] / n) * 100}%`,
              width: `${((range[1] - range[0] + 1) / n) * 100}%`,
              bottom: `${(pivotValue / maxValue) * 100}%`,
              borderTop: `1.5px dashed ${viz.pivot}`,
              opacity: 0.8,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        )}
        {arc && (
          <Box
            component="svg"
            aria-hidden
            viewBox={`0 0 ${n} 100`}
            preserveAspectRatio="none"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            {(() => {
              const xa = arc.a + 0.5;
              const xb = arc.b + 0.5;
              const top = 100 - (Math.max(values[arc.a], values[arc.b]) / maxValue) * 100;
              const lift = Math.min(top, 6 + Math.abs(xb - xa) * (40 / n));
              const ya = 100 - (values[arc.a] / maxValue) * 100;
              const yb = 100 - (values[arc.b] / maxValue) * 100;
              return (
                <path
                  d={`M ${xa} ${ya} C ${xa} ${top - lift}, ${xb} ${top - lift}, ${xb} ${yb}`}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={1.75}
                  strokeDasharray="4 3"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })()}
          </Box>
        )}
        {values.map((value, i) => {
          const role = roles.get(i);
          const isSorted = done || sorted[i] === 1;
          const ratio = value / maxValue;
          let color: string;
          if (role) color = roleColor(theme, role);
          else if (isSorted) color = viz.sorted;
          else
            color = `color-mix(in oklab, ${viz.barHigh} ${Math.round(ratio * 100)}%, ${viz.barLow})`;
          const style: CSSProperties & Record<'--i' | '--sweep', string | number> = {
            height: `${Math.max(ratio * 100, 0.8)}%`,
            backgroundColor: color,
            boxShadow: role ? `0 0 ${compact ? 8 : 16}px -2px ${color}` : undefined,
            '--i': i,
            '--sweep': `${sweep}ms`,
          };
          return (
            <div className="slot" key={i} style={{ paddingInline: gap / 2 }}>
              <div className={done ? 'bar done' : 'bar'} style={style}>
                {showLabels && (
                  <span className={role ? 'label hot' : 'label'}>
                    {digit ? <DigitLabel value={value} digit={digit} /> : value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </Box>
    </Box>
  );
}

export const Bars = memo(BarsImpl);
