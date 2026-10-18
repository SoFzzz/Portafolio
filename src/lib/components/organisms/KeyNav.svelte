<script lang="ts">
	// Navegación con teclado estilo Persona para las páginas de sección:
	//   · Flechas (y W/A/S/D) mueven la selección en esa dirección sobre el contenido (navegación espacial).
	//     Si no hay nada seleccionado, la primera pulsación selecciona el primer elemento (el botón Volver).
	//     Si en esa dirección no hay más elementos, no se intercepta la tecla y la página se desplaza normal.
	//   · Dos niveles opcionales: un elemento con `data-nav-group` (p. ej. una tarjeta) es una unidad en el
	//     nivel 1. Enter sobre ella entra (selecciona su primer enlace/botón); dentro, las flechas solo
	//     recorren sus controles y Esc vuelve a la tarjeta. Esc en el nivel 1 vuelve atrás (SectionShell).
	//   · Enter activa el elemento seleccionado (nativo: tiene el foco real).
	// La selección es el foco real + el atributo `data-selected` (vacío) en el elemento. Los componentes
	// estilizan [data-selected], :hover y :focus-visible igual (bloque rojo estilo menú del inicio).
	// En el inicio las teclas las gestiona MainMenu; aquí solo se muestra la ayuda.
	import { page } from '$app/state';
	import { animate, stagger } from 'animejs';
	import { onMount, tick } from 'svelte';
	import { motionOn } from '$lib/motion/prefs.svelte';

	const SELECTOR = 'a[href], button:not([disabled]), [role="button"]';
	const GROUP = '[data-nav-group]';
	const DIRS: Record<string, 'up' | 'down' | 'left' | 'right'> = {
		ArrowUp: 'up', w: 'up', W: 'up',
		ArrowDown: 'down', s: 'down', S: 'down',
		ArrowLeft: 'left', a: 'left', A: 'left',
		ArrowRight: 'right', d: 'right', D: 'right'
	};

	const isHome = $derived(page.route.id === '/');
	let arrow: SVGSVGElement | undefined = $state();
	let current: HTMLElement | null = null;

	const main = () => document.getElementById('contenido');
	const visible = (el: HTMLElement) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
	const groupOf = (el: Element | null) => (el?.closest(GROUP) as HTMLElement | null) ?? null;

	/** Nivel 1: grupos (tarjetas) y controles sueltos. Sin grupos, todos los controles. */
	function topItems(): HTMLElement[] {
		const m = main();
		if (!m) return [];
		return [...m.querySelectorAll<HTMLElement>(`${SELECTOR}, ${GROUP}`)].filter(
			(el) => (el.matches(GROUP) || !el.closest(GROUP)) && visible(el)
		);
	}

	/** Nivel 2: controles dentro de un grupo. */
	function innerItems(g: HTMLElement): HTMLElement[] {
		return [...g.querySelectorAll<HTMLElement>(SELECTOR)].filter(visible);
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

	/** Deja `data-selected` solo en `el` (o en ninguno). */
	function mark(el: HTMLElement | null) {
		for (const old of document.querySelectorAll('[data-selected]')) if (old !== el) old.removeAttribute('data-selected');
		el?.setAttribute('data-selected', '');
	}

	function select(el: HTMLElement) {
		mark(el);
		el.focus({ preventScroll: true });
		const r = el.getBoundingClientRect();
		if (r.top < 80 || r.bottom > innerHeight - 80) {
			el.scrollIntoView({ block: 'center', behavior: motionOn() ? 'smooth' : 'auto' });
		}
	}

	function onKey(e: KeyboardEvent) {
		if (isHome || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
		if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable]')) return;
		const a = document.activeElement as HTMLElement | null;

		// Enter sobre una tarjeta: entra a sus controles
		if (e.key === 'Enter' && a && a.matches(GROUP) && e.target === a) {
			const first = innerItems(a)[0];
			if (first) {
				e.preventDefault();
				select(first);
			}
			return;
		}

		const dir = DIRS[e.key];
		if (!dir) return;
		const g = a ? groupOf(a) : null;
		const inner = !!g && a !== g;
		const list = inner ? innerItems(g!) : topItems();
		if (!list.length) return;
		if (inner) {
			// Dentro de una tarjeta la selección no sale de ella (y no se desplaza la página)
			e.preventDefault();
			const next = pick(a!, list, dir);
			if (next) select(next);
			return;
		}
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

	/** Esc dentro de una tarjeta vuelve a la tarjeta. En captura para que SectionShell (volver atrás) no lo reciba. */
	function onEscCapture(e: KeyboardEvent) {
		if (isHome || e.key !== 'Escape' || e.ctrlKey || e.metaKey || e.altKey) return;
		const a = document.activeElement as HTMLElement | null;
		const g = a ? groupOf(a) : null;
		if (!g || a === g || !main()?.contains(g)) return;
		e.preventDefault();
		e.stopImmediatePropagation();
		select(g);
	}

	/** Flechita junto al control seleccionado dentro de una tarjeta (solo transform/opacity). */
	function place(el: HTMLElement, animated: boolean) {
		const m = main();
		if (!arrow || !m) return;
		const mr = m.getBoundingClientRect();
		const r = el.getBoundingClientRect();
		const x = Math.max(2, r.left - mr.left - 18);
		const y = r.top - mr.top + r.height / 2 - 10;
		arrow.style.opacity = '1';
		if (animated && motionOn()) {
			animate(arrow, {
				translateX: [{ to: x - 12, duration: 0 }, { to: x, duration: 260, ease: 'outBack' }],
				translateY: { to: y, duration: 0 }
			});
		} else {
			arrow.style.transform = `translate(${x}px, ${y}px)`;
		}
	}

	function onFocusIn(e: FocusEvent) {
		const el = e.target as HTMLElement;
		if (isHome || !el.matches?.(`${SELECTOR}, ${GROUP}`) || !main()?.contains(el)) return;
		// Foco por ratón: sin selección. Foco por teclado (Tab, flechas): selección visible.
		if (!el.matches(':focus-visible')) return hide();
		mark(el);
		if (el.matches(GROUP) || !groupOf(el)) {
			current = null;
			if (arrow) arrow.style.opacity = '0';
		} else {
			current = el;
			place(el, true);
		}
	}

	function hide() {
		current = null;
		if (arrow) arrow.style.opacity = '0';
		mark(null);
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
			const list = topItems().slice(0, 14);
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
		window.addEventListener('keydown', onEscCapture, { capture: true });
		return () => {
			window.removeEventListener('resize', reposition);
			window.removeEventListener('keydown', onEscCapture, { capture: true });
		};
	});
</script>

<svelte:window onkeydown={onKey} onfocusin={onFocusIn} onfocusout={onFocusOut} onpointerdown={hide} />

<!-- Flechita del nivel 2 (dentro de una tarjeta): dentro de <main> para que se desplace con la página -->
<svg
	bind:this={arrow}
	aria-hidden="true"
	class="pointer-events-none absolute top-0 left-0 z-30 text-primary opacity-0 max-sm:hidden"
	width="14"
	height="20"
	viewBox="0 0 14 20"
	fill="none"
	stroke="currentColor"
	stroke-width="4"
	stroke-linecap="square"
>
	<path d="M3 2l8 8-8 8" />
</svg>

<!-- Ayuda de teclado: solo en escritorio -->
<p
	class="pointer-events-none fixed bottom-5 left-5 z-40 hidden items-center gap-3 border-2 border-secondary bg-surface/90 px-3 py-1.5 text-xs font-semibold tracking-widest text-secondary uppercase lg:flex"
	aria-hidden="true"
>
	<span class="flex items-center gap-1.5"><kbd class="flex items-center gap-0.5"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="square" style="transform: rotate(0deg)"><path d="M12 20V5M5 11l7-7 7 7" /></svg><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="square" style="transform: rotate(180deg)"><path d="M12 20V5M5 11l7-7 7 7" /></svg><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="square" style="transform: rotate(270deg)"><path d="M12 20V5M5 11l7-7 7 7" /></svg><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="square" style="transform: rotate(90deg)"><path d="M12 20V5M5 11l7-7 7 7" /></svg></kbd> Mover</span>
	<span><kbd class="font-sans">Enter</kbd> Seleccionar</span>
	{#if !isHome}<span><kbd class="font-sans">Esc</kbd> Volver</span>{/if}
</p>
