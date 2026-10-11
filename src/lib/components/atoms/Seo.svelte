<script lang="ts">
	import { base } from '$app/paths';
	import { SITE_URL } from '$lib/data/site';

	let { title, description, path }: { title: string; description: string; path: string } = $props();

	const url = $derived(SITE_URL + base + path);
	const image = SITE_URL + base + '/og.png';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta property="og:locale" content="es_CO" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
