// Coste de las animaciones (CPU ×4). Uso: npm run check:perf -- <url> [--motion on|off] [--max <pct>]
import { openChrome } from './lib/cdp.mjs';

const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const base = (args.find((a) => /^https?:/.test(a)) ?? 'http://localhost:4173/').replace(/\/?$/, '/');
const motion = opt('--motion', 'on');
const max = opt('--max') ? Number(opt('--max')) : null;
const ROUTES = ['', 'sobre-mi/', 'proyectos/', 'contacto/'];

const c = await openChrome({ port: 9335 });
let fallos = 0;
try {
	await c.send('Page.navigate', { url: base });
	await c.sleep(1000);
	await c.ev(`localStorage.setItem('pf-motion', '${motion}')`);
	await c.send('Performance.enable');
	for (const r of ROUTES) {
		await c.send('Emulation.setCPUThrottlingRate', { rate: 1 });
		await c.send('Page.navigate', { url: base + r });
		await c.sleep(3000);
		await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
		const get = async () =>
			Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
		const a = await get();
		await c.sleep(5000);
		const b = await get();
		const dt = b.Timestamp - a.Timestamp;
		const task = ((b.TaskDuration - a.TaskDuration) / dt) * 100;
		const style = ((b.RecalcStyleDuration - a.RecalcStyleDuration) / dt) * 100;
		const bad = max !== null && task > max;
		if (bad) fallos++;
		console.log(
			`${bad ? '✘' : '✔'} /${r} motion=${motion} TaskDuration ${task.toFixed(1)}%  RecalcStyle ${style.toFixed(1)}%`
		);
	}
} finally {
	c.close();
}
process.exit(fallos ? 1 : 0);
