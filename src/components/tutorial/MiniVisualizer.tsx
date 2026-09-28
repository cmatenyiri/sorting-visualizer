import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import ReplayRounded from '@mui/icons-material/ReplayRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import type { AlgorithmId } from '../../algorithms';
import { buildTimeline, type Timeline } from '../../engine/timeline';
import { usePlayer } from '../../hooks/usePlayer';
import { Bars } from '../Bars';
import { HeapTree } from '../visuals/HeapTree';
import { RadixBuckets } from '../visuals/RadixBuckets';

interface MiniVisualizerProps {
  algorithm: AlgorithmId;
  input: readonly number[];
  /** Base steps per second (multiplied by the speed toggle). */
  sps?: number;
  /** Hide narration and controls — for purely decorative loops. */
  bare?: boolean;
  barsHeight?: number;
}

export function MiniVisualizer({
  algorithm,
  input,
  sps = 3,
  bare = false,
  barsHeight = 180,
}: MiniVisualizerProps) {
  const timeline = useMemo(() => buildTimeline(algorithm, input), [algorithm, input]);
  return (
    <MiniPlayer
      key={`${algorithm}-${input.join(',')}`}
      algorithm={algorithm}
      timeline={timeline}
      sps={sps}
      bare={bare}
      barsHeight={barsHeight}
    />
  );
}

interface MiniPlayerProps {
  algorithm: AlgorithmId;
  timeline: Timeline;
  sps: number;
  bare: boolean;
  barsHeight: number;
}

function MiniPlayer({ algorithm, timeline, sps, bare, barsHeight }: MiniPlayerProps) {
  const [rate, setRate] = useState(1);
  const player = usePlayer(timeline, {
    sps: sps * rate,
    autoPlay: true,
    loop: true,
    loopDelay: 2200,
  });
  const { frame } = player;
  const step = frame.step;

  const bars = (
    <Box sx={{ height: barsHeight }}>
      <Bars
        values={frame.values}
        maxValue={timeline.maxValue}
        sorted={frame.sorted}
        step={step}
        done={frame.done}
        labels={!bare}
        pivotLine={algorithm === 'quick' || algorithm === 'insertion'}
        arcs={algorithm === 'tidal' || algorithm === 'heap'}
        digit={algorithm === 'radix' ? step?.digit : undefined}
        compact={bare}
        animMs={Math.min(260, 600 / (sps * rate))}
      />
    </Box>
  );

  if (bare) return bars;

  return (
    <Box sx={{ display: 'grid', gap: 1.5, width: '100%' }}>
      {bars}

      {algorithm === 'heap' && (
        <Box sx={{ px: 1 }}>
          <HeapTree values={frame.values} sorted={frame.sorted} step={step} done={frame.done} />
        </Box>
      )}
      {algorithm === 'radix' && (
        <RadixBuckets steps={timeline.steps} index={frame.index} maxChips={4} />
      )}

      <Box
        aria-live="polite"
        sx={(theme) => ({
          minHeight: 44,
          px: 1.5,
          py: 1,
          borderRadius: 2.5,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.alpha(theme.vars.palette.surface.raised, 0.8),
          border: `1px solid ${theme.vars.palette.surface.border}`,
        })}
      >
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          {frame.done ? 'Sorted! Replaying in a moment…' : (step?.message ?? 'Starting…')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={player.playing ? 'Pause' : 'Play'}>
          <IconButton
            size="small"
            aria-label={player.playing ? 'Pause illustration' : 'Play illustration'}
            onClick={player.toggle}
          >
            {player.playing ? <PauseRounded /> : <PlayArrowRounded />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Restart">
          <IconButton
            size="small"
            aria-label="Restart illustration"
            onClick={() => {
              player.reset();
              player.play();
            }}
          >
            <ReplayRounded />
          </IconButton>
        </Tooltip>
        <Box
          sx={(theme) => ({
            flex: 1,
            height: 4,
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: theme.vars.palette.surface.borderStrong,
          })}
        >
          <Box
            sx={(theme) => ({
              height: '100%',
              width: `${(frame.index / Math.max(1, frame.total)) * 100}%`,
              backgroundImage: `linear-gradient(90deg, ${theme.vars.palette.secondary.main}, ${theme.vars.palette.primary.main})`,
            })}
          />
        </Box>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={rate}
          onChange={(_, v: number | null) => v && setRate(v)}
          aria-label="Illustration speed"
          sx={{ p: 0.25, '& .MuiToggleButton-root': { px: 1, py: 0.25, fontSize: 11 } }}
        >
          <ToggleButton value={1}>1×</ToggleButton>
          <ToggleButton value={2}>2×</ToggleButton>
          <ToggleButton value={4}>4×</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
