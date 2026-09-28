import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { isAlgorithmId, type AlgorithmId } from './algorithms';
import { CheatSheetView } from './components/CheatSheetView';
import { Header, type View } from './components/Header';
import { RaceView } from './components/race/RaceView';
import { ShortcutsDialog } from './components/ShortcutsDialog';
import { Tutorial } from './components/tutorial/Tutorial';
import { VisualizerView } from './components/VisualizerView';
import { useHotkeys } from './hooks/useHotkeys';
import { isBoolean, usePersistentState } from './hooks/usePersistentState';

const VIEWS: readonly View[] = ['visualizer', 'race', 'cheatsheet'];
const isView = (v: unknown): v is View => VIEWS.includes(v as View);

export default function App() {
  const [view, setView] = usePersistentState<View>('sortscape.view', 'visualizer', isView);
  const [algorithm, setAlgorithm] = usePersistentState<AlgorithmId>(
    'sortscape.algorithm',
    'quick',
    isAlgorithmId,
  );
  const [sound, setSound] = usePersistentState('sortscape.sound', false, isBoolean);
  const [hideTutorial, setHideTutorial] = usePersistentState(
    'sortscape.hideTutorial',
    false,
    isBoolean,
  );
  const [tutorialOpen, setTutorialOpen] = useState(() => !hideTutorial);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const overlayOpen = tutorialOpen || shortcutsOpen;

  useHotkeys(
    {
      '?': () => setShortcutsOpen(true),
      m: () => setSound((s) => !s),
      t: () => setTutorialOpen(true),
    },
    !overlayOpen,
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        view={view}
        onView={setView}
        sound={sound}
        onSound={setSound}
        onTutorial={() => setTutorialOpen(true)}
        onShortcuts={() => setShortcutsOpen(true)}
      />

      <Box sx={{ flex: 1, width: '100%', maxWidth: 1480, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
        {view === 'visualizer' && (
          <VisualizerView
            algorithm={algorithm}
            onAlgorithm={setAlgorithm}
            sound={sound}
            hotkeysEnabled={!overlayOpen}
          />
        )}
        {view === 'race' && <RaceView hotkeysEnabled={!overlayOpen} />}
        {view === 'cheatsheet' && (
          <CheatSheetView
            onOpenTutorial={() => setTutorialOpen(true)}
            onPick={(id) => {
              setAlgorithm(id);
              setView('visualizer');
            }}
          />
        )}
      </Box>

      <Box
        component="footer"
        sx={(theme) => ({
          borderTop: `1px solid ${theme.vars.palette.surface.border}`,
          py: 2.5,
          px: 3,
          textAlign: 'center',
        })}
      >
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          Sortscape — built with React, Vite &amp; MUI. Press <b>?</b> for keyboard shortcuts.
        </Typography>
      </Box>

      <Tutorial
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
        hideOnStartup={hideTutorial}
        onHideOnStartup={setHideTutorial}
        onTryAlgorithm={(id) => {
          setAlgorithm(id);
          setView('visualizer');
        }}
      />
      <ShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </Box>
  );
}
