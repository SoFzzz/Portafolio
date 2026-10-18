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

<!-- Selección (teclado), hover y foco se ven igual que el menú de inicio: un bloque entra desde la izquierda,
     el contenido se desplaza un poco y el subrayado de acento se estira. -->
<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	download={download ? '' : undefined}
	data-sveltekit-reload={download ? '' : undefined}
	class="group relative inline-flex min-h-12 items-center gap-2.5 overflow-hidden px-6 text-[15px] font-semibold tracking-[0.08em] uppercase outline-none transition-colors duration-200
		{variant === 'primary'
		? 'bg-primary text-white shadow-[5px_5px_0_var(--color-accent)]'
		: 'border-[3px] border-primary bg-surface text-primary shadow-[5px_5px_0_var(--color-secondary)] hover:text-white focus-visible:text-white data-[selected]:text-white'}"
>
	<span
		aria-hidden="true"
		class="absolute inset-0 origin-left scale-x-0 transition-transform duration-200 ease-snap group-hover:scale-x-100 group-focus-visible:scale-x-100 group-data-[selected]:scale-x-100
			{variant === 'primary' ? 'bg-secondary' : 'bg-primary'}"
	></span>
	<span class="relative inline-flex items-center gap-2.5 transition-transform duration-200 ease-out-expo group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 group-data-[selected]:translate-x-1.5">
		{@render children()}
		{#if external}<span class="sr-only">(se abre en una pestaña nueva)</span>{/if}
	</span>
	<span
		aria-hidden="true"
		class="absolute right-6 bottom-1.5 left-6 h-1 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out-expo group-hover:scale-x-100 group-hover:delay-75 group-focus-visible:scale-x-100 group-focus-visible:delay-75 group-data-[selected]:scale-x-100 group-data-[selected]:delay-75"
	></span>
</a>
