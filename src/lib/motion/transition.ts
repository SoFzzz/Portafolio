import { animate, stagger, utils } from 'animejs';

export type CurtainParts = {
	root: HTMLElement;
	/** Paneles internos (se animan con translateX). */
	panels: HTMLElement[];
	label: HTMLElement;
};

let curtain: CurtainParts | null = null;

export function registerCurtain(parts: CurtainParts) {
	curtain = parts;
	return () => {
		curtain = null;
	};
}

import { motionOn } from './prefs.svelte';

const prefersReducedMotion = () => !motionOn();

/** Envuelve animate() en una promesa que se resuelve al terminar. */
function play(targets: Parameters<typeof animate>[0], params: Record<string, unknown>) {
	return new Promise<void>((resolve) => {
		animate(targets, { ...params, onComplete: () => resolve() });
	});
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Cierra la cortina, ejecuta el cambio de ruta (`swap`) y la abre de nuevo.
 * Con `prefers-reduced-motion` se sustituye por un fundido corto.
 */
export async function runTransition(label: string, swap: () => Promise<unknown>) {
	if (!curtain) {
		await swap();
		return;
	}
	const { root, panels, label: labelEl } = curtain;
	labelEl.textContent = label;
	root.style.visibility = 'visible';

	if (prefersReducedMotion()) {
		utils.set(panels, { translateX: '0%' });
		await play(root, { opacity: [0, 1], duration: 150, ease: 'linear' });
		await swap();
		await play(root, { opacity: [1, 0], duration: 150, ease: 'linear' });
		root.style.visibility = 'hidden';
		utils.set(panels, { translateX: '-130%' });
		return;
	}

	utils.set(root, { opacity: 1 });
	utils.set(labelEl, { opacity: 0, translateX: -40 });

	// 1) Los paneles entran en diagonal
	await play(panels, {
		translateX: ['-130%', '0%'],
		duration: 420,
		delay: stagger(90),
		ease: 'inOutQuart'
	});
	animate(labelEl, { opacity: [0, 1], translateX: [-40, 0], duration: 260, ease: 'outExpo' });

	// 2) Cambio de ruta bajo la cortina
	await swap();
	await wait(260);

	// 3) Los paneles salen
	await play(labelEl, { opacity: [1, 0], duration: 140, ease: 'linear' });
	await play(panels, {
		translateX: ['0%', '130%'],
		duration: 420,
		delay: stagger(70),
		ease: 'inOutQuart'
	});

	root.style.visibility = 'hidden';
	utils.set(panels, { translateX: '-130%' });
}
