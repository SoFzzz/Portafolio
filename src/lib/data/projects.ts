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
	/** Enlaces extra (sitio en vivo, repositorio de la API…). */
	links?: { label: string; href: string }[];
	role: string;
	/** Colaborativo o personal; se muestra como insignia y agrupa la lista. */
	kind: 'collaborative' | 'personal';
	/** Puntos técnicos clave para la página del proyecto. */
	highlights?: string[];
	/** shots[0] es la portada de la tarjeta; sin capturas la tarjeta usa una portada tipográfica. */
	shots?: Shot[];
	logo?: Shot;
};

export const kindLabel: Record<Project['kind'], string> = { collaborative: 'Colaborativo', personal: 'Personal' };

export const projects: Project[] = [
	{
		slug: 'likka-pet',
		title: 'Likka-Pet',
		summary: 'Una mascota virtual que te regaña cuando procrastinas y te cuida la postura del cuello.',
		platform: 'Android',
		stack: ['Kotlin', 'Compose', 'Python', 'DeepSeek'],
		cover: { bg: '#F2C94C', dot: 'rgba(13,0,0,0.18)', ink: '#0D0000', chipBg: '#0D0000', chipInk: '#F2C94C' },
		repo: 'https://github.com/SoFzzz/Likka-Pet',
		kind: 'personal',
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
		kind: 'personal',
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
		kind: 'personal',
		role: 'Proyecto personal: idea, planificación, diseño y programación.',
		shots: [
			{ src: '/projects/clearread/claro.webp', alt: 'Inicio de ClearRead en modo claro: continuar lectura y subir un PDF o una foto', width: 1280, height: 651 },
			{ src: '/projects/clearread/oscuro.webp', alt: 'Inicio de ClearRead en modo oscuro', width: 1280, height: 687 },
			{ src: '/projects/clearread/ajustes.webp', alt: 'Ajustes de lectura de ClearRead', width: 1280, height: 684 }
		]
	},
	{
		slug: 'veltro',
		title: 'Veltro',
		summary:
			'El backend de un sistema de inventario y punto de venta para pequeños negocios, con un escáner de productos asistido por IA.',
		platform: 'API REST',
		stack: ['Java 21', 'Spring Boot', 'PostgreSQL', 'pgvector', 'JWT'],
		cover: { bg: '#bf2424', dot: 'rgba(242,212,121,0.28)', ink: '#F2D479', chipBg: '#0D0000', chipInk: '#F2D479' },
		repo: 'https://github.com/SoFzzz/Veltro',
		kind: 'collaborative',
		role: 'Proyecto colaborativo (equipo de 3): desarrollo del backend, con foco en el escáner de IA, la base de datos y la validación.',
		highlights: [
			'API REST con autenticación JWT (acceso y refresh), roles y límite de intentos de login.',
			'Productos, categorías, inventario, ventas, compras a proveedores con recepción parcial, alertas de stock, reportes en PDF y Excel, y auditoría.',
			'PostgreSQL con pgvector para la búsqueda semántica de productos (índice HNSW) y migraciones con Flyway.',
			'Escáner de productos con IA: visión, CLIP (ONNX) y segmentación.',
			'Patrones de diseño: State en ventas y órdenes, Strategy, Chain of Responsibility en las alertas, Command en la auditoría y eventos de dominio.',
			'Más de 70 archivos de prueba (unitarias, de controlador y de integración) y despliegue con Docker.',
			'El repositorio contiene solo el backend: no incluye el frontend.'
		]
	},
	{
		slug: 'tarium',
		title: 'Tarium',
		summary:
			'Un reproductor de música web que reúne tu biblioteca local, Spotify, Jamendo, Deezer y YouTube en una sola interfaz.',
		platform: 'Web',
		stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind'],
		cover: { bg: '#0D0000', dot: 'rgba(242,149,68,0.26)', ink: '#F29544', chipBg: '#F29544', chipInk: '#0D0000' },
		repo: 'https://github.com/SoFzzz/Tarium-Frontend',
		links: [
			{ label: 'Ver en vivo', href: 'https://tarium-frontend.vercel.app' },
			{ label: 'API (Tarium-BD)', href: 'https://github.com/SoFzzz/Tarium-BD' }
		],
		kind: 'personal',
		role: 'Proyecto personal: programación de la aplicación web y de su API de respaldo.',
		highlights: [
			'Reproduce desde cuatro fuentes de música y la biblioteca local de archivos de audio, con cola, favoritos y playlists.',
			'Inicio de sesión con Spotify, búsqueda, playlists y recomendaciones desde rutas de servidor de Next.js.',
			'Un adaptador de audio por fuente, combinados en uno solo, y una cola de reproducción hecha con una lista doblemente enlazada.',
			'API de respaldo en Express con TypeScript: playlists, favoritos e historial, con autenticación de Supabase.',
			'Pruebas con Vitest y Testing Library, y despliegue del frontend en Vercel.'
		]
	},
	{
		slug: 'notiz-java',
		title: 'Notiz',
		summary:
			'El backend de una plataforma de gestión académica: calificaciones, matrículas, horarios, mensajería y reportes.',
		platform: 'API REST',
		stack: ['Java 21', 'Spring Boot', 'MongoDB', 'Redis', 'WebSocket'],
		cover: { bg: '#F29544', dot: 'rgba(13,0,0,0.16)', ink: '#0D0000', chipBg: '#0D0000', chipInk: '#F29544' },
		repo: 'https://github.com/SoFzzz/Notiz-Java',
		kind: 'personal',
		role: 'Proyecto personal: diseño y programación del backend.',
		highlights: [
			'Roles de administrador, profesor, estudiante y acudiente, con autenticación JWT e inicio de sesión con Google (OAuth2).',
			'Calificaciones con escalas y criterios configurables, periodos académicos, materias, matrículas y horarios.',
			'Chat y foros en tiempo real con WebSocket (STOMP), con Redis para caché.',
			'Reportes en PDF, Excel y CSV, y correos transaccionales con SendGrid.',
			'Documentación de ingeniería: requisitos, diagramas UML y colección de Postman.',
			'Cuenta con una sola prueba automatizada (arranque del contexto).'
		]
	}
];
