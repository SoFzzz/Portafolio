// Preferencia de movimiento del visitante.
// Valor inicial: lo que dejó el script de app.html (elección guardada o preferencia del sistema).

export const motion = $state({ on: true });

export function initMotion() {
	motion.on = document.documentElement.dataset.motion !== 'off';
}

export function setMotion(on: boolean) {
	motion.on = on;
	document.documentElement.dataset.motion = on ? 'on' : 'off';
	try {
		localStorage.setItem('pf-motion', on ? 'on' : 'off');
	} catch {
		/* sin almacenamiento: solo afecta a esta visita */
	}
}

/** Para código que no es reactivo (animaciones con anime.js). */
export const motionOn = () =>
	typeof document === 'undefined' || document.documentElement.dataset.motion !== 'off';
