<script>
	import '../app.css';
</script>

<div class="min-h-screen bg-cream">
	<header class="bg-cream border-b border-ink/5">
		<div class="max-w-3xl mx-auto px-4 sm:px-6 py-3">
			<div class="flex items-center gap-2">
				<svg class="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<circle cx="12" cy="12" r="10" />
					<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
				</svg>
				<h1 class="font-semibold">Remote Sync</h1>
			</div>
		</div>
	</header>

	<main class="max-w-3xl mx-auto px-4 sm:px-6 py-6">
		<slot />
	</main>
</div>
