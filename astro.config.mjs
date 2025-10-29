// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Define un site válido para evitar "Invalid URL" cuando algún código use import.meta.env.SITE
  site: 'http://localhost:4321/en',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()], // con estas versiones, esto funciona sin cast
  },
  outDir: 'dist',
})
