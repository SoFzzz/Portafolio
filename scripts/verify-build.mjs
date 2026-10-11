// Revisa el HTML prerenderizado en build/. Uso: BASE_PATH=/Portafolio npm run verify
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BASE = process.env.BASE_PATH ?? '';
const ROOT = 'build';
let fallos = 0;
const ok = (cond, msg) => {
	if (!cond) fallos++;
	console.log((cond ? '✔ ' : '✘ ') + msg);
};

function* walk(dir) {
	for (const f of readdirSync(dir)) {
		const p = join(dir, f);
		if (statSync(p).isDirectory()) yield* walk(p);
		else yield p;
	}
}

const pages = [...walk(ROOT)].filter((p) => p.endsWith('index.html'));
for (const file of pages) {
	const name = '/' + relative(ROOT, file).replace(/\\/g, '/').replace(/index\.html$/, '');
	const html = readFileSync(file, 'utf8');
	const meta = (re) => re.exec(html)?.[1]?.trim();
	ok(!!meta(/<meta name="description" content="([^"]*)"/), `${name} meta description`);
	ok(!!meta(/<meta property="og:title" content="([^"]*)"/), `${name} og:title`);
	ok(!!meta(/<meta property="og:description" content="([^"]*)"/), `${name} og:description`);
	ok(/^https:\/\//.test(meta(/<meta property="og:image" content="([^"]*)"/) ?? ''), `${name} og:image absoluta`);
	ok((html.match(/<h1[\s>]/g) ?? []).length === 1, `${name} exactamente un <h1>`);
	ok(!/href="#"/.test(html), `${name} sin href="#"`);
	ok(!/\[(Captura|Tu foto)/.test(html), `${name} sin placeholders`);
	for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
		const src = /src="([^"]*)"/.exec(tag)?.[1] ?? '';
		const bien = /\balt=/.test(tag) && /\bwidth=/.test(tag) && /\bheight=/.test(tag);
		const local = src.startsWith(BASE + '/') && existsSync(join(ROOT, src.slice(BASE.length)));
		ok(bien && local, `${name} img ${src} (alt, width, height, prefijo y archivo)`);
	}
}

const sitemap = existsSync(join(ROOT, 'sitemap.xml')) ? readFileSync(join(ROOT, 'sitemap.xml'), 'utf8') : '';
ok((sitemap.match(/<loc>/g) ?? []).length === 8, 'sitemap.xml con 8 <loc>');
const robots = existsSync(join(ROOT, 'robots.txt')) ? readFileSync(join(ROOT, 'robots.txt'), 'utf8') : '';
ok(/Sitemap:/.test(robots), 'robots.txt con Sitemap:');

process.exit(fallos ? 1 : 0);
