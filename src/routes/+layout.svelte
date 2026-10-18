<script lang="ts">
	import '@fontsource/anton';
	import '@fontsource-variable/inter';
	import '../app.css';
	import { beforeNavigate, goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import MotionToggle from '$lib/components/molecules/MotionToggle.svelte';
	import BackgroundMotion from '$lib/components/organisms/BackgroundMotion.svelte';
	import KeyNav from '$lib/components/organisms/KeyNav.svelte';
	import TransitionCurtain from '$lib/components/organisms/TransitionCurtain.svelte';
	import { findNav } from '$lib/data/nav';
	import { silhouettes } from '$lib/data/scene';
	import { runTransition } from '$lib/motion/transition';

	let { children } = $props();

	const strip = (p: string) => (base && p.startsWith(base) ? p.slice(base.length) : p) || '/';
	const current = $derived(findNav(strip(page.url.pathname)));

	let busy = false;

	// Toda navegación interna (enlaces, botón atrás, goto) pasa por la cortina.
	beforeNavigate((nav) => {
		if (busy || !nav.to || nav.willUnload || nav.type === 'leave' || nav.type === 'popstate') return;
		const to = nav.to.url;
		if (to.pathname === page.url.pathname) return;

		nav.cancel();
		busy = true;
		const target = findNav(strip(to.pathname));
		runTransition(target.label, () => goto(to.pathname + to.search + to.hash)).finally(() => {
			busy = false;
		});
	});
</script>

<a href="#contenido" class="skip-link">Saltar al contenido</a>
<BackgroundMotion scene={current.scene} sil={silhouettes[current.id] ?? null} />
<main id="contenido" class="relative min-h-dvh">
	{@render children()}
	<KeyNav />
</main>
<TransitionCurtain />
<MotionToggle />
