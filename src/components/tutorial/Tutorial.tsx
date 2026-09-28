import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import RocketLaunchRounded from '@mui/icons-material/RocketLaunchRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import { keyframes, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState, type ReactNode } from 'react';
import { ALGORITHMS, type AlgorithmId, type AlgorithmMeta } from '../../algorithms';
import { ComplexityGrid, TraitBadge } from '../AlgorithmDetails';
import { ALGORITHM_ICONS } from '../algorithmIcons';
import { LogoMark } from '../Logo';
import { GrowthChart, KeyboardMap, ShuffleCards } from './Illustrations';
import { MiniVisualizer } from './MiniVisualizer';

const SAMPLE = [38, 27, 43, 3, 9, 82, 10, 55, 19, 64];
const HERO = [
  34, 12, 58, 71, 23, 90, 45, 8, 66, 29, 81, 17, 52, 38, 95, 5, 62, 27, 76, 41, 14, 87, 49, 20, 69,
  32, 57, 10,
];
const LEGEND_SAMPLE = [46, 18, 73, 29, 88, 12, 61, 35];

interface Slide {
  id: string;
  label: string;
  eyebrow: string;
  title: ReactNode;
  body: ReactNode;
  illustration: ReactNode;
}

function Para({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1.75, fontSize: '0.96rem' }}>
      {children}
    </Typography>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <Box component="ul" sx={{ m: 0, mb: 2, p: 0, listStyle: 'none', display: 'grid', gap: 1.1 }}>
      {items.map((item, i) => (
        <Box component="li" key={i} sx={{ display: 'flex', gap: 1.25 }}>
          <Box
            sx={(theme) => ({
              mt: '9px',
              width: 6,
              height: 6,
              borderRadius: '50%',
              flexShrink: 0,
              backgroundColor: theme.vars.palette.secondary.main,
              boxShadow: `0 0 8px ${theme.vars.palette.secondary.main}`,
            })}
          />
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function Term({ name, children }: { name: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="subtitle2" component="div" sx={{ color: 'text.primary', mb: 0.25 }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {children}
      </Typography>
    </Box>
  );
}

function Swatch({ color, dashed }: { color: string; dashed?: boolean }) {
  return (
    <Box
      component="span"
      sx={(theme) => ({
        display: 'inline-block',
        width: 12,
        height: 12,
        borderRadius: 0.75,
        mr: 1,
        verticalAlign: '-1px',
        backgroundColor: dashed ? theme.vars.palette.viz.range : color,
        border: dashed ? `1px dashed ${theme.vars.palette.primary.main}` : 'none',
        boxShadow: dashed ? 'none' : `0 0 8px -1px ${color}`,
      })}
    />
  );
}

function AlgorithmBody({ algo, onTry }: { algo: AlgorithmMeta; onTry: () => void }) {
  return (
    <>
      <Typography
        variant="subtitle1"
        sx={(theme) => ({
          color: theme.vars.palette.primary.light,
          mb: 1.5,
          fontWeight: 600,
          ...theme.applyStyles('light', { color: theme.vars.palette.primary.main }),
        })}
      >
        {algo.tagline}
      </Typography>
      <Typography variant="eyebrow" component="h4" sx={{ color: 'text.secondary', mb: 0.75 }}>
        The technique
      </Typography>
      <Para>{algo.summary}</Para>
      <Typography variant="eyebrow" component="h4" sx={{ color: 'text.secondary', mb: 1 }}>
        Step by step
      </Typography>
      <Box component="ol" sx={{ m: 0, mb: 2, p: 0, listStyle: 'none', display: 'grid', gap: 1 }}>
        {algo.steps.map((text, i) => (
          <Box component="li" key={i} sx={{ display: 'flex', gap: 1.25 }}>
            <Box
              sx={(theme) => ({
                flexShrink: 0,
                width: 22,
                height: 22,
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
            <Typography variant="body2">{text}</Typography>
          </Box>
        ))}
      </Box>
      <ComplexityGrid algorithm={algo} />
      <Box sx={{ display: 'flex', gap: 1, mt: 1.25, flexWrap: 'wrap', alignItems: 'center' }}>
        <TraitBadge label="Stable" on={algo.stable} />
        <TraitBadge label="In-place" on={algo.inPlace} />
        <Box sx={{ flex: 1 }} />
        <Button size="small" variant="outlined" endIcon={<ArrowForwardRounded />} onClick={onTry}>
          Open in visualizer
        </Button>
      </Box>
    </>
  );
}

function buildSlides(
  onStart: () => void,
  onSkip: () => void,
  onTry: (id: AlgorithmId) => void,
): Slide[] {
  const intro: Slide[] = [
    {
      id: 'welcome',
      label: 'Welcome',
      eyebrow: 'Welcome to Sortscape',
      title: 'See how computers put things in order.',
      body: (
        <>
          <Para>
            Sortscape turns seven sorting algorithms into living animations. This short tour
            explains what a sorting algorithm is, how to read the visualizer, and how each algorithm
            works — with a live illustration for every one.
          </Para>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {['7 algorithms', '≈ 3 minute tour', 'Live illustrations'].map((t) => (
              <Box
                key={t}
                sx={(theme) => ({
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 99,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: theme.vars.palette.text.primary,
                  backgroundColor: theme.vars.palette.surface.raised,
                  border: `1px solid ${theme.vars.palette.surface.borderStrong}`,
                })}
              >
                {t}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              size="large"
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              onClick={onStart}
            >
              Start the tour
            </Button>
            <Button size="large" onClick={onSkip}>
              Skip tutorial
            </Button>
          </Box>
        </>
      ),
      illustration: (
        <Box sx={{ width: '100%', maxWidth: 560 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 3,
              justifyContent: 'center',
            }}
          >
            <LogoMark size={44} />
            <Typography
              sx={{
                fontFamily: 'h1.fontFamily',
                fontWeight: 700,
                fontSize: '2rem',
                letterSpacing: '-0.04em',
              }}
            >
              Sortscape
            </Typography>
          </Box>
          <MiniVisualizer algorithm="quick" input={HERO} sps={26} bare barsHeight={220} />
        </Box>
      ),
    },
    {
      id: 'what',
      label: 'What is sorting?',
      eyebrow: 'Chapter 1 · The basics',
      title: 'What is a sorting algorithm?',
      body: (
        <>
          <Para>
            A sorting algorithm is a precise, step-by-step procedure that takes a collection of
            items and rearranges them into order — smallest to largest, A to Z, oldest to newest.
          </Para>
          <Para>
            A computer cannot “see” a whole list at once the way you do. It can only look at a
            couple of items at a time, compare them and move them around. A sorting algorithm is the
            strategy that decides <b>which</b> items to compare and move, and <b>when</b>.
          </Para>
          <Typography variant="eyebrow" component="h4" sx={{ color: 'text.secondary', mb: 1 }}>
            Why it matters
          </Typography>
          <Bullets
            items={[
              <>
                <b>Search</b> — a sorted list of a million names can be searched with ~20 looks
                using binary search, instead of up to a million.
              </>,
              <>
                <b>Databases &amp; spreadsheets</b> — indexes, <code>ORDER BY</code> and every “sort
                by” button.
              </>,
              <>
                <b>Graphics</b> — renderers sort objects by depth to draw them back to front.
              </>,
              <>
                <b>Data analysis</b> — medians, rankings and duplicates become trivial once data is
                sorted.
              </>,
            ]}
          />
          <Para>
            Every algorithm here produces exactly the same result. What differs is the strategy —
            and how much work it takes to get there.
          </Para>
        </>
      ),
      illustration: <ShuffleCards />,
    },
    {
      id: 'measure',
      label: 'Measuring work',
      eyebrow: 'Chapter 2 · Measuring work',
      title: 'How do we compare algorithms?',
      body: (
        <>
          <Para>
            We count the basic operations an algorithm performs as the input grows — mostly{' '}
            <b>comparisons</b> (“is a greater than b?”) and <b>swaps or writes</b> (moving values
            around). Sortscape counts both live while it runs.
          </Para>
          <Term name="Big-O notation">
            Describes how the work grows with the input size n. With O(n²), doubling the input
            roughly quadruples the work; O(n log n) grows only a little faster than n itself.
          </Term>
          <Term name="Best, average & worst case">
            The same algorithm can be quick on one input and slow on another: Bubble Sort needs
            about n steps on sorted data but about n² on shuffled data.
          </Term>
          <Term name="Stable">
            Equal values keep their original relative order — useful when sorting by one column and
            then another.
          </Term>
          <Term name="In-place">
            Needs only a small, constant amount of memory on top of the array itself.
          </Term>
        </>
      ),
      illustration: <GrowthChart />,
    },
    {
      id: 'read',
      label: 'Reading the visualizer',
      eyebrow: 'Chapter 3 · Reading the visualizer',
      title: 'Every bar is a number.',
      body: <ReadingBody />,
      illustration: (
        <Box sx={{ width: '100%', maxWidth: 520 }}>
          <MiniVisualizer algorithm="quick" input={LEGEND_SAMPLE} sps={2.2} barsHeight={200} />
        </Box>
      ),
    },
  ];

  const algorithms: Slide[] = ALGORITHMS.map((algo, i) => ({
    id: algo.id,
    label: algo.name,
    eyebrow: `Algorithm ${i + 1} of ${ALGORITHMS.length} · ${algo.technique}${algo.original ? ' · Sortscape original' : ''}`,
    title: algo.name,
    body: <AlgorithmBody algo={algo} onTry={() => onTry(algo.id)} />,
    illustration: (
      <Box sx={{ width: '100%', maxWidth: 540 }}>
        <MiniVisualizer
          algorithm={algo.id}
          input={SAMPLE}
          sps={algo.id === 'bubble' || algo.id === 'insertion' ? 4 : 3}
          barsHeight={algo.id === 'heap' || algo.id === 'radix' ? 150 : 210}
        />
      </Box>
    ),
  }));

  const outro: Slide = {
    id: 'ready',
    label: 'You’re ready',
    eyebrow: 'You’re ready',
    title: 'Time to experiment.',
    body: (
      <>
        <Bullets
          items={[
            'Pick an algorithm and press Play — or step through it one operation at a time.',
            'Change the array size and starting order. Try Insertion Sort on nearly sorted data, or Quick Sort on few unique values.',
            'Drag the timeline to scrub backwards and forwards through a run; the pseudocode follows along.',
            'Open Race to run several algorithms on the same array side by side.',
            'The Cheat sheet compares every algorithm at a glance, and this tour is always one click away in the header.',
          ]}
        />
        <Button
          size="large"
          variant="contained"
          startIcon={<RocketLaunchRounded />}
          onClick={onSkip}
          sx={{ mt: 1 }}
        >
          Start visualizing
        </Button>
      </>
    ),
    illustration: <KeyboardMap />,
  };

  return [...intro, ...algorithms, outro];
}

function ReadingBody() {
  const theme = useTheme();
  const viz = theme.vars.palette.viz;
  const rows: [string, string, ReactNode, boolean?][] = [
    ['Compare', viz.compare, 'two values are being compared'],
    ['Swap', viz.swap, 'two values trade places'],
    ['Write', viz.write, 'a value is copied into a slot (Merge & Radix Sort)'],
    ['Inspect', viz.read, 'a value is being looked at, e.g. dropped into a bucket'],
    ['Pivot / key', viz.pivot, 'the reference value the algorithm organises around'],
    ['Sorted', viz.sorted, 'the value has reached its final position'],
    ['Active range', viz.range, 'the part of the array currently being worked on', true],
  ];
  return (
    <>
      <Para>
        The height of each bar is its value. As an algorithm runs, bars light up to show exactly
        what it is doing at that moment:
      </Para>
      <Box sx={{ display: 'grid', gap: 0.9, mb: 2 }}>
        {rows.map(([name, color, text, dashed]) => (
          <Typography key={name} variant="body2" sx={{ color: 'text.secondary' }}>
            <Swatch color={color} dashed={dashed} />
            <Box component="b" sx={{ color: 'text.primary' }}>
              {name}
            </Box>{' '}
            — {text}
          </Typography>
        ))}
      </Box>
      <Para>
        Pause at any moment, step forwards or backwards one operation at a time, or drag the
        timeline to scrub through the whole run. The pseudocode panel highlights the line behind
        every step.
      </Para>
    </>
  );
}

const enter = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
`;

interface TutorialProps {
  open: boolean;
  onClose: () => void;
  hideOnStartup: boolean;
  onHideOnStartup: (hide: boolean) => void;
  onTryAlgorithm: (id: AlgorithmId) => void;
}

export function Tutorial({
  open,
  onClose,
  hideOnStartup,
  onHideOnStartup,
  onTryAlgorithm,
}: TutorialProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth={false}
      aria-labelledby="tutorial-title"
      slotProps={{
        paper: {
          sx: {
            width: fullScreen ? '100%' : 'min(1180px, calc(100% - 48px))',
            height: fullScreen ? '100%' : 'min(760px, calc(100% - 48px))',
            maxHeight: 'none',
            m: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            ...(fullScreen && { borderRadius: 0, border: 'none' }),
          },
        },
      }}
    >
      {open && (
        <TutorialContent
          onClose={onClose}
          hideOnStartup={hideOnStartup}
          onHideOnStartup={onHideOnStartup}
          onTryAlgorithm={onTryAlgorithm}
        />
      )}
    </Dialog>
  );
}

function TutorialContent({
  onClose,
  hideOnStartup,
  onHideOnStartup,
  onTryAlgorithm,
}: Omit<TutorialProps, 'open'>) {
  const [index, setIndex] = useState(0);
  const slides = buildSlides(
    () => setIndex(1),
    onClose,
    (id) => {
      onTryAlgorithm(id);
      onClose();
    },
  );
  const count = slides.length;
  const slide = slides[index];
  const last = index === count - 1;
  const go = (next: number) => setIndex(Math.max(0, Math.min(count - 1, next)));
  const Icon = slide.id in ALGORITHM_ICONS ? ALGORITHM_ICONS[slide.id as AlgorithmId] : null;

  // Listen on window: clicking a slide's own button unmounts it, which drops focus out of the dialog.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest('input:not([type="checkbox"]), textarea, [role="slider"]')) return;
      const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!delta) return;
      e.preventDefault();
      setIndex((i) => Math.max(0, Math.min(count - 1, i + delta)));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [count]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Top bar: progress and skip */}
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderBottom: `1px solid ${theme.vars.palette.surface.border}`,
        })}
      >
        <Typography variant="eyebrow" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          Tour · {String(index + 1).padStart(2, '0')} / {slides.length}
        </Typography>
        <Box
          sx={{ flex: 1, display: 'flex', gap: 0.5 }}
          role="tablist"
          aria-label="Tutorial chapters"
        >
          {slides.map((s, i) => (
            <Tooltip key={s.id} title={s.label} placement="bottom">
              <ButtonBase
                role="tab"
                aria-selected={i === index}
                aria-label={s.label}
                onClick={() => go(i)}
                sx={(theme) => ({
                  flex: 1,
                  height: 16,
                  borderRadius: 1,
                  '&::after': {
                    content: '""',
                    display: 'block',
                    width: '100%',
                    height: 4,
                    borderRadius: 4,
                    transition: 'background-color 200ms',
                    backgroundColor:
                      i === index
                        ? theme.vars.palette.primary.main
                        : i < index
                          ? theme.alpha(theme.vars.palette.primary.main, 0.45)
                          : theme.vars.palette.surface.borderStrong,
                  },
                })}
              />
            </Tooltip>
          ))}
        </Box>
        <Button
          size="small"
          onClick={onClose}
          endIcon={<CloseRounded />}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Skip tutorial
        </Button>
      </Box>

      {/* Body */}
      <Box
        key={slide.id}
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.05fr) minmax(0, 1fr)' },
          gridTemplateRows: { xs: 'auto 1fr', md: '1fr' },
          overflow: { xs: 'auto', md: 'hidden' },
        }}
      >
        <Box
          sx={(theme) => ({
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2.5, sm: 4 },
            minHeight: { xs: 300, md: 0 },
            overflow: 'hidden',
            backgroundColor: theme.vars.palette.surface.sunken,
            backgroundImage: [
              `radial-gradient(600px 300px at 30% 0%, ${theme.alpha(theme.vars.palette.primary.main, 0.18)}, transparent 70%)`,
              `radial-gradient(500px 300px at 100% 100%, ${theme.alpha(theme.vars.palette.secondary.main, 0.1)}, transparent 70%)`,
              `linear-gradient(${theme.vars.palette.viz.grid} 1px, transparent 1px)`,
              `linear-gradient(90deg, ${theme.vars.palette.viz.grid} 1px, transparent 1px)`,
            ].join(','),
            backgroundSize: 'auto, auto, 28px 28px, 28px 28px',
            borderRight: { md: `1px solid ${theme.vars.palette.surface.border}` },
            '& > *': { animation: `${enter} 420ms cubic-bezier(.2,.7,.2,1) both` },
          })}
        >
          {slide.illustration}
        </Box>
        <Box
          sx={{
            overflowY: { md: 'auto' },
            px: { xs: 2.5, sm: 4, md: 5 },
            py: { xs: 3, md: 4.5 },
            '& > *': { animation: `${enter} 420ms 60ms cubic-bezier(.2,.7,.2,1) both` },
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {Icon && (
                <Box
                  sx={(theme) => ({
                    width: 26,
                    height: 26,
                    borderRadius: 1.5,
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    backgroundImage: `linear-gradient(140deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.primary.dark})`,
                  })}
                >
                  <Icon sx={{ fontSize: 16 }} />
                </Box>
              )}
              <Typography variant="eyebrow" sx={{ color: 'secondary.main' }}>
                {slide.eyebrow}
              </Typography>
            </Box>
            <Typography
              id="tutorial-title"
              variant="h3"
              component="h2"
              sx={{ fontSize: { xs: '1.9rem', sm: '2.4rem' }, lineHeight: 1.1, mb: 2.5 }}
            >
              {slide.title}
            </Typography>
            {slide.body}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          borderTop: `1px solid ${theme.vars.palette.surface.border}`,
          backgroundColor: theme.alpha(theme.vars.palette.surface.raised, 0.4),
        })}
      >
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={hideOnStartup}
              onChange={(e) => onHideOnStartup(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Don’t show on startup
            </Typography>
          }
          sx={{ mr: 'auto' }}
        />
        <IconButton
          aria-label="Previous"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          sx={{ display: { sm: 'none' } }}
        >
          <ArrowBackRounded />
        </IconButton>
        <Button
          onClick={() => go(index - 1)}
          disabled={index === 0}
          startIcon={<ArrowBackRounded />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Back
        </Button>
        {last ? (
          <Button variant="contained" onClick={onClose} endIcon={<RocketLaunchRounded />}>
            Finish
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => go(index + 1)}
            endIcon={<ArrowForwardRounded />}
          >
            {index === 0 ? 'Start' : 'Next'}
          </Button>
        )}
      </Box>
    </Box>
  );
}
