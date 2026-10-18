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
	/** CV en PDF (se genera con `npm run cv` a partir de cv/cv.html). Ruta sin el base path. */
	cv: { href: '/cv/Paula-Sofia-Gonzalez-CV.pdf', label: 'Descargar CV (PDF)' },
	education: [
		{
			title: 'Ingeniería de Software',
			place: 'Universidad Cooperativa de Colombia',
			period: '5.º semestre · desde agosto de 2024'
		}
	],
	skills: [
		{ group: 'Móvil y wearables', items: ['Kotlin', 'Jetpack Compose', 'Android', 'Wear OS'] },
		{ group: 'Backend', items: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'TypeScript', 'Cloudflare Workers'] },
		{ group: 'Bases de datos', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
		{ group: 'Frontend', items: ['JavaScript', 'React', 'Next.js', 'Tailwind CSS'] },
		{ group: 'IA y servicios', items: ['DeepSeek API', 'OCR', 'Mapbox'] },
		{ group: 'Diseño y herramientas', items: ['Design systems', 'Git y GitHub'] }
	]
};
