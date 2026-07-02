/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
			},
			colors: {
				canvas: '#f6f7f5',
				surface: '#ffffff',
				'surface-subtle': '#f0f2ef',
				ink: '#1b211e',
				muted: '#69736d',
				line: '#e1e5e1',
				'line-strong': '#cdd3ce',
				accent: '#2f6b50',
				'accent-strong': '#24543e',
				'accent-soft': '#e7f0ea',
				available: '#2f7653',
				'available-soft': '#e4f2e9',
				caution: '#90651b',
				'caution-soft': '#f8efd9',
				busy: '#737b76',
				'busy-soft': '#eef0ee',
				danger: '#b42318',
				'danger-soft': '#fef0ed'
			}
		}
	},
	plugins: []
};
