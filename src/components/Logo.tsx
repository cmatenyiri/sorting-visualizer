import Box from '@mui/material/Box';
import { useId } from 'react';

export function LogoMark({ size = 32 }: { size?: number }) {
  const id = useId();
  return (
    <Box
      component="svg"
      viewBox="0 0 32 32"
      aria-hidden
      sx={{ width: size, height: size, display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient
          id={`${id}-bg`}
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#A294FF" />
          <stop offset="0.55" stopColor="#6A55F5" />
          <stop offset="1" stopColor="#3B2BB8" />
        </linearGradient>
        <linearGradient id={`${id}-hi`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7CF2DC" />
          <stop offset="1" stopColor="#2EE6C5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${id}-bg)`} />
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="8.5"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
      />
      <rect x="7" y="18" width="3.6" height="7" rx="1.2" fill="rgba(255,255,255,0.55)" />
      <rect x="12.5" y="14" width="3.6" height="11" rx="1.2" fill="rgba(255,255,255,0.7)" />
      <rect x="18" y="10.5" width="3.6" height="14.5" rx="1.2" fill="rgba(255,255,255,0.88)" />
      <rect x="23.4" y="6.5" width="3.6" height="18.5" rx="1.2" fill={`url(#${id}-hi)`} />
    </Box>
  );
}
