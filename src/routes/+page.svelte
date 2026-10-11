<script lang="ts">
	import { base } from '$app/paths';
	import MainMenu from '$lib/components/organisms/MainMenu.svelte';
	import { profile } from '$lib/data/profile';
</script>

<svelte:head><title>{profile.shortName} · Portafolio</title></svelte:head>

<!-- La silueta (Shiori) vive en el fondo, a la derecha, y "mira" hacia el menú. -->
<div class="mx-auto flex min-h-dvh max-w-[90rem] flex-col gap-8 px-4 py-5 sm:px-8 lg:px-[4.5rem] lg:py-12">
	<div class="flex min-h-[calc(100dvh-2.5rem)] flex-1 flex-col justify-start gap-8 lg:min-h-[calc(100dvh-6rem)] lg:w-[52%]">
		<header class="flex items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<img src="{base}/logo.webp" alt="" width="40" height="40" class="size-9 md:size-10" />
				<div class="flex flex-col">
					<h1 class="m-0 font-display text-lg leading-tight tracking-wider text-primary uppercase md:text-xl">{profile.shortName}</h1>
					<p class="m-0 text-[11px] font-semibold tracking-[0.14em] text-secondary uppercase md:text-[13px]">{profile.role}</p>
				</div>
			</div>
			<span class="hidden text-[13px] font-semibold tracking-[0.14em] text-secondary uppercase sm:inline">Portafolio 2026</span>
		</header>

		<div class="mt-[12vh] lg:mt-[18vh]"><MainMenu /></div>
	</div>
</div>
