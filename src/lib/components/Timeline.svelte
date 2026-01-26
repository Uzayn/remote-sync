<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Teammate } from '$lib/stores/teammates';
	import { getHourInTimezone, getReachability, formatTime } from '$lib/utils/time';

	export let teammates: Teammate[] = [];
	export let myTimezone: string;

	let currentHour = 0;
	let currentMinute = 0;
	let interval: ReturnType<typeof setInterval>;

	function updateTime() {
		const now = new Date();
		const formatter = new Intl.DateTimeFormat('en-US', {
			timeZone: myTimezone,
			hour: 'numeric',
			minute: 'numeric',
			hour12: false
		});
		const parts = formatter.formatToParts(now);
		currentHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
		currentMinute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
	}

	onMount(() => {
		updateTime();
		interval = setInterval(updateTime, 60000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	// Get position (0-100%) for an hour
	function getPosition(hour: number, minute: number = 0): number {
		return ((hour + minute / 60) / 24) * 100;
	}

	// Get teammate's current hour and minute in their timezone
	function getTeammateTime(timezone: string): { hour: number; minute: number } {
		const now = new Date();
		const formatter = new Intl.DateTimeFormat('en-US', {
			timeZone: timezone,
			hour: 'numeric',
			minute: 'numeric',
			hour12: false
		});
		const parts = formatter.formatToParts(now);
		return {
			hour: parseInt(parts.find(p => p.type === 'hour')?.value || '0'),
			minute: parseInt(parts.find(p => p.type === 'minute')?.value || '0')
		};
	}

	function getStatusColor(timezone: string): string {
		const status = getReachability(timezone);
		if (status === 'good') return 'bg-available border-available';
		if (status === 'maybe') return 'bg-caution border-caution';
		return 'bg-busy border-busy';
	}

	function getInitials(name: string): string {
		return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
	}

	$: myPosition = getPosition(currentHour, currentMinute);

	// Hour markers
	const hours = [0, 3, 6, 9, 12, 15, 18, 21];

	function formatHourLabel(h: number): string {
		if (h === 0) return '12am';
		if (h === 12) return '12pm';
		if (h < 12) return `${h}am`;
		return `${h - 12}pm`;
	}
</script>

<div class="bg-paper border border-ink/10 rounded-xl p-4 mb-6">
	<!-- Timeline container -->
	<div class="relative">
		<!-- Day/night gradient background -->
		<div class="absolute inset-0 h-16 rounded-lg overflow-hidden">
			<div class="absolute inset-0 flex">
				<!-- Night: 0-6 -->
				<div class="w-1/4 bg-slate-900/5"></div>
				<!-- Morning: 6-12 -->
				<div class="w-1/4 bg-amber-500/5"></div>
				<!-- Afternoon: 12-18 -->
				<div class="w-1/4 bg-amber-400/5"></div>
				<!-- Evening/Night: 18-24 -->
				<div class="w-1/4 bg-slate-800/5"></div>
			</div>
			<!-- Working hours overlay (9am-6pm = 37.5% to 75%) -->
			<div
				class="absolute top-0 bottom-0 bg-available/5"
				style="left: 37.5%; right: 25%;"
			></div>
		</div>

		<!-- Hour markers -->
		<div class="relative h-16 flex items-end pb-1">
			{#each hours as hour}
				<div
					class="absolute text-[10px] text-ink/40 -translate-x-1/2"
					style="left: {getPosition(hour)}%"
				>
					{formatHourLabel(hour)}
				</div>
			{/each}
		</div>

		<!-- Timeline track -->
		<div class="relative h-12 mt-2">
			<!-- Track line -->
			<div class="absolute top-1/2 left-0 right-0 h-px bg-ink/20"></div>

			<!-- Current time marker (YOU) -->
			<div
				class="absolute top-0 bottom-0 w-px bg-ink/60 z-10"
				style="left: {myPosition}%"
			>
				<div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-ink rounded-full"></div>
				<div class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-ink whitespace-nowrap">
					You
				</div>
			</div>

			<!-- Teammate markers -->
			{#each teammates as teammate (teammate.id)}
				{@const time = getTeammateTime(teammate.timezone)}
				{@const pos = getPosition(time.hour, time.minute)}
				<div
					class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-pointer z-20"
					style="left: {pos}%"
					title="{teammate.name} - {formatTime(teammate.timezone)}"
				>
					<!-- Dot -->
					<div class="w-8 h-8 rounded-full border-2 {getStatusColor(teammate.timezone)} flex items-center justify-center text-[10px] font-medium text-white shadow-sm">
						{getInitials(teammate.name)}
					</div>

					<!-- Tooltip on hover -->
					<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
						<div class="bg-ink text-cream text-xs px-2 py-1 rounded whitespace-nowrap">
							{teammate.name}
							<span class="text-ink/60 ml-1">{formatTime(teammate.timezone)}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
