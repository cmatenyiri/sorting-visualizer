import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import FirstPageRounded from '@mui/icons-material/FirstPageRounded';
import LastPageRounded from '@mui/icons-material/LastPageRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import ReplayRounded from '@mui/icons-material/ReplayRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import { keyframes, useTheme, type Theme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { AlgorithmMeta, StepKind } from '../algorithms';
import type { Timeline } from '../engine/timeline';
import type { Player } from '../hooks/usePlayer';
import { ALGORITHM_ICONS } from './algorithmIcons';
import { Bars } from './Bars';
import { Panel } from './Panel';
import { HeapTree } from './visuals/HeapTree';
import { RadixBuckets } from './visuals/RadixBuckets';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 currentColor; }
  70% { box-shadow: 0 0 0 6px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
`;

type Status = 'ready' | 'running' | 'paused' | 'sorted';

const STATUS: Record<Status, { label: string; color: (t: Theme) => string }> = {
  ready: { label: 'Ready', color: (t) => t.vars.palette.text.secondary },
  running: { label: 'Sorting', color: (t) => t.vars.palette.secondary.main },
  paused: { label: 'Paused', color: (t) => t.vars.palette.warning.main },
  sorted: { label: 'Sorted', color: (t) => t.vars.palette.success.main },
};

const KIND_LABEL: Record<StepKind, string> = {
  compare: 'Compare',
  swap: 'Swap',
  write: 'Write',
  read: 'Inspect',
  sorted: 'Settled',
  info: 'Note',
  done: 'Done',
};

const kindColor = (theme: Theme, kind: StepKind | undefined) => {
  const viz = theme.vars.palette.viz;
  switch (kind) {
    case 'compare':
      return viz.compare;
    case 'swap':
      return viz.swap;
    case 'write':
      return viz.write;
    case 'read':
      return viz.read;
    case 'sorted':
    case 'done':
      return viz.sorted;
    default:
      return theme.vars.palette.primary.main;
  }
};

function StatusPill({ status }: { status: Status }) {
  const { label, color } = STATUS[status];
  return (
    <Box
      role="status"
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: 99,
        border: `1px solid ${theme.vars.palette.surface.border}`,
        backgroundColor: theme.vars.palette.surface.sunken,
        color: color(theme),
      })}
    >
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          animation: status === 'running' ? `${pulse} 1.4s infinite` : 'none',
        }}
      />
      <Typography variant="eyebrow" sx={{ color: 'text.primary', fontSize: 10.5 }}>
        {label}
      </Typography>
    </Box>
  );
}

function Legend({ pivotLabel }: { pivotLabel: string | null }) {
  const theme = useTheme();
  const viz = theme.vars.palette.viz;
  const items: [string, string][] = [
    ['Compare', viz.compare],
    ['Swap', viz.swap],
    ['Write', viz.write],
    ['Inspect', viz.read],
    ...(pivotLabel ? ([[pivotLabel, viz.pivot]] as [string, string][]) : []),
    ['Sorted', viz.sorted],
  ];
  return (
    <Box
      sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5, alignItems: 'center' }}
    >
      {items.map(([label, color]) => (
        <Box key={label} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: 0.75,
              backgroundColor: color,
              boxShadow: `0 0 8px -1px ${color}`,
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {label}
          </Typography>
        </Box>
      ))}
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
        <Box
          sx={{
            width: 16,
            height: 10,
            borderRadius: 0.5,
            backgroundColor: viz.range,
            border: `1px dashed ${theme.alpha(theme.vars.palette.primary.main, 0.5)}`,
          }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Active range
        </Typography>
      </Box>
    </Box>
  );
}

const PIVOT_LABEL: Partial<Record<AlgorithmMeta['id'], string>> = {
  quick: 'Pivot',
  insertion: 'Key',
  heap: 'Parent',
};

interface StageProps {
  algorithm: AlgorithmMeta;
  timeline: Timeline;
  player: Player;
}

export function Stage({ algorithm, timeline, player }: StageProps) {
  const { frame, playing } = player;
  const Icon = ALGORITHM_ICONS[algorithm.id];
  const status: Status = frame.done
    ? 'sorted'
    : playing
      ? 'running'
      : frame.index === 0
        ? 'ready'
        : 'paused';
  const step = frame.step;
  const n = timeline.input.length;
  const message =
    step?.message ??
    `${timeline.input.length} items ready. Press play — or step through one operation at a time.`;

  return (
    <Panel
      sx={(theme) => ({
        p: { xs: 2, sm: 2.5 },
        transition: 'border-color 400ms, box-shadow 400ms',
        ...(frame.done && {
          borderColor: theme.alpha(theme.vars.palette.success.main, 0.45),
          boxShadow: `0 0 0 1px ${theme.alpha(theme.vars.palette.success.main, 0.2)}, 0 30px 80px -40px ${theme.vars.palette.success.main}`,
        }),
      })}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          <Box
            sx={(theme) => ({
              width: 42,
              height: 42,
              borderRadius: 2.5,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              backgroundImage: `linear-gradient(140deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.primary.dark})`,
              boxShadow: `0 10px 24px -10px ${theme.vars.palette.viz.glow}`,
              flexShrink: 0,
            })}
          >
            <Icon />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="eyebrow" component="div" sx={{ color: 'text.secondary' }}>
              {algorithm.technique}
            </Typography>
            <Typography variant="h5" component="h2" sx={{ lineHeight: 1.2 }}>
              {algorithm.name}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Tooltip title="Average time complexity">
            <Chip
              size="small"
              label={algorithm.complexity.average}
              sx={{ fontFamily: 'mono.fontFamily' }}
            />
          </Tooltip>
          <Chip size="small" variant="outlined" label={`${timeline.input.length} items`} />
          <StatusPill status={status} />
        </Box>
      </Box>

      <Box
        sx={(theme) => ({
          position: 'relative',
          height: { xs: 240, sm: 320, lg: 'clamp(320px, 46vh, 500px)' },
          px: { xs: 1, sm: 1.5 },
          pt: 1.5,
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: theme.vars.palette.surface.sunken,
          border: `1px solid ${theme.vars.palette.surface.border}`,
          backgroundImage: `repeating-linear-gradient(to top, ${theme.vars.palette.viz.grid} 0 1px, transparent 1px 25%)`,
        })}
      >
        <Bars
          values={frame.values}
          maxValue={timeline.maxValue}
          sorted={frame.sorted}
          step={step}
          done={frame.done}
          pivotLine={algorithm.id === 'quick' || algorithm.id === 'insertion'}
          arcs={(algorithm.id === 'tidal' || algorithm.id === 'heap') && n <= 100}
          digit={algorithm.id === 'radix' ? step?.digit : undefined}
        />
      </Box>

      {algorithm.id === 'heap' && n <= 31 && (
        <Box
          sx={(theme) => ({
            mt: 1.5,
            px: 2,
            py: 1,
            borderRadius: 3,
            backgroundColor: theme.vars.palette.surface.sunken,
            border: `1px solid ${theme.vars.palette.surface.border}`,
          })}
        >
          <Typography variant="eyebrow" component="div" sx={{ color: 'text.secondary', mt: 0.5 }}>
            The same array, seen as a heap
          </Typography>
          <Box sx={{ maxWidth: n > 15 ? 900 : 560, mx: 'auto' }}>
            <HeapTree values={frame.values} sorted={frame.sorted} step={step} done={frame.done} />
          </Box>
        </Box>
      )}
      {algorithm.id === 'radix' && n <= 64 && (
        <Box sx={{ mt: 1.5 }}>
          <RadixBuckets steps={timeline.steps} index={frame.index} maxChips={6} />
        </Box>
      )}

      <Box
        aria-live="polite"
        sx={(theme) => ({
          mt: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          minHeight: 40,
          px: 1.5,
          py: 1,
          borderRadius: 2.5,
          backgroundColor: theme.alpha(theme.vars.palette.surface.raised, 0.7),
          border: `1px solid ${theme.vars.palette.surface.border}`,
        })}
      >
        <Box
          sx={(theme) => ({
            flexShrink: 0,
            fontFamily: 'mono.fontFamily',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            px: 0.9,
            py: 0.35,
            borderRadius: 1,
            minWidth: 64,
            textAlign: 'center',
            color: kindColor(theme, step?.kind),
            backgroundColor: theme.alpha(kindColor(theme, step?.kind), 0.12),
          })}
        >
          {step ? KIND_LABEL[step.kind] : 'Start'}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: { xs: 'normal', sm: 'nowrap' },
          }}
        >
          {message}
        </Typography>
      </Box>

      <Transport player={player} />

      <Box sx={{ mt: 1.5 }}>
        <Legend pivotLabel={PIVOT_LABEL[algorithm.id] ?? null} />
      </Box>
    </Panel>
  );
}

function Transport({ player }: { player: Player }) {
  const { frame, playing } = player;
  const PlayIcon = playing ? PauseRounded : frame.done ? ReplayRounded : PlayArrowRounded;
  const playLabel = playing ? 'Pause' : frame.done ? 'Replay' : 'Play';

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 1.5 },
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Back to start (R)">
          <span>
            <IconButton
              aria-label="Back to start"
              onClick={player.reset}
              disabled={frame.index === 0}
            >
              <FirstPageRounded />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Step back (←)">
          <span>
            <IconButton
              aria-label="Step back"
              onClick={() => player.stepBy(-1)}
              disabled={frame.index === 0}
            >
              <ChevronLeftRounded />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={`${playLabel} (Space)`}>
          <ButtonBase
            aria-label={playLabel}
            onClick={player.toggle}
            sx={(theme) => ({
              width: 52,
              height: 52,
              mx: 0.5,
              borderRadius: '50%',
              color: '#fff',
              backgroundImage: `linear-gradient(140deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.primary.main} 50%, ${theme.vars.palette.primary.dark})`,
              boxShadow: `0 10px 30px -8px ${theme.vars.palette.viz.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
              transition: 'transform 120ms, box-shadow 160ms',
              '&:hover': {
                boxShadow: `0 14px 36px -8px ${theme.vars.palette.viz.glow}, inset 0 1px 0 rgba(255,255,255,0.35)`,
              },
              '&:active': { transform: 'scale(0.96)' },
              '&.Mui-focusVisible': {
                outline: `2px solid ${theme.vars.palette.primary.light}`,
                outlineOffset: 3,
              },
            })}
          >
            <PlayIcon sx={{ fontSize: 30 }} />
          </ButtonBase>
        </Tooltip>
        <Tooltip title="Step forward (→)">
          <span>
            <IconButton
              aria-label="Step forward"
              onClick={() => player.stepBy(1)}
              disabled={frame.done}
            >
              <ChevronRightRounded />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Jump to the end (End)">
          <span>
            <IconButton
              aria-label="Jump to the end"
              onClick={player.skipToEnd}
              disabled={frame.done}
            >
              <LastPageRounded />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 200,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: { xs: 1, sm: 0 },
        }}
      >
        <Slider
          aria-label="Timeline"
          size="small"
          value={frame.index}
          min={0}
          max={Math.max(1, frame.total)}
          onChange={(_, v) => {
            player.pause();
            player.seek(v);
          }}
          sx={{
            '& .MuiSlider-track': { transition: 'none' },
            '& .MuiSlider-thumb': { transition: 'none' },
          }}
        />
        <Typography
          variant="mono"
          sx={{ color: 'text.secondary', whiteSpace: 'nowrap', minWidth: 96, textAlign: 'right' }}
        >
          {frame.index.toLocaleString()}
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {' / '}
            {frame.total.toLocaleString()}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
