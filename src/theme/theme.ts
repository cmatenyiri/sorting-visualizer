import { createTheme, type Theme } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import type { CSSProperties } from 'react';

export interface VizPalette {
  barLow: string;
  barHigh: string;
  compare: string;
  swap: string;
  write: string;
  pivot: string;
  sorted: string;
  read: string;
  range: string;
  grid: string;
  glow: string;
  /** Categorical series colors for data charts, validated for CVD separation per mode. */
  series1: string;
  series2: string;
  series3: string;
}

export interface SurfacePalette {
  base: string;
  raised: string;
  sunken: string;
  border: string;
  borderStrong: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    viz: VizPalette;
    surface: SurfacePalette;
  }
  interface PaletteOptions {
    viz?: VizPalette;
    surface?: SurfacePalette;
  }
  interface TypographyVariants {
    mono: CSSProperties;
    eyebrow: CSSProperties;
  }
  interface TypographyVariantsOptions {
    mono?: CSSProperties;
    eyebrow?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    mono: true;
    eyebrow: true;
  }
}

export const FONT_DISPLAY = '"Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
export const FONT_BODY = '"Inter Variable", "Inter", system-ui, -apple-system, sans-serif';
export const FONT_MONO = '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';

const dark = {
  primary: { main: '#8B7BFF', light: '#B4A9FF', dark: '#6A55F5', contrastText: '#0C0822' },
  secondary: { main: '#2EE6C5', light: '#7CF2DC', dark: '#16B89B', contrastText: '#03201B' },
  success: { main: '#34E3A0' },
  warning: { main: '#FFC857' },
  error: { main: '#FF6B8B' },
  info: { main: '#6CB6FF' },
  background: { default: '#07080F', paper: '#0D1020' },
  text: { primary: '#E9EBF7', secondary: '#949CBA', disabled: '#596080' },
  divider: 'rgba(148, 160, 220, 0.12)',
  surface: {
    base: '#0D1020',
    raised: '#131731',
    sunken: '#090B17',
    border: 'rgba(148, 160, 220, 0.12)',
    borderStrong: 'rgba(148, 160, 220, 0.24)',
  },
  viz: {
    barLow: '#2B337F',
    barHigh: '#8FA0FF',
    compare: '#FFC857',
    swap: '#FF6B8B',
    write: '#FF9A62',
    pivot: '#E27BFF',
    sorted: '#34E3A0',
    read: '#6CB6FF',
    range: 'rgba(139, 123, 255, 0.09)',
    grid: 'rgba(148, 160, 220, 0.07)',
    glow: 'rgba(139, 123, 255, 0.35)',
    series1: '#3987E5',
    series2: '#D95926',
    series3: '#199E70',
  },
};

const light = {
  primary: { main: '#5B45F2', light: '#8676FF', dark: '#4330D1', contrastText: '#FFFFFF' },
  secondary: { main: '#0CA88D', light: '#3FCCB2', dark: '#07806B', contrastText: '#FFFFFF' },
  success: { main: '#0FA876' },
  warning: { main: '#E59A0B' },
  error: { main: '#E8385C' },
  info: { main: '#2F7FE0' },
  background: { default: '#F3F4FA', paper: '#FFFFFF' },
  text: { primary: '#121430', secondary: '#5B6186', disabled: '#A1A6C2' },
  divider: 'rgba(24, 30, 80, 0.10)',
  surface: {
    base: '#FFFFFF',
    raised: '#F7F7FD',
    sunken: '#ECEEF7',
    border: 'rgba(24, 30, 80, 0.10)',
    borderStrong: 'rgba(24, 30, 80, 0.20)',
  },
  viz: {
    barLow: '#C9CEFF',
    barHigh: '#4B3FD9',
    compare: '#F0A10C',
    swap: '#EC3F63',
    write: '#F2743A',
    pivot: '#B63AD8',
    sorted: '#10B27C',
    read: '#2F7FE0',
    range: 'rgba(91, 69, 242, 0.07)',
    grid: 'rgba(24, 30, 80, 0.06)',
    glow: 'rgba(91, 69, 242, 0.25)',
    series1: '#2A78D6',
    series2: '#EB6834',
    series3: '#1BAF7A',
  },
};

