import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import KeyboardRounded from '@mui/icons-material/KeyboardRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import VolumeOffRounded from '@mui/icons-material/VolumeOffRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { LogoMark } from './Logo';

export type View = 'visualizer' | 'race' | 'cheatsheet';

interface HeaderProps {
  view: View;
  onView: (view: View) => void;
  sound: boolean;
  onSound: (on: boolean) => void;
  onTutorial: () => void;
  onShortcuts: () => void;
}

export function Header({ view, onView, sound, onSound, onTutorial, onShortcuts }: HeaderProps) {
  const { colorScheme, setMode } = useColorScheme();
  const isDark = colorScheme !== 'light';

  return (
    <Box
      component="header"
      sx={(theme) => ({
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar,
        borderBottom: `1px solid ${theme.vars.palette.surface.border}`,
        backgroundColor: theme.alpha(theme.vars.palette.background.default, 0.72),
        backdropFilter: 'blur(16px) saturate(140%)',
      })}
    >
      <Box
        sx={{
          maxWidth: 1480,
          mx: 'auto',
          px: { xs: 2, md: 3 },
          minHeight: 64,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr auto', md: '1fr auto 1fr' },
          alignItems: 'center',
          columnGap: 2,
          rowGap: 1,
          py: { xs: 1, md: 0 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          <LogoMark size={34} />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: 'h1.fontFamily',
                fontWeight: 700,
                fontSize: '1.2rem',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Sortscape
            </Typography>
            <Typography
              variant="eyebrow"
              component="p"
              sx={{
                color: 'text.secondary',
                fontSize: '0.625rem',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Sorting, visualized
            </Typography>
          </Box>
        </Box>

        <Tabs
          value={view}
          onChange={(_, v: View) => onView(v)}
          aria-label="Views"
          sx={{
            gridColumn: { xs: '1 / -1', md: 'auto' },
            gridRow: { xs: 2, md: 'auto' },
            justifySelf: 'center',
          }}
        >
          <Tab value="visualizer" label="Visualizer" />
          <Tab value="race" label="Race" />
          <Tab value="cheatsheet" label="Cheat sheet" />
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
          <Tooltip title={sound ? 'Mute sound (M)' : 'Enable sound (M)'}>
            <IconButton
              aria-label={sound ? 'Mute sound' : 'Enable sound'}
              aria-pressed={sound}
              onClick={() => onSound(!sound)}
              sx={sound ? { color: 'secondary.main' } : undefined}
            >
              {sound ? <VolumeUpRounded /> : <VolumeOffRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>
            <IconButton
              aria-label="Toggle color theme"
              onClick={() => setMode(isDark ? 'light' : 'dark')}
            >
              {isDark ? <LightModeRounded /> : <DarkModeRounded />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Keyboard shortcuts (?)">
            <IconButton
              aria-label="Keyboard shortcuts"
              onClick={onShortcuts}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              <KeyboardRounded />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SchoolRounded />}
            onClick={onTutorial}
            sx={{ ml: 0.5, display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Tutorial
          </Button>
          <Tooltip title="Tutorial">
            <IconButton
              aria-label="Open tutorial"
              onClick={onTutorial}
              sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
            >
              <SchoolRounded />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
