<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Teammate } from '$lib/stores/teammates';
	import { getAllTimezones, formatTimezoneLabel } from '$lib/utils/time';

	export let teammate: Teammate | null = null;
	export let open = false;

	const dispatch = createEventDispatcher<{
		save: Omit<Teammate, 'id'> & { id?: string };
		close: void;
	}>();

	let name = '';
	let timezone = '';
	let avatar = '';
	let searchQuery = '';

	const allTimezones = getAllTimezones();

	$: filteredTimezones = searchQuery
		? allTimezones.filter(tz =>
			tz.toLowerCase().includes(searchQuery.toLowerCase()) ||
			formatTimezoneLabel(tz).toLowerCase().includes(searchQuery.toLowerCase())
		).slice(0, 50)
		: allTimezones.slice(0, 50);

	$: if (open) {
		if (teammate) {
			name = teammate.name;
			timezone = teammate.timezone;
			avatar = teammate.avatar || '';
		} else {
			name = '';
			timezone = '';
			avatar = '';
		}
		searchQuery = '';
	}

	$: isEditing = teammate !== null;

	function handleSubmit() {
		if (!name.trim() || !timezone) return;

		dispatch('save', {
			id: teammate?.id,
			name: name.trim(),
			timezone,
			avatar: avatar.trim() || undefined
		});

		handleClose();
	}

	function handleClose() {
		dispatch('close');
	}

	function selectTimezone(tz: string) {
		timezone = tz;
		searchQuery = '';
	}
</script>

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 bg-ink/40 z-40"
		on:click={handleClose}
		transition:fly={{ duration: 200 }}
	></div>

	<!-- Panel: bottom on mobile, right on desktop -->
	<div
		class="fixed z-50 bg-cream
			inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl
			sm:inset-y-0 sm:right-0 sm:left-auto sm:w-96 sm:max-h-none sm:rounded-none sm:rounded-l-2xl"
		transition:fly={{ y: 400, x: 0, duration: 300 }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between px-5 py-4 border-b border-ink/10">
			<h2 class="font-semibold">
				{isEditing ? 'Edit teammate' : 'Add teammate'}
			</h2>
			<button
				type="button"
				on:click={handleClose}
				class="p-1 text-muted hover:text-ink transition-colors"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Form -->
		<form on:submit|preventDefault={handleSubmit} class="p-5 space-y-5 overflow-y-auto max-h-[calc(85vh-60px)] sm:max-h-[calc(100vh-60px)]">
			<div>
				<label for="name" class="block text-sm font-medium text-ink/70 mb-1.5">Name</label>
				<input
					type="text"
					id="name"
					bind:value={name}
					placeholder="John Doe"
					required
					class="w-full px-3 py-2.5 bg-paper border border-ink/20 rounded-lg focus:border-ink/40 focus:ring-1 focus:ring-ink/10 outline-none text-sm"
				/>
			</div>

			<div>
				<label for="avatar" class="block text-sm font-medium text-ink/70 mb-1.5">
					Initials <span class="font-normal text-muted">(optional)</span>
				</label>
				<input
					type="text"
					id="avatar"
					bind:value={avatar}
					placeholder="JD"
					maxlength="2"
					class="w-full px-3 py-2.5 bg-paper border border-ink/20 rounded-lg focus:border-ink/40 focus:ring-1 focus:ring-ink/10 outline-none text-sm"
				/>
			</div>

			<div>
				<label for="timezone-search" class="block text-sm font-medium text-ink/70 mb-1.5">Timezone</label>
				<input
					type="text"
					id="timezone-search"
					bind:value={searchQuery}
					placeholder="Search (e.g. Tokyo, New York...)"
					class="w-full px-3 py-2.5 bg-paper border border-ink/20 rounded-lg focus:border-ink/40 focus:ring-1 focus:ring-ink/10 outline-none text-sm"
				/>

				{#if timezone && !searchQuery}
					<div class="mt-2 px-3 py-2 bg-available/10 text-available rounded-lg text-sm flex items-center gap-2">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
						{formatTimezoneLabel(timezone)}
					</div>
				{/if}

				<div class="mt-2 max-h-48 overflow-y-auto border border-ink/20 rounded-lg bg-paper">
					{#each filteredTimezones as tz}
						<button
							type="button"
							on:click={() => selectTimezone(tz)}
							class="w-full px-3 py-2.5 text-left text-sm hover:bg-ink/5 transition-colors border-b border-ink/5 last:border-b-0 {timezone === tz ? 'bg-ink text-cream' : ''}"
						>
							{formatTimezoneLabel(tz)}
						</button>
					{/each}
				</div>
			</div>

			<div class="flex gap-3 pt-2">
				<button
					type="button"
					on:click={handleClose}
					class="flex-1 px-4 py-2.5 border border-ink/20 text-ink/60 rounded-lg hover:bg-ink/5 transition-colors text-sm font-medium"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={!name.trim() || !timezone}
					class="flex-1 px-4 py-2.5 bg-ink text-cream rounded-lg hover:bg-ink/90 transition-colors text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
				>
					{isEditing ? 'Save' : 'Add'}
				</button>
			</div>
		</form>
	</div>
{/if}
