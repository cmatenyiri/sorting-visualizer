import EditNoteRounded from '@mui/icons-material/EditNoteRounded';
import ShuffleRounded from '@mui/icons-material/ShuffleRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ALGORITHMS, type AlgorithmId } from '../algorithms';
import type { ReactNode } from 'react';
import { MAX_SIZE, MIN_SIZE, PRESETS, type ArrayPreset } from '../engine/arrays';
import { formatSps, speedLabel, speedToSps } from '../engine/speed';
import { ALGORITHM_ICONS } from './algorithmIcons';
import { Panel } from './Panel';

interface ControlPanelProps {
  algorithm: AlgorithmId;
  onAlgorithm: (id: AlgorithmId) => void;
  size: number;
  onSize: (size: number) => void;
  preset: ArrayPreset | 'custom';
  onPreset: (preset: ArrayPreset) => void;
  speed: number;
  onSpeed: (speed: number) => void;
  onShuffle: () => void;
  onCustom: () => void;
}

function SectionLabel({ children, value }: { children: string; value?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="eyebrow" sx={{ color: 'text.secondary' }}>
        {children}
      </Typography>
      {value && (
        <Typography variant="mono" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {value}
        </Typography>
      )}
    </Box>
  );
}

export function ControlPanel(props: ControlPanelProps) {
  const { algorithm, onAlgorithm, size, onSize, preset, onPreset, speed, onSpeed } = props;
  const sps = speedToSps(speed);

  return (
    <Panel eyebrow="Controls" title="Configure the run">
      <SectionLabel>Algorithm</SectionLabel>
      <Box
        role="radiogroup"
        aria-label="Algorithm"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr' },
          gap: 0.75,
        }}
      >
        {ALGORITHMS.map((algo, index) => {
          const Icon = ALGORITHM_ICONS[algo.id];
          const selected = algo.id === algorithm;
          return (
            <ButtonBase
              key={algo.id}
              role="radio"
              aria-checked={selected}
              onClick={() => onAlgorithm(algo.id)}
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                width: '100%',
                p: 1,
                pr: 1.25,
                borderRadius: 2.5,
                textAlign: 'left',
                border: '1px solid',
                borderColor: selected
                  ? theme.alpha(theme.vars.palette.primary.main, 0.55)
                  : 'transparent',
                backgroundColor: selected
                  ? theme.alpha(theme.vars.palette.primary.main, 0.1)
                  : 'transparent',
                transition: 'background-color 140ms, border-color 140ms',
                '&:hover': {
                  backgroundColor: selected
                    ? theme.alpha(theme.vars.palette.primary.main, 0.14)
                    : theme.alpha(theme.vars.palette.text.primary, 0.04),
                },
                '&.Mui-focusVisible': {
                  outline: `2px solid ${theme.vars.palette.primary.main}`,
                  outlineOffset: 1,
                },
              })}
            >
              <Box
                sx={(theme) => ({
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  color: selected ? '#fff' : theme.vars.palette.text.secondary,
                  backgroundColor: theme.vars.palette.surface.sunken,
                  border: `1px solid ${theme.vars.palette.surface.border}`,
                  ...(selected && {
                    border: 'none',
                    backgroundImage: `linear-gradient(140deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.primary.dark})`,
                    boxShadow: `0 6px 16px -6px ${theme.vars.palette.viz.glow}`,
                  }),
                })}
              >
                <Icon sx={{ fontSize: 19 }} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography
                    sx={{
                      fontFamily: 'h6.fontFamily',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      lineHeight: 1.3,
                      color: selected ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {algo.name}
                  </Typography>
                  {algo.original && (
                    <Box
                      component="span"
                      sx={{
                        fontFamily: 'mono.fontFamily',
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        px: 0.6,
                        py: 0.1,
                        borderRadius: 1,
                        color: 'secondary.main',
                        border: '1px solid',
                        borderColor: 'secondary.main',
                      }}
                    >
                      ORIGINAL
                    </Box>
                  )}
                </Box>
                <Typography
                  variant="mono"
                  component="div"
                  noWrap
                  sx={{ color: 'text.disabled', fontSize: 11 }}
                >
                  {algo.complexity.average} · {algo.technique.split(' · ')[0]}
                </Typography>
              </Box>
              <Box
                component="kbd"
                sx={(theme) => ({
                  fontSize: 10,
                  fontWeight: 600,
                  minWidth: 18,
                  textAlign: 'center',
                  px: 0.5,
                  py: 0.1,
                  borderRadius: 1,
                  color: 'text.disabled',
                  border: `1px solid ${theme.vars.palette.surface.border}`,
                  display: { xs: 'none', md: 'block' },
                })}
              >
                {index + 1}
              </Box>
            </ButtonBase>
          );
        })}
      </Box>

      <Divider sx={{ my: 2.5 }} />

      <SectionLabel value={`${size} items`}>Array size</SectionLabel>
      <Slider
        aria-label="Array size"
        value={size}
        min={MIN_SIZE}
        max={MAX_SIZE}
        onChange={(_, v) => onSize(v)}
        valueLabelDisplay="auto"
        marks={[{ value: 5 }, { value: 50 }, { value: 100 }, { value: 150 }, { value: 200 }]}
      />

      <Box sx={{ mt: 2 }}>
        <SectionLabel>Starting order</SectionLabel>
        <ToggleButtonGroup
          exclusive
          value={preset}
          onChange={(_, v: ArrayPreset | null) => v && onPreset(v)}
          aria-label="Starting order"
          sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%' }}
        >
          {PRESETS.map((p) => (
            <Tooltip key={p.id} title={p.hint} placement="top">
              <ToggleButton value={p.id} size="small">
                {p.label}
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
        <Tooltip title="New array with the same settings (S)">
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ShuffleRounded />}
            onClick={props.onShuffle}
          >
            Shuffle
          </Button>
        </Tooltip>
        <Tooltip title="Type your own numbers">
          <Button
            fullWidth
            variant={preset === 'custom' ? 'outlined' : 'text'}
            startIcon={<EditNoteRounded />}
            onClick={props.onCustom}
            sx={preset === 'custom' ? { borderColor: 'primary.main' } : undefined}
          >
            Custom
          </Button>
        </Tooltip>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      <SectionLabel value={formatSps(sps)}>Speed</SectionLabel>
      <Slider
        aria-label="Sorting speed"
        aria-valuetext={`${speedLabel(speed)}, ${formatSps(sps)}`}
        value={speed}
        min={0}
        max={100}
        onChange={(_, v) => onSpeed(v)}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -0.5 }}>
        {['Slow-mo', 'Relaxed', 'Brisk', 'Fast', 'Ludicrous'].map((label) => (
          <Typography
            key={label}
            variant="caption"
            sx={{
              fontSize: 10.5,
              fontWeight: 600,
              color: speedLabel(speed) === label ? 'primary.light' : 'text.disabled',
              transition: 'color 140ms',
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>
    </Panel>
  );
}
