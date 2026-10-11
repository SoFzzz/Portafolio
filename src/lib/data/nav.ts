/** Escena de fondo: 'split' panel diagonal · 'plain' franjas · 'sea' mar visto desde una cubierta · 'stars' estrellas · 'metro' vagón. */
export type Scene = 'split' | 'plain' | 'sea' | 'stars' | 'metro';

export type NavItem = {
	id: string;
	label: string;
	href: string;
	scene: Scene;
};

/** Opciones del menú principal. */
export const menuItems: NavItem[] = [
	{ id: 'sobre-mi', label: 'Sobre mí', href: '/sobre-mi/', scene: 'sea' },
	{ id: 'proyectos', label: 'Proyectos', href: '/proyectos/', scene: 'stars' }, // incluye el videojuego
	{ id: 'contacto', label: 'Contacto', href: '/contacto/', scene: 'metro' }
];

/** Todas las rutas (el menú más las que no aparecen en él). */
const routes: NavItem[] = [
	{ id: 'inicio', label: 'Inicio', href: '/', scene: 'split' },
	...menuItems,
	{
		id: 'juego',
		label: 'Videojuego',
		href: '/proyectos/descending-to-my-heaven/',
		scene: 'plain'
	}
];

/** Busca la entrada de una ruta (sin el base path). */
export function findNav(pathname: string): NavItem {
	const clean = pathname.replace(/\/+$/, '') || '/';
	return routes.find((n) => n.href.replace(/\/+$/, '') === clean) ?? routes[0];
}
