<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let open = false;
	export let title = 'Confirm action';
	export let description = '';

	const dispatch = createEventDispatcher<{ confirm: void; cancel: void }>();
	let cancelButton: HTMLButtonElement;
	let dialog: HTMLDivElement;
	let wasOpen = false;
	let previousFocus: HTMLElement | null = null;

	$: if (open && !wasOpen) {
		wasOpen = true;
		previousFocus = document.activeElement as HTMLElement;
		tick().then(() => cancelButton?.focus());
	}

	$: if (!open && wasOpen) {
		wasOpen = false;
		tick().then(() => previousFocus?.focus());
	}

	function cancel() {
		dispatch('cancel');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			cancel();
			return;
		}

		if (event.key !== 'Tab' || !dialog) return;
		const focusable = Array.from(
			dialog.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
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
		aria-label="Cancel removal"
		class="fixed inset-0 z-[60] cursor-default bg-ink/35 backdrop-blur-[2px]"
		on:click={cancel}
		transition:fade={{ duration: 140 }}
	></button>

	<div class="fixed inset-0 z-[70] flex items-center justify-center p-4">
		<div
			bind:this={dialog}
			role="alertdialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="confirm-title"
			aria-describedby="confirm-description"
			class="w-full max-w-sm rounded-2xl border border-line bg-surface p-5 shadow-[0_24px_70px_rgba(20,31,25,0.18)] sm:p-6"
			on:keydown={handleKeydown}
			transition:fly={{ y: 12, duration: 160 }}
		>
			<div
				class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-danger-soft text-danger"
			>
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					aria-hidden="true"
				>
					<path stroke-linecap="round" d="M5 7h14M9 7V4h6v3m-8 0 1 13h8l1-13" />
				</svg>
			</div>
			<h2 id="confirm-title" class="text-lg font-semibold text-ink">{title}</h2>
			<p id="confirm-description" class="mt-2 text-sm leading-6 text-muted">{description}</p>

			<div class="mt-6 flex gap-3 sm:justify-end">
				<button
					bind:this={cancelButton}
					type="button"
					class="button-secondary flex-1 sm:flex-none"
					on:click={cancel}
				>
					Cancel
				</button>
				<button
					type="button"
					class="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/90 sm:flex-none"
					on:click={() => dispatch('confirm')}
				>
					Remove
				</button>
			</div>
		</div>
	</div>
{/if}
