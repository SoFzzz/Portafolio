# Mejoras de la auditoría: plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDA: superpowers:executing-plans. **Un solo agente** implementa todas las tareas en orden, en la rama `mejoras-auditoria`. Al terminar, Claude revisa toda la rama y después se despliega (ver "Después de la revisión"). Los pasos usan casillas (`- [ ]`) para el seguimiento.

**Objetivo:** corregir los problemas verificados de las dos auditorías (la de Claude del 2026-10-10 y la de Antigravity, `auditoria-portafolio.md`) y cargar el contenido real que entregó Paula: foto, capturas, rol en los proyectos y habilidades.

**Arquitectura:** el sitio sigue siendo SvelteKit estático. El contenido se queda en `src/lib/data/`. Las imágenes fuente se descargan a `image/` (ignorada por git) y un script con `sharp` genera los WebP en `static/`. La verificación se hace con tres scripts Node sin dependencias nuevas: `verify-build` (HTML prerenderizado), `check-nav` (Chrome por CDP) y `perf-check` (coste de animaciones por CDP).

**Stack:** SvelteKit 2 · Svelte 5 · Tailwind v4 · anime.js 4 · sharp (ya instalado) · Node 22 (`WebSocket` y `fetch` globales) · Chrome.

**Spec:** este documento resume, en la sección "Hallazgos verificados", las dos auditorías y los dos mensajes de Paula del 2026-10-11. No hay un documento de diseño aparte; `docs/PLAN-PORTAFOLIO.md` sigue siendo el design system.

**Pedidos de Paula (2026-10-11, segundo mensaje):**
- correo de contacto;
- quitar el texto de la esquina inferior izquierda del inicio;
- arreglar los fondos en móvil:
  - Inicio: falta el panel oscuro;
  - Proyectos: falta la silueta;
  - Sobre mí: no se ven bien ni el mar ni la silueta;
  - Contacto: desaparece todo;
- el repo se llama `Portafolio`.

Verificado con capturas en 390×844 y 820×1180: todo lo anterior es cierto. Además, el botón "Animaciones" tapa contenido en móvil.

## Hallazgos verificados (lo que este plan corrige)

| Origen | Hallazgo | Veredicto | Tarea |
|---|---|---|---|
| Ambas | El botón Atrás crea entradas nuevas y deja un bucle | ✅ medido (history 3→4→5) | 2 |
| Antigravity D1 | `runTransition` sin `try/finally` | ⚠️ falta, pero el bloqueo no se reproduce: SvelteKit recarga la página entera si falla el chunk | 2 |
| Claude | La cortina tarda ~1.7 s; Backspace manda al inicio | ✅ medido | 2 |
| Antigravity D7 | W/S/flechas capturadas en `window` | ✅ (latente) | 2 |
| Antigravity D12 | Hrefs del menú sin `/` final con `trailingSlash: 'always'` | ✅ | 2 |
| Claude | `aria-current` marca la opción con hover o foco | ✅ | 2 |
| Antigravity D6 | "Jugar"/"Repositorio" van a `#`; el ▶ no hace nada | ✅ | 4 |
| Claude | Placeholders `[Captura]`, foto `[Tu foto…]` | ✅ | 3, 4 |
| Claude | El rol "Full Stack" no aparece; faltan habilidades; la portada no tiene `<h1>` | ✅ | 3 |
| Claude | La bio se lee sobre las olas | ✅ captura | 3 |
| Ambas | 0 meta description / Open Graph / sitemap | ✅ | 5 |
| Antigravity D24 | `handleHttpError: 'warn'` | ✅ | 5 |
| Antigravity D3 | Animar `background-position`/`mask-position` cuesta CPU | ✅ medido: hilo principal a CPU ×4, `/` 43 %, `/sobre-mi/` 97 %, `/contacto/` 46 % | 7 |
| Antigravity D15 | `--tw-skew` en SocialLink no hace nada | ✅ código muerto | 8 |
| Antigravity D16 | "(se abre en una pestaña nueva)" también en `mailto:` | ✅ latente | 8 |
| Antigravity D20 | 3 siluetas sin usar en `static/` | ✅ | 3 |
| Claude | `image/` (8.8 MB) sin ignorar; repo sin commits | ✅ | 1 |
| Antigravity D9 | `sharp` sin uso | ✅ hoy; se resuelve **usándolo** en la Tarea 3 | 3 |

**Descartados tras verificar (no se tocan):**
- D4: las estrellas animan `transform`/`opacity` y van al compositor (0.9 % del hilo principal).
- D5: `vh` no cambia al hacer scroll en los navegadores actuales.
- D8: por `unicode-range` solo se descargan `inter-latin` y `anton-latin`.
- D11: `setMotion` mantiene sincronizadas las dos lecturas.
- D13, D17, D18: impacto despreciable.
- D14: `SilhouetteLayer` ya antepone `base`.
- D27: la vulnerabilidad de `cookie` no aplica a un sitio estático sin servidor.

## Restricciones globales

