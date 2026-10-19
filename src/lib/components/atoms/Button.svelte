<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		variant = 'primary',
		external = false,
		download = false,
		children
	}: {
		href: string;
		variant?: 'primary' | 'secondary';
		external?: boolean;
		/** Descarga el archivo (omite el enrutador de SvelteKit y la cortina de transición) */
		download?: boolean;
		children: Snippet;
	} = $props();
</script>

<!-- Lo rojo es de quien está seleccionado (teclado o puntero: KeyNav pone `data-selected` en ambos casos). Si el botón
     está dentro de un `.btn-row` y otro botón de la fila está seleccionado, el principal pasa a blanco con borde rojo
     y el rojo "se mueve" al seleccionado (entra desde la izquierda, como el menú del inicio). Sin selección, el
     principal es rojo y el secundario blanco. -->
<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	download={download ? '' : undefined}
	data-sveltekit-reload={download ? '' : undefined}
	data-variant={variant}
	class="btn relative inline-flex min-h-12 items-center gap-2.5 overflow-hidden px-6 text-[15px] font-semibold tracking-[0.08em] uppercase outline-none"
>
	<span aria-hidden="true" class="btn-fill absolute inset-0"></span>
	<span class="btn-text relative inline-flex items-center gap-2.5">
		{@render children()}
		{#if external}<span class="sr-only">(se abre en una pestaña nueva)</span>{/if}
	</span>
	<span aria-hidden="true" class="btn-line absolute right-6 bottom-1.5 left-6 h-1 bg-accent"></span>
</a>

<style>
	.btn {
		border: 3px solid var(--color-primary);
		background: var(--color-surface);
		color: var(--color-primary);
		box-shadow: 5px 5px 0 var(--color-secondary);
		transition: color 0.2s;
	}
	.btn-fill {
		background: var(--color-primary);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.2s var(--ease-snap);
	}
	.btn-text {
		transition: transform 0.2s var(--ease-out-expo);
	}
	.btn-line {
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s var(--ease-out-expo);
	}
	/* Principal en reposo: rojo */
	.btn[data-variant='primary'] {
		color: #fff;
	}
	.btn[data-variant='primary'] .btn-fill {
		transform: scaleX(1);
	}
	/* Hay otro botón de la fila seleccionado: el principal vuelve a blanco con borde rojo */
	:global(.btn-row:has([data-selected])) .btn[data-variant='primary']:not(:global([data-selected])) {
		color: var(--color-primary);
	}
	:global(.btn-row:has([data-selected])) .btn[data-variant='primary']:not(:global([data-selected])) .btn-fill {
		transform: scaleX(0);
	}
	:global(.btn-row:has([data-selected])) .btn[data-variant='primary']:not(:global([data-selected])) :global(svg.text-highlight) {
		color: var(--color-primary);
	}
	/* Seleccionado: rojo, texto blanco que se desplaza y subrayado de acento */
	.btn:global([data-selected]) {
		color: #fff;
	}
	.btn:global([data-selected]) .btn-fill {
		transform: scaleX(1);
	}
	.btn:global([data-selected]) .btn-text {
		transform: translateX(0.375rem);
	}
	.btn:global([data-selected]) .btn-line {
		transform: scaleX(1);
		transition-delay: 75ms;
	}
</style>
