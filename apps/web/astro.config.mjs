import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://marcorojas17.github.io',
  base: '/Movimiento-simbi-tico-digital',
  outDir: './dist',
  build: {
    assets: 'assets',
  },
});