- **No hay dependencias nuevas.** Los scripts usan solo Node 22 y `sharp`. Ruta de Chrome: `process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'`.
- **Textos en español**, con el tono actual del sitio. Los identificadores siguen en inglés y los comentarios en español, como el resto del código.
- **Las siluetas y el logo de otras franquicias se quedan** (es un trabajo académico; Paula los reemplazará más adelante por assets propios). Solo se borran los 3 archivos sin usar.
- **No se añade CV.**
- **Correo (exacto):** `gonzalezambranopaula840@gmail.com`. Va en Contacto como **primera** opción (tono oscuro), con `label: 'Correo'`.
- **Inicio sin pie:** se elimina el bloque inferior izquierdo (estudios + frase). `profile.tagline` deja de mostrarse en la portada.
- **El contenido del videojuego se queda como está.** Solo se corrige lo interactivo roto.
- **Rol:** `'Full Stack Developer Junior'`. **Estudios:** `'Ingeniería de Software · UCC'`.
- **Rol en cada proyecto (exacto):** `'Proyecto personal: idea, planificación, diseño y programación.'`
- **Habilidades (exactas, en este orden):**
  - Móvil y wearables: Kotlin, Java, Jetpack Compose, Android, Wear OS
  - Backend: Python, FastAPI, TypeScript, Cloudflare Workers
  - Frontend: JavaScript, CSS, Tailwind CSS
  - IA y servicios: DeepSeek API, OCR, Mapbox
  - Diseño y herramientas: Design systems, Git y GitHub
- **Cada tarea termina con `npm run check` (0 errores) y `npm run build` (éxito)** antes del commit.
- **URL pública (confirmada):** `https://sofzzz.github.io` con base `/Portafolio`. Vive en `src/lib/data/site.ts`.

## Foco de revisión

1. **Atrás/adelante tras varias navegaciones** (Inicio → Proyectos → detalle → Atrás → Atrás) debe volver por el mismo camino. Lo cubre `check-nav` en la Tarea 2 y se amplía con el detalle en la Tarea 4.
2. **Build con `BASE_PATH=/Portafolio`:** las capturas, la foto y `og:image` deben llevar el prefijo y existir. Lo cubre `verify-build` con `BASE_PATH` en la Tarea 8.
3. **Animaciones apagadas:** las nuevas animaciones `pf-slide` deben detenerse. Lo cubre `perf-check --motion off` en la Tarea 7.
4. **Móvil a 375 px:** las capturas de escritorio (1920 px) no deben desbordar en la tarjeta ni en el detalle. Lo cubre `check-nav` (scrollWidth) en las Tareas 2 y 4.
5. **Imágenes sin `alt`, `width` o `height`** (accesibilidad y CLS). Lo cubre `verify-build` en las Tareas 1 y 4.
6. **Fondos en móvil:** cada sección debe mostrar su escena y su silueta a 390 px y a 820 px. Lo cubre `check-nav` (`data-bg` visibles) más capturas en la Tarea 6.

---

### Tarea 1: base del repo y scripts de verificación

**Archivos:**
- Modificar: `.gitignore`. Añadir la línea `image/`.
- Modificar: `.claude/launch.json`. Añadir la configuración `{ "name": "portafolio-preview", "runtimeExecutable": "npm", "runtimeArgs": ["run", "preview", "--", "--port", "4173"], "port": 4173 }`.
- Crear: `scripts/lib/cdp.mjs`, `scripts/verify-build.mjs`, `scripts/check-nav.mjs`, `scripts/perf-check.mjs`.
- Modificar: `package.json`. Añadir los scripts `"verify": "node scripts/verify-build.mjs"`, `"check:nav": "node scripts/check-nav.mjs"` y `"check:perf": "node scripts/perf-check.mjs"`.

**Interfaces:**
- Produce: `openChrome({ port, width, height }) → Promise<{ send(method, params), ev(fn | string), close() }>` en `scripts/lib/cdp.mjs`. `ev` evalúa una función serializada (`'(' + fn + ')()'`) con `awaitPromise` y `returnByValue`. Si hay excepción, la lanza.
- Produce: `npm run verify` (sale con código 1 y lista los fallos), `npm run check:nav -- <url>` y `npm run check:perf -- <url> [--motion on|off] [--max <pct>]`.

- [ ] **Paso 1: proteger `image/` y hacer el commit base en `main`**

```bash
git add -A
git status --short   # confirmar que image/, node_modules, build y .svelte-kit NO aparecen
git commit -m "chore: estado inicial del portafolio"
git switch -c mejoras-auditoria
```

- [ ] **Paso 2: escribir `scripts/lib/cdp.mjs`**

Lanza Chrome con `spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + tmpdir, '--window-size=' + w + ',' + h, 'about:blank'])`. Espera a que responda `http://127.0.0.1:<port>/json`, conecta con `new WebSocket(target.webSocketDebuggerUrl)` al target `type === 'page'` y empareja las respuestas por `id`. `close()` cierra el socket y mata el proceso. El prototipo probado está en el historial de la sesión; la lógica completa son unas 25 líneas.

- [ ] **Paso 3: escribir `scripts/verify-build.mjs`**

Recorre `build/**/index.html` (ignora `404.html`). `BASE = process.env.BASE_PATH ?? ''`. Aserciones por página:
- `<meta name="description" content="…">` no vacío.
- `og:title`, `og:description` y `og:image`, con `og:image` empezando por `https://`.
- Exactamente un `<h1`.
- Ningún `href="#"`.
- Ningún texto que cumpla `/\[(Captura|Tu foto)/`.
- Todo `<img` tiene `alt=`, `width=` y `height=`. Su `src` empieza por `BASE + '/'` y el archivo existe en `build/` (quitando `BASE`).

Globales:
- `build/sitemap.xml` existe y tiene exactamente 8 `<loc>`.
- `build/robots.txt` contiene `Sitemap:`.

