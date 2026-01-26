import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getLocalTimezone } from '$lib/utils/time';

export interface Teammate {
	id: string;
	name: string;
	timezone: string;
	avatar?: string;
}

export interface AppState {
	myTimezone: string;
	teammates: Teammate[];
}

const STORAGE_KEY = 'remote-sync-data';

function loadFromStorage(): AppState {
	if (!browser) {
		return { myTimezone: 'UTC', teammates: [] };
	}

	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch {
			// Invalid JSON, return default
		}
	}

	return {
		myTimezone: getLocalTimezone(),
		teammates: []
	};
}

function saveToStorage(state: AppState): void {
	if (browser) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}
}

function createAppStore() {
	const initial = loadFromStorage();
	const { subscribe, set, update } = writable<AppState>(initial);

	// Subscribe to changes and save to localStorage
	subscribe(state => {
		saveToStorage(state);
	});

	return {
		subscribe,

		setMyTimezone: (timezone: string) => {
			update(state => ({ ...state, myTimezone: timezone }));
		},

		addTeammate: (teammate: Omit<Teammate, 'id'>) => {
			const id = crypto.randomUUID();
			update(state => ({
				...state,
				teammates: [...state.teammates, { ...teammate, id }]
			}));
		},

		updateTeammate: (id: string, updates: Partial<Omit<Teammate, 'id'>>) => {
			update(state => ({
				...state,
				teammates: state.teammates.map(t =>
					t.id === id ? { ...t, ...updates } : t
				)
			}));
		},

		removeTeammate: (id: string) => {
			update(state => ({
				...state,
				teammates: state.teammates.filter(t => t.id !== id)
			}));
		},

		reset: () => {
			const freshState = {
				myTimezone: browser ? getLocalTimezone() : 'UTC',
				teammates: []
			};
			set(freshState);
		}
	};
}

export const appStore = createAppStore();