const focusRing = (theme: Theme) => ({
  outline: `2px solid ${theme.vars.palette.primary.main}`,
  outlineOffset: 2,
});

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data', cssVarPrefix: 'ss' },
  defaultColorScheme: 'dark',
  colorSchemes: {
    dark: { palette: dark },
    light: { palette: light },
  },
  // A 4px unit keeps `sx={{ borderRadius: n }}` on a 4px grid; components set their own radii below.
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: FONT_BODY,
    h1: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.035em' },
    h2: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.03em' },
    h3: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.025em' },
    h4: { fontFamily: FONT_DISPLAY, fontWeight: 650, letterSpacing: '-0.02em' },
    h5: { fontFamily: FONT_DISPLAY, fontWeight: 650, letterSpacing: '-0.015em' },
    h6: { fontFamily: FONT_DISPLAY, fontWeight: 600, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, letterSpacing: '0.005em' },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.6 },
    button: {
      fontFamily: FONT_DISPLAY,
      fontWeight: 600,
      letterSpacing: '0.005em',
      textTransform: 'none',
    },
    overline: { fontFamily: FONT_MONO, fontWeight: 600, letterSpacing: '0.14em', lineHeight: 1.6 },
    mono: { fontFamily: FONT_MONO, fontSize: '0.8125rem', fontFeatureSettings: '"zero" 1' },
    eyebrow: {
      fontFamily: FONT_MONO,
      fontSize: '0.6875rem',
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: {
          minHeight: '100vh',
          backgroundColor: theme.vars.palette.background.default,
          backgroundImage: [
            `radial-gradient(1200px 600px at 10% -10%, ${theme.alpha(theme.vars.palette.primary.main, 0.16)}, transparent 60%)`,
            `radial-gradient(900px 500px at 100% 0%, ${theme.alpha(theme.vars.palette.secondary.main, 0.08)}, transparent 60%)`,
          ].join(','),
          backgroundAttachment: 'fixed',
          ...theme.applyStyles('light', {
            backgroundImage: [
              `radial-gradient(1200px 600px at 10% -10%, ${theme.alpha(theme.vars.palette.primary.main, 0.1)}, transparent 60%)`,
              `radial-gradient(900px 500px at 100% 0%, ${theme.alpha(theme.vars.palette.secondary.main, 0.08)}, transparent 60%)`,
            ].join(','),
          }),
        },
        '::selection': { background: theme.alpha(theme.vars.palette.primary.main, 0.35) },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.vars.palette.surface.borderStrong} transparent`,
        },
        'code, kbd, pre': { fontFamily: FONT_MONO },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.001ms !important',
            transitionDuration: '0.001ms !important',
          },
        },
      }),
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: theme.vars.palette.surface.base,
          border: `1px solid ${theme.vars.palette.surface.border}`,
        }),
      },
    },
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          paddingInline: 16,
          transition:
            'background-color 160ms, box-shadow 160ms, border-color 160ms, transform 120ms',
          '&:active': { transform: 'translateY(1px)' },
          '&.Mui-focusVisible': focusRing(theme),
        }),
        sizeLarge: { paddingBlock: 10, paddingInline: 22, fontSize: '0.975rem' },
        contained: ({ theme }) => ({
          '&.MuiButton-colorPrimary': {
            color: '#fff',
            backgroundImage: `linear-gradient(135deg, ${theme.vars.palette.primary.light} -20%, ${theme.vars.palette.primary.main} 45%, ${theme.vars.palette.primary.dark} 120%)`,
            boxShadow: `0 8px 24px -8px ${theme.vars.palette.viz.glow}, inset 0 1px 0 rgba(255,255,255,0.22)`,
            '&:hover': {
              boxShadow: `0 10px 30px -6px ${theme.vars.palette.viz.glow}, inset 0 1px 0 rgba(255,255,255,0.28)`,
            },
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.vars.palette.surface.borderStrong,
          color: theme.vars.palette.text.primary,
          backgroundColor: theme.alpha(theme.vars.palette.surface.raised, 0.6),
          '&:hover': {
            borderColor: theme.vars.palette.primary.main,
            backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.08),
          },
        }),
        text: ({ theme }) => ({
          color: theme.vars.palette.text.secondary,
          '&:hover': {
            color: theme.vars.palette.text.primary,
            backgroundColor: theme.alpha(theme.vars.palette.text.primary, 0.06),
          },
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          color: theme.vars.palette.text.secondary,
          transition: 'background-color 160ms, color 160ms, border-color 160ms',
          '&:hover': {
            color: theme.vars.palette.text.primary,
            backgroundColor: theme.alpha(theme.vars.palette.text.primary, 0.07),
          },
          '&.Mui-focusVisible': focusRing(theme),
        }),
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: 6,
          paddingBlock: 14,
          '& .MuiSlider-thumb': {
            width: 18,
            height: 18,
            backgroundColor: '#fff',
            border: `4px solid ${theme.vars.palette.primary.main}`,
            boxShadow: `0 0 0 0 ${theme.vars.palette.viz.glow}`,
            transition: 'box-shadow 160ms, width 120ms, height 120ms',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: `0 0 0 7px ${theme.vars.palette.viz.glow}`,
            },
            '&.Mui-active': {
              width: 20,
              height: 20,
              boxShadow: `0 0 0 9px ${theme.vars.palette.viz.glow}`,
            },
            '&::before': { display: 'none' },
          },
          '& .MuiSlider-track': {
            border: 'none',
            backgroundImage: `linear-gradient(90deg, ${theme.vars.palette.secondary.main}, ${theme.vars.palette.primary.main})`,
          },
          '& .MuiSlider-rail': {
            opacity: 1,
            backgroundColor: theme.vars.palette.surface.sunken,
            boxShadow: `inset 0 0 0 1px ${theme.vars.palette.surface.border}`,
          },
          '& .MuiSlider-valueLabel': {
            fontFamily: FONT_MONO,
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 8,
            padding: '3px 8px',
            color: theme.vars.palette.text.primary,
            backgroundColor: theme.vars.palette.surface.raised,
            border: `1px solid ${theme.vars.palette.surface.borderStrong}`,
            '&::before': { display: 'none' },
          },
          '& .MuiSlider-mark': {
            width: 3,
            height: 3,
            borderRadius: 3,
            backgroundColor: theme.vars.palette.text.disabled,
          },
          '& .MuiSlider-markActive': { backgroundColor: 'rgba(255,255,255,0.7)' },
        }),
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          gap: 4,
          padding: 4,
          borderRadius: 12,
          backgroundColor: theme.vars.palette.surface.sunken,
          border: `1px solid ${theme.vars.palette.surface.border}`,
        }),
        grouped: {
          border: 0,
          borderRadius: '8px !important',
          margin: '0 !important',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: '0.8125rem',
          color: theme.vars.palette.text.secondary,
          paddingBlock: 6,
          '&:hover': { backgroundColor: theme.alpha(theme.vars.palette.text.primary, 0.05) },
          '&.Mui-selected': {
            color: theme.vars.palette.text.primary,
            backgroundColor: theme.vars.palette.surface.raised,
            boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 14px -6px rgba(0,0,0,0.5), 0 0 0 1px ${theme.vars.palette.surface.borderStrong}`,
            '&:hover': { backgroundColor: theme.vars.palette.surface.raised },
            ...theme.applyStyles('light', {
              boxShadow: `0 2px 8px -4px rgba(20, 24, 60, 0.25), 0 0 0 1px ${theme.vars.palette.surface.border}`,
            }),
          },
          '&.Mui-focusVisible': focusRing(theme),
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 40,
          padding: 4,
          borderRadius: 12,
          backgroundColor: theme.vars.palette.surface.sunken,
          border: `1px solid ${theme.vars.palette.surface.border}`,
        }),
        indicator: ({ theme }) => ({
          height: '100%',
          borderRadius: 8,
          zIndex: 0,
          backgroundColor: theme.vars.palette.surface.raised,
          boxShadow: `0 0 0 1px ${theme.vars.palette.surface.borderStrong}`,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          zIndex: 1,
          minHeight: 32,
          minWidth: 0,
          paddingBlock: 6,
          paddingInline: 14,
          borderRadius: 8,
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: '0.875rem',
          textTransform: 'none',
          color: theme.vars.palette.text.secondary,
          transition: 'color 160ms',
          '&.Mui-selected': { color: theme.vars.palette.text.primary },
          '&.Mui-focusVisible': focusRing(theme),
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
          backgroundColor: theme.vars.palette.surface.raised,
          border: `1px solid ${theme.vars.palette.surface.border}`,
        }),
        sizeSmall: { height: 24 },
        label: { paddingInline: 8 },
        outlined: ({ theme }) => ({
          backgroundColor: 'transparent',
          borderColor: theme.vars.palette.surface.borderStrong,
        }),
      },
    },
    MuiTooltip: {
      // describeChild: tooltips add a description instead of replacing the control's accessible name.
      defaultProps: { arrow: true, enterDelay: 350, describeChild: true },
      styleOverrides: {
        tooltip: ({ theme }) => ({
          fontFamily: FONT_BODY,
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 10px',
          borderRadius: 8,
          color: theme.vars.palette.text.primary,
          backgroundColor: theme.vars.palette.surface.raised,
          border: `1px solid ${theme.vars.palette.surface.borderStrong}`,
          boxShadow: '0 12px 32px -12px rgba(0,0,0,0.6)',
        }),
        arrow: ({ theme }) => ({
          color: theme.vars.palette.surface.raised,
          '&::before': { border: `1px solid ${theme.vars.palette.surface.borderStrong}` },
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 24,
          backgroundColor: theme.vars.palette.surface.base,
          border: `1px solid ${theme.vars.palette.surface.borderStrong}`,
          boxShadow: '0 40px 120px -30px rgba(0,0,0,0.75)',
          ...theme.applyStyles('light', { boxShadow: '0 40px 120px -40px rgba(20,24,60,0.35)' }),
        }),
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: 'rgba(3, 4, 10, 0.72)',
          backdropFilter: 'blur(6px)',
          ...theme.applyStyles('light', { backgroundColor: 'rgba(210, 214, 235, 0.6)' }),
          '&.MuiBackdrop-invisible': { backgroundColor: 'transparent', backdropFilter: 'none' },
        }),
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { width: 42, height: 26, padding: 0 },
        switchBase: ({ theme }) => ({
          padding: 3,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: theme.vars.palette.primary.main,
              opacity: 1,
            },
          },
        }),
        thumb: { width: 20, height: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.35)' },
        track: ({ theme }) => ({
          borderRadius: 13,
          opacity: 1,
          backgroundColor: theme.vars.palette.surface.borderStrong,
        }),
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.vars.palette.text.disabled,
          '&.Mui-checked': { color: theme.vars.palette.primary.main },
        }),
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: 6,
          borderRadius: 6,
          backgroundColor: theme.vars.palette.surface.sunken,
        }),
        bar: ({ theme }) => ({
          borderRadius: 6,
          backgroundImage: `linear-gradient(90deg, ${theme.vars.palette.secondary.main}, ${theme.vars.palette.primary.main})`,
        }),
      },
    },
    MuiDivider: {
      styleOverrides: { root: ({ theme }) => ({ borderColor: theme.vars.palette.surface.border }) },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          marginTop: 6,
          borderRadius: 12,
          backgroundColor: theme.vars.palette.surface.raised,
          border: `1px solid ${theme.vars.palette.surface.borderStrong}`,
          boxShadow: '0 24px 60px -20px rgba(0,0,0,0.6)',
        }),
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          backgroundColor: theme.vars.palette.surface.sunken,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.surface.borderStrong,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.text.disabled,
          },
        }),
        input: { fontFamily: FONT_MONO, fontSize: '0.875rem' },
      },
    },
  },
});
