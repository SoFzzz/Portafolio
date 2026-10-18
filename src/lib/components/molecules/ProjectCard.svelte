<script lang="ts">
	import { base } from '$app/paths';
	import { kindLabel, type Project } from '$lib/data/projects';
	import CardFrame from '../atoms/CardFrame.svelte';
	import Button from '../atoms/Button.svelte';
	import Tag from '../atoms/Tag.svelte';

	let { project }: { project: Project } = $props();
	const c = $derived(project.cover);
	const cover = $derived(project.shots?.[0]);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<article
	data-nav-group
	tabindex="0"
	role="group"
	aria-label="Proyecto {project.title}"
	class="nav-card relative isolate flex h-full flex-col outline-none shadow-[6px_6px_0_var(--color-secondary)] transition-transform duration-200 ease-out-expo hover:-translate-y-1 md:shadow-[8px_8px_0_var(--color-secondary)]"
>
	<CardFrame />
	<div
		class="relative flex h-48 items-center justify-center p-4 [clip-path:polygon(0_0,100%_0,100%_92%,90%_100%,0_100%)] md:h-56"
		style="background-color: {c.bg}; background-image: radial-gradient(circle, {c.dot} 1.4px, transparent 2px); background-size: 10px 10px"
	>
		{#if cover}
			<img
				src={base + cover.src}
				alt={cover.alt}
				width={cover.width}
				height={cover.height}
				loading="lazy"
				class="max-h-[85%] max-w-[85%] w-auto object-contain shadow-[5px_5px_0_var(--color-secondary)]"
			/>
		{:else}
			<!-- Sin capturas: portada tipográfica con el nombre del proyecto. -->
			<span
				aria-hidden="true"
				class="pointer-events-none absolute -right-2 -bottom-10 font-display text-[11rem] leading-none uppercase opacity-20 select-none"
				style="color: {c.ink}">{project.title.charAt(0)}</span
			>
			<span
				aria-hidden="true"
				class="relative -rotate-3 font-display text-[clamp(3.25rem,2.5rem+3vw,4.75rem)] leading-none tracking-wide uppercase [text-shadow:4px_4px_0_var(--color-secondary)]"
				style="color: {c.ink}">{project.title}</span
			>
		{/if}
		{#if project.logo}
			<img
				src={base + project.logo.src}
				alt={project.logo.alt}
				width={project.logo.width}
				height={project.logo.height}
				class="absolute bottom-3 left-3 size-10 object-contain"
			/>
		{/if}
		<span
			class="absolute top-3 left-3 border-2 px-2 py-0.5 text-[11px] font-semibold tracking-[0.12em] uppercase"
			style="border-color: {c.ink}; color: {c.ink}">{kindLabel[project.kind]}</span
		>
		<span
			class="absolute right-3 bottom-3 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase md:text-xs"
			style="background: {c.chipBg}; color: {c.chipInk}">{project.platform}</span
		>
	</div>

	<div class="flex flex-1 flex-col gap-3.5 p-5 pb-6 md:p-6">
		<h2 class="font-display text-[clamp(2rem,1.6rem+1vw,2.5rem)] leading-none tracking-wide text-primary uppercase">
			{project.title}
		</h2>
		<p class="text-base leading-relaxed">{project.summary}</p>
		<ul class="flex flex-wrap gap-2">
			{#each project.stack as item}
				<li><Tag>{item}</Tag></li>
			{/each}
		</ul>
		<div class="mt-auto flex flex-wrap gap-3 pt-2">
			<Button href="{base}/proyectos/{project.slug}/">
				Ver proyecto
				<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-highlight" stroke-width="3" stroke-linecap="square"
					><path d="M5 12h14M13 6l6 6-6 6" /></svg
				>
			</Button>
			<Button href={project.repo} external variant="secondary">Repositorio</Button>
		</div>
	</div>
</article>
