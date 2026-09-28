import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

type SxItem = Exclude<SxProps<Theme>, readonly unknown[]>;

interface PanelProps {
  title?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
  id?: string;
}

/** Frosted surface used for every section of the app. */
export function Panel({ title, eyebrow, action, children, sx, id }: PanelProps) {
  return (
    <Paper
      component="section"
      id={id}
      sx={[
        (theme) => ({
          position: 'relative',
          p: { xs: 2, sm: 2.5 },
          borderRadius: 4,
          backgroundColor: theme.alpha(theme.vars.palette.surface.base, 0.72),
          backdropFilter: 'blur(14px)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.03) inset, 0 24px 48px -32px rgba(0,0,0,0.6)',
          ...theme.applyStyles('light', {
            boxShadow: '0 1px 2px rgba(20,24,60,0.04), 0 24px 48px -36px rgba(20,24,60,0.25)',
          }),
        }),
        ...((Array.isArray(sx) ? sx : [sx]) as SxItem[]),
      ]}
    >
      {(title ?? eyebrow ?? action) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            mb: 2,
            minHeight: 28,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {eyebrow && (
              <Typography variant="eyebrow" component="div" sx={{ color: 'text.secondary' }}>
                {eyebrow}
              </Typography>
            )}
            {title && (
              <Typography variant="h6" component="h2" sx={{ fontSize: '1rem', lineHeight: 1.3 }}>
                {title}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
      )}
      {children}
    </Paper>
  );
}
