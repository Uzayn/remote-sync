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

export function getTimeInTimezone(timezone: string, date = new Date()): Date {
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

	const parts = formatter.formatToParts(date);
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

export function formatTime(timezone: string, date = new Date()): string {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	}).format(date);
}

export function formatTimeWithSeconds(timezone: string, date = new Date()): string {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true
	}).format(date);
}

export function getHourInTimezone(timezone: string, date = new Date()): number {
	const time = getTimeInTimezone(timezone, date);
	return time.getHours();
}

export function getMinutesInTimezone(timezone: string, date = new Date()): number {
	const time = getTimeInTimezone(timezone, date);
	return time.getHours() * 60 + time.getMinutes();
}

export function getTimePeriod(timezone: string, date = new Date()): TimePeriod {
	const hour = getHourInTimezone(timezone, date);

	if (hour >= 0 && hour < 6) return 'night';
	if (hour >= 6 && hour < 12) return 'morning';
	if (hour >= 12 && hour < 18) return 'afternoon';
	if (hour >= 18 && hour < 21) return 'evening';
	return 'latenight';
}

export function getReachability(timezone: string, date = new Date()): Reachability {
	const hour = getHourInTimezone(timezone, date);

	if (hour >= 9 && hour < 18) return 'good';
	if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 21)) return 'maybe';
	return 'avoid';
}

export function getTimezoneOffset(timezone: string, date = new Date()): string {
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		timeZoneName: 'shortOffset'
	});

	const parts = formatter.formatToParts(date);
	const offsetPart = parts.find((p) => p.type === 'timeZoneName');
	return offsetPart?.value || '';
}

export function formatTimezoneLabel(timezone: string): string {
	const offset = getTimezoneOffset(timezone);
	const city = getCityName(timezone);
	return `${city} (${offset})`;
}

export function getCityName(timezone: string): string {
	return timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
}

export function formatLocalDate(timezone: string, date = new Date()): string {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	}).format(date);
}

function getCalendarDay(timezone: string, date: Date): number {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: timezone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).formatToParts(date);
	const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
	return Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day));
}

export function getDayRelation(timezone: string, baseTimezone: string, date = new Date()): string {
	const difference = Math.round(
		(getCalendarDay(timezone, date) - getCalendarDay(baseTimezone, date)) / 86_400_000
	);

	if (difference === 0) return 'Today';
	if (difference === 1) return 'Tomorrow';
	if (difference === -1) return 'Yesterday';
	return difference > 0 ? `+${difference} days` : `${difference} days`;
}

export function getTimezoneOffsetMinutes(timezone: string, date = new Date()): number {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		timeZoneName: 'longOffset'
	}).formatToParts(date);
	const value = parts.find((part) => part.type === 'timeZoneName')?.value || 'GMT';
	const match = value.match(/^GMT(?:(\+|-)(\d{1,2})(?::?(\d{2}))?)?$/);

	if (!match || !match[1]) return 0;
	const minutes = Number(match[2]) * 60 + Number(match[3] || 0);
	return match[1] === '-' ? -minutes : minutes;
}

export function getRelativeOffsetMinutes(
	timezone: string,
	baseTimezone: string,
	date = new Date()
): number {
	return getTimezoneOffsetMinutes(timezone, date) - getTimezoneOffsetMinutes(baseTimezone, date);
}

export function formatRelativeOffset(
	timezone: string,
	baseTimezone: string,
	date = new Date()
): string {
	const difference = getRelativeOffsetMinutes(timezone, baseTimezone, date);
	if (difference === 0) return 'Same time';

	const absolute = Math.abs(difference);
	const hours = Math.floor(absolute / 60);
	const minutes = absolute % 60;
	const amount = [hours ? `${hours}h` : '', minutes ? `${minutes}m` : ''].filter(Boolean).join(' ');
	return `${amount} ${difference > 0 ? 'ahead' : 'behind'}`;
}
