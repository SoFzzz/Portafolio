// Cliente mínimo de Chrome DevTools Protocol (Node 22: WebSocket y fetch globales).
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function openChrome({ port = 9333, width = 1440, height = 900 } = {}) {
	const dir = mkdtempSync(join(tmpdir(), 'pf-chrome-'));
	const proc = spawn(
		CHROME,
		[
			'--headless=new',
			'--remote-debugging-port=' + port,
			'--user-data-dir=' + dir,
			'--window-size=' + width + ',' + height,
			'--no-first-run',
			'about:blank'
		],
		{ stdio: 'ignore' }
	);

	let target;
	for (let i = 0; i < 100 && !target; i++) {
		try {
			const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
			target = list.find((t) => t.type === 'page');
		} catch {}
		if (!target) await sleep(100);
	}
	if (!target) {
		proc.kill();
		throw new Error('No se pudo conectar con Chrome (¿CHROME_PATH?)');
	}

	const ws = new WebSocket(target.webSocketDebuggerUrl);
	await new Promise((res, rej) => {
		ws.onopen = res;
		ws.onerror = rej;
	});
	let id = 0;
	const pending = new Map();
	ws.onmessage = (m) => {
		const msg = JSON.parse(m.data);
		const p = pending.get(msg.id);
		if (!p) return;
		pending.delete(msg.id);
		msg.error ? p.rej(new Error(msg.error.message)) : p.res(msg.result);
	};
	const send = (method, params = {}) =>
		new Promise((res, rej) => {
			const i = ++id;
			pending.set(i, { res, rej });
			ws.send(JSON.stringify({ id: i, method, params }));
		});

	const ev = async (fn) => {
		const expression = typeof fn === 'string' ? fn : '(' + fn + ')()';
		const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
		if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
		return r.result.value;
	};

	await send('Page.enable');
	await send('Runtime.enable');

	return {
		send,
		ev,
		sleep,
		close() {
			try {
				ws.close();
			} catch {}
			proc.kill();
		}
	};
}
