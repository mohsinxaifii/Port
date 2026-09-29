/* Paths to files in public/ written as '/work/x.jpg' work locally, but the
   deployed site lives under a sub-path (e.g. /Port/ on GitHub Pages).
   Wrap every public file path in asset() so it picks up that prefix. */
export const asset = (path) => (import.meta.env?.BASE_URL ?? '/') + path.replace(/^\//, '')
