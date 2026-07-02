<script lang="ts">
	import { onMount } from 'svelte';
	import { appStore, type Teammate } from '$lib/stores/teammates';
	import { currentTime } from '$lib/stores/time';
	import {
		formatLocalDate,
		formatTimezoneLabel,
		getAllTimezones,
		getReachability
	} from '$lib/utils/time';
	import Clock from '$lib/components/Clock.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import TeammateCard from '$lib/components/TeammateCard.svelte';
	import TeammateForm from '$lib/components/TeammateForm.svelte';
	import Timeline from '$lib/components/Timeline.svelte';

	let showForm = false;
	let editingTeammate: Teammate | null = null;
	let pendingDelete: Teammate | null = null;
	let mounted = false;

	const allTimezones = getAllTimezones();
	const reachabilityOrder = { good: 0, maybe: 1, avoid: 2 };

	onMount(() => {
		mounted = true;
	});

	$: sortedTeammates = [...$appStore.teammates].sort((first, second) => {
		const statusDifference =
			reachabilityOrder[getReachability(first.timezone, $currentTime)] -
			reachabilityOrder[getReachability(second.timezone, $currentTime)];
		return statusDifference || first.name.localeCompare(second.name);
	});
	$: workingCount = $appStore.teammates.filter(
		(teammate) => getReachability(teammate.timezone, $currentTime) === 'good'
	).length;

	function handleAddClick() {
		editingTeammate = null;
		showForm = true;
	}

	function handleEdit(event: CustomEvent<Teammate>) {
		editingTeammate = event.detail;
		showForm = true;
	}

	function handleDelete(event: CustomEvent<Teammate>) {
		pendingDelete = event.detail;
	}

	function confirmDelete() {
		if (pendingDelete) appStore.removeTeammate(pendingDelete.id);
		pendingDelete = null;
	}

	function handleSave(event: CustomEvent<Omit<Teammate, 'id'> & { id?: string }>) {
		const { id, ...data } = event.detail;
		if (id) {
			appStore.updateTeammate(id, data);
		} else {
			appStore.addTeammate(data);
		}
	}

	function handleCloseForm() {
		showForm = false;
		editingTeammate = null;
	}

	function handleMyTimezoneChange(event: Event) {
		appStore.setMyTimezone((event.currentTarget as HTMLSelectElement).value);
	}
</script>

<svelte:head>
	<title>Remote Sync — Team timezone planner</title>
	<meta
		name="description"
		content="See your remote team's local time and working-hours overlap at a glance."
	/>
</svelte:head>

<div class="mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
	<div class="max-w-2xl">
		<p class="eyebrow mb-2">Team availability</p>
		<h1 class="text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-[30px]">
			Know when to reach out.
		</h1>
		<p class="mt-2 max-w-xl text-sm leading-6 text-muted">
			Compare local time and working hours without doing timezone arithmetic in your head.
		</p>
	</div>
	<button type="button" on:click={handleAddClick} class="button-primary w-full sm:w-auto">
		<svg
			class="h-4 w-4"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			stroke-width="2"
			aria-hidden="true"
		>
			<path stroke-linecap="round" d="M12 5v14M5 12h14" />
		</svg>
		Add teammate
	</button>
</div>

<section
	class="surface-panel mb-5 grid gap-5 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5"
	aria-labelledby="local-time-title"
>
	<div>
		<p id="local-time-title" class="eyebrow mb-1.5">Your local time</p>
		<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
			{#if mounted}
				<Clock timezone={$appStore.myTimezone} size="lg" />
			{:else}
				<span class="font-mono text-2xl font-semibold text-ink sm:text-[28px]">--:-- --</span>
			{/if}
			<span class="text-sm text-muted">
				{mounted ? formatLocalDate($appStore.myTimezone, $currentTime) : 'Loading local date'}
			</span>
		</div>
	</div>

	<div class="min-w-0 sm:w-64">
		<label for="my-timezone" class="mb-1.5 block text-xs font-semibold text-muted"
			>Your timezone</label
		>
		<div class="relative">
			<select
				id="my-timezone"
				value={$appStore.myTimezone}
				on:change={handleMyTimezoneChange}
				class="field-control appearance-none pr-9"
			>
				{#each allTimezones as timezone}
					<option value={timezone}>{formatTimezoneLabel(timezone)}</option>
				{/each}
			</select>
			<svg
				class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m8 10 4 4 4-4" />
			</svg>
		</div>
	</div>
</section>

{#if mounted && $appStore.teammates.length > 0}
	<div class="mb-7">
		<Timeline teammates={sortedTeammates} myTimezone={$appStore.myTimezone} />
	</div>
{/if}

<section aria-labelledby="teammates-title">
	<div class="mb-3 flex items-end justify-between gap-4">
		<div>
			<h2 id="teammates-title" class="text-base font-semibold text-ink">Teammates</h2>
			{#if $appStore.teammates.length > 0}
				<p class="mt-0.5 text-xs text-muted">
					{workingCount} of {$appStore.teammates.length} currently in working hours
				</p>
			{/if}
		</div>
	</div>

	{#if $appStore.teammates.length === 0}
		<div class="surface-panel px-5 py-12 text-center sm:py-16">
			<div
				class="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface-subtle text-muted"
			>
				<svg
					class="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					aria-hidden="true"
				>
					<circle cx="9" cy="8" r="3" />
					<path
						stroke-linecap="round"
						d="M3.5 19a5.5 5.5 0 0 1 11 0M16 8.5a2.5 2.5 0 1 1 1 4.79M17 15.5A4.5 4.5 0 0 1 21 20"
					/>
				</svg>
			</div>
			<h3 class="text-base font-semibold text-ink">Build your team view</h3>
			<p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
				Add a teammate to compare their local time and see where your working hours overlap.
			</p>
			<button type="button" on:click={handleAddClick} class="button-secondary mt-6">
				Add your first teammate
			</button>
		</div>
	{:else}
		<div class="surface-panel divide-y divide-line">
			{#each sortedTeammates as teammate (teammate.id)}
				<TeammateCard
					{teammate}
					myTimezone={$appStore.myTimezone}
					on:edit={handleEdit}
					on:delete={handleDelete}
				/>
			{/each}
		</div>
	{/if}
</section>

<TeammateForm
	open={showForm}
	teammate={editingTeammate}
	on:save={handleSave}
	on:close={handleCloseForm}
/>

<ConfirmDialog
	open={pendingDelete !== null}
	title="Remove teammate?"
	description={pendingDelete
		? `${pendingDelete.name} will be removed from this local workspace.`
		: ''}
	on:confirm={confirmDelete}
	on:cancel={() => (pendingDelete = null)}
/>
