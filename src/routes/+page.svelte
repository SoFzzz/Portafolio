<script lang="ts">
	import { base } from '$app/paths';
	import MainMenu from '$lib/components/organisms/MainMenu.svelte';
	import { profile } from '$lib/data/profile';
</script>

<svelte:head><title>{profile.shortName} · Portafolio</title></svelte:head>

<!-- La silueta (Shiori) vive en el fondo, a la derecha, y "mira" hacia el menú. -->
<div class="mx-auto flex min-h-dvh max-w-[90rem] flex-col gap-8 px-4 py-5 sm:px-8 lg:px-[4.5rem] lg:py-12">
	<div class="flex min-h-[calc(100dvh-2.5rem)] flex-1 flex-col justify-between gap-8 lg:min-h-[calc(100dvh-6rem)] lg:w-[52%]">
		<header class="flex items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<img src="{base}/logo.webp" alt="" width="40" height="40" class="size-9 md:size-10" />
				<span class="font-display text-lg tracking-wider text-primary uppercase md:text-xl">{profile.shortName}</span>
			</div>
			<span class="hidden text-[13px] font-semibold tracking-[0.14em] text-secondary uppercase sm:inline">Portafolio 2026</span>
		</header>

		<MainMenu />

		<footer class="flex flex-col items-start gap-2.5">
			<span class="text-base font-medium md:text-lg">{profile.role}</span>
			<span class="max-w-md text-sm leading-relaxed text-muted md:text-base">{profile.tagline}</span>
		</footer>
	</div>
</div>
