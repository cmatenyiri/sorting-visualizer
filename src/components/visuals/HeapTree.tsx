import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { Step } from '../../algorithms';
import { roleColor, rolesFor, type Role } from '../roles';

interface HeapTreeProps {
  values: readonly number[];
  sorted: Uint8Array;
  step: Step | undefined;
  done: boolean;
  height?: number;
}

const ROW = 56;
const RADIUS = 15;

/** Draws the implicit binary tree that Heap Sort sees inside the array. */
export function HeapTree({ values, sorted, step, done, height }: HeapTreeProps) {
  const theme = useTheme();
  const n = values.length;
  const levels = Math.max(1, Math.ceil(Math.log2(n + 1)));
  const width = Math.max(320, 2 ** (levels - 1) * 44);
  const svgHeight = levels * ROW;
  const heapSize = done ? 0 : (step?.heapSize ?? n);
  const roles = done ? new Map<number, Role>() : rolesFor(step);

  const pos = (i: number) => {
    const level = Math.floor(Math.log2(i + 1));
    const first = 2 ** level - 1;
    const slots = 2 ** level;
    return { x: ((i - first + 0.5) / slots) * width, y: ROW / 2 + level * ROW };
  };

  return (
    <Box
      component="svg"
      role="img"
      aria-label="Heap drawn as a binary tree"
      viewBox={`0 0 ${width} ${svgHeight}`}
      sx={{ width: '100%', height: height ?? 'auto', maxHeight: svgHeight, display: 'block' }}
    >
      {values.map((_, i) => {
        if (i === 0) return null;
        const parent = (i - 1) >> 1;
        const a = pos(parent);
        const b = pos(i);
        const inHeap = i < heapSize;
        return (
          <line
            key={`e${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={
              inHeap ? theme.vars.palette.surface.borderStrong : theme.vars.palette.surface.border
            }
            strokeWidth={1.5}
            strokeDasharray={inHeap ? undefined : '3 4'}
          />
        );
      })}
      {values.map((value, i) => {
        const { x, y } = pos(i);
        const role = roles.get(i);
        const isSorted = done || sorted[i] === 1;
        const fill = role
          ? roleColor(theme, role)
          : isSorted
            ? theme.alpha(theme.vars.palette.viz.sorted, 0.3)
            : theme.vars.palette.surface.raised;
        const stroke = role
          ? roleColor(theme, role)
          : isSorted
            ? theme.alpha(theme.vars.palette.viz.sorted, 0.6)
            : theme.vars.palette.surface.borderStrong;
        return (
          <g
            key={`n${i}`}
            style={{ transition: 'opacity 200ms' }}
            opacity={i < heapSize || isSorted ? 1 : 0.5}
          >
            <circle
              cx={x}
              cy={y}
              r={RADIUS}
              fill={fill}
              stroke={stroke}
              strokeWidth={1.5}
              style={{ transition: 'fill 140ms, stroke 140ms' }}
            />
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize={11.5}
              fontWeight={700}
              fontFamily={theme.typography.mono.fontFamily}
              fill={role ? '#0B0B14' : theme.vars.palette.text.primary}
            >
              {value}
            </text>
            <text
              x={x + RADIUS + 3}
              y={y - RADIUS + 4}
              fontSize={8.5}
              fontFamily={theme.typography.mono.fontFamily}
              fill={theme.vars.palette.text.disabled}
            >
              {i}
            </text>
          </g>
        );
      })}
    </Box>
  );
}
