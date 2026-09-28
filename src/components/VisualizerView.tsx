import Box from '@mui/material/Box';
import { useMemo, useState } from 'react';
import { ALGORITHM_IDS, getAlgorithm, type AlgorithmId, type AlgorithmMeta } from '../algorithms';
import { generateArray, MAX_SIZE, MIN_SIZE, PRESETS, type ArrayPreset } from '../engine/arrays';
import { synth } from '../engine/sound';
import { speedToSps } from '../engine/speed';
import { buildTimeline, type Frame, type Timeline } from '../engine/timeline';
import { useHotkeys } from '../hooks/useHotkeys';
import { isNumber, usePersistentState } from '../hooks/usePersistentState';
import { usePlayer } from '../hooks/usePlayer';
import { AlgorithmDetails } from './AlgorithmDetails';
import { ControlPanel } from './ControlPanel';
import { CustomArrayDialog } from './CustomArrayDialog';
import { PseudocodePanel } from './PseudocodePanel';
import { Stage } from './Stage';
import { StatsPanel } from './StatsPanel';

const isPreset = (v: unknown): v is ArrayPreset => PRESETS.some((p) => p.id === v);
const isSize = (v: unknown): v is number => isNumber(v) && v >= MIN_SIZE && v <= MAX_SIZE;
const isSpeed = (v: unknown): v is number => isNumber(v) && v >= 0 && v <= 100;

interface ArrayState {
  values: number[];
  version: number;
  custom: boolean;
}

interface VisualizerViewProps {
  algorithm: AlgorithmId;
  onAlgorithm: (id: AlgorithmId) => void;
  sound: boolean;
  hotkeysEnabled: boolean;
}

export function VisualizerView({
  algorithm,
  onAlgorithm: setAlgorithm,
  sound,
  hotkeysEnabled,
}: VisualizerViewProps) {
  const [size, setSize] = usePersistentState('sortscape.size', 48, isSize);
  const [preset, setPreset] = usePersistentState<ArrayPreset>(
    'sortscape.preset',
    'random',
    isPreset,
  );
  const [speed, setSpeed] = usePersistentState('sortscape.speed', 58, isSpeed);
  const [data, setData] = useState<ArrayState>(() => ({
    values: generateArray(size, preset),
    version: 0,
    custom: false,
  }));
  const [customOpen, setCustomOpen] = useState(false);

  const timeline = useMemo(() => buildTimeline(algorithm, data.values), [algorithm, data.values]);
  const meta = getAlgorithm(algorithm);

  const regenerate = (nextSize: number, nextPreset: ArrayPreset) =>
    setData((d) => ({
      values: generateArray(nextSize, nextPreset),
      version: d.version + 1,
      custom: false,
    }));

  const changeSize = (next: number) => {
    setSize(next);
    regenerate(next, preset);
  };

  const changePreset = (next: ArrayPreset) => {
    setPreset(next);
    regenerate(data.custom ? size : data.values.length, next);
  };

  const shuffle = () => regenerate(data.custom ? size : data.values.length, preset);

  const applyCustom = (values: number[]) => {
    setData((d) => ({ values, version: d.version + 1, custom: true }));
    if (values.length >= MIN_SIZE) setSize(values.length);
  };

  const shortcuts: Record<string, () => void> = { s: shuffle };
  ALGORITHM_IDS.forEach((id, i) => {
    shortcuts[String(i + 1)] = () => setAlgorithm(id);
  });
  useHotkeys(shortcuts, hotkeysEnabled && !customOpen);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2.5,
        alignItems: 'start',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: '312px minmax(0, 1fr)' },
      }}
    >
      <Box component="aside" sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
        <ControlPanel
          algorithm={algorithm}
          onAlgorithm={setAlgorithm}
          size={data.custom ? data.values.length : size}
          onSize={changeSize}
          preset={data.custom ? 'custom' : preset}
          onPreset={changePreset}
          speed={speed}
          onSpeed={setSpeed}
          onShuffle={shuffle}
          onCustom={() => setCustomOpen(true)}
        />
      </Box>
      <Box
        component="main"
        sx={{ display: 'grid', gap: 2.5, minWidth: 0, gridTemplateColumns: 'minmax(0, 1fr)' }}
      >
        <PlayerSurface
          key={`${algorithm}-${data.version}`}
          algorithm={meta}
          timeline={timeline}
          sps={speedToSps(speed)}
          sound={sound}
          hotkeysEnabled={hotkeysEnabled && !customOpen}
        />
      </Box>
      <CustomArrayDialog
        open={customOpen}
        initial={data.values}
        onClose={() => setCustomOpen(false)}
        onApply={applyCustom}
      />
    </Box>
  );
}

interface PlayerSurfaceProps {
  algorithm: AlgorithmMeta;
  timeline: Timeline;
  sps: number;
  sound: boolean;
  hotkeysEnabled: boolean;
}

function PlayerSurface({ algorithm, timeline, sps, sound, hotkeysEnabled }: PlayerSurfaceProps) {
  const player = usePlayer(timeline, {
    sps,
    onAdvance: sound
      ? (frame: Frame) => {
          const i = frame.step?.a;
          if (i !== undefined && !frame.done) synth.play(frame.values[i] / timeline.maxValue);
        }
      : undefined,
    onFinish: sound ? () => synth.flourish() : undefined,
  });

  useHotkeys(
    {
      ' ': player.toggle,
      ArrowRight: (e) => player.stepBy(e.shiftKey ? 10 : 1),
      ArrowLeft: (e) => player.stepBy(e.shiftKey ? -10 : -1),
      r: player.reset,
      Home: player.reset,
      End: player.skipToEnd,
    },
    hotkeysEnabled,
  );

  return (
    <>
      <Stage algorithm={algorithm} timeline={timeline} player={player} />
      <StatsPanel algorithm={algorithm} timeline={timeline} frame={player.frame} />
      <Box
        sx={(theme) => ({
          display: 'grid',
          gap: 2.5,
          alignItems: 'start',
          gridTemplateColumns: 'minmax(0, 1fr)',
          [theme.breakpoints.up(1320)]: { gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' },
        })}
      >
        <PseudocodePanel algorithm={algorithm} activeLine={player.frame.step?.line} />
        <AlgorithmDetails algorithm={algorithm} />
      </Box>
    </>
  );
}
