<script lang="ts">
	import { onMount } from 'svelte';
	import { appStore, type Teammate } from '$lib/stores/teammates';
	import { formatTimezoneLabel, getLocalTimezone, getReachability } from '$lib/utils/time';
	import TeammateCard from '$lib/components/TeammateCard.svelte';
	import TeammateForm from '$lib/components/TeammateForm.svelte';
	import Clock from '$lib/components/Clock.svelte';
	import Timeline from '$lib/components/Timeline.svelte';

	let showForm = false;
	let editingTeammate: Teammate | null = null;
	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	function handleAddClick() {
		editingTeammate = null;
		showForm = true;
	}

	function handleEdit(event: CustomEvent<Teammate>) {
		editingTeammate = event.detail;
		showForm = true;
	}

	function handleDelete(event: CustomEvent<string>) {
		if (confirm('Are you sure you want to remove this teammate?')) {
			appStore.removeTeammate(event.detail);
		}
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

	// Group teammates by reachability
	$: groupedTeammates = {
		good: $appStore.teammates.filter(t => getReachability(t.timezone) === 'good'),
		maybe: $appStore.teammates.filter(t => getReachability(t.timezone) === 'maybe'),
		avoid: $appStore.teammates.filter(t => getReachability(t.timezone) === 'avoid')
	};
</script>

<svelte:head>
	<title>Remote Sync - Remote Team Timezone Tracker</title>
</svelte:head>

<!-- Header bar -->
<div class="flex items-center justify-between mb-6">
	<div>
		<div class="flex items-baseline gap-2">
			{#if mounted}
				<Clock timezone={$appStore.myTimezone} />
			{:else}
				<span class="font-mono text-sm font-semibold">--:-- --</span>
			{/if}
			<span class="text-xs text-muted">
				{formatTimezoneLabel($appStore.myTimezone)}
			</span>
		</div>
	</div>
	<button
		on:click={handleAddClick}
		class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-cream rounded-lg hover:bg-ink/90 transition-colors text-sm font-medium"
	>
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
		</svg>
		<span class="hidden sm:inline">Add</span>
	</button>
</div>

<!-- Timeline visualization -->
{#if mounted && $appStore.teammates.length > 0}
	<Timeline teammates={$appStore.teammates} myTimezone={$appStore.myTimezone} />
{/if}

<!-- Teammates list -->
{#if $appStore.teammates.length === 0}
	<div class="text-center py-20">
		<svg class="w-16 h-16 mx-auto mb-4 text-ink/10" viewBox="0 0 24 24" fill="currentColor">
			<path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
		</svg>
		<h2 class="font-semibold mb-1">No teammates yet</h2>
		<p class="text-sm text-muted mb-6">Add your team to see their local time at a glance</p>
		<button
			on:click={handleAddClick}
			class="inline-flex items-center gap-2 px-4 py-2 bg-ink text-cream rounded-lg hover:bg-ink/90 transition-colors text-sm font-medium"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Add your first teammate
		</button>
	</div>
{:else}
	<!-- Available -->
	{#if groupedTeammates.good.length > 0}
		<section class="mb-6">
			<h2 class="text-xs font-medium text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
				<span class="w-1.5 h-1.5 rounded-full bg-available"></span>
				Available ({groupedTeammates.good.length})
			</h2>
			<div class="flex flex-col gap-2">
				{#each groupedTeammates.good as teammate (teammate.id)}
					<TeammateCard {teammate} on:edit={handleEdit} on:delete={handleDelete} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Maybe -->
	{#if groupedTeammates.maybe.length > 0}
		<section class="mb-6">
			<h2 class="text-xs font-medium text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
				<span class="w-1.5 h-1.5 rounded-full bg-caution"></span>
				Maybe ({groupedTeammates.maybe.length})
			</h2>
			<div class="flex flex-col gap-2">
				{#each groupedTeammates.maybe as teammate (teammate.id)}
					<TeammateCard {teammate} on:edit={handleEdit} on:delete={handleDelete} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Busy -->
	{#if groupedTeammates.avoid.length > 0}
		<section class="mb-6">
			<h2 class="text-xs font-medium text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
				<span class="w-1.5 h-1.5 rounded-full bg-busy"></span>
				Busy ({groupedTeammates.avoid.length})
			</h2>
			<div class="flex flex-col gap-2">
				{#each groupedTeammates.avoid as teammate (teammate.id)}
					<TeammateCard {teammate} on:edit={handleEdit} on:delete={handleDelete} />
				{/each}
			</div>
		</section>
	{/if}
{/if}

<TeammateForm
	open={showForm}
	teammate={editingTeammate}
	on:save={handleSave}
	on:close={handleCloseForm}
/>
