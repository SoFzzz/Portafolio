<script lang="ts">
	import type { Scene } from '$lib/data/nav';
	import type { Silhouette } from '$lib/data/scene';
	import MetroBackdrop from './backdrops/MetroBackdrop.svelte';
	import SilhouetteLayer from './backdrops/SilhouetteLayer.svelte';
	import SeaBackdrop from './backdrops/SeaBackdrop.svelte';
	import StarsBackdrop from './backdrops/StarsBackdrop.svelte';

	// Fondo vivo detrás del contenido. Cada sección elige su escena (ver nav.ts) y su silueta (ver scene.ts).
	let { scene = 'plain', sil = null }: { scene?: Scene; sil?: Silhouette | null } = $props();
</script>

<div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
	{#if scene === 'plain' || scene === 'split'}
		<!-- franjas muy suaves que se desplazan -->
		<div
			class="pf-stripes absolute -inset-[10%] -rotate-[8deg]"
			style="background-image: repeating-linear-gradient(90deg, rgba(191,36,36,0.05) 0 90px, transparent 90px 180px); background-size: 180px 100%"
		></div>
	{:else if scene === 'sea'}
		<SeaBackdrop />
	{:else if scene === 'stars'}
		<StarsBackdrop />
	{:else if scene === 'metro'}
		<MetroBackdrop />
	{/if}

	{#if scene === 'split'}
		<!-- panel oscuro: franja inferior en móvil y diagonal a la derecha desde lg -->
		<div
			data-bg="panel"
			class="absolute inset-x-0 bottom-0 h-[46vh] [clip-path:polygon(0_22%,100%_0,100%_100%,0_100%)] lg:inset-x-auto lg:top-0 lg:right-0 lg:h-full lg:w-[50%] lg:[clip-path:polygon(26%_0,100%_0,100%_100%,0_100%)]"
			style="background: linear-gradient(160deg, var(--color-secondary) 0%, color-mix(in oklab, var(--color-primary) 45%, var(--color-secondary)) 100%)"
		>
			<div
				class="pf-stripes-fast absolute -inset-[20%] -rotate-[8deg]"
				style="background-image: repeating-linear-gradient(90deg, rgba(242,149,68,0.09) 0 36px, transparent 36px 120px); background-size: 120px 100%"
			></div>
		</div>
	{/if}

	{#if sil}
		<SilhouetteLayer {sil} />
	{/if}
</div>
