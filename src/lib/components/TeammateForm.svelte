<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import type { Teammate } from '$lib/stores/teammates';
	import { formatTimezoneLabel, getAllTimezones, getCityName } from '$lib/utils/time';

	export let teammate: Teammate | null = null;
	export let open = false;

	const dispatch = createEventDispatcher<{
		save: Omit<Teammate, 'id'> & { id?: string };
		close: void;
	}>();

	let name = '';
	let timezone = '';
	let searchQuery = '';
	let dialog: HTMLDivElement;
	let nameInput: HTMLInputElement;
	let previousFocus: HTMLElement | null = null;
	let wasOpen = false;

	const allTimezones = getAllTimezones();

	$: filteredTimezones = (
		searchQuery
			? allTimezones.filter((timezoneOption) =>
					`${timezoneOption} ${formatTimezoneLabel(timezoneOption)}`
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
				)
			: allTimezones
	).slice(0, 60);

	$: isEditing = teammate !== null;

	$: if (open && !wasOpen) {
		wasOpen = true;
		previousFocus = document.activeElement as HTMLElement;
		name = teammate?.name || '';
		timezone = teammate?.timezone || '';
		searchQuery = '';
		tick().then(() => nameInput?.focus());
	}

	$: if (!open && wasOpen) {
		wasOpen = false;
		tick().then(() => previousFocus?.focus());
	}

	function handleSubmit() {
		if (!name.trim() || !timezone) return;

		dispatch('save', {
			id: teammate?.id,
			name: name.trim(),
			timezone,
			avatar: teammate?.avatar
		});

		handleClose();
	}

	function handleClose() {
		dispatch('close');
	}

	function selectTimezone(timezoneOption: string) {
		timezone = timezoneOption;
		searchQuery = '';
	}

	function handleDialogKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			handleClose();
			return;
		}

		if (event.key !== 'Tab' || !dialog) return;
		const focusable = Array.from(
			dialog.querySelectorAll<HTMLElement>(
				'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		);
		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last?.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first?.focus();
		}
	}
</script>

{#if open}
	<button
		type="button"
		tabindex="-1"
		aria-label="Close teammate dialog"
		class="fixed inset-0 z-40 cursor-default bg-ink/35 backdrop-blur-[2px]"
		on:click={handleClose}
		transition:fade={{ duration: 160 }}
	></button>

	<div class="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
		<div
			bind:this={dialog}
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="teammate-dialog-title"
			class="flex max-h-[calc(100vh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_70px_rgba(20,31,25,0.18)]"
			on:keydown={handleDialogKeydown}
			transition:fly={{ y: 16, duration: 180 }}
		>
			<div class="flex items-start justify-between border-b border-line px-5 py-4 sm:px-6 sm:py-5">
				<div>
					<p class="eyebrow mb-1">Team member</p>
					<h2 id="teammate-dialog-title" class="text-lg font-semibold text-ink">
						{isEditing ? 'Edit teammate' : 'Add teammate'}
					</h2>
				</div>
				<button
					type="button"
					on:click={handleClose}
					class="icon-button -mr-2"
					aria-label="Close dialog"
				>
					<svg
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						stroke-width="1.8"
						aria-hidden="true"
					>
						<path stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
					</svg>
				</button>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="flex min-h-0 flex-1 flex-col">
				<div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
					<div>
						<label for="name" class="mb-1.5 block text-sm font-semibold text-ink">Name</label>
						<input
							bind:this={nameInput}
							type="text"
							id="name"
							bind:value={name}
							placeholder="e.g. Maya Chen"
							autocomplete="off"
							required
							class="field-control"
						/>
					</div>

					<div>
						<label for="timezone-search" class="mb-1.5 block text-sm font-semibold text-ink">
							Timezone
						</label>

						{#if timezone}
							<div
								class="mb-3 flex items-center justify-between rounded-lg border border-accent/15 bg-accent-soft px-3 py-2.5"
							>
								<div class="min-w-0">
									<p class="truncate text-sm font-semibold text-accent">{getCityName(timezone)}</p>
									<p class="truncate text-xs text-accent/70">{formatTimezoneLabel(timezone)}</p>
								</div>
								<svg
									class="h-5 w-5 shrink-0 text-accent"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									stroke-width="2"
									aria-hidden="true"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
								</svg>
							</div>
						{/if}

						<div class="relative">
							<svg
								class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								aria-hidden="true"
							>
								<circle cx="11" cy="11" r="7" />
								<path stroke-linecap="round" d="m20 20-4-4" />
							</svg>
							<input
								type="search"
								id="timezone-search"
								bind:value={searchQuery}
								placeholder={timezone ? 'Search to change timezone' : 'Search city or timezone'}
								autocomplete="off"
								class="field-control pl-9"
							/>
						</div>

						{#if searchQuery || !timezone}
							<div
								class="mt-2 max-h-52 overflow-y-auto rounded-lg border border-line bg-surface"
								aria-label="Timezone results"
							>
								{#if filteredTimezones.length > 0}
									{#each filteredTimezones as timezoneOption}
										<button
											type="button"
											on:click={() => selectTimezone(timezoneOption)}
											class="flex w-full items-center justify-between gap-3 border-b border-line px-3 py-2.5 text-left last:border-0 hover:bg-surface-subtle {timezone ===
											timezoneOption
												? 'bg-accent-soft'
												: ''}"
										>
											<span class="min-w-0">
												<span class="block truncate text-sm font-medium text-ink"
													>{getCityName(timezoneOption)}</span
												>
												<span class="block truncate text-[11px] text-muted">{timezoneOption}</span>
											</span>
											<span class="shrink-0 text-xs text-muted"
												>{formatTimezoneLabel(timezoneOption).match(/\((.*)\)/)?.[1]}</span
											>
										</button>
									{/each}
								{:else}
									<p class="px-3 py-8 text-center text-sm text-muted">
										No matching timezone found.
									</p>
								{/if}
							</div>
						{/if}
					</div>
				</div>

				<div class="flex gap-3 border-t border-line bg-surface px-5 py-4 sm:justify-end sm:px-6">
					<button type="button" on:click={handleClose} class="button-secondary flex-1 sm:flex-none">
						Cancel
					</button>
					<button
						type="submit"
						disabled={!name.trim() || !timezone}
						class="button-primary flex-1 sm:flex-none"
					>
						{isEditing ? 'Save changes' : 'Add teammate'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
