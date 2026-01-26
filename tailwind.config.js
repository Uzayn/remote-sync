/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['Space Mono', 'monospace']
			},
			colors: {
				// Base palette - warm neutrals
				cream: '#fafaf9',
				paper: '#f5f5f4',
				ink: '#1c1917',
				muted: '#78716c',
				// Status - softer, more modern
				available: '#22c55e',
				caution: '#eab308',
				busy: '#ef4444'
			}
		}
	},
	plugins: []
};
