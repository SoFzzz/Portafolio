import { base } from '$app/paths';
import { projects } from '$lib/data/projects';
import { SITE_URL } from '$lib/data/site';

export const prerender = true;

const fixed = ['/', '/sobre-mi/', '/proyectos/', '/proyectos/descending-to-my-heaven/', '/contacto/'];

export function GET() {
	const paths = [...fixed, ...projects.map((p) => `/proyectos/${p.slug}/`)];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `\t<url><loc>${SITE_URL}${base}${p}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
