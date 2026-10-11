<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import SectionShell from '$lib/components/templates/SectionShell.svelte';
	import { game } from '$lib/data/game';

	const facts = [
		['Género', game.genre],
		['Motor', game.engine],
		['Plataforma', game.platform],
		['Mi rol', game.role]
	];
	const keyArt = 'polygon(0 0, 100% 0, 100% 90%, 94% 100%, 0 100%)';
</script>

<SectionShell title="Videojuego" backHref="/proyectos">
	<div class="flex flex-col gap-10 lg:flex-row lg:gap-12">
		<div class="flex min-w-0 flex-col gap-5 lg:flex-[1.3]">
			<div class="relative">
				<div aria-hidden="true" class="absolute inset-0 translate-x-2 translate-y-2 bg-secondary md:translate-x-3.5 md:translate-y-3.5" style="clip-path: {keyArt}"></div>
				<div
					role="img"
					aria-label="Espacio para el arte clave o video de {game.title}"
					class="relative flex aspect-[16/10] items-end justify-between p-4 md:aspect-video md:p-6"
					style="clip-path: {keyArt}; background-image: radial-gradient(circle, rgba(242,149,68,0.45) 1.5px, transparent 2.1px), linear-gradient(160deg, #0d0000 0%, #4a0f0f 50%, #bf2424 100%); background-size: 11px 11px, 100% 100%"
				>
					<span class="font-display text-sm tracking-widest text-background uppercase md:text-[22px]">[Arte clave o video del juego]</span>
				</div>
			</div>

			<ul class="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
				{#each game.media as m}
					<li
						class="flex aspect-video items-center justify-center bg-chip text-xs font-semibold tracking-widest text-secondary uppercase"
						style="background-image: radial-gradient(circle, rgba(191,36,36,0.22) 1.2px, transparent 1.8px); background-size: 9px 9px"
					>
						{m.label}
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex min-w-0 flex-col gap-6 lg:flex-1">
			<div><Tag kind="status">{game.status}</Tag></div>
			<h2 class="m-0 font-display text-[clamp(3rem,2rem+4vw,5.25rem)] leading-[0.98] tracking-wide text-primary uppercase">
				Descending<br />to my Heaven
			</h2>
			<p class="max-w-md text-base leading-relaxed sm:text-lg">{game.premise}</p>

			<dl class="m-0 grid grid-cols-[6.5rem_minmax(0,1fr)] bg-surface shadow-[6px_6px_0_var(--color-secondary)] md:grid-cols-[7.5rem_minmax(0,1fr)] md:shadow-[8px_8px_0_var(--color-secondary)]">
				{#each facts as [k, v], i}
					<dt class="px-4 py-3.5 text-xs font-semibold tracking-[0.12em] text-secondary uppercase {i < facts.length - 1 ? 'border-b border-text/15' : ''}">{k}</dt>
					<dd class="m-0 px-4 py-3.5 text-[15px] {i < facts.length - 1 ? 'border-b border-text/15' : ''}">{v}</dd>
				{/each}
			</dl>

			{#if game.links.play || game.links.repo}
				<div class="flex flex-wrap gap-4">
					{#if game.links.play}<Button href={game.links.play} external>Jugar</Button>{/if}
					{#if game.links.repo}<Button href={game.links.repo} variant="secondary" external>Repositorio</Button>{/if}
				</div>
			{/if}
		</div>
	</div>
</SectionShell>
