<script lang="ts">
	import { base } from '$app/paths';
	import { game } from '$lib/data/game';
	import CardFrame from '../atoms/CardFrame.svelte';
	import Button from '../atoms/Button.svelte';
	import Tag from '../atoms/Tag.svelte';
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<article
	data-nav-group
	tabindex="0"
	role="group"
	aria-label="Proyecto {game.title}"
	class="nav-card relative isolate flex h-full flex-col outline-none"
>
	<CardFrame />
	<div
		role="img"
		aria-label="Arte de {game.title}"
		class="flex h-40 items-end justify-between p-4 [clip-path:polygon(0_0,100%_0,100%_84%,90%_100%,0_100%)] md:h-56 md:p-5"
		style="background-image: radial-gradient(circle, rgba(242,149,68,0.4) 1.4px, transparent 2px), linear-gradient(160deg, #0d0000 0%, #4a0f0f 55%, #bf2424 100%); background-size: 10px 10px, 100% 100%"
	>
		<span class="font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[0.95] tracking-wide text-background uppercase"
			>Descending<br />to my Heaven</span
		>
		<span class="bg-highlight px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-text uppercase md:text-xs">Videojuego</span>
	</div>

	<div class="flex flex-1 flex-col gap-3.5 p-5 pb-6 md:p-6">
		<h2 class="font-display text-[clamp(2rem,1.6rem+1vw,2.5rem)] leading-none tracking-wide text-primary uppercase">
			{game.title}
		</h2>
		<p class="text-base leading-relaxed">{game.premise}</p>
		<ul class="flex flex-wrap gap-2">
			<li><Tag kind="status">{game.status}</Tag></li>
			<li><Tag>Godot</Tag></li>
			<li><Tag>GDScript</Tag></li>
		</ul>
		<div class="mt-auto pt-2">
			<Button href="{base}/proyectos/descending-to-my-heaven/">
				Ver proyecto
				<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-highlight" stroke-width="3" stroke-linecap="square"
					><path d="M5 12h14M13 6l6 6-6 6" /></svg
				>
			</Button>
		</div>
	</div>
</article>
