<script>
	import '../app.css';
</script>

<div class="min-h-screen bg-canvas">
	<header class="border-b border-line bg-surface/95 backdrop-blur">
		<div class="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6">
			<a href="/" class="group flex items-center gap-3 rounded-lg" aria-label="Remote Sync home">
				<span
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white transition-colors group-hover:bg-accent-strong"
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="8.5" />
						<path stroke-linecap="round" d="M12 7.5V12l3 2" />
					</svg>
				</span>
				<span>
					<span class="block text-sm font-semibold leading-tight text-ink">Remote Sync</span>
					<span class="hidden text-[11px] leading-tight text-muted sm:block"
						>Team time, without the math</span
					>
				</span>
			</a>
		</div>
	</header>

	<main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
		<slot />
	</main>
</div>
