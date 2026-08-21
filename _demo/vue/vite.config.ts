import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// The demo is served from https://<user>.github.io/capacitor-microphone/,
// so assets need that sub-path when built for Pages.
export default defineConfig({
  plugins: [vue()],
  base: process.env.DEMO_BASE ?? '/',
  build: { outDir: 'dist' },
});
