export type Game = {
	title: string;
	status: string;
	premise: string;
	genre: string;
	engine: string;
	platform: string;
	role: string;
	media: { label: string }[];
	links: { play?: string; repo?: string };
};

// Marcadores: faltan los datos reales del juego (ver docs/PLAN-PORTAFOLIO.md §13).
export const game: Game = {
	title: 'Descending to my Heaven',
	status: '[Estado del juego]',
	premise: '[Premisa del juego en 2–3 frases: de qué trata y qué se siente al jugarlo.]',
	genre: '[Género]',
	engine: '[Motor]',
	platform: '[Plataforma]',
	role: '[Tu rol en el proyecto]',
	media: [{ label: '[Captura 1]' }, { label: '[Captura 2]' }, { label: '[Captura 3]' }, { label: '[Captura 4]' }],
	links: {}
};
