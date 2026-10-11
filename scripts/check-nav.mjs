// Navegación, historial y desbordes. Uso: npm run check:nav -- [url]
import { openChrome } from './lib/cdp.mjs';

const base = (process.argv[2] ?? 'http://localhost:4173/').replace(/\/?$/, '/');
const ROUTES = ['', 'sobre-mi/', 'proyectos/', 'proyectos/descending-to-my-heaven/', 'contacto/'];

let fallos = 0;
const ok = (cond, msg) => {
	if (!cond) fallos++;
	console.log((cond ? '✔ ' : '✘ ') + msg);
};

const c = await openChrome({ port: 9334 });
const path = () => c.ev(() => location.pathname);
const goto = async (url) => {
	await c.send('Page.navigate', { url });
	await c.sleep(1200);
};
const key = (k) =>
	c.send('Input.dispatchKeyEvent', {
		type: 'keyDown',
		key: k,
		code: k,
		windowsVirtualKeyCode: { Backspace: 8, Escape: 27 }[k]
	});

try {
	await goto(base);
	await c.ev(`localStorage.setItem('pf-motion','on')`);
	await goto(base);

	// 1. Menú
	const hrefs = await c.ev(() => [...document.querySelectorAll('nav a')].map((a) => a.getAttribute('href')));
	ok(hrefs.length > 0 && hrefs.every((h) => h.endsWith('/')), `hrefs del menú terminan en "/" (${hrefs.join(', ')})`);
	await c.ev(() => document.querySelector('nav a[href*="proyectos"]').dispatchEvent(new MouseEvent('mouseenter')));
	await c.sleep(200);
	ok((await c.ev(() => document.querySelectorAll('nav [aria-current]').length)) === 0, 'sin aria-current por hover/foco');

	// 2. Cortina
	const len = await c.ev(() => history.length);
	await c.ev(() => document.querySelector('nav a[href*="proyectos"]').click());
	const t0 = Date.now();
	let ms = 0;
	for (let i = 0; i < 200; i++) {
		await c.sleep(10);
		const hidden = await c.ev(
			() => getComputedStyle(document.querySelector('[aria-hidden=true].z-50')).visibility === 'hidden'
		);
		if (hidden && (await path()).includes('proyectos')) {
			ms = Date.now() - t0;
			break;
		}
	}
	ok(ms > 0 && ms <= 1100, `cortina ≤ 1100 ms (${ms} ms)`);
	ok((await path()).endsWith('/proyectos/'), 'ruta /proyectos/');

	// 3. Atrás / adelante
	const len2 = await c.ev(() => history.length);
	await c.ev(() => history.back());
	await c.sleep(800);
	const p = await path();
	ok(!p.includes('proyectos'), 'atrás → inicio');
	ok((await c.ev(() => history.length)) === len2, 'history.length no crece al volver');
	await c.ev(() => history.forward());
	await c.sleep(800);
	ok((await path()).endsWith('/proyectos/'), 'adelante → /proyectos/');
	ok((await c.ev(() => history.length)) === len2, 'history.length no crece al avanzar');

	// 4. Teclado
	await goto(base + 'sobre-mi/');
	await key('Backspace');
	await c.sleep(1500);
	ok((await path()).endsWith('/sobre-mi/'), 'Backspace no navega');
	await key('Escape');
	await c.sleep(1800);
	ok(!(await path()).includes('sobre-mi'), 'Escape vuelve al inicio');

	// 5. Móvil
	await c.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
	for (const r of ROUTES) {
		await goto(base + r);
		const w = await c.ev(() => document.documentElement.scrollWidth);
		ok(w <= 375, `/${r} sin desborde a 375 px (scrollWidth ${w})`);
	}
} finally {
	c.close();
}
process.exit(fallos ? 1 : 0);