Imprime `✔`/`✘` por aserción y termina con `process.exit(fallos ? 1 : 0)`.

- [ ] **Paso 4: escribir `scripts/check-nav.mjs`**

Argumento: la URL base (por defecto `http://localhost:4173/`). Primero fija `localStorage['pf-motion'] = 'on'` y recarga. Comprobaciones:
1. En `/`: todos los `nav a` tienen href terminado en `/` y `document.querySelectorAll('nav [aria-current]').length === 0` tras hacer hover sobre "Proyectos".
2. Clic en el enlace del menú a Proyectos. Mide el tiempo hasta que la cortina `[aria-hidden=true].z-50` vuelve a `visibility: hidden`: debe ser **≤ 1100 ms**. La ruta debe ser `/proyectos/`.
3. `history.back()` → ruta `/`. Luego `history.forward()` → `/proyectos/`. `history.length` no crece en ninguno de los dos.
4. En `/sobre-mi/`, `Backspace` (CDP `Input.dispatchKeyEvent`) → la ruta sigue siendo `/sobre-mi/`. `Escape` → `/`.
5. Con la ventana a 375×812: en cada ruta de la lista `ROUTES`, `document.documentElement.scrollWidth <= 375`.

`ROUTES` es un array al principio del archivo; la Tarea 4 le añade las rutas de detalle y el paso Inicio → Proyectos → detalle → Atrás → Atrás.

- [ ] **Paso 5: escribir `scripts/perf-check.mjs`**

Por cada ruta (`/`, `/sobre-mi/`, `/proyectos/`, `/contacto/`):
- Fija `pf-motion` según `--motion`, navega y espera 3 s.
- Aplica `Emulation.setCPUThrottlingRate { rate: 4 }`.
- Toma `Performance.getMetrics` dos veces con 5 s de diferencia e imprime `TaskDuration` y `RecalcStyleDuration` como % del tiempo.

Con `--max N`, sale con código 1 si alguna ruta supera N %.

- [ ] **Paso 6: medir la línea base (debe fallar)**

Ejecuta `npm run build` y arranca `portafolio-preview` con preview_start. Luego:

```bash
npm run verify                 # esperado: FALLA (sin description/OG, [Captura], href="#", sin sitemap, sin h1 en inicio)
npm run check:nav              # esperado: FALLA en 1 (hrefs sin '/', aria-current), 2 (~1.7 s), 3 (history crece), 4 (Backspace)
npm run check:perf -- http://localhost:4173/ --motion on   # anotar los % en el mensaje de commit
```

- [ ] **Paso 7: commit**

```bash
git add .gitignore .claude/launch.json package.json scripts/
git commit -m "chore: scripts de verificación (build, navegación, rendimiento)"
```

---

### Tarea 2: navegación y transiciones

**Archivos:**
- Modificar: `src/routes/+layout.svelte:24-34`
- Modificar: `src/lib/motion/transition.ts:36-82`
- Modificar: `src/lib/components/templates/SectionShell.svelte:20-27`
- Modificar: `src/lib/components/organisms/MainMenu.svelte:20-43`
- Modificar: `src/lib/components/molecules/MenuOption.svelte:21`
- Modificar: `src/lib/data/nav.ts:14-27`

**Interfaces:**
- Produce: los `href` de `nav.ts` terminan en `/` (`'/sobre-mi/'`, `'/proyectos/'`, `'/contacto/'`, `'/proyectos/descending-to-my-heaven/'`). `findNav` ya quita la barra final y sigue funcionando sin cambios.

- [ ] **Paso 1: ejecutar `npm run check:nav`.** Debe fallar como en la línea base.
- [ ] **Paso 2: `beforeNavigate`.** Añadir `nav.type === 'popstate'` a la condición de salida temprana. Atrás y adelante quedan nativos, sin cortina.
- [ ] **Paso 3: `runTransition`.** Envolver todo desde `root.style.visibility = 'visible'` en `try { … } finally { root.style.visibility = 'hidden'; utils.set(root, { opacity: 0 }); utils.set(labelEl, { opacity: 0 }); utils.set(panels, { translateX: '-130%' }); }`. Nuevos tiempos:
  - paneles: entrada y salida de **300 ms**, stagger **60/50**
  - espera bajo la cortina: **120 ms**
  - fundido de la etiqueta: **100 ms**
  - rama sin animaciones: **120 ms** por fundido
- [ ] **Paso 4: `SectionShell`.** Solo `Escape` vuelve atrás; se elimina `Backspace`.
- [ ] **Paso 5: `MainMenu.onKey`.** Salir si `e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable]')`. W/S y las flechas solo actúan si `document.activeElement` es `body` o está dentro del `<nav>`.
- [ ] **Paso 6: `MenuOption`.** Quitar el atributo `aria-current`; el estado visual sigue saliendo de `active`.
- [ ] **Paso 7: `nav.ts`.** Poner los hrefs con `/` final.
- [ ] **Paso 8: verificar.** `npm run check`, `npm run build`, reiniciar preview y `npm run check:nav`. Esperado: PASA en 1–5.
- [ ] **Paso 9: commit.** `fix: botón atrás nativo, cortina más corta y segura, atajos de teclado acotados`

---

### Tarea 3: imágenes y perfil

