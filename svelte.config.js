import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// En GitHub Pages el sitio vive en /<repo>. Se define con BASE_PATH en el build (ver CI).
const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		paths: { base, relative: false },
		prerender: { handleHttpError: 'fail' }
	}
};

export default config;
