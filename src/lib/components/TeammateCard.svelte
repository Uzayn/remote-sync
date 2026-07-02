<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Teammate } from '$lib/stores/teammates';
	import { currentTime } from '$lib/stores/time';
	import {
		formatRelativeOffset,
		getCityName,
		getDayRelation,
		getReachability
	} from '$lib/utils/time';
	import Clock from './Clock.svelte';

	export let teammate: Teammate;
	export let myTimezone: string;

	let menuOpen = false;

	const dispatch = createEventDispatcher<{
		edit: Teammate;
		delete: Teammate;
	}>();

	$: initials =
		teammate.avatar ||
		teammate.name
			.split(' ')
			.map((name) => name[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	$: reachability = getReachability(teammate.timezone, $currentTime);
	$: status = {
		good: { label: 'Working hours', className: 'bg-available-soft text-available' },
		maybe: { label: 'Near working hours', className: 'bg-caution-soft text-caution' },
		avoid: { label: 'Outside working hours', className: 'bg-busy-soft text-busy' }
	}[reachability];
	$: dayRelation = getDayRelation(teammate.timezone, myTimezone, $currentTime);
	$: relativeOffset = formatRelativeOffset(teammate.timezone, myTimezone, $currentTime);

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') menuOpen = false;
	}

	function handleEdit() {
		menuOpen = false;
		dispatch('edit', teammate);
	}

	function handleDelete() {
		menuOpen = false;
		dispatch('delete', teammate);
	}
</script>

<svelte:window on:click={() => (menuOpen = false)} on:keydown={handleWindowKeydown} />

<article class="relative flex items-center gap-3 px-3 py-4 sm:gap-4 sm:px-5">
	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-xs font-semibold text-accent"
	>
		{initials}
	</div>

	<div class="min-w-0 flex-1">
		<div class="flex items-center gap-2">
			<h3 class="truncate text-sm font-semibold text-ink">{teammate.name}</h3>
			<span
				class="hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline-flex {status.className}"
			>
				{status.label}
			</span>
		</div>
		<p class="mt-0.5 truncate text-xs text-muted">
			{getCityName(teammate.timezone)}
			<span aria-hidden="true"> · </span>
			{relativeOffset}
		</p>
		<p class="mt-1 truncate text-[10px] font-semibold sm:hidden {status.className.split(' ')[1]}">
			{status.label}
		</p>
	</div>

	<div class="shrink-0 text-right">
		<Clock timezone={teammate.timezone} />
		<p
			class="mt-0.5 text-[10px] font-medium {dayRelation === 'Today'
				? 'text-muted'
				: 'text-caution'}"
		>
			{dayRelation}
		</p>
	</div>

	<div class="relative shrink-0">
		<button
			type="button"
			class="icon-button"
			aria-label={`Actions for ${teammate.name}`}
			aria-haspopup="menu"
			aria-expanded={menuOpen}
			on:click|stopPropagation={() => (menuOpen = !menuOpen)}
		>
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<circle cx="5" cy="12" r="1.5" />
				<circle cx="12" cy="12" r="1.5" />
				<circle cx="19" cy="12" r="1.5" />
			</svg>
		</button>

		{#if menuOpen}
			<div
				class="absolute right-0 top-11 z-30 w-36 rounded-lg border border-line bg-surface p-1 shadow-[0_12px_32px_rgba(21,32,26,0.12)]"
				role="menu"
				tabindex="-1"
				on:click|stopPropagation
				on:keydown={handleWindowKeydown}
			>
				<button
					type="button"
					class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-ink hover:bg-surface-subtle"
					role="menuitem"
					on:click={handleEdit}
				>
					<svg
						class="h-4 w-4 text-muted"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.5 5.5 4 4M4 20l4.5-1 10-10a2.12 2.12 0 0 0-3-3l-10 10L4 20Z"
						/>
					</svg>
					Edit
				</button>
				<button
					type="button"
					class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-danger-soft"
					role="menuitem"
					on:click={handleDelete}
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						aria-hidden="true"
					>
						<path stroke-linecap="round" d="M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13" />
					</svg>
					Remove
				</button>
			</div>
		{/if}
	</div>
</article>