**Archivos:**
- Crear: `scripts/prepare-images.mjs`
- Crear (generados): `static/photo.webp`, `static/og.png`, `static/projects/<slug>/*.webp`
- Borrar: `static/characters/madoka.webp`, `static/characters/rias.webp`, `static/characters/symphogear.webp`. Actualizar la línea "Disponibles sin usar" de `src/lib/data/scene.ts`.
- Modificar: `src/lib/data/profile.ts`, `src/routes/+page.svelte`, `src/routes/sobre-mi/+page.svelte`, `src/lib/components/molecules/PhotoFrame.svelte` (comentario "azul" → "rojo"), `package.json` (`"images": "node scripts/prepare-images.mjs"`).

**Interfaces:**
- Produce: `profile.role = 'Full Stack Developer Junior'`, `profile.studies = 'Ingeniería de Software · UCC'` (campo nuevo), `profile.photo = '/photo.webp'` (sin base; `PhotoFrame` lo recibe con `base` delante) y `profile.skills` con los 5 grupos de las Restricciones globales.
- Produce: los archivos de la tabla siguiente, que consume la Tarea 4.

- [ ] **Paso 1: descargar las fuentes a `image/projects/`.** El prefijo de todas las URL es `https://github.com/user-attachments/assets/`.

| Archivo de salida en `image/projects/` | ID del asset | Proceso | Salida en `static/` |
|---|---|---|---|
| `foto.png` | `6cb5a777-44a6-4489-a9d8-b1004a24959a` | cover 440×520, centrado | `photo.webp` |
| `lp-menu.png` | `59376886-b627-4dcb-8abe-83375168b20d` | sin escalar (330×649) | `projects/likka-pet/menu.webp` |
| `lp-dormido.png` | `bb39c192-917b-4f7c-a015-3280df430256` | sin escalar (319×636) | `projects/likka-pet/dormido.webp` |
| `lp-aparece.png` | `24a6df35-243f-4bf5-9ccf-48a630e8dff4` | **recorte** `{ left: 400, top: 380, width: 560, height: 328 }`: solo el globo y Likka, sin las carátulas del emulador | `projects/likka-pet/aparece.webp` |
| `ws-menu.png` | `432a3d4c-92da-4348-be5a-851f03ae8c83` | sin escalar (514×490) | `projects/wakesync/menu.webp` |
| `ws-mapa.png` | `64f6697d-8efb-47f6-b13c-cd143fdd9575` | sin escalar (528×484) | `projects/wakesync/mapa.webp` |
| `ws-logo.png` | `3ce5d4d1-0fe1-4cfb-b861-16772181ec93` | sin escalar (120×142), WebP sin pérdida | `projects/wakesync/logo.webp` |
| `cr-claro.png` | `6b6868ac-21fe-42ec-ad69-1a2ad23998f3` | ancho 1280 | `projects/clearread/claro.webp` |
| `cr-oscuro.png` | `e97b5c66-1613-4e6a-b0df-a50cb7cb87b5` | ancho 1280 | `projects/clearread/oscuro.webp` |
| `cr-ajustes.png` | `561942f2-fe6d-4749-900b-f450de14600e` | ancho 1280 | `projects/clearread/ajustes.webp` |

- [ ] **Paso 2: escribir `scripts/prepare-images.mjs`.** Una tabla con la misma forma que la del Paso 1 (`{ in, out, op }`) y WebP con `quality: 80`. Imprime `out ancho×alto KB` por archivo; la Tarea 4 copia esas dimensiones a `projects.ts`.

  `og.png` (1200×630) se genera desde un SVG en línea:
  - fondo `#F2F2F2` con una franja diagonal `#BF2424`
  - "PAULA SOFÍA GONZÁLEZ" en Anton, leída de `node_modules/@fontsource/anton/files/anton-latin-400-normal.woff`
  - "Full Stack Developer Junior" en Inter
  - la foto con su recorte poligonal de `PhotoFrame` a la derecha

- [ ] **Paso 3: ejecutar `npm run images`** y abrir `static/og.png` y `static/projects/likka-pet/aparece.webp` para comprobarlos a ojo.
- [ ] **Paso 4: `profile.ts`.** Aplicar los valores de "Interfaces". El campo `education.period` queda igual.
- [ ] **Paso 5: portada (`+page.svelte`).**
  - El `<span>` del nombre pasa a `<h1 class="m-0 …mismas clases…">`.
  - Justo debajo del nombre, dentro del mismo bloque del logo, va `<p class="m-0 text-[11px] font-semibold tracking-[0.14em] text-secondary uppercase md:text-[13px]">{profile.role}</p>`.
  - **Se elimina el `<footer>` completo** (estudios + frase).
  - El contenedor de la columna deja `justify-between` y pasa a `justify-start`, con el menú separado del header por `mt-[12vh] lg:mt-[18vh]`.
- [ ] **Paso 6: Sobre mí.**
  - `PhotoFrame src={base + profile.photo}`.
  - Bajo el nombre van `profile.role` y `profile.studies`.
  - Los párrafos de la bio quedan dentro de `<div class="flex max-w-xl flex-col gap-4 bg-surface px-5 py-4 shadow-[6px_6px_0_var(--color-secondary)]">`.
  - La rejilla de habilidades pasa a `sm:grid-cols-2 xl:grid-cols-3` (5 grupos).
- [ ] **Paso 7: verificar.** `npm run check`, `npm run build` y captura de `/sobre-mi/` en escritorio y móvil: la foto se ve en duotono, la bio sobre el panel blanco y los 5 grupos están sin cortes.
- [ ] **Paso 8: commit.** `feat: foto, rol Full Stack, habilidades nuevas y bio legible; pipeline de imágenes con sharp`

