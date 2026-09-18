import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync, existsSync } from 'node:fs'

const root = dirname(fileURLToPath(import.meta.url))

/* Case-study pages are generated into /work/ by scripts/gen-cases.mjs
   (run by the pre-dev / pre-build hooks), so pick them up dynamically. */
const workDir = resolve(root, 'work')
const casePages = existsSync(workDir)
  ? Object.fromEntries(
      readdirSync(workDir)
        .filter((f) => f.endsWith('.html'))
        .map((f) => [`work-${f.replace(/\.html$/, '')}`, resolve(workDir, f)])
    )
  : {}

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        work: resolve(root, 'work.html'),
        about: resolve(root, 'about.html'),
        legal: resolve(root, 'legal.html'),
        ...casePages,
      },
    },
  },
})
