export type TimePeriod = 'night' | 'morning' | 'afternoon' | 'evening' | 'latenight';
export type Reachability = 'good' | 'maybe' | 'avoid';

export function getLocalTimezone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getAllTimezones(): string[] {
	try {
		return Intl.supportedValuesOf('timeZone');
	} catch {
		// Fallback for older browsers
		return [
			'America/New_York',
			'America/Chicago',
			'America/Denver',
			'America/Los_Angeles',
			'America/Anchorage',
			'Pacific/Honolulu',
			'Europe/London',
			'Europe/Paris',
			'Europe/Berlin',
			'Europe/Moscow',
			'Asia/Dubai',
			'Asia/Kolkata',
			'Asia/Bangkok',
			'Asia/Singapore',
			'Asia/Tokyo',
			'Asia/Shanghai',
			'Australia/Sydney',
			'Pacific/Auckland'
		];
	}
}

export function getTimeInTimezone(timezone: string): Date {
	const now = new Date();
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	});

	const parts = formatter.formatToParts(now);
	const values: Record<string, string> = {};
	for (const part of parts) {
		values[part.type] = part.value;
	}

	return new Date(
		parseInt(values.year),
		parseInt(values.month) - 1,
		parseInt(values.day),
		parseInt(values.hour),
		parseInt(values.minute),
		parseInt(values.second)
	);
}

export function formatTime(timezone: string): string {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	}).format(new Date());
}

export function formatTimeWithSeconds(timezone: string): string {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true
	}).format(new Date());
}

export function getHourInTimezone(timezone: string): number {
	const time = getTimeInTimezone(timezone);
	return time.getHours();
}

export function getTimePeriod(timezone: string): TimePeriod {
	const hour = getHourInTimezone(timezone);

	if (hour >= 0 && hour < 6) return 'night';
	if (hour >= 6 && hour < 12) return 'morning';
	if (hour >= 12 && hour < 18) return 'afternoon';
	if (hour >= 18 && hour < 21) return 'evening';
	return 'latenight';
}

export function getReachability(timezone: string): Reachability {
	const hour = getHourInTimezone(timezone);

	if (hour >= 9 && hour < 18) return 'good';
	if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 21)) return 'maybe';
	return 'avoid';
}

export function getTimezoneOffset(timezone: string): string {
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		timeZoneName: 'shortOffset'
	});

	const parts = formatter.formatToParts(new Date());
	const offsetPart = parts.find(p => p.type === 'timeZoneName');
	return offsetPart?.value || '';
}

export function formatTimezoneLabel(timezone: string): string {
	const offset = getTimezoneOffset(timezone);
	const city = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
	return `${city} (${offset})`;
}
