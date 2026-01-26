<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Teammate } from '$lib/stores/teammates';
	import { formatTimezoneLabel, getReachability } from '$lib/utils/time';
	import Clock from './Clock.svelte';
	import TimeIndicator from './TimeIndicator.svelte';

	export let teammate: Teammate;

	const dispatch = createEventDispatcher<{
		edit: Teammate;
		delete: string;
	}>();

	$: initials = teammate.avatar || teammate.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
	$: reachability = getReachability(teammate.timezone);

	$: borderColor = {
		good: 'border-l-available',
		maybe: 'border-l-caution',
		avoid: 'border-l-busy'
	}[reachability];
</script>

<div class="group bg-paper border border-ink/10 border-l-4 {borderColor} rounded-lg px-4 py-3 hover:bg-cream transition-colors flex items-center gap-4">
	<!-- Avatar -->
	<div class="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center font-medium text-xs text-muted shrink-0">
		{initials}
	</div>

	<!-- Name & timezone -->
	<div class="flex-1 min-w-0">
		<h3 class="font-medium text-sm">{teammate.name}</h3>
		<p class="text-xs text-muted hidden sm:block truncate">{formatTimezoneLabel(teammate.timezone)}</p>
	</div>

	<!-- Time -->
	<div class="shrink-0">
		<Clock timezone={teammate.timezone} />
	</div>

	<!-- Time of day -->
	<div class="shrink-0 hidden sm:block">
		<TimeIndicator timezone={teammate.timezone} />
	</div>

	<!-- Actions -->
	<div class="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
		<button
			on:click={() => dispatch('edit', teammate)}
			class="p-1.5 text-muted hover:text-ink hover:bg-ink/5 rounded transition-colors"
			title="Edit"
		>
			<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
			</svg>
		</button>
		<button
			on:click={() => dispatch('delete', teammate.id)}
			class="p-1.5 text-muted hover:text-busy hover:bg-busy/5 rounded transition-colors"
			title="Delete"
		>
			<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
</div>
