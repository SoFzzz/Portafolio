<script lang="ts">
	// Navegación con teclado estilo Persona para las páginas de sección:
	//   · Flechas (y W/A/S/D) mueven la selección en esa dirección sobre el contenido (navegación espacial).
	//     Si no hay nada seleccionado, la primera pulsación selecciona el primer elemento (el botón Volver).
	//     Si en esa dirección no hay más elementos, no se intercepta la tecla y la página se desplaza normal.
	//   · Enter activa el elemento seleccionado (nativo: tiene el foco real).
	//   · Esc vuelve atrás (lo gestiona SectionShell con su backHref).
	// La selección es el foco real, así que Tab, lectores de pantalla y :focus-visible siguen funcionando.
	// En el inicio las teclas las gestiona MainMenu; aquí solo se muestra la ayuda.
	import { page } from '$app/state';
	import { animate, stagger } from 'animejs';
	import { onMount, tick } from 'svelte';
	import { motionOn } from '$lib/motion/prefs.svelte';

	const SELECTOR = 'a[href], button:not([disabled]), [role="button"]';
	const DIRS: Record<string, 'up' | 'down' | 'left' | 'right'> = {
		ArrowUp: 'up', w: 'up', W: 'up',
		ArrowDown: 'down', s: 'down', S: 'down',
		ArrowLeft: 'left', a: 'left', A: 'left',
		ArrowRight: 'right', d: 'right', D: 'right'
	};

	const isHome = $derived(page.route.id === '/');
	let marker: SVGSVGElement | undefined = $state();
	let current: HTMLElement | null = null;

	const main = () => document.getElementById('contenido');

	function items(): HTMLElement[] {
		const m = main();
		if (!m) return [];
		return [...m.querySelectorAll<HTMLElement>(SELECTOR)].filter(
			(el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
		);
	}

	/** Mejor candidato en una dirección: prioriza cercanía en el eje y poca desviación en el otro. */
	function pick(from: HTMLElement, list: HTMLElement[], dir: 'up' | 'down' | 'left' | 'right') {
		const r = from.getBoundingClientRect();
		const cx = r.left + r.width / 2;
		const cy = r.top + r.height / 2;
		let best: HTMLElement | null = null;
		let bestScore = Infinity;
		for (const el of list) {
			if (el === from || from.contains(el) || el.contains(from)) continue;
			const b = el.getBoundingClientRect();
			const dx = b.left + b.width / 2 - cx;
			const dy = b.top + b.height / 2 - cy;
			const [main, cross] = dir === 'up' || dir === 'down' ? [dy, dx] : [dx, dy];
			const sign = dir === 'down' || dir === 'right' ? 1 : -1;
			const along = main * sign;
			if (along < 4) continue;
			// Si se solapan en el eje transversal (misma columna/fila), cuenta menos la desviación
			const overlap =
				dir === 'up' || dir === 'down'
					? Math.min(r.right, b.right) - Math.max(r.left, b.left) > 0
					: Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top) > 0;
			const score = along + Math.abs(cross) * (overlap ? 0.5 : 3);
			if (score < bestScore) {
				bestScore = score;
				best = el;
			}
		}
		return best;
	}

	function select(el: HTMLElement) {
		el.focus({ preventScroll: true });
		const r = el.getBoundingClientRect();
		if (r.top < 80 || r.bottom > innerHeight - 80) {
			el.scrollIntoView({ block: 'center', behavior: motionOn() ? 'smooth' : 'auto' });
		}
	}

	function onKey(e: KeyboardEvent) {
		if (isHome || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
		const dir = DIRS[e.key];
		if (!dir) return;
		if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable]')) return;
		const list = items();
		if (!list.length) return;
		const a = document.activeElement as HTMLElement | null;
		const onItem = a && list.includes(a);
		if (!onItem) {
			// Foco en el cuerpo: primera pulsación = primer elemento. Foco en otro control (p. ej. el botón de animaciones): no se toca.
			if (a && a !== document.body) return;
			e.preventDefault();
			select(list[0]);
			return;
		}
		const next = pick(a!, list, dir);
		if (next) {
			e.preventDefault();
			select(next);
		}
	}

	/** Coloca el marcador junto al elemento seleccionado y lo anima (solo transform/opacity). */
	function place(el: HTMLElement, animated: boolean) {
		const m = main();
		if (!marker || !m) return;
		const mr = m.getBoundingClientRect();
		const r = el.getBoundingClientRect();
		const x = Math.max(2, r.left - mr.left - 26);
		const y = r.top - mr.top + r.height / 2 - 14;
		marker.style.opacity = '1';
		if (animated && motionOn()) {
			animate(marker, {
				translateX: [{ to: x - 14, duration: 0 }, { to: x, duration: 260, ease: 'outBack' }],
				translateY: { to: y, duration: 200, ease: 'outExpo' },
				scaleY: [{ to: 1.5, duration: 90 }, { to: 1, duration: 220, ease: 'outBack' }]
			});
		} else {
			marker.style.transform = `translate(${x}px, ${y}px)`;
		}
	}

	function onFocusIn(e: FocusEvent) {
		const el = e.target as HTMLElement;
		if (isHome || !marker || !el.matches?.(SELECTOR) || !main()?.contains(el)) return;
		if (!el.matches(':focus-visible')) return hide();
		current = el;
		place(el, true);
		// Pequeño "pop" del propio elemento
		if (motionOn()) {
			const a = animate(el, {
				scale: [{ to: 1.06, duration: 90 }, { to: 1, duration: 260, ease: 'outBack' }],
				onComplete: () => a.revert()
			});
		}
	}

	function hide() {
		current = null;
		if (marker) marker.style.opacity = '0';
	}

	function onFocusOut(e: FocusEvent) {
		if (!(e.relatedTarget instanceof HTMLElement) || !main()?.contains(e.relatedTarget)) hide();
	}

	function reposition() {
		if (current && document.contains(current)) place(current, false);
		else hide();
	}

	// Entrada escalonada de los elementos de cada sección (como el menú del inicio)
	$effect(() => {
		page.url.pathname;
		hide();
		if (isHome || !motionOn()) return;
		tick().then(() => {
			const list = items().slice(0, 14);
			if (!list.length) return;
			const a = animate(list, {
				translateY: [18, 0],
				opacity: [0, 1],
				duration: 480,
				delay: stagger(60, { start: 200 }),
				ease: 'outExpo',
				onComplete: () => a.revert()
			});
		});
	});

	onMount(() => {
		window.addEventListener('resize', reposition);
		return () => window.removeEventListener('resize', reposition);
	});
