<script lang="ts">
	import { onMount } from 'svelte';
	import { registerCurtain } from '$lib/motion/transition';

	let root: HTMLDivElement;
	let label: HTMLSpanElement;
	let panelEls: HTMLDivElement[] = $state([]);

	onMount(() => registerCurtain({ root, panels: panelEls, label }));

	// Orden: secundario -> primario -> acento (el último entra y sale al final)
	const colors = ['bg-secondary', 'bg-primary', 'bg-accent'];
</script>

<div
	bind:this={root}
	aria-hidden="true"
	class="pointer-events-none fixed inset-0 z-50 overflow-hidden"
	style="visibility: hidden"
>
	{#each colors as color, i}
		<div class="absolute inset-y-0 -left-[20%] w-[140%] -skew-x-12">
			<div
				bind:this={panelEls[i]}
				class="absolute inset-0 {color}"
				style="transform: translateX(-130%)"
			></div>
		</div>
	{/each}

	<div class="absolute inset-0 flex items-center justify-center">
		<span
			bind:this={label}
			class="font-display text-[clamp(3rem,14vw,11rem)] uppercase leading-none tracking-wide text-white"
			style="opacity: 0; transform: skewX(var(--skew))"
		></span>
	</div>
</div>
