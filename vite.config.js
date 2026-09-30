import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// GitHub Pages serves the repo at https://<user>.github.io/<repo>/, so the
// production build is based at /Port/. `npm run dev` stays at the root.
// On a custom domain (or a <user>.github.io repo) set BASE_PATH=/ instead.
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? (process.env.BASE_PATH || '/Port/') : '/',
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        // /in/ - India contact details + India CV download.
        in: resolve(import.meta.dirname, 'in/index.html'),
      },
    },
  },
}))
