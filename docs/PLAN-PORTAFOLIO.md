# Portafolio — Documento de Plan, Navegación y Diseño

> Un solo documento con la visión, la organización, la navegación y el design system del portafolio.
> Inspiración: la **estructura de interacción** de los menús de Atlus (Persona 3 Reload, Metaphor: ReFantazio). No se usa arte, fuentes ni audio de Atlus.

**Estado:** borrador para revisión · **Stack:** SvelteKit (estático) + Tailwind CSS v4 + anime.js · **Hosting:** GitHub Pages

---

## 1. Visión

### Cambios de dirección (2026-10-10)
Estas decisiones tienen prioridad sobre el resto del documento donde haya contradicción.
- **Paleta cálida** en lugar de la azul/cian: `--primary #BF2424` (rojo), `--accent #F29544` (naranja), `--highlight #F2D479` (amarillo), `--text` y `--secondary #0D0000` (casi negro), `--background #F2F2F2`. Contrastes medidos: texto sobre fondo 18.44; rojo sobre fondo 5.37; blanco sobre rojo 6.01; naranja sobre negro 9.00; amarillo sobre negro 14.23; amarillo sobre rojo 4.14 (solo texto grande o iconos); negro sobre rojo 3.43 y naranja sobre fondo claro 2.05 (nunca texto).
- **Menú de 3 opciones** (Sobre mí, Proyectos, Contacto). Se quitó la opción "Inicio".
- **El videojuego va dentro de Proyectos**: tarjeta en `/proyectos` y página `/proyectos/descending-to-my-heaven`.
- **Fondo más sobrio**: se quitó la franja inferior con la palabra. Queda el panel diagonal oscuro en Inicio, franjas suaves y una **silueta de personaje animado** a un lado en las secciones (`src/lib/data/scene.ts`). Imagen o video con transparencia/fondo blanco; si es video se mezcla con `mix-blend-mode: multiply`.
- **Icono del sitio y logo**: la mascota (favicon, apple-touch-icon y logo del encabezado).
- **Interruptor "Animaciones"**: respeta la preferencia del sistema por defecto y permite forzarlas.

### 1.1 Objetivo
Un portafolio académico y profesional (UCC) que presente quién soy, mis proyectos y cómo contactarme, con una identidad memorable inspirada en los menús de Atlus: opciones gigantes inclinadas, formas angulares, transiciones rápidas de cortina y tipografía enorme.

### 1.2 Principios
1. **Profesional primero.** El estilo Atlus es el vehículo, no el disfraz. Debe verse serio ante un docente o reclutador.
2. **Foto real, estética coherente.** Nada de arte anime. La foto se integra con duotono azul y halftone dentro de formas geométricas (dirección *Editorial gráfico*).
3. **Responsive de verdad.** Mobile-first. El menú de escritorio se transforma en una lista apilada táctil, con la misma identidad.
4. **Accesible.** Contraste AA, navegación por teclado, `prefers-reduced-motion`.
5. **Original.** Se reescribe la técnica; no se copia código ni assets ajenos (ver §10).

### 1.3 Éxito
- Lighthouse ≥ 90 en Performance, Accessibility, Best Practices y SEO.
- Se entiende quién soy y qué hago en menos de 10 segundos.
- Se navega completo solo con teclado y solo con el dedo.
- Un proyecto nuevo se agrega editando un archivo de datos, sin tocar componentes.

---

## 2. Arquitectura de información

### 2.1 Mapa del sitio

```
/                      Inicio (menú principal + héroe con foto)
/sobre-mi              Presentación, habilidades, formación
/proyectos             Cuadrícula de proyectos
/proyectos/[slug]      Detalle de un proyecto
/juego                 Descending to my Heaven (videojuego)
/contacto              Redes y formulario/enlace de correo
```

### 2.2 Contenido por sección

| Opción del menú | Metáfora Atlus | Contenido |
|---|---|---|
| **Inicio** | Pantalla de pausa | Nombre, rol, frase corta, foto duotono, etiqueta "Disponible" |
| **Sobre mí** | Perfil / Status | Presentación, habilidades agrupadas, formación, intereses |
| **Proyectos** | Inventario / Items | Tarjetas con imagen, título, tecnologías, enlaces; detalle por proyecto |
| **Videojuego** | Opción especial / Nuevo juego | Apartado propio de *Descending to my Heaven* (ver §2.4) |
| **Contacto** | Comunicaciones | GitHub, LinkedIn, correo, CV descargable |

