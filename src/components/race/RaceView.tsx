import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import FlagRounded from '@mui/icons-material/FlagRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import ReplayRounded from '@mui/icons-material/ReplayRounded';
import ShuffleRounded from '@mui/icons-material/ShuffleRounded';
import SkipNextRounded from '@mui/icons-material/SkipNextRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Slider from '@mui/material/Slider';
import { useTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { ALGORITHMS, ALGORITHM_IDS, getAlgorithm, type AlgorithmId } from '../../algorithms';
import { generateArray, PRESETS, type ArrayPreset } from '../../engine/arrays';
import { formatSps, speedToSps } from '../../engine/speed';
import { buildTimeline, type Timeline } from '../../engine/timeline';
import { useHotkeys } from '../../hooks/useHotkeys';
import { ALGORITHM_ICONS } from '../algorithmIcons';
import { Bars } from '../Bars';
import { Panel } from '../Panel';
import { useRace, type RaceLaneState } from './useRace';

const MIN_RACE_SIZE = 8;
const MAX_RACE_SIZE = 120;

interface RaceViewProps {
  hotkeysEnabled: boolean;
}

export function RaceView({ hotkeysEnabled }: RaceViewProps) {
  const [selected, setSelected] = useState<AlgorithmId[]>(() => [...ALGORITHM_IDS]);
  const [size, setSize] = useState(40);
  const [preset, setPreset] = useState<ArrayPreset>('random');
  const [speed, setSpeed] = useState(62);
  const [data, setData] = useState(() => ({ values: generateArray(40, 'random'), version: 0 }));

  const timelines = useMemo(
    () => selected.map((id) => buildTimeline(id, data.values)),
    [selected, data.values],
  );

  const regenerate = (nextSize = size, nextPreset = preset) =>
    setData((d) => ({ values: generateArray(nextSize, nextPreset), version: d.version + 1 }));

  const toggle = (id: AlgorithmId) =>
    setSelected((current) => {
      if (current.includes(id))
        return current.length > 2 ? current.filter((x) => x !== id) : current;
      return ALGORITHM_IDS.filter((x) => x === id || current.includes(x));
    });

  useHotkeys({ s: () => regenerate() }, hotkeysEnabled);

  return (
    <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: 'minmax(0, 1fr)' }}>
      <Panel
        eyebrow="Race mode"
        title="Same array, every algorithm, one operation per tick"
        action={
          <Tooltip title="New array (S)">
            <Button
              variant="outlined"
              size="small"
              startIcon={<ShuffleRounded />}
              onClick={() => regenerate()}
            >
              Shuffle
            </Button>
          </Tooltip>
        }
      >
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 2, md: 3 },
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr)',
            },
            alignItems: 'start',
          }}
        >
          <Box>
            <Typography variant="eyebrow" component="div" sx={{ color: 'text.secondary', mb: 1 }}>
              Contestants · {selected.length}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {ALGORITHMS.map((algo) => {
                const Icon = ALGORITHM_ICONS[algo.id];
                const on = selected.includes(algo.id);
                return (
                  <Chip
                    key={algo.id}
                    icon={<Icon sx={{ fontSize: 16 }} />}
                    label={algo.name.replace(' Sort', '')}
                    onClick={() => toggle(algo.id)}
                    aria-pressed={on}
                    sx={(theme) => ({
                      height: 30,
                      transition: 'all 140ms',
                      ...(on
                        ? {
                            color: theme.vars.palette.text.primary,
                            borderColor: theme.alpha(theme.vars.palette.primary.main, 0.6),
                            backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.16),
                            '& .MuiChip-icon': { color: theme.vars.palette.primary.light },
                          }
                        : {
                            color: theme.vars.palette.text.disabled,
                            backgroundColor: 'transparent',
                          }),
                    })}
                  />
                );
              })}
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="eyebrow" sx={{ color: 'text.secondary' }}>
                Array size
              </Typography>
              <Typography variant="mono" sx={{ fontWeight: 600 }}>
                {size}
              </Typography>
            </Box>
            <Slider
              aria-label="Race array size"
              size="small"
              value={size}
              min={MIN_RACE_SIZE}
              max={MAX_RACE_SIZE}
              onChange={(_, v) => {
                setSize(v);
                regenerate(v, preset);
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, mt: 1 }}>
              <Typography variant="eyebrow" sx={{ color: 'text.secondary' }}>
                Speed
              </Typography>
              <Typography variant="mono" sx={{ fontWeight: 600 }}>
                {formatSps(speedToSps(speed))}
              </Typography>
            </Box>
            <Slider
              aria-label="Race speed"
              size="small"
              value={speed}
              min={0}
              max={100}
              onChange={(_, v) => setSpeed(v)}
            />
          </Box>
          <Box>
            <Typography variant="eyebrow" component="div" sx={{ color: 'text.secondary', mb: 1 }}>
              Starting order
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={preset}
              onChange={(_, v: ArrayPreset | null) => {
                if (!v) return;
                setPreset(v);
                regenerate(size, v);
              }}
              aria-label="Race starting order"
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}
            >
              {PRESETS.map((p) => (
                <ToggleButton key={p.id} value={p.id} size="small">
                  {p.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Panel>

      <RaceArena
        key={`${data.version}-${selected.join(',')}`}
        timelines={timelines}
        sps={speedToSps(speed)}
        hotkeysEnabled={hotkeysEnabled}
      />
    </Box>
  );
}

const MEDALS = ['#FFD166', '#C9D1E6', '#E3A36B'];

function placeLabel(place: number) {
  const suffix = place === 1 ? 'st' : place === 2 ? 'nd' : place === 3 ? 'rd' : 'th';
  return `${place}${suffix}`;
}

function RaceArena({
  timelines,
  sps,
  hotkeysEnabled,
}: {
  timelines: Timeline[];
  sps: number;
  hotkeysEnabled: boolean;
}) {
  const race = useRace(timelines, sps);
  const theme = useTheme();

  // Places are decided by total operations; ties share a place.
  const totals = race.lanes.map((l) => l.totalOps);
  const sortedTotals = [...new Set(totals)].sort((a, b) => a - b);
  const placeOf = (i: number) => sortedTotals.indexOf(totals[i]) + 1;
  const finishedCount = race.lanes.filter((l) => l.finished).length;
  const started = race.ticks > 0;
  const allDone = race.ticks >= race.finishTicks;

  useHotkeys(
    {
      ' ': race.playing ? race.pause : race.play,
      r: race.reset,
      End: race.finish,
    },
    hotkeysEnabled,
  );

  const standings = race.lanes
    .map((lane, i) => ({ lane, i, timeline: timelines[i] }))
    .sort((a, b) => {
      if (a.lane.finished && b.lane.finished) return a.lane.totalOps - b.lane.totalOps;
      if (a.lane.finished !== b.lane.finished) return a.lane.finished ? -1 : 1;
      return b.lane.ops / b.lane.totalOps - a.lane.ops / a.lane.totalOps;
    });

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2.5,
        alignItems: 'start',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 320px' },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
      >
        {race.lanes.map((lane, i) => (
          <LaneCard
            key={timelines[i].algorithm}
            timeline={timelines[i]}
            lane={lane}
            place={lane.finished ? placeOf(i) : null}
          />
        ))}
      </Box>

      <Panel
        eyebrow="Leaderboard"
        title={allDone ? 'Final standings' : started ? 'Live standings' : 'Ready to race'}
        sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={
              race.playing ? <PauseRounded /> : allDone ? <ReplayRounded /> : <PlayArrowRounded />
            }
            onClick={race.playing ? race.pause : race.play}
          >
            {race.playing ? 'Pause' : allDone ? 'Race again' : started ? 'Resume' : 'Start race'}
          </Button>
          <Tooltip title="Reset (R)">
            <span>
              <Button
                variant="outlined"
                onClick={race.reset}
                disabled={!started}
                sx={{ minWidth: 0, px: 1.25 }}
                aria-label="Reset race"
              >
                <ReplayRounded />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Skip to the finish (End)">
            <span>
              <Button
                variant="outlined"
                onClick={race.finish}
                disabled={allDone}
                sx={{ minWidth: 0, px: 1.25 }}
                aria-label="Skip to finish"
              >
                <SkipNextRounded />
              </Button>
            </span>
          </Tooltip>
        </Box>

        <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gap: 1 }}>
          {standings.map(({ lane, i, timeline }, row) => {
            const algo = getAlgorithm(timeline.algorithm);
            const place = lane.finished ? placeOf(i) : null;
            const medal = place && place <= 3 ? MEDALS[place - 1] : undefined;
            const pct = (lane.ops / Math.max(1, lane.totalOps)) * 100;
            return (
              <Box
                component="li"
                key={algo.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr auto',
                  alignItems: 'center',
                  columnGap: 1,
                  rowGap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'mono.fontFamily',
                    fontSize: 11,
                    fontWeight: 700,
                    color: medal ? '#1A1405' : 'text.secondary',
                    backgroundColor: medal ?? theme.vars.palette.surface.sunken,
                    border: medal ? 'none' : `1px solid ${theme.vars.palette.surface.border}`,
                  }}
                >
                  {place ?? row + 1}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {algo.name}
                </Typography>
                <Typography
                  variant="mono"
                  sx={{ fontSize: 11.5, color: lane.finished ? 'success.main' : 'text.secondary' }}
                >
                  {lane.finished ? `${lane.totalOps.toLocaleString()} ops` : `${Math.floor(pct)}%`}
                </Typography>
                <Box
                  sx={{
                    gridColumn: '2 / -1',
                    height: 4,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: theme.vars.palette.surface.sunken,
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: lane.finished
                        ? theme.vars.palette.viz.sorted
                        : theme.vars.palette.primary.main,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        <Typography variant="caption" component="p" sx={{ color: 'text.disabled', mt: 2 }}>
          Each tick every contestant performs one operation — a comparison, swap, write or read — so
          the finishing order reflects the total work each algorithm needs for this input.
          {finishedCount > 0 && !allDone && ` ${finishedCount} of ${race.lanes.length} finished.`}
        </Typography>
      </Panel>
    </Box>
  );
}

function LaneCard({
  timeline,
  lane,
  place,
}: {
  timeline: Timeline;
  lane: RaceLaneState;
  place: number | null;
}) {
  const algo = getAlgorithm(timeline.algorithm);
  const Icon = ALGORITHM_ICONS[algo.id];
  const medal = place && place <= 3 ? MEDALS[place - 1] : undefined;
  const step = lane.frame.step;

  return (
    <Box
      sx={(theme) => ({
        p: 1.75,
        borderRadius: 4,
        backgroundColor: theme.alpha(theme.vars.palette.surface.base, 0.72),
        backdropFilter: 'blur(14px)',
        border: `1px solid ${
          place === 1
            ? theme.alpha('#FFD166', 0.55)
            : lane.finished
              ? theme.alpha(theme.vars.palette.success.main, 0.35)
              : theme.vars.palette.surface.border
        }`,
        boxShadow: place === 1 ? '0 20px 60px -30px rgba(255, 209, 102, 0.7)' : 'none',
        transition: 'border-color 300ms, box-shadow 300ms',
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
        <Icon sx={{ fontSize: 18, color: 'primary.light' }} />
        <Typography
          sx={{ fontFamily: 'h6.fontFamily', fontWeight: 600, fontSize: '0.95rem', flex: 1 }}
          noWrap
        >
          {algo.name}
        </Typography>
        {place ? (
          <Box
            sx={(theme) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: 99,
              fontSize: 11.5,
              fontWeight: 700,
              color: medal ? '#1A1405' : theme.vars.palette.text.primary,
              backgroundColor: medal ?? theme.vars.palette.surface.raised,
            })}
          >
            {place === 1 ? (
              <EmojiEventsRounded sx={{ fontSize: 14 }} />
            ) : (
              <FlagRounded sx={{ fontSize: 14 }} />
            )}
            {placeLabel(place)}
          </Box>
        ) : (
          <Typography variant="mono" sx={{ fontSize: 11, color: 'text.disabled' }}>
            {algo.complexity.average}
          </Typography>
        )}
      </Box>
      <Box
        sx={(theme) => ({
          height: 132,
          px: 0.75,
          pt: 0.75,
          borderRadius: 2.5,
          backgroundColor: theme.vars.palette.surface.sunken,
          border: `1px solid ${theme.vars.palette.surface.border}`,
          overflow: 'hidden',
        })}
      >
        <Bars
          values={lane.frame.values}
          maxValue={timeline.maxValue}
          sorted={lane.frame.sorted}
          step={step}
          done={lane.frame.done}
          compact
          labels={false}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.25, gap: 1 }}>
        {(
          [
            ['ops', lane.ops],
            ['cmp', step?.comparisons ?? 0],
            ['writes', step?.writes ?? 0],
          ] as const
        ).map(([label, value]) => (
          <Box key={label}>
            <Typography variant="mono" component="div" sx={{ fontWeight: 600, fontSize: 13 }}>
              {value.toLocaleString()}
            </Typography>
            <Typography
              variant="eyebrow"
              component="div"
              sx={{ fontSize: 9, color: 'text.disabled' }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
