# Portafolio — Paula Sofía González

Portafolio web inspirado en la **estructura de interacción** de los menús de Atlus.

Plan, navegación y design system: [`docs/PLAN-PORTAFOLIO.md`](docs/PLAN-PORTAFOLIO.md).

## Stack
SvelteKit (estático) · Tailwind CSS v4 · anime.js v4 · Anton + Inter (autohospedadas)

## Comandos
```bash
npm install
npm run dev      # servidor local en http://localhost:5173
npm run check    # types + svelte-check
npm run build    # sitio estático en /build
npm run cv       # regenera static/cv/Paula-Sofia-Gonzalez-CV.pdf desde cv/cv.html (requiere Chrome)
```

## Dónde editar el contenido
| Qué | Archivo |
|---|---|
| Nombre, bio, formación, habilidades, foto | `src/lib/data/profile.ts` |
| Proyectos | `src/lib/data/projects.ts` |
| Videojuego | `src/lib/data/game.ts` |
| CV (PDF descargable) | `cv/cv.html` → `npm run cv` → `static/cv/Paula-Sofia-Gonzalez-CV.pdf` |
| Redes | `src/lib/data/socials.ts` |
| Capturas y foto | `image/projects/` + `npm run images` → `static/` |
| Menú y palabra del fondo animado | `src/lib/data/nav.ts` |

Los textos entre `[corchetes]` son marcadores pendientes.

## Despliegue
GitHub Actions (`.github/workflows/deploy.yml`) construye y publica en GitHub Pages en cada push a `main`. En el repo: Settings → Pages → Source: **GitHub Actions**.