---

### Tarea 4: proyectos con capturas y páginas de detalle

**Archivos:**
- Modificar: `src/lib/data/projects.ts`, `src/lib/components/molecules/ProjectCard.svelte`, `src/lib/data/nav.ts` (`findNav`), `src/routes/proyectos/descending-to-my-heaven/+page.svelte`
- Crear: `src/routes/proyectos/[slug]/+page.ts`, `src/routes/proyectos/[slug]/+page.svelte`
- Modificar: `scripts/check-nav.mjs` (`ROUTES` y el recorrido con detalle)

**Interfaces:**
- Consume: los archivos de la Tarea 3.
- Produce:
  ```ts
  export type Shot = { src: string; alt: string; width: number; height: number }; // src sin base
  export type Project = { …campos actuales…; role: string; shots: Shot[]; logo?: Shot }; // shots[0] = portada
  ```
- Produce: `findNav('/proyectos/<slug>')` devuelve `{ id: 'proyecto', label: 'Proyectos', href, scene: 'plain' }` para cualquier subruta de `/proyectos/` que no sea el juego. El juego sigue por coincidencia exacta.

- [ ] **Paso 1: ampliar `check-nav.mjs`.**
  - Añadir `/proyectos/likka-pet/`, `/proyectos/wakesync/` y `/proyectos/clearread/` a `ROUTES`.
  - Añadir el recorrido Inicio → Proyectos → clic en el primer "Ver proyecto" → `/proyectos/likka-pet/` → Atrás → `/proyectos/` → Atrás → `/`.
  - Ejecutarlo: debe fallar (las rutas no existen).
- [ ] **Paso 2: `projects.ts`.** Cada proyecto lleva `role` = el texto exacto de las Restricciones globales, y `shots` con las dimensiones que imprimió `npm run images`. `alt` exactos:
  - **likka-pet**
    - `menu`: "Pantalla principal de Likka-Pet: la mascota vigila el tiempo en redes del día"
    - `dormido`: "Likka-Pet en modo descanso, con la mascota dormida"
    - `aparece`: "Likka aparece sobre otra app con un mensaje para dejar de procrastinar"
  - **wakesync**
    - `menu`: "Menú del reloj con los modos Siesta y Siesta con destino"
    - `mapa`: "Mapa en el reloj para fijar el destino del trayecto"
    - `logo`: "Logo de WakeSync"
  - **clearread**
    - `claro`: "Inicio de ClearRead en modo claro: continuar lectura y subir un PDF o una foto"
    - `oscuro`: "Inicio de ClearRead en modo oscuro"
    - `ajustes`: "Ajustes de lectura de ClearRead"
- [ ] **Paso 3: `ProjectCard`.**
  - La franja de color se queda. El texto `[Captura]` y el `role="img"` falso se sustituyen por `<img src={base + shots[0].src} alt width height loading="lazy" class="max-h-[85%] max-w-[85%] w-auto object-contain shadow-[5px_5px_0_var(--color-secondary)]">`, centrada.
  - Si hay `logo`, va en la esquina inferior izquierda a `size-10`.
  - El chip de plataforma se queda.
  - Botones en `flex flex-wrap gap-3`: `Button href="{base}/proyectos/{slug}/"` "Ver proyecto" (primario, con flecha) y `Button variant="secondary" external href={repo}` "Repositorio".
- [ ] **Paso 4: `[slug]/+page.ts`.**
  - `export const entries = () => projects.map((p) => ({ slug: p.slug }))`.
  - `load({ params })` devuelve `{ project }` o lanza `error(404)`.
- [ ] **Paso 5: `[slug]/+page.svelte`.** Usa `SectionShell title={project.title} intro={project.summary} backHref="/proyectos/"`. Diseño en `lg:flex-row`:
  - **Izquierda:** galería `grid gap-4 sm:grid-cols-2`. Las capturas con `width > height * 1.4` ocupan `sm:col-span-2`. Cada `<img>` lleva `bg-surface p-2 shadow-[6px_6px_0_var(--color-secondary)]`, `w-full h-auto` y `loading="lazy"` salvo la primera.
  - **Derecha:** el logo, si existe, y luego un `<dl>` con el mismo estilo que el del juego (Plataforma · Mi rol · Tecnologías como `Tag`). Debajo, `Button external` "Ver repositorio".
- [ ] **Paso 6: `findNav`.** Implementar la regla de "Interfaces" después de la búsqueda exacta.
- [ ] **Paso 7: página del juego.**
  - Quitar el `<button>` ▶ (la caja `role="img"` se queda).
  - Renderizar "Jugar" solo con `{#if game.links.play}` y "Repositorio" solo con `{#if game.links.repo}`, ambos `external`. Si no hay ninguno, no se pinta el contenedor.
- [ ] **Paso 8: verificar.** `npm run check`, `npm run build`, reiniciar preview, `npm run check:nav` (PASA, también a 375 px) y capturas de `/proyectos/` y `/proyectos/clearread/` en escritorio y móvil.
- [ ] **Paso 9: commit.** `feat: capturas reales y página de detalle por proyecto; botones del juego solo si hay enlace`

---

### Tarea 5: SEO y metadatos

