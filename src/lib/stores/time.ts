import { browser } from '$app/environment';
import { readable } from 'svelte/store';

export const currentTime = readable(new Date(), (set) => {
	if (!browser) return;

	const update = () => set(new Date());
	const interval = setInterval(update, 30_000);
	return () => clearInterval(interval);
});