</script>

<svelte:window onkeydown={onKey} onfocusin={onFocusIn} onfocusout={onFocusOut} onpointerdown={hide} />

<!-- Marcador de selección: dentro de <main> para que se desplace con la página -->
<svg
	bind:this={marker}
	aria-hidden="true"
	class="pointer-events-none absolute top-0 left-0 z-30 opacity-0 max-sm:hidden"
	width="18"
	height="28"
	viewBox="0 0 18 28"
>
	<polygon points="0,0 18,14 0,28 5,14" fill="#F29544" stroke="#0D0000" stroke-width="2" stroke-linejoin="miter" />
</svg>

<!-- Ayuda de teclado: solo en escritorio -->
<p
	class="pointer-events-none fixed bottom-5 left-5 z-40 hidden items-center gap-3 border-2 border-secondary bg-surface/90 px-3 py-1.5 text-xs font-semibold tracking-widest text-secondary uppercase lg:flex"
	aria-hidden="true"
>
	<span><kbd style="font-family: system-ui, 'Segoe UI Symbol', sans-serif">↑ ↓ ← →</kbd> Mover</span>
	<span><kbd class="font-sans">Enter</kbd> Seleccionar</span>
	{#if !isHome}<span><kbd class="font-sans">Esc</kbd> Volver</span>{/if}
</p>