### 2.3 Modelo de contenido
El contenido vive en datos tipados, no en los componentes.

```ts
// src/lib/data/projects.ts
export type Project = {
  slug: string;
  title: string;
  tagline: string;                        // frase de una línea
  summary: string;
  platform: string;                       // "Android", "Wear OS", "Windows"...
  stack: string[];
  highlights: string[];                   // 3–4 puntos clave
  accent: 'blue' | 'purple' | 'yellow';  // color propio del proyecto
  cover: string;                          // ruta de imagen
  links: { repo: string; demo?: string; download?: string; docs?: string };
};
```

Los colores azul, morado y amarillo de mis proyectos **no son colores de la interfaz**: solo se usan como acento dentro de cada tarjeta de proyecto (franja, etiqueta, borde). La interfaz mantiene su identidad propia.

### 2.3.1 Proyectos con repositorio completo
Datos tomados de los repositorios y de su documentación técnica (ninguno tiene README ni descripción en GitHub; los textos del sitio se redactan aparte).

| Proyecto | Qué es | Plataforma y stack | Repositorio | Acento |
|---|---|---|---|---|
| **Likka-Pet** | Mascota virtual anti-procrastinación y guardián contra el dolor cervical. Combina detección de postura con sensores, un overlay flotante y una IA sarcástica. | App Android en Kotlin, backend proxy en Python/JS, DeepSeek. Incluye APK. | [SoFzzz/Likka-Pet](https://github.com/SoFzzz/Likka-Pet) | por confirmar |
| **WakeSync** | App autónoma para smartwatch que estima el reposo y la proximidad en tránsito, con geocerca dinámica, hápticos e insights por IA. | Wear OS en Kotlin, backend `wakesync-gateway` en TypeScript (Cloudflare Workers), Mapbox y DeepSeek. Incluye APK. | [SoFzzz/WakeSync](https://github.com/SoFzzz/WakeSync) | por confirmar |
| **ClearRead** | Lector de escritorio para estudiantes con dislexia: OCR, silabeo con color, lectura en voz alta sincronizada y asistente de IA opcional. | Python (app de escritorio Windows `.exe`), backend FastAPI desplegado en Render, DeepSeek. | [SoFzzz/ClearRead](https://github.com/SoFzzz/ClearRead) | morado (su propio diseño usa morado y amarillo) |

Notas:
- **Acentos:** se confirman con el design system de cada proyecto y al elegir las capturas, para que las tres tarjetas se distingan entre sí.
- **Texto:** los resúmenes se redactan en lenguaje de portafolio (problema, solución, mi rol), no se copian de las especificaciones técnicas.
- **Capturas:** hacen falta 2–3 por proyecto (pantalla principal y una pantalla clave). Likka-Pet tiene sprites propios (`likka_sprites`) que sirven de arte de portada.
- **Descargas:** los APK de Likka-Pet y WakeSync están dentro de los repos; se enlaza al repositorio, no se aloja el binario en el portafolio.
- **Más proyectos:** hay más en camino. Agregar uno es añadir una entrada en `projects.ts` (criterio de éxito de §1.3).

### 2.4 Apartado del videojuego: *Descending to my Heaven*
Es un proyecto de otra naturaleza y tiene su propia opción del menú, `/juego`. Funciona como una pantalla de "juego destacado", más inmersiva que la ficha de un proyecto de software.

**Estructura de la página:**
1. **Portada:** título en tipografía display, arte clave y una etiqueta de estado (p. ej. "En desarrollo").
2. **Premisa:** 2–3 frases de qué trata y qué se siente al jugarlo.
3. **Galería:** capturas o GIF/video corto del gameplay.
4. **Ficha técnica:** motor, plataforma, género, mi rol, estado.
5. **Acciones:** jugar o descargar, repositorio, devlog (según lo que exista).

**Reglas de diseño:**
- El arte del juego aporta su propio color dentro de un marco con la identidad del portafolio (azul + cian), para que se sienta parte del sitio.
- Con `prefers-reduced-motion` el video o GIF no se reproduce solo; se muestra una imagen fija con botón de reproducir.
- En móvil la galería es un carrusel con swipe; en escritorio, una grilla.

```ts
// src/lib/data/game.ts
export type Game = {
  title: string;                          // "Descending to my Heaven"
  status: 'concepto' | 'en-desarrollo' | 'jugable' | 'publicado';
  premise: string;
  engine: string;
  platforms: string[];
  genre: string;
  role: string;
  media: { src: string; alt: string; kind: 'image' | 'video' }[];
  links: { play?: string; repo?: string; devlog?: string };
};
```

**Falta de tu parte:** género, motor, plataforma, estado actual, arte o capturas, y si hay algo jugable o descargable (ver §13).

### 2.5 La foto
La foto de perfil está en el issue [Book-nestjs#1](https://github.com/SoFzzz/Book-nestjs/issues/1) (800×800 px, formato cuadrado, así que el recorte del héroe parte de ahí). Antes de la Fase 4 se descarga a `static/images/` para no depender de GitHub y se procesa según §5.5. La descarga se hará con tu confirmación.

### 2.6 Redes y contacto
Estos enlaces alimentan la sección Contacto (`ContactPanel`), el pie de página y los metadatos del sitio.

```ts
// src/lib/data/socials.ts
export const socials = [
  { id: 'github',   label: 'GitHub',   handle: 'SoFzzz',
    url: 'https://github.com/SoFzzz' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'Paula Sofía González Zambrano',
    url: 'https://www.linkedin.com/in/paula-sofia-gonzalez-zambrano-435081265/' },
  // { id: 'mail', label: 'Correo', url: 'mailto:...' }   // pendiente de confirmar
] as const;
```

Reglas:
- Los enlaces externos abren con `rel="noopener noreferrer"` y llevan texto accesible ("GitHub, se abre en una pestaña nueva").
- GitHub y LinkedIn aparecen también en el héroe de Inicio como accesos rápidos (`SocialLink` en tamaño pequeño).
- El nombre completo para el sitio (título, `<h1>` y metadatos) se toma de LinkedIn: **Paula Sofía González Zambrano**. Se confirma abajo en §13.
- El correo no se publica en texto plano; si se incluye, va como `mailto:` en un botón para reducir el spam.

---

## 3. Navegación

### 3.1 Modelo
Menú principal con 5 opciones (Inicio, Sobre mí, Proyectos, Videojuego, Contacto). Una opción está **enfocada** (hover, teclado o toque) y se **activa** con Enter o clic. La activación dispara la transición de cortina y la ruta cambia.

### 3.2 Entradas

| Entrada | Acción |
|---|---|
| `↑` `↓` / `W` `S` | Mover el foco entre opciones |
| `Enter` / `Espacio` | Activar la opción enfocada |
| `Esc` / `Backspace` | Volver al menú principal |
| Mouse | Hover = foco, clic = activar |
| Táctil | Toque = activar (sin hover) |
| Rueda / swipe vertical | Cambia foco en el menú (opcional, solo escritorio) |

### 3.3 Flujo

```
Carga → Intro (cortina entra) → Menú principal
  └─ activar opción → Cortina cierra → Sección → [Esc / "Volver"] → Cortina → Menú
Proyectos → tarjeta → /proyectos/[slug] → [Volver] → /proyectos
```

### 3.4 Reglas
- Cada ruta es una URL real (compartible, indexable, botón "atrás" funciona).
- El foco del teclado nunca se pierde: tras cada transición se enfoca el `<h1>` de la nueva vista.
- Existe siempre un enlace **"Saltar al contenido"**.
- Con `prefers-reduced-motion` las cortinas se sustituyen por un fundido de 150 ms.

---

## 4. Wireframes

### 4.1 Escritorio (≥ 1024 px) — Inicio

```
┌────────────────────────────────────────────────────────────────┐
│ ▓▓ NOMBRE                                     ES │ EN (opc.)     │
│                                                                │
│   ╲ INICIO ◀══════╗            ┌───────────────────────┐        │
│    ╲ SOBRE MÍ     ║            │  ░░░░░░░░░░░░░░░░░░░  │        │
│     ╲ PROYECTOS   ║  formas    │  ░░  FOTO DUOTONO ░░  │        │
│      ╲ VIDEOJUEGO ║ angulares  │  ░░  + halftone   ░░  │        │
│       ╲ CONTACTO  ║            │  ░░░░░░░░░░░░░░░░░░░  │        │
│   ● DISPONIBLE    ╝            └───────────────────────┘        │
│   Rol · Frase corta           [↑↓ mover]  [Enter elegir]        │
└────────────────────────────────────────────────────────────────┘
```

- El texto gigante decorativo de fondo (como el de P3R) usa `--secondary` al 6 % de opacidad.
- La opción enfocada lleva un bloque `--primary` inclinado y un subrayado `--accent`.

### 4.2 Móvil (< 640 px) — Inicio

```
┌───────────────────┐
│ ▓▓ NOMBRE         │
│  ┌─────────────┐  │
│  │ FOTO duotono│  │
│  └─────────────┘  │
│  ● Disponible     │
│  Rol · frase      │
│ ───────────────── │
│  ▌INICIO          │
│  ▌SOBRE MÍ        │
│  ▌PROYECTOS       │
│  ▌VIDEOJUEGO      │
│  ▌CONTACTO        │
└───────────────────┘
```

### 4.2.1 Videojuego (escritorio)

```
┌────────────────────────────────────────────────────────────┐
│ ◀ VOLVER                                      VIDEOJUEGO   │
│ ┌──────────────────────────┐   DESCENDING                  │
│ │                          │   TO MY HEAVEN                │
│ │   ARTE CLAVE / VIDEO     │   ● EN DESARROLLO             │
│ │   en marco angular       │   Premisa en 2–3 frases       │
│ │                          │   Motor · Plataforma · Género │
│ └──────────────────────────┘   [ Jugar ] [ Repositorio ]   │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐   galería (carrusel en móvil)  │
│ └────┘ └────┘ └────┘ └────┘                                │
└────────────────────────────────────────────────────────────┘
```

- Lista apilada con objetivos táctiles ≥ 48 px de alto.
- Inclinación reducida (2° en vez de 8°) para no romper el ancho.
- Cortina vertical corta en lugar de diagonal completa.

### 4.3 Proyectos (escritorio)

```
┌────────────────────────────────────────────────────────────┐
│ ◀ VOLVER                                     PROYECTOS     │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│ │ cover    │  │ cover    │  │ cover    │   grid 3 col      │
│ │▌título   │  │▌título   │  │▌título   │   (2 col tablet,  │
│ │ #react   │  │ #node    │  │ #python  │    1 col móvil)   │
│ └──────────┘  └──────────┘  └──────────┘                   │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Design System

### 5.1 Color

Paleta oficial:

| Token | Hex | Uso |
|---|---|---|
| `--text` | `#081826` | Texto principal |
| `--background` | `#f6f7f9` | Fondo general |
| `--primary` | `#03318C` | Estructura, foco del menú, botones, títulos |
| `--secondary` | `#023373` | Superficies oscuras, hover/pressed, texto decorativo |
| `--accent` | `#04C4D9` | Resaltes: subrayado, etiqueta "Disponible", indicador de selección |

Derivados permitidos (se generan con `color-mix`, no se agregan colores nuevos):
- `--surface`: `color-mix(in oklab, var(--background) 92%, var(--primary))` para tarjetas.
- `--muted`: `color-mix(in oklab, var(--text) 60%, var(--background))` para texto secundario.

**Reglas de uso (regla 60-30-10):**
- ~60 % `--background` y neutros, ~30 % `--primary`/`--secondary`, ≤ 10 % `--accent`.
- No colocar `--primary` y `--accent` en bloques grandes adyacentes; el acento es un detalle.

**Contraste medido (WCAG, objetivo ≥ 4.5:1 para texto normal):**

| Combinación | Ratio | ¿Texto normal? |
|---|---|---|
| `--text` sobre `--background` | 16.76 | Sí |
| `--primary` sobre `--background` | 10.75 | Sí |
| `--secondary` sobre `--background` | 11.37 | Sí |
| Blanco sobre `--primary` | 11.53 | Sí |
| Blanco sobre `--secondary` | 12.18 | Sí |
| `--accent` sobre `--primary` | 5.44 | Sí |
| `--accent` sobre `--secondary` | 5.75 | Sí |
| `--text` sobre `--accent` | 8.47 | Sí |
| `--accent` sobre `--background` | **1.98** | **No** |
| Blanco sobre `--accent` | **2.12** | **No** |

**Consecuencias:**
- El cian **nunca** es color de texto sobre fondo claro. Sobre fondo claro se usa solo como relleno, línea gruesa o forma decorativa.
- Texto sobre un relleno cian = `--text`. Texto cian = solo sobre `--primary`/`--secondary`.
- Los indicadores que dependan solo del cian sobre claro (p. ej. foco) llevan además un borde `--primary` para cumplir 3:1 en componentes no textuales.

### 5.2 Tipografía

| Rol | Fuente (libre) | Uso |
|---|---|---|
| Display | **Anton** (alternativa: Bebas Neue) | Opciones del menú, títulos grandes |
| Cuerpo | **Inter** | Párrafos, UI |
| Mono (opcional) | **JetBrains Mono** | Etiquetas de tecnologías |

Se autohospedan (WOFF2, `font-display: swap`) para no depender de CDN.

Escala fluida (`clamp`) para el responsive:

| Token | Valor |
|---|---|
| `--fs-display` | `clamp(3rem, 2rem + 6vw, 8rem)` |
| `--fs-h1` | `clamp(2.25rem, 1.5rem + 3vw, 4rem)` |
| `--fs-h2` | `clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)` |
| `--fs-body` | `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)` |
| `--fs-small` | `0.875rem` |

### 5.3 Espaciado, forma y elevación
- Escala base 4 px: `4, 8, 12, 16, 24, 32, 48, 64, 96`.
- **Inclinación de marca:** `--skew: -8deg` (escritorio), `-2deg` (móvil).
- Formas: bloques con `clip-path` poligonal (esquinas cortadas), sin radios grandes. Radio máximo 4 px en elementos de UI pequeños.
- Elevación: sombra dura desplazada (`4px 4px 0 var(--secondary)`), sin difuminados, coherente con el estilo gráfico.

### 5.4 Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--dur-fast` | 120 ms | Hover, foco |
| `--dur-base` | 240 ms | Cambios de estado |
| `--dur-slow` | 480 ms | Cortina de transición |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | Entradas |
| `--ease-snap` | `cubic-bezier(.7,0,.2,1)` | Cortinas |

Animaciones clave (a implementar con anime.js):
1. **Foco de opción:** el bloque `--primary` entra deslizándose con skew; el texto sube 4 px y el subrayado `--accent` se estira de 0 a 100 %.
2. **Cortina de transición:** dos paneles diagonales (`--primary` y `--secondary`) cruzan la pantalla, la ruta cambia en el punto medio y salen.
3. **Entrada del héroe:** la foto aparece por revelado de máscara poligonal; el halftone hace fade.
4. **Tarjetas de proyecto:** entrada escalonada (stagger 60 ms).
5. **Fondo vivo (todas las vistas):** una capa decorativa detrás del contenido con (a) la palabra de la sección repetida en dos filas inclinadas que corren en sentidos opuestos (60 s y 80 s por ciclo, color `--secondary` al 6 % y `--accent` al 10 %) y (b) franjas diagonales azules al 5 % que se desplazan (12 s por ciclo). Solo se animan `transform` y `background-position`; la capa es `aria-hidden`, con `pointer-events: none` y detrás del contenido (`z-index: -1`). Con `prefers-reduced-motion` queda estática. En móvil el texto se reduce a la mitad y la inclinación a 4°.

Todas respetan `prefers-reduced-motion`.

### 5.5 Tratamiento de la foto (Editorial gráfico)
1. Recortar el fondo de la foto.
2. Duotono: sombras `--secondary`, luces `--background`, con acento cian puntual en el borde.
3. Textura halftone ligera (patrón SVG/CSS), no un filtro pesado.
4. Se enmarca en una forma poligonal inclinada con sombra dura.
5. Se exporta en WebP/AVIF con `srcset` (480, 800, 1200 px). Debe tener `alt` descriptivo.

---

## 6. Diseño atómico

### 6.1 Estructura de carpetas

```
src/
  lib/
    styles/
      tokens.css            # variables del design system
    components/
      atoms/
      molecules/
      organisms/
      templates/
    data/                   # projects.ts, game.ts, profile.ts, socials.ts
    motion/                 # animaciones reutilizables (anime.js)
    utils/
  routes/
    +layout.svelte          # cortina + skip link
    +page.svelte            # Inicio
    sobre-mi/+page.svelte
    proyectos/+page.svelte
    proyectos/[slug]/+page.svelte
    juego/+page.svelte
    contacto/+page.svelte
static/
  fonts/  images/  cv.pdf
docs/
  PLAN-PORTAFOLIO.md        # este documento
```

### 6.2 Catálogo

| Nivel | Componente | Descripción | Variantes / estados |
|---|---|---|---|
| **Átomo** | `Button` | Botón/enlace con forma angular | primary, ghost · hover, focus, disabled |
| | `Tag` | Etiqueta pequeña | tech, status ("Disponible") |
| | `Icon` | Ícono SVG con `aria-hidden` o `label` | tamaños sm/md/lg |
| | `Heading` | h1–h3 con la escala tipográfica | display, h1, h2 |
| | `Link` | Enlace con subrayado de acento | interno, externo |
| | `Divider` | Línea diagonal decorativa | — |
| **Molécula** | `MenuOption` | Opción del menú (texto grande, bloque, subrayado) | idle, focused, active |
| | `ProjectCard` | Cover + título + tags + enlaces | accent: blue/purple/yellow |
| | `SocialLink` | Ícono + etiqueta + URL | github, linkedin, mail |
| | `SkillGroup` | Título + lista de tags | — |
| | `PhotoFrame` | Foto duotono en forma poligonal | hero, small |
| **Organismo** | `MainMenu` | Lista de `MenuOption` con navegación por teclado | desktop, mobile |
| | `Hero` | Foto + nombre + rol + estado | — |
| | `ProjectGrid` | Grilla responsive de `ProjectCard` | 1/2/3 col |
| | `GameShowcase` | Portada, premisa, ficha técnica y acciones del videojuego | desktop, mobile |
| | `MediaGallery` | Galería de imágenes/video (grilla o carrusel) con control de reproducción | grid, carousel |
| | `TransitionCurtain` | Paneles de transición de ruta | normal, reduced |
| | `ContactPanel` | Lista de `SocialLink` + CTA de correo | — |
| | `SiteHeader` | Nombre + volver | — |
| **Plantilla** | `MenuLayout` | Menú + héroe (Inicio) | — |
| | `SectionLayout` | Header + contenido + botón volver | — |
| **Página** | Inicio, Sobre mí, Proyectos, Detalle, Videojuego, Contacto | Plantillas con datos reales | — |

Reglas: un átomo no importa moléculas; un nivel solo importa del nivel inferior; los estilos viven en tokens y utilidades de Tailwind, no en valores sueltos.

### 6.3 Integración con Tailwind v4
Los tokens se declaran una vez y Tailwind los expone como utilidades.

```css
/* src/lib/styles/tokens.css */
@import "tailwindcss";

@theme {
  --color-text: #081826;
  --color-background: #f6f7f9;
  --color-primary: #03318C;
  --color-secondary: #023373;
  --color-accent: #04C4D9;

  --font-display: "Anton", "Bebas Neue", Impact, sans-serif;
  --font-sans: "Inter", system-ui, sans-serif;

  --breakpoint-sm: 40rem;   /* 640 */
  --breakpoint-md: 48rem;   /* 768 */
  --breakpoint-lg: 64rem;   /* 1024 */
  --breakpoint-xl: 80rem;   /* 1280 */

  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --ease-snap: cubic-bezier(.7, 0, .2, 1);
}

:root {
  --skew: -2deg;
  --surface: color-mix(in oklab, var(--color-background) 92%, var(--color-primary));
  --muted: color-mix(in oklab, var(--color-text) 60%, var(--color-background));
}
@media (min-width: 64rem) { :root { --skew: -8deg; } }
```

Uso: `bg-primary text-background`, `text-text`, `bg-accent text-text`, `font-display`.

---

## 7. Responsive Design

### 7.1 Estrategia
**Mobile-first.** Se diseña primero para 360 px y se amplía con `sm`, `md`, `lg`, `xl`. Sin scroll horizontal en ningún ancho.

### 7.2 Breakpoints

| Nombre | Ancho | Dispositivo típico |
|---|---|---|
| base | < 640 | Móvil |
| `sm` | ≥ 640 | Móvil grande |
| `md` | ≥ 768 | Tablet vertical |
| `lg` | ≥ 1024 | Tablet horizontal / laptop |
| `xl` | ≥ 1280 | Escritorio |

### 7.3 Comportamiento por componente

| Componente | Móvil (<640) | Tablet (md) | Escritorio (lg+) |
|---|---|---|---|
| `MainMenu` | Lista apilada, filas ≥ 48 px, skew 2° | Lista grande, skew 4° | Menú inclinado a la izquierda, skew 8° |
| `Hero` | Foto arriba, texto debajo | Foto y texto en 2 columnas | Foto a la derecha, texto con menú a la izquierda |
| `ProjectGrid` | 1 columna | 2 columnas | 3 columnas |
| `GameShowcase` / `MediaGallery` | Arte arriba, texto debajo, galería en carrusel con swipe | Arte y texto en 2 columnas | Arte grande a la izquierda, ficha a la derecha, galería en grilla |
| `TransitionCurtain` | Cortina vertical corta | Diagonal | Diagonal completa |
| `SiteHeader` | Compacto, botón "volver" con ícono | Con texto | Con texto y atajo de teclado visible |
| Hints de teclado | Ocultos | Ocultos | Visibles |

### 7.4 Reglas
- Tipografía fluida con `clamp` (§5.2); el texto gigante no desborda (`overflow-wrap`, `min-w-0`).
- Objetivos táctiles ≥ 44×44 px.
- Imágenes responsivas con `srcset` y `sizes`; dimensiones explícitas para evitar CLS.
- Usar `dvh` en lugar de `vh` para evitar saltos con la barra del navegador móvil.
- Sin dependencia de `hover`; todo estado hover tiene equivalente de foco/toque.
- Se prueba en 360, 390, 768, 1024, 1440 y 1920 px, en vertical y horizontal.

---

## 8. Accesibilidad
- Estructura semántica: `<header>`, `<nav>`, `<main>`, un solo `<h1>` por vista.
- El menú es un `<nav>` con `<ul>`; las opciones son enlaces reales (`<a href>`), no `div` clicables.
- Foco visible: anillo doble (`--primary` + `--accent`) de 3 px.
- `prefers-reduced-motion`: animaciones sustituidas por fundido corto.
- Todas las imágenes con `alt`; las decorativas con `alt=""`.
- Idioma declarado (`lang="es"`); si hay inglés, `lang="en"` en esos bloques.
- Verificación: Lighthouse, axe DevTools y recorrido manual con teclado.

---

## 9. Rendimiento y SEO
- Prerrender estático de todas las rutas (`adapter-static`).
- Fuentes autohospedadas, subset latino, WOFF2.
- Imágenes en WebP/AVIF, `loading="lazy"` salvo la foto del héroe.
- anime.js se importa por módulos (tree-shaking). Presupuesto JS inicial ≤ 100 KB gzip.
- `<title>` y `meta description` por ruta, Open Graph con imagen, `sitemap.xml` y `robots.txt`.

---

## 10. Licencias y originalidad

| Elemento | Decisión |
|---|---|
| Código de `deltea/p3r-pause-menu` | El repo **no tiene licencia**, por lo que no se copia. Se estudia la técnica (anime.js + SVG/transform) y se reescribe desde cero. Si se quisiera reutilizar código literal, hay que pedir permiso al autor por escrito. |
| Fuentes Rodin / Skip / Expressway | De Atlus/Sega, **no se usan**. Se reemplazan por Anton/Inter (OFL). |
| Música, sfx, video de fondo | **No se usan.** Si se añade audio, será propio o con licencia libre y desactivado por defecto. |
| Iconos | Librería con licencia abierta (p. ej. Lucide o Iconify con set MIT/Apache). |
| Marca | Se evita nombrar o imitar logotipos de Atlus. Es "inspirado en", no un clon. |
| Mi foto y proyectos | Propios. |

---

## 11. Despliegue (GitHub Pages)

1. `@sveltejs/adapter-static` con `fallback: '404.html'` y `prerender = true`.
2. En `svelte.config.js`: `paths.base = '/<nombre-del-repo>'` (si no se usa dominio propio) y `trailingSlash: 'always'`.
3. Archivo `static/.nojekyll`.
4. GitHub Actions: instalar, `build`, subir `build/` con `actions/upload-pages-artifact` y desplegar con `actions/deploy-pages`.
5. En el repo: Settings → Pages → Source: **GitHub Actions**.
6. Opcional: dominio propio (`CNAME`) y en ese caso `paths.base = ''`.

Alternativas gratuitas equivalentes: Cloudflare Pages, Vercel, Netlify.

---

## 12. Hoja de ruta

| Fase | Entregable | Criterio de salida |
|---|---|---|
| 0. Fundación | Proyecto SvelteKit + Tailwind v4 + `tokens.css` + fuentes + CI a Pages | Sitio vacío publicado en GitHub Pages |
| 1. Átomos | `Button`, `Tag`, `Icon`, `Heading`, `Link` | Página de catálogo (`/dev`) con todas las variantes |
| 2. Moléculas | `MenuOption`, `ProjectCard`, `SocialLink`, `SkillGroup`, `PhotoFrame` | Estados idle/focus/active funcionando |
| 3. Menú y transiciones | `MainMenu`, `TransitionCurtain`, navegación por teclado | Navegar entre rutas con cortina; reduced-motion probado |
| 4. Páginas y contenido | Inicio, Sobre mí, Proyectos (Likka-Pet, WakeSync, ClearRead), Videojuego, Contacto con datos reales | Contenido completo, foto tratada |
| 5. Responsive y QA | Pruebas en los 6 anchos, Lighthouse, axe | Metas de §1.3 cumplidas |
| 6. Lanzamiento | Dominio/URL final, OG images, sitemap | Publicado y revisado |

---

## 13. Decisiones abiertas

| # | Pregunta | Propuesta por defecto |
|---|---|---|
| 1 | ¿Idioma único o ES/EN? | Solo español al inicio; estructura lista para i18n |
| 2 | ¿Dominio propio o `usuario.github.io/repo`? | `github.io` al inicio |
| 3 | ¿Audio de navegación? | No; opcional y apagado por defecto más adelante |
| 4 | ¿Formulario de contacto o solo enlaces? | Solo enlaces y `mailto:` (sin backend) |
| 5 | Contenido real: bio, capturas de Likka-Pet, WakeSync y ClearRead, foto base (ya hay link, §2.5) | Se necesita de tu parte antes de la Fase 4 |
| 6 | *Descending to my Heaven*: género, motor, plataforma, estado, arte/capturas, ¿algo jugable? | Se necesita de tu parte antes de la Fase 4. Mientras tanto la página se construye con estado "En desarrollo" y datos de ejemplo claramente marcados |
| 8 | Nombre a mostrar en el sitio y correo de contacto | "Paula Sofía González Zambrano" (de LinkedIn); correo pendiente, sin él Contacto muestra solo GitHub y LinkedIn |
| 7 | ¿El videojuego lleva opción propia en el menú o va dentro de Proyectos? | Opción propia (`/juego`), por ser de otra naturaleza |

---

## Apéndice A — Checklist de revisión de diseño
- [ ] El cian no se usa como texto sobre fondo claro.
- [ ] El acento ocupa ≤ 10 % de la pantalla.
- [ ] Ningún valor de color/espaciado está hardcodeado fuera de tokens.
- [ ] Cada animación tiene versión `prefers-reduced-motion`.
- [ ] Todo funciona sin hover y sin mouse.
- [ ] Sin scroll horizontal de 320 a 1920 px.
- [ ] No hay assets de Atlus en el repositorio.