**Archivos:**
- Crear: `src/lib/data/site.ts`, `src/lib/components/atoms/Seo.svelte`, `src/routes/sitemap.xml/+server.ts`, `static/robots.txt`
- Modificar: `src/lib/components/templates/SectionShell.svelte` (prop `description: string`, obligatoria; su `<svelte:head>` pasa a `<Seo>`), `src/routes/+page.svelte`, las 4 páginas que usan `SectionShell`, `[slug]/+page.svelte` (`description={project.summary}`), `svelte.config.js` (`handleHttpError: 'fail'`)

**Interfaces:**
- Produce: `export const SITE_URL = 'https://sofzzz.github.io'` y `export const siteName = 'Paula Sofía González'` en `site.ts`.
- Produce: `Seo.svelte` con las props `{ title: string; description: string; path: string }`. Emite:
  - `<title>`
  - `meta description`
  - `link rel="canonical"`
  - `og:type=website`, `og:title`, `og:description`, `og:url`, `og:image = SITE_URL + base + '/og.png'`, `og:locale=es_CO`
  - `twitter:card=summary_large_image`

  Las URL absolutas se construyen como `SITE_URL + base + path`.

- [ ] **Paso 1:** con el preview arriba, `npm run verify` debe FALLAR en description, OG, sitemap y robots.
- [ ] **Paso 2: crear `site.ts` y `Seo.svelte`.** Usarlos en `SectionShell` y en la portada (`title = "Paula Sofía González · Full Stack Developer Junior"`, `path = '/'`).
- [ ] **Paso 3: descripciones exactas.**

| Página | Descripción |
|---|---|
| Inicio | "Portafolio de Paula Sofía González, Full Stack Developer Junior y estudiante de Ingeniería de Software. Apps Android, Wear OS y escritorio con Kotlin, Python y FastAPI." |
| Sobre mí | "Quién soy, qué tecnologías manejo y mi formación en Ingeniería de Software en la Universidad Cooperativa de Colombia." |
| Proyectos | "Likka-Pet, WakeSync y ClearRead: tres apps que ideé, diseñé y programé, y un videojuego en desarrollo." |
| Videojuego | "Descending to my Heaven, videojuego en desarrollo de Paula Sofía González." |
| Contacto | "Escríbeme por correo o LinkedIn, o revisa mi código en GitHub." |
| Detalle | `project.summary` |

- [ ] **Paso 4: `sitemap.xml/+server.ts`.**
  - `export const prerender = true`.
  - `GET` devuelve un XML con `Content-Type: application/xml` y 8 `<loc>`: las 5 rutas fijas más los 3 slugs de `projects`, todos con `/` final y `SITE_URL + base`.
  - `static/robots.txt`: `User-agent: *` / `Allow: /` / `Sitemap: https://sofzzz.github.io/Portafolio/sitemap.xml`.
- [ ] **Paso 5:** `handleHttpError: 'fail'` en `svelte.config.js`.
- [ ] **Paso 6: verificar.** `npm run check`, `npm run build` (no debe fallar el prerender) y `npm run verify` (PASA en todo).
- [ ] **Paso 7: commit.** `feat: meta description, Open Graph, canonical, sitemap y robots`

---

### Tarea 6: fondos y siluetas en móvil y tableta

**Estado actual (capturas a 390×844 y 820×1180):**

| Sección | Problema | Causa en el código |
|---|---|---|
| Inicio | Falta el panel oscuro; silueta casi invisible | `BackgroundMotion.svelte:47`, el panel tiene `max-lg:hidden`; `scene.ts`: `smOpacity: 0.12` |
| Sobre mí | Mar apenas visible, sin silueta | `scene.ts`: `from: 'md'` sin `smOpacity`; el `clip-path` del agua en `SeaBackdrop` se pensó para escritorio |
| Proyectos | Solo estrellas | `scene.ts`: `from: 'md'` sin `smOpacity`; el tamaño `top-right` de `w-[52vw]` es diminuto en móvil |
| Videojuego | Sin silueta | `scene.ts`: `from: 'md'` sin `smOpacity` |
| Contacto | Fondo vacío por debajo de 768 px; de 768 a 1279 px solo la silueta | `MetroBackdrop.svelte`: variantes `hidden md:block xl:hidden` y `hidden xl:block` |
| Todas | El botón "Animaciones" tapa contenido | `MotionToggle.svelte`: botón con texto fijo abajo a la derecha |

**Archivos:**
- Modificar: `src/lib/data/scene.ts`, `src/lib/components/organisms/backdrops/SilhouetteLayer.svelte`, `src/lib/components/organisms/BackgroundMotion.svelte`, `src/lib/components/organisms/backdrops/SeaBackdrop.svelte`, `src/lib/components/organisms/backdrops/MetroBackdrop.svelte`, `src/lib/components/molecules/MotionToggle.svelte`, `src/routes/+page.svelte`
- Modificar: `scripts/check-nav.mjs`

**Interfaces:**
- Produce: atributos `data-bg` en las piezas del fondo, para las pruebas: `data-bg="panel"` (panel oscuro de Inicio), `data-bg="silhouette"` (contenedor de `SilhouetteLayer` y silueta del metro), `data-bg="sea"` (contenedor del agua) y `data-bg="wagon"` (ventanas del metro).
- Produce: `Silhouette.from` admite también `'sm'` (visible siempre). `smOpacity` y `smTone` se mantienen.

- [ ] **Paso 1: ampliar `check-nav.mjs`.** A 390×844 y a 820×1180, cada elemento esperado debe estar visible: `display` distinto de `none`, `visibility` distinta de `hidden`, `getBoundingClientRect()` con ancho y alto mayores que 0 y opacidad efectiva (producto de `opacity` del elemento y sus ancestros) ≥ 0.15.

