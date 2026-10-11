<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { Snippet } from 'svelte';
	import { siteName } from '$lib/data/site';
	import Seo from '../atoms/Seo.svelte';
	import SectionTitle from '../atoms/SectionTitle.svelte';

	let {
		title,
		description,
		path,
		intro,
		backHref = '/',
		aside,
		children
	}: {
		title: string;
		description: string;
		/** Ruta de la página (con barra final), para canonical y og:url. */
		path: string;
		intro?: string;
		backHref?: string;
		/** Contenido opcional a la derecha del título (en escritorio), para equilibrar el peso visual. */
		aside?: Snippet;
		children: Snippet;
	} = $props();

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			const t = e.target as HTMLElement | null;
			if (t && /^(input|textarea|select)$/i.test(t.tagName)) return;
			e.preventDefault();
			goto(base + backHref);
		}
	}
</script>

<svelte:window onkeydown={onKey} />

<Seo title="{title} · {siteName}" {description} {path} />

<div class="relative mx-auto flex max-w-[90rem] flex-col gap-8 px-4 pt-5 pb-16 sm:px-8 lg:gap-10 lg:px-[4.5rem] lg:pt-10">
	<header class="flex flex-wrap items-center justify-between gap-4">
		<a
			href="{base}{backHref}"
			class="inline-flex min-h-11 items-center gap-2.5 bg-primary pr-5 pl-3.5 text-sm font-semibold tracking-widest text-white uppercase [clip-path:polygon(0_50%,14px_0,100%_0,100%_100%,14px_100%)] transition-colors hover:bg-secondary"
		>
			<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2D479" stroke-width="3" stroke-linecap="square"><path d="M15 5 8 12l7 7" /></svg>
			Volver
		</a>
	</header>

	<div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
		<div class="flex flex-col gap-3">
			<SectionTitle>{title}</SectionTitle>
			{#if intro}
				<p class="mt-1 ml-1 w-fit max-w-xl bg-background/85 px-3 py-1.5 text-base leading-relaxed text-muted sm:text-lg">{intro}</p>
			{/if}
		</div>
		{#if aside}
			<div class="min-w-0 lg:w-[46%] lg:max-w-[40rem] xl:w-[52%] xl:max-w-[52rem]">{@render aside()}</div>
		{/if}
	</div>

	{@render children()}
</div>
