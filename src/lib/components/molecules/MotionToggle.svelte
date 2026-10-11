<script lang="ts">
	import { onMount } from 'svelte';
	import { initMotion, motion, setMotion } from '$lib/motion/prefs.svelte';

	onMount(initMotion);
</script>

<button
	type="button"
	aria-pressed={motion.on}
	onclick={() => setMotion(!motion.on)}
	class="fixed right-3 bottom-3 z-40 inline-flex min-h-11 cursor-pointer items-center gap-2.5 border-2 border-primary bg-surface px-3.5 text-xs font-semibold tracking-widest text-primary uppercase shadow-[4px_4px_0_var(--color-secondary)] transition-transform hover:-translate-y-0.5 sm:right-5 sm:bottom-5 max-sm:size-11 max-sm:justify-center max-sm:px-0"
>
	<span
		aria-hidden="true"
		class="size-2.5 rounded-full {motion.on ? 'bg-accent' : 'bg-muted/50'}"
	></span>
	<span class="max-sm:sr-only">Animaciones: {motion.on ? 'sí' : 'no'}</span>
</button>