| Ruta | `data-bg` esperados |
|---|---|
| `/` | `panel`, `silhouette` |
| `/sobre-mi/` | `sea`, `silhouette` |
| `/proyectos/` | `silhouette` |
| `/proyectos/descending-to-my-heaven/` | `silhouette` |
| `/contacto/` | `wagon`, `silhouette` |

Ejecutarlo: debe FALLAR.

- [ ] **Paso 2: Inicio.** El panel oscuro se ve en todos los tamaños:
  - **Desde `lg`:** se queda como está (mitad derecha, diagonal).
  - **Por debajo de `lg`:** ocupa la franja inferior: `inset-x-0 bottom-0 h-[46vh]` con `clip-path: polygon(0 22%, 100% 0, 100% 100%, 0 100%)`. Es decir, borde superior en diagonal, coherente con el `--skew`.
  - **Silueta de Inicio en `scene.ts`:** `from: 'sm'` y en todos los tamaños `tone: 'accent'` con `opacity: 0.9` (se borran `smOpacity` y `smTone`), igual que en escritorio.
  - **Silueta en `SilhouetteLayer`:** `right-tall` pasa a `right-[-6%] bottom-0 h-[44vh] w-[78vw] lg:right-[1%] lg:h-[96vh] lg:w-[42vw]`, para que quede de pie dentro del panel.
  - **Menú:** con la portada sin pie (Tarea 3), el menú queda en la mitad superior. Comprobar con la captura que ninguna opción pisa el panel a 390×844 ni a 390×667 (iPhone SE). Si pisa a 667 de alto, bajar el panel a `h-[40vh]` con la variante arbitraria `[@media(max-height:700px)]:h-[40vh]`.

- [ ] **Paso 3: Proyectos y Videojuego.** En `scene.ts`:
  - **Proyectos:** `from: 'sm', opacity: 0.26`.
  - **Videojuego:** `from: 'sm', opacity: 0.2`.

  En `SilhouetteLayer`, `top-right` pasa a `right-0 top-0 h-[22vh] w-[92vw] md:h-[36vh] md:w-[52vw]` y `right` a `right-[-8%] bottom-0 h-[55vh] w-[80vw] md:right-[2%] md:h-[84vh] md:w-[34vw]`. Con la opacidad baja, la silueta puede quedar detrás del título y de las tarjetas: los dos tienen fondo opaco.

- [ ] **Paso 4: Sobre mí.**
  - **Silueta en `scene.ts`:** `from: 'sm', opacity: 0.62` y `bottom-wide` en `SilhouetteLayer` pasa a `right-[-4%] bottom-0 h-[30vh] w-[104vw] md:right-[2%] md:h-[58vh] md:w-[60vw]`.
  - **En `SeaBackdrop`, por debajo de `md`:** el agua es una banda simple que ocupa la mitad inferior. Se aplica `clip-path: polygon(0 50vh, 100vw 47vh, 100vw 100%, 0 100%)` y las filas de olas empiezan en `top: 50vh`. Desde `md` se usa el `clip-path` actual con la cubierta.
  - **Implementación:** dos clases `.sea-clip` en `app.css`, `clip-path: var(--clip-sm)` y `@media (min-width: 48rem) { clip-path: var(--clip-md) }`, con las dos formas pasadas como variables en el `style`. El `top` de cada fila se calcula como `calc(var(--sea-top) + …)`, con `--sea-top: 50vh` en móvil y `62vh` desde `md`.
  - **Legibilidad:** la bio va sobre panel blanco desde la Tarea 3; comprobar que la foto y Formación se leen sobre el mar.

- [ ] **Paso 5: Contacto.** Un solo vagón para todos los tamaños. Se borra la variante `hidden md:block xl:hidden` y la grande pierde `hidden xl:block`. Las medidas dependen de dos variables en el contenedor:
  - `--win`, la altura de las ventanas: `34vh` por defecto, `44vh` desde `md` y `52vh` desde `xl`.
  - `--girl-w`, el ancho de la silueta sentada: `118vw` por defecto, `86vw` desde `md` y `64vw` desde `xl`.

  Usos:
  - ventanas: `h-[var(--win)]`;
  - pilares: `h-[var(--win)]`; el de `left-[57vw]` se oculta por debajo de `md` para no cortar el título;
  - repisa: `top-[calc(var(--win)-2vh)]`;
  - respaldo: `top-[calc(var(--win)+4vh)]`;
  - silueta: `w-[var(--girl-w)]` con `-right-[34vw] md:-right-[12vw] xl:-right-[3vw]` y `-bottom-[4vh] xl:-bottom-[10vh]`.

  `data-bg="wagon"` va en el contenedor de las ventanas y `data-bg="silhouette"` en el de la silueta.

- [ ] **Paso 6: botón de animaciones.** Por debajo de `sm`, el texto pasa a `max-sm:sr-only` y el botón queda cuadrado (`max-sm:size-11 max-sm:justify-center max-sm:px-0`), solo con el punto de color. El nombre accesible sigue siendo "Animaciones: sí/no" y `aria-pressed` no cambia.

- [ ] **Paso 7: verificar.**
  - `npm run check`, `npm run build`, reiniciar preview y `npm run check:nav` → PASA, incluida la visibilidad de `data-bg` a 390 y 820 px y sin desbordes a 375 px.
  - Capturas de las 5 rutas a 390×844, 820×1180 y 1440×900. **En escritorio (1440) todo debe verse igual que antes:** comparar con las capturas de la línea base.
