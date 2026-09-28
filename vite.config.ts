import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Keep framework code in long-lived chunks so app updates don't bust their cache.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            {
              name: 'mui',
              test: /node_modules[\\/](@mui|@emotion|@popperjs|react-transition-group)[\\/]/,
            },
          ],
        },
      },
    },
  },
});
