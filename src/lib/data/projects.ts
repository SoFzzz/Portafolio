export type Project = {
	slug: string;
	title: string;
	summary: string;
	platform: string;
	stack: string[];
	/** Colores propios de la tarjeta (no son colores de la interfaz). */
	cover: { bg: string; dot: string; ink: string; chipBg: string; chipInk: string };
	repo: string;
};

export const projects: Project[] = [
	{
		slug: 'likka-pet',
		title: 'Likka-Pet',
		summary: 'Una mascota virtual que te regaña cuando procrastinas y te cuida la postura del cuello.',
		platform: 'Android',
		stack: ['Kotlin', 'Compose', 'Python', 'DeepSeek'],
		cover: { bg: '#F2C94C', dot: 'rgba(13,0,0,0.18)', ink: '#0D0000', chipBg: '#0D0000', chipInk: '#F2C94C' },
		repo: 'https://github.com/SoFzzz/Likka-Pet'
	},
	{
		slug: 'wakesync',
		title: 'WakeSync',
		summary:
			'Un smartwatch que estima tu reposo en el trayecto y te avisa con vibración cuando estás por llegar.',
		platform: 'Wear OS',
		stack: ['Kotlin', 'Wear OS', 'Cloudflare Workers', 'Mapbox'],
		cover: { bg: '#3b7bf0', dot: 'rgba(255,255,255,0.28)', ink: '#ffffff', chipBg: '#0D0000', chipInk: '#ffffff' },
		repo: 'https://github.com/SoFzzz/WakeSync'
	},
	{
		slug: 'clearread',
		title: 'ClearRead',
		summary:
			'Un lector para estudiantes con dislexia: sílabas en color, lectura en voz alta y un asistente de IA.',
		platform: 'Windows',
		stack: ['Python', 'OCR', 'FastAPI', 'DeepSeek'],
		cover: { bg: '#392F5A', dot: 'rgba(244,208,111,0.35)', ink: '#F4D06F', chipBg: '#F4D06F', chipInk: '#0D0000' },
		repo: 'https://github.com/SoFzzz/ClearRead'
	}
];
