<script lang="ts">
	import { getTimePeriod, type TimePeriod } from '$lib/utils/time';

	export let timezone: string;

	$: period = getTimePeriod(timezone);
</script>

{#if period === 'night' || period === 'latenight'}
	<!-- Moon -->
	<svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
		<path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
	</svg>
{:else if period === 'morning'}
	<!-- Sunrise -->
	<svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M12 2v3m0 14v3m-7.07-7.07l2.12 2.12m9.9-9.9l2.12 2.12M2 12h3m14 0h3M5.636 5.636l2.122 2.122m8.484 8.484l2.122 2.122" />
		<circle cx="12" cy="12" r="4" fill="currentColor" />
	</svg>
{:else if period === 'afternoon'}
	<!-- Sun -->
	<svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
	</svg>
{:else}
	<!-- Sunset/Evening -->
	<svg class="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<path d="M12 3v1m0 16v1m-7.07-2.93l.7-.7m12.73-12.73l.7-.7M3 12h1m16 0h1m-2.93 7.07l-.7-.7M6.34 6.34l-.7-.7" />
		<path d="M17 12a5 5 0 01-10 0" fill="currentColor" />
		<path d="M3 17h18" />
	</svg>
{/if}
