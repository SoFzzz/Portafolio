<script lang="ts">
	import '@fontsource/anton';
	import '@fontsource-variable/inter';
	import '../app.css';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
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

	/*
	 * Historial jerárquico: Inicio (0) → sección (1) → detalle (2).
	 * - Bajar un nivel agrega una entrada.
	 * - Ir a una página del mismo nivel reemplaza la entrada actual.
	 * - Subir (Volver, Esc) retrocede en el historial si el destino ya está atrás.
	 * Así el botón Atrás del navegador recorre detalle → sección → Inicio → fuera del sitio.
	 */
	let trail: string[] = []; // rutas visitadas, alineadas con las entradas del historial
	let idx = 0; // posición actual dentro de `trail`
	let replaceNext = false;
	let onPop: (() => void) | null = null;

	const depth = (p: string) => strip(p).split('/').filter(Boolean).length;

	/** Retrocede `delta` entradas y espera a que la ruta cambie. */
	function goBack(delta: number) {
		return new Promise<void>((resolve) => {
			const done = () => {
				onPop = null;
				clearTimeout(timer);
				resolve();
			};
			const timer = setTimeout(done, 2000);
			onPop = done;
			history.go(delta);
		});
	}

	afterNavigate((nav) => {
		const path = page.url.pathname;
		if (nav.type === 'enter' || trail.length === 0) {
			trail = [path];
			idx = 0;
		} else if (nav.type === 'popstate') {
			idx += nav.delta ?? 0;
			if (trail[idx] !== path) {
				// Salto desconocido (por ejemplo, tras recargar): se reinicia el rastro.
				trail = [path];
				idx = 0;
			}
			onPop?.();
		} else if (replaceNext) {
			trail[idx] = path;
		} else {
			trail = [...trail.slice(0, idx + 1), path];
			idx++;
		}
		replaceNext = false;
	});

	// Toda navegación interna (enlaces, botón atrás, goto) pasa por la cortina.
	beforeNavigate((nav) => {
		if (busy || !nav.to || nav.willUnload || nav.type === 'leave' || nav.type === 'popstate') return;
		const to = nav.to.url;
		if (to.pathname === page.url.pathname) return;

		nav.cancel();
		busy = true;
		const target = findNav(strip(to.pathname));
		const from = depth(page.url.pathname);
		const dest = depth(to.pathname);

		let swap: () => Promise<unknown>;
		const back = dest < from && idx > 0 ? trail.lastIndexOf(to.pathname, idx - 1) : -1;
		if (back >= 0) {
			swap = () => goBack(back - idx);
		} else {
			replaceNext = dest <= from;
			swap = () => goto(to.pathname + to.search + to.hash, { replaceState: replaceNext });
		}
		runTransition(target.label, swap).finally(() => {
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
