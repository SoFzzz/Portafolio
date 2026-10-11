// Genera los WebP de static/ desde image/projects/ y la imagen social og.png.
// Uso: npm run images
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import sharp from 'sharp';
import { openChrome } from './lib/cdp.mjs';

const SRC = 'image/projects/';
const OUT = 'static/';

// op: 'cover' | 'crop' | 'width' | 'none'
const jobs = [
	{ in: 'foto.png', out: 'photo.webp', op: { cover: [440, 520] } },
	{ in: 'lp-menu.png', out: 'projects/likka-pet/menu.webp' },
	{ in: 'lp-dormido.png', out: 'projects/likka-pet/dormido.webp' },
	// solo el globo y Likka, sin las carátulas del emulador
	{ in: 'lp-aparece.png', out: 'projects/likka-pet/aparece.webp', op: { crop: { left: 400, top: 380, width: 560, height: 328 } } },
	{ in: 'ws-menu.png', out: 'projects/wakesync/menu.webp' },
	{ in: 'ws-mapa.png', out: 'projects/wakesync/mapa.webp' },
	{ in: 'ws-logo.png', out: 'projects/wakesync/logo.webp', lossless: true },
	{ in: 'cr-claro.png', out: 'projects/clearread/claro.webp', op: { width: 1280 } },
	{ in: 'cr-oscuro.png', out: 'projects/clearread/oscuro.webp', op: { width: 1280 } },
	{ in: 'cr-ajustes.png', out: 'projects/clearread/ajustes.webp', op: { width: 1280 } }
];

for (const j of jobs) {
	let img = sharp(SRC + j.in);
	if (j.op?.cover) img = img.resize(j.op.cover[0], j.op.cover[1], { fit: 'cover', position: 'centre' });
	if (j.op?.crop) img = img.extract(j.op.crop);
	if (j.op?.width) img = img.resize({ width: j.op.width });
	mkdirSync(dirname(OUT + j.out), { recursive: true });
	const info = await img.webp(j.lossless ? { lossless: true } : { quality: 80 }).toFile(OUT + j.out);
	console.log(`${j.out} ${info.width}×${info.height} ${(statSync(OUT + j.out).size / 1024).toFixed(1)} KB`);
}

// --- og.png (1200×630): se compone en HTML y se captura con Chrome para poder usar Anton e Inter ---
const b64 = (f) => readFileSync(f).toString('base64');
const anton = b64('node_modules/@fontsource/anton/files/anton-latin-400-normal.woff');
const inter = b64('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2');
const photo = b64(OUT + 'photo.webp');
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Anton;src:url(data:font/woff;base64,${anton})}
@font-face{font-family:Inter;font-weight:100 900;src:url(data:font/woff2;base64,${inter})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#F2F2F2;position:relative;overflow:hidden;font-family:Inter}
.stripe{position:absolute;left:-200px;top:380px;width:1700px;height:150px;background:#BF2424;transform:rotate(-8deg)}
h1{position:absolute;left:70px;top:150px;font:400 112px/1 Anton;color:#BF2424;text-transform:uppercase;letter-spacing:2px}
p{position:absolute;left:74px;top:482px;font:700 30px Inter;letter-spacing:.14em;text-transform:uppercase;color:#fff}
.ph{position:absolute;right:70px;top:90px;width:340px;height:402px;clip-path:polygon(14% 0,100% 0,100% 86%,86% 100%,0 100%,0 14%);background:#222}
.ph img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.1)}
</style><div class="stripe"></div><h1>Paula Sofía<br>González</h1><p>Full Stack Developer Junior</p>
<div class="ph"><img src="data:image/webp;base64,${photo}"></div>`;
const c = await openChrome({ port: 9336, width: 1200, height: 630 });
try {
	await c.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
	await c.send('Page.navigate', { url: 'data:text/html;base64,' + Buffer.from(html).toString('base64') });
	await c.sleep(1500);
	const shot = await c.send('Page.captureScreenshot', { format: 'png' });
	writeFileSync(OUT + 'og.png', Buffer.from(shot.data, 'base64'));
	console.log('og.png 1200×630');
} finally {
	c.close();
}
