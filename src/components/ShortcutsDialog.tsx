import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

const GROUPS: { title: string; items: [string[], string][] }[] = [
  {
    title: 'Playback',
    items: [
      [['Space'], 'Play / pause'],
      [['→'], 'Step forward'],
      [['←'], 'Step back'],
      [['Shift', '→'], 'Jump 10 steps'],
      [['R'], 'Back to start'],
      [['End'], 'Jump to the end'],
    ],
  },
  {
    title: 'Data & app',
    items: [
      [['1', '–', '7'], 'Choose algorithm'],
      [['S'], 'Shuffle a new array'],
      [['M'], 'Toggle sound'],
      [['T'], 'Open the tutorial'],
      [['?'], 'Show this list'],
    ],
  },
];

export function Kbd({ children }: { children: string }) {
  if (children === '–')
    return (
      <Box component="span" sx={{ color: 'text.disabled', px: 0.25 }}>
        –
      </Box>
    );
  return (
    <Box
      component="kbd"
      sx={(theme) => ({
        display: 'inline-grid',
        placeItems: 'center',
        minWidth: 26,
        height: 24,
        px: 0.75,
        borderRadius: 1.5,
        fontFamily: theme.typography.mono.fontFamily,
        fontSize: 11.5,
        fontWeight: 600,
        color: theme.vars.palette.text.primary,
        backgroundColor: theme.vars.palette.surface.raised,
        border: `1px solid ${theme.vars.palette.surface.borderStrong}`,
        boxShadow: `0 2px 0 ${theme.vars.palette.surface.borderStrong}`,
      })}
    >
      {children}
    </Box>
  );
}

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="eyebrow" component="div" sx={{ color: 'text.secondary' }}>
          Work faster
        </Typography>
        <Typography variant="h5" component="span">
          Keyboard shortcuts
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, pt: 1 }}
        >
          {GROUPS.map((group) => (
            <Box key={group.title}>
              <Typography
                variant="eyebrow"
                component="h3"
                sx={{ color: 'primary.light', mb: 1.25 }}
              >
                {group.title}
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.1 }}>
                {group.items.map(([keys, label]) => (
                  <Box
                    key={label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {label}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {keys.map((k) => (
                        <Kbd key={k}>{k}</Kbd>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