- [ ] **Paso 8: commit.** `fix: fondos y siluetas visibles en móvil y tableta; botón de animaciones compacto`

---

### Tarea 7: animaciones de fondo en el compositor

**Archivos:**
- Modificar: `src/app.css` (sustituir los keyframes `pf-stripes`, `pf-stripes-fast`, `pf-scroll` y `pf-mscroll`)
- Modificar: `src/lib/components/organisms/BackgroundMotion.svelte`, `src/lib/components/organisms/backdrops/MetroBackdrop.svelte`, `src/lib/components/organisms/backdrops/SeaBackdrop.svelte`

**Interfaces:**
- Produce: una sola animación en CSS, sin capa (fuera de `@layer` para que gane a las utilidades de Tailwind):
  ```css
  @keyframes pf-slide { to { transform: translateX(calc(var(--tile) * -1)); } }
  .pf-stripes, .pf-stripes-fast, .pf-scroll, .pf-mscroll {
  	margin-right: calc(var(--tile) * -1); /* alarga la caja una baldosa para que el deslizamiento no deje hueco */
  	animation: pf-slide var(--dur) linear infinite;
  }
  ```
  Los nombres de clase no cambian, así que la lista `html[data-motion='off']` sigue funcionando sin tocarla.

- [ ] **Paso 1:** con el preview arriba, `npm run check:perf -- http://localhost:4173/ --motion on --max 25`. Debe FALLAR; ya tienes los % de la Tarea 1.
- [ ] **Paso 2: CSS.** Aplicar el bloque de "Interfaces" y borrar los cuatro keyframes viejos.
- [ ] **Paso 3: fondo de franjas (`BackgroundMotion`).** Añadir `--tile: 180px; --dur: 9s` al estilo de las franjas y `--tile: 120px; --dur: 5s` a las rápidas. El `-rotate-[8deg]` de Tailwind v4 usa la propiedad `rotate`, que se combina con `transform` sin conflicto.
- [ ] **Paso 4: metro y mar.** En `MetroBackdrop` y `SeaBackdrop` no hace falta tocar el markup: ya ponen `--tile` y `--dur`. Comprobar que el brillo del agua (`pf-scroll` con `mask` horizontal) se ve igual.
- [ ] **Paso 5: verificar.**
  - `npm run build` y reiniciar preview.
  - `npm run check:perf -- … --motion on --max 25` → PASA.
  - `npm run check:perf -- … --motion off --max 3` → PASA.
  - Comparar a ojo `/`, `/sobre-mi/` y `/contacto/` con las capturas de la línea base: el movimiento debe verse igual y sin saltos al reiniciar el ciclo.
- [ ] **Paso 6: commit.** `perf: fondos animados con transform en vez de background/mask-position` (incluir en el mensaje los % antes y después)

---

### Tarea 8: correo, limpieza y verificación final con base path

**Archivos:**
- Modificar: `src/lib/data/socials.ts`. La entrada de correo pasa a ser la **primera** del array: `{ id: 'mail', label: 'Correo', handle: 'gonzalezambranopaula840@gmail.com', url: 'mailto:gonzalezambranopaula840@gmail.com' }`. Se borra el comentario "Correo pendiente de confirmar".
- Modificar: `src/routes/contacto/+page.svelte`. `intro` = "Escríbeme por correo o LinkedIn, o revisa mi código en GitHub."
- Modificar: `src/lib/components/molecules/SocialLink.svelte`. Quitar `--tw-skew: var(--skew)` del `style` y envolver el `sr-only` en `{#if !social.url.startsWith('mailto:')}`.
- Modificar: `README.md`. En la tabla "Dónde editar el contenido", añadir la fila `Capturas y foto | image/projects/ + npm run images → static/`.

- [ ] **Paso 1:** aplicar los cambios. A 390 px, el correo largo se trunca con `…` (el `truncate` ya existe) y el enlace sigue siendo usable. Comprobarlo en una captura.
- [ ] **Paso 2: verificación completa con base path.**
  ```bash
  npm run check
  BASE_PATH=/Portafolio npm run build
  BASE_PATH=/Portafolio npm run verify     # esperado: PASA (src con prefijo /Portafolio y archivos existentes)
  npm run build                            # volver a construir sin base para el preview local
  npm run check:nav                        # esperado: PASA
  npm run check:perf -- http://localhost:4173/ --motion on --max 25   # esperado: PASA
  ```
- [ ] **Paso 3: capturas finales.** Las 5 rutas más 1 detalle, en escritorio (1440×900) y móvil (375×812), para mostrarlas a Paula.
- [ ] **Paso 4: commit.** `feat: correo de contacto; limpieza de SocialLink y README`

---

## Después de la revisión (no lo hace el agente)

1. Claude revisa la rama `mejoras-auditoria` completa contra este plan.
2. Si se aprueba, se fusiona en `main`.
3. Paula crea el repo `SoFzzz/Portafolio` en GitHub y activa Settings → Pages → Source: **GitHub Actions**.
4. Se añade el remoto y se hace push de `main`. El workflow `deploy.yml` construye con `BASE_PATH=/Portafolio` y publica en `https://sofzzz.github.io/Portafolio/`.
5. Se comprueba el sitio publicado: navegación, imágenes y vista previa al compartir el enlace.

