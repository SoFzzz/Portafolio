/** Captura de pantalla. `src` va sin el base path. */
export type Shot = { src: string; alt: string; width: number; height: number };

export type Project = {
	slug: string;
	title: string;
	summary: string;
	platform: string;
	stack: string[];
	/** Colores propios de la tarjeta (no son colores de la interfaz). */
	cover: { bg: string; dot: string; ink: string; chipBg: string; chipInk: string };
	repo: string;
	role: string;
	/** shots[0] es la portada de la tarjeta. */
	shots: Shot[];
	logo?: Shot;
};

export const projects: Project[] = [
	{
		slug: 'likka-pet',
		title: 'Likka-Pet',
		summary: 'Una mascota virtual que te regaña cuando procrastinas y te cuida la postura del cuello.',
		platform: 'Android',
		stack: ['Kotlin', 'Compose', 'Python', 'DeepSeek'],
		cover: { bg: '#F2C94C', dot: 'rgba(13,0,0,0.18)', ink: '#0D0000', chipBg: '#0D0000', chipInk: '#F2C94C' },
		repo: 'https://github.com/SoFzzz/Likka-Pet',
		role: 'Proyecto personal: idea, planificación, diseño y programación.',
		shots: [
			{ src: '/projects/likka-pet/menu.webp', alt: 'Pantalla principal de Likka-Pet: la mascota vigila el tiempo en redes del día', width: 330, height: 649 },
			{ src: '/projects/likka-pet/dormido.webp', alt: 'Likka-Pet en modo descanso, con la mascota dormida', width: 319, height: 636 },
			{ src: '/projects/likka-pet/aparece.webp', alt: 'Likka aparece sobre otra app con un mensaje para dejar de procrastinar', width: 560, height: 328 }
		]
	},
	{
		slug: 'wakesync',
		title: 'WakeSync',
		summary:
			'Un smartwatch que estima tu reposo en el trayecto y te avisa con vibración cuando estás por llegar.',
		platform: 'Wear OS',
		stack: ['Kotlin', 'Wear OS', 'Cloudflare Workers', 'Mapbox'],
		cover: { bg: '#3b7bf0', dot: 'rgba(255,255,255,0.28)', ink: '#ffffff', chipBg: '#0D0000', chipInk: '#ffffff' },
		repo: 'https://github.com/SoFzzz/WakeSync',
		role: 'Proyecto personal: idea, planificación, diseño y programación.',
		shots: [
			{ src: '/projects/wakesync/menu.webp', alt: 'Menú del reloj con los modos Siesta y Siesta con destino', width: 514, height: 490 },
			{ src: '/projects/wakesync/mapa.webp', alt: 'Mapa en el reloj para fijar el destino del trayecto', width: 528, height: 484 }
		],
		logo: { src: '/projects/wakesync/logo.webp', alt: 'Logo de WakeSync', width: 120, height: 142 }
	},
	{
		slug: 'clearread',
		title: 'ClearRead',
		summary:
			'Un lector para estudiantes con dislexia: sílabas en color, lectura en voz alta y un asistente de IA.',
		platform: 'Windows',
		stack: ['Python', 'OCR', 'FastAPI', 'DeepSeek'],
		cover: { bg: '#392F5A', dot: 'rgba(244,208,111,0.35)', ink: '#F4D06F', chipBg: '#F4D06F', chipInk: '#0D0000' },
		repo: 'https://github.com/SoFzzz/ClearRead',
		role: 'Proyecto personal: idea, planificación, diseño y programación.',
		shots: [
			{ src: '/projects/clearread/claro.webp', alt: 'Inicio de ClearRead en modo claro: continuar lectura y subir un PDF o una foto', width: 1280, height: 651 },
			{ src: '/projects/clearread/oscuro.webp', alt: 'Inicio de ClearRead en modo oscuro', width: 1280, height: 687 },
			{ src: '/projects/clearread/ajustes.webp', alt: 'Ajustes de lectura de ClearRead', width: 1280, height: 684 }
		]
	}
];
