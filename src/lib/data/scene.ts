/**
 * Siluetas del fondo, una por sección. Los archivos están en `static/characters/`.
 *
 * Cada silueta es una imagen plana con transparencia: solo se usa su forma (máscara CSS),
 * así que se pinta del color que se indique. La clave es el `id` de la ruta (ver nav.ts).
 * El fondo de cada sección (cielo, estrellas, metro...) se elige con `scene` en nav.ts.
 *
 * pos  → dónde se coloca:
 *   'right' · 'right-tall'  figura alta a la derecha, apoyada abajo
 *   'bottom-wide'           grupo ancho abajo a la derecha
 *   'top-right'             figura colgando desde arriba a la derecha
 *   'run'                   grupo que cruza la pantalla por abajo
 * anim → cómo se mueve: 'sway' péndulo · 'breathe' respira · 'float' flota · 'run' corre · 'none' quieta
 * from → desde qué ancho se ve ('sm' = siempre, 'md' = 768 px, 'lg' = 1024 px); smOpacity la muestra también en móvil.
 *
 * La de Contacto (banca) la dibuja MetroBackdrop, porque va sentada dentro del vagón.
 */
export type Silhouette = {
	src: string;
	pos: 'right' | 'right-tall' | 'bottom-wide' | 'top-right' | 'run';
	anim: 'sway' | 'breathe' | 'float' | 'run' | 'none';
	/** Color de la silueta: rojo de la marca o naranja (para fondos oscuros). */
	tone: 'primary' | 'accent';
	opacity: number;
	from: 'sm' | 'md' | 'lg';
	/** Si se define, la silueta también se ve en móvil con esta opacidad (y smTone). */
	smOpacity?: number;
	smTone?: 'primary' | 'accent';
	flip?: boolean;
};

export const silhouettes: Record<string, Silhouette | null> = {
	// Shiori mira hacia el menú, sobre el panel oscuro
	inicio: {
		src: '/characters/shiori.webp',
		pos: 'right-tall',
		anim: 'breathe',
		tone: 'accent',
		opacity: 0.9,
		from: 'sm'
	},
	// Quieta: el movimiento está en el cielo de arriba
	'sobre-mi': { src: '/characters/touhou.webp', pos: 'bottom-wide', anim: 'none', tone: 'primary', opacity: 0.62, from: 'sm' },
	proyectos: { src: '/characters/holly-quintet.webp', pos: 'top-right', anim: 'sway', tone: 'primary', opacity: 0.26, from: 'sm' },
	juego: { src: '/characters/utena.webp', pos: 'right', anim: 'float', tone: 'primary', opacity: 0.2, from: 'sm' },
	contacto: null
};
