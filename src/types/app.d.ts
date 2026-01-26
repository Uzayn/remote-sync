// Temporary workaround for missing $app/environment types
declare module '$app/environment' {
	export const browser: boolean;
	export const dev: boolean;
	export const building: boolean;
	export const version: string;
}

declare module '$app/stores' {
	import { writable } from 'svelte/store';
	export const navigating: writable<import('@sveltejs/kit').Navigation | null>;
	export const page: writable<import('@sveltejs/kit').Page>;
	export const session: writable<any>;
}

declare module '$app/navigation' {
	export function goto(href: string, opts?: { replaceState?: boolean; noScroll?: boolean; keepfocus?: boolean; state?: any }): Promise<void>;
	export function pushState(href: string, state?: any): void;
	export function replaceState(href: string, state?: any): void;
	export function preloadCode(code: () => Promise<any>): Promise<void>;
}
