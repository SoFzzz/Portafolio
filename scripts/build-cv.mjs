// Genera static/cv/Paula-Sofia-Gonzalez-CV.pdf a partir de cv/cv.html con Chrome headless.
// Uso: npm run cv   (opcional: CV_PNG=ruta.png guarda además una captura para revisar el diseño)
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { openChrome } from './lib/cdp.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = pathToFileURL(resolve(root, 'cv/cv.html')).href;
const out = resolve(root, 'static/cv/Paula-Sofia-Gonzalez-CV.pdf');

const chrome = await openChrome({ port: 9341, width: 794, height: 1123 });
try {
	await chrome.send('Page.navigate', { url: src });
	await chrome.sleep(500);
	// Espera a que las fuentes estén cargadas antes de imprimir
	await chrome.ev('document.fonts.ready.then(() => true)');

	// Avisa si el contenido no cabe en la hoja A4 (el .page recorta lo que sobra)
	const overflow = await chrome.ev(
		'(() => { const p = document.querySelector(".page"); return p.scrollHeight - p.clientHeight; })()'
	);
	if (overflow > 1) console.warn(`AVISO: el contenido desborda la página A4 en ${overflow}px`);

	const { data } = await chrome.send('Page.printToPDF', {
		paperWidth: 8.27,
		paperHeight: 11.69,
		marginTop: 0,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		printBackground: true,
		preferCSSPageSize: true
	});
	mkdirSync(dirname(out), { recursive: true });
	writeFileSync(out, Buffer.from(data, 'base64'));
	console.log('CV generado:', out);

	if (process.env.CV_PNG) {
		const shot = await chrome.send('Page.captureScreenshot', { format: 'png' });
		writeFileSync(process.env.CV_PNG, Buffer.from(shot.data, 'base64'));
	}
} finally {
	chrome.close();
}
