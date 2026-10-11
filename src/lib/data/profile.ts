export const profile = {
	name: 'Paula Sofía González Zambrano',
	shortName: 'Paula Sofía González',
	role: 'Full Stack Developer Junior',
	studies: 'Ingeniería de Software · UCC',
	tagline: 'Me gusta convertir ideas en software y descubrir nuevas formas de construir tecnología.',
	/** Ruta de la foto procesada (WebP), sin el base path. Si es null se muestra el marcador. */
	photo: '/photo.webp' as string | null,
	bio: [
		'Me gusta programar, experimentar con nuevas tecnologías y construir soluciones que tengan un propósito. Estoy explorando el mundo de la ciberseguridad y el cloud computing, dos áreas en las que quiero seguir creciendo. Cuando no estoy programando, probablemente estoy jugando algún RPG.',
		'He desarrollado apps para Android y Wear OS, una aplicación de escritorio y varios backends, además de un videojuego.'
	],
	education: [
		{
			title: 'Ingeniería de Software',
			place: 'Universidad Cooperativa de Colombia',
			period: '2 años'
		}
	],
	skills: [
		{ group: 'Móvil y wearables', items: ['Kotlin', 'Java', 'Jetpack Compose', 'Android', 'Wear OS'] },
		{ group: 'Backend', items: ['Python', 'FastAPI', 'TypeScript', 'Cloudflare Workers'] },
		{ group: 'Frontend', items: ['JavaScript', 'CSS', 'Tailwind CSS'] },
		{ group: 'IA y servicios', items: ['DeepSeek API', 'OCR', 'Mapbox'] },
		{ group: 'Diseño y herramientas', items: ['Design systems', 'Git y GitHub'] }
	]
};
