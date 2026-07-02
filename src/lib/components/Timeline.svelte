<script lang="ts">
	import type { Teammate } from '$lib/stores/teammates';
	import { currentTime } from '$lib/stores/time';
	import {
		formatTime,
		getCityName,
		getMinutesInTimezone,
		getReachability,
		getRelativeOffsetMinutes
	} from '$lib/utils/time';

	export let teammates: Teammate[] = [];
	export let myTimezone: string;

	const workStart = 9 * 60;
	const workEnd = 18 * 60;
	const hourLabels = ['12am', '6am', '12pm', '6pm', '12am'];

	type Segment = { left: number; width: number };

	function normalizeMinutes(minutes: number): number {
		return ((minutes % 1440) + 1440) % 1440;
	}

	function percent(minutes: number): number {
		return (minutes / 1440) * 100;
	}

	function getWorkSegments(timezone: string): Segment[] {
		const offset = getRelativeOffsetMinutes(timezone, myTimezone, $currentTime);
		const start = normalizeMinutes(workStart - offset);
		const end = normalizeMinutes(workEnd - offset);

		if (start < end) {
			return [{ left: percent(start), width: percent(end - start) }];
		}

		return [
			{ left: percent(start), width: percent(1440 - start) },
			{ left: 0, width: percent(end) }
		];
	}

	$: nowPosition = percent(getMinutesInTimezone(myTimezone, $currentTime));
</script>

<section class="surface-panel overflow-hidden" aria-labelledby="schedule-title">
	<div
		class="flex flex-col gap-3 border-b border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
	>
		<div>
			<p class="eyebrow mb-1">Shared working hours</p>
			<h2 id="schedule-title" class="text-base font-semibold text-ink">Today's overlap</h2>
		</div>
		<div class="flex items-center gap-4 text-xs text-muted" aria-label="Schedule legend">
			<span class="flex items-center gap-1.5">
				<span class="h-2.5 w-2.5 rounded-sm bg-available-soft ring-1 ring-available/20"></span>
				9am–6pm
			</span>
			<span class="flex items-center gap-1.5">
				<span class="h-3 w-px bg-accent"></span>
				Now
			</span>
		</div>
	</div>

	<div class="px-4 py-5 sm:px-5">
		<div
			class="mb-2 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5"
		>
			<div></div>
			<div class="flex justify-between font-mono text-[10px] text-muted" aria-hidden="true">
				{#each hourLabels as label}
					<span>{label}</span>
				{/each}
			</div>
		</div>

		<div class="space-y-3">
			{#each teammates as teammate (teammate.id)}
				{@const isWorking = getReachability(teammate.timezone, $currentTime) === 'good'}
				<div
					class="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5"
				>
					<div class="min-w-0">
						<p class="truncate text-xs font-semibold text-ink sm:text-sm">{teammate.name}</p>
						<p class="truncate text-[10px] text-muted sm:text-xs">
							{getCityName(teammate.timezone)} · {formatTime(teammate.timezone, $currentTime)}
						</p>
					</div>

					<div
						class="relative h-8 overflow-hidden rounded-md border border-line bg-surface-subtle"
						aria-label={`${teammate.name}'s working hours shown in your local time`}
					>
						<div class="absolute inset-y-0 left-1/4 w-px bg-line"></div>
						<div class="absolute inset-y-0 left-1/2 w-px bg-line"></div>
						<div class="absolute inset-y-0 left-3/4 w-px bg-line"></div>

						{#each getWorkSegments(teammate.timezone) as segment}
							<div
								class="absolute inset-y-1 rounded-sm bg-available-soft ring-1 ring-inset ring-available/10"
								style={`left: ${segment.left}%; width: ${segment.width}%;`}
							></div>
						{/each}

						<div class="absolute inset-y-0 z-10 w-px bg-accent" style={`left: ${nowPosition}%;`}>
							<span
								class="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface {isWorking
									? 'bg-available'
									: 'bg-busy'}"
							></span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
