// Navegación, historial y desbordes. Uso: npm run check:nav -- [url]
import { openChrome } from './lib/cdp.mjs';

const base = (process.argv[2] ?? 'http://localhost:4173/').replace(/\/?$/, '/');
const ROUTES = ['', 'sobre-mi/', 'proyectos/', 'proyectos/descending-to-my-heaven/', 'proyectos/likka-pet/', 'proyectos/wakesync/', 'proyectos/clearread/', 'proyectos/veltro/', 'proyectos/tarium/', 'proyectos/notiz-java/', 'contacto/'];

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

	// 4a. Enter en el botón de animaciones no navega y alterna data-motion
	await goto(base);
	const motion0 = await c.ev(() => document.documentElement.dataset.motion);
	await c.ev(() => document.querySelector('button[aria-pressed]').focus());
	for (const type of ['keyDown', 'keyUp']) {
		await c.send('Input.dispatchKeyEvent', {
			type,
			key: 'Enter',
			code: 'Enter',
			windowsVirtualKeyCode: 13,
			...(type === 'keyDown' ? { text: '\r' } : {})
		});
	}
	await c.sleep(1500);
	ok((await path()) === new URL(base).pathname, 'Enter en el botón de animaciones no navega');
	ok((await c.ev(() => document.documentElement.dataset.motion)) !== motion0, 'Enter en el botón de animaciones alterna data-motion');
	await c.ev(() => localStorage.setItem('pf-motion', 'on'));

	// 4e. Flechas / Enter / Esc dentro de una sección
	await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
	const press = async (k, vk) => {
		for (const type of ['keyDown', 'keyUp'])
			await c.send('Input.dispatchKeyEvent', { type, key: k, code: k, windowsVirtualKeyCode: vk, ...(type === 'keyDown' && k === 'Enter' ? { text: String.fromCharCode(13) } : {}) });
		await c.sleep(500);
	};
	const focusText = () => c.ev(() => document.activeElement?.textContent?.trim().slice(0, 30) ?? '');
	await goto(base + 'proyectos/');
	await press('ArrowDown', 40);
	ok((await focusText()).includes('Volver'), 'ArrowDown sin selección → primer elemento (Volver)');
	await press('ArrowDown', 40);
	const sel = await c.ev(() => document.activeElement?.closest('main') && document.activeElement.tagName === 'A' && document.activeElement.textContent.trim() !== 'Volver');
	ok(sel, 'ArrowDown mueve la selección a otro enlace');
	await press('ArrowUp', 38);
	ok((await focusText()).includes('Volver'), 'ArrowUp vuelve a Volver');
	await press('Enter', 13);
	await c.sleep(1500);
	ok(!(await path()).includes('proyectos'), 'Enter sobre Volver navega al inicio');

	// 4b. Inicio → Proyectos → detalle → Atrás → Atrás
	await goto(base);
	await c.ev(() => document.querySelector('nav a[href*="proyectos"]').click());
	await c.sleep(1800);
	await c.ev(() => [...document.querySelectorAll('a[href*="likka-pet"]')].find((a) => a.textContent.includes('Ver proyecto')).click());
	await c.sleep(1800);
	ok((await path()).endsWith('/proyectos/likka-pet/'), 'Ver proyecto → /proyectos/likka-pet/');
	await c.ev(() => history.back());
	await c.sleep(800);
	ok((await path()).endsWith('/proyectos/'), 'atrás → /proyectos/');
	await c.ev(() => history.back());
	await c.sleep(800);
	ok(!(await path()).includes('proyectos'), 'atrás → inicio');

	// 4c. El correo se muestra completo en Contacto
	for (const [w, h] of [[1440, 900], [390, 844]]) {
		await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
		await goto(base + 'contacto/');
		const mail = await c.ev(() => {
			const el = document.querySelector('a[href^="mailto:"] .flex-col > span:last-child');
			return { text: el.textContent.trim(), full: el.scrollWidth <= el.clientWidth };
		});
		ok(mail.full && mail.text === 'gonzalezambranopaula840@gmail.com', `${w}px correo completo en Contacto ("${mail.text}")`);
	}

	// 4d. Sobre mí en móvil: la presentación (foto) va antes que Habilidades; solo hay un bloque visible
	for (const [w, h] of [[390, 844], [1440, 900]]) {
		await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
		await goto(base + 'sobre-mi/');
		const r = await c.ev(() => {
			const skills = [...document.querySelectorAll('h2')].filter(
				(e) => e.textContent.trim() === 'Habilidades' && e.getClientRects().length > 0
			);
			const photo = [...document.querySelectorAll('img')].find((i) => (i.alt || '').startsWith('Retrato'));
			return { n: skills.length, skillsTop: skills[0]?.getBoundingClientRect().top + scrollY, photoTop: photo.getBoundingClientRect().top + scrollY };
		});
		ok(r.n === 1, `${w}px /sobre-mi/ un solo bloque Habilidades visible (${r.n})`);
		if (w < 768) ok(r.skillsTop > r.photoTop, `${w}px /sobre-mi/ Habilidades (${Math.round(r.skillsTop)}) después de la foto (${Math.round(r.photoTop)})`);
	}

	// 5. Móvil
	await c.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
	for (const r of ROUTES) {
		await goto(base + r);
		const w = await c.ev(() => document.documentElement.scrollWidth);
		ok(w <= 375, `/${r} sin desborde a 375 px (scrollWidth ${w})`);
	}

	// 6. Fondos visibles en móvil y tableta
	const BG = {
		'': ['panel', 'silhouette'],
		'sobre-mi/': ['sea', 'silhouette'],
		'proyectos/': ['silhouette'],
		'proyectos/descending-to-my-heaven/': ['silhouette'],
		'contacto/': ['wagon', 'silhouette']
	};
	for (const [w, h] of [[390, 844], [820, 1180]]) {
		await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
		for (const [r, wanted] of Object.entries(BG)) {
			await goto(base + r);
			await c.sleep(1500);
			for (const name of wanted) {
				const vis = await c.ev(`(() => [...document.querySelectorAll('[data-bg="${name}"]')].some((el) => {
					const b = el.getBoundingClientRect();
					let o = 1;
					for (let e = el; e; e = e.parentElement) {
						const cs = getComputedStyle(e);
						if (cs.display === 'none' || cs.visibility === 'hidden') return false;
						o *= Number(cs.opacity);
					}
					return b.width > 0 && b.height > 0 && o >= 0.15;
				}))()`);
				ok(vis, `${w}px /${r} data-bg=${name} visible`);
			}
		}
	}
} finally {
	c.close();
}
process.exit(fallos ? 1 : 0);
