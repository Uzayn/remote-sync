<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { formatTime } from '$lib/utils/time';

	export let timezone: string;

	let time = formatTime(timezone);
	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		time = formatTime(timezone);
		interval = setInterval(() => {
			time = formatTime(timezone);
		}, 1000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	$: if (timezone) {
		time = formatTime(timezone);
	}
</script>

<span class="font-mono text-sm font-semibold tabular-nums">{time}</span>
