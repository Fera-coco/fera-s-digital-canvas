// The theme is fixed at build time (VITE_THEME), so each build only ships its own look.
if (import.meta.env.VITE_THEME === 'blue') import('./blue/main')
else import('./crimson/main')
