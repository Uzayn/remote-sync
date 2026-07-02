<script lang="ts">
	import { formatTime } from '$lib/utils/time';
	import { currentTime } from '$lib/stores/time';

	export let timezone: string;
	export let size: 'sm' | 'lg' = 'sm';

	$: time = formatTime(timezone, $currentTime);
</script>

<span
	class="whitespace-nowrap font-mono font-semibold tabular-nums tracking-tight {size === 'lg'
		? 'text-2xl sm:text-[28px]'
		: 'text-[15px]'}">{time}</span
>
