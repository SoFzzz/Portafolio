<script lang="ts">
	import type { Social } from '$lib/data/socials';
	import DownloadIcon from '$lib/components/atoms/DownloadIcon.svelte';

	/** `download`: enlace de descarga local (no abre pestaña nueva ni pasa por el enrutador). */
	let { social, download = false }: { social: Social; download?: boolean } = $props();
	const isMail = $derived(social.url.startsWith('mailto:'));
	const external = $derived(!isMail && !download);
</script>

<!-- Igual que el menú de inicio: al seleccionar/pasar/enfocar, un bloque rojo entra desde la izquierda,
     el texto se vuelve blanco y se desplaza, y el subrayado de acento se estira. -->
<a
	href={social.url}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	download={download ? '' : undefined}
	data-sveltekit-reload={download ? '' : undefined}
	class="sl group relative flex min-h-20 items-center gap-5 bg-surface px-6 pt-3 pb-5 text-primary shadow-[6px_6px_0_var(--color-secondary)] outline-none md:min-h-24 md:gap-6 md:px-7 md:shadow-[8px_8px_0_var(--color-secondary)]"
>
	<span aria-hidden="true" class="sl-block absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-200 ease-snap"></span>
	<span class="sl-icon relative flex size-10 shrink-0 items-center justify-center text-primary transition-colors duration-200">
		{#if social.id === 'github'}
			<svg aria-hidden="true" viewBox="0 0 24 24" class="size-10" fill="currentColor"
				><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg
			>
		{:else if social.id === 'linkedin'}
			<svg aria-hidden="true" viewBox="0 0 24 24" class="size-10" fill="currentColor"
				><path d="M4.5 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM2.5 9.5h4V21h-4zM9 9.5h3.8v1.6h.1c.5-1 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9z" /></svg
			>
		{:else if social.id === 'mail'}
			<svg aria-hidden="true" viewBox="0 0 24 24" class="size-10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"
				><rect x="3" y="5" width="18" height="14" /><path d="m3 7 9 7 9-7" /></svg
			>
		{:else}
			<span class="contents [&>svg]:size-10"><DownloadIcon /></span>
		{/if}
	</span>
	<span class="sl-text relative flex min-w-0 flex-1 flex-col gap-0.5 transition-transform duration-200 ease-out-expo">
		<span class="sl-title font-display text-[clamp(2rem,1.5rem+2vw,2.75rem)] leading-none tracking-wide uppercase transition-colors duration-200">{social.label}</span>
		<span class="sl-handle {isMail ? 'break-all' : 'truncate'} text-[15px] text-muted transition-colors duration-200">{social.handle}</span>
	</span>
	<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="sl-arrow relative shrink-0 text-primary transition-colors duration-200" stroke-width="3" stroke-linecap="square"
		><path d="M5 12h14M13 6l6 6-6 6" /></svg
	>
	<span aria-hidden="true" class="sl-line absolute right-6 bottom-2 left-6 h-1 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out-expo md:right-7 md:left-7 md:h-1.5"></span>
	{#if external}<span class="sr-only">(se abre en una pestaña nueva)</span>{/if}
</a>

<style>
	/* Estado activo = seleccionado con teclado, hover o foco; sin nada activo, el primero de la lista (como el menú de inicio). */
	.sl:is(:hover, :focus-visible, :global([data-selected])) .sl-block,
	:global(ul.sl-list:not(:has(:hover, :focus-visible, [data-selected])) > li:first-child) .sl .sl-block,
	.sl:is(:hover, :focus-visible, :global([data-selected])) .sl-line,
	:global(ul.sl-list:not(:has(:hover, :focus-visible, [data-selected])) > li:first-child) .sl .sl-line {
		--tw-scale-x: 100%;
	}
	.sl:is(:hover, :focus-visible, :global([data-selected])) .sl-text,
	:global(ul.sl-list:not(:has(:hover, :focus-visible, [data-selected])) > li:first-child) .sl .sl-text {
		transform: translateX(0.5rem);
	}
	.sl:is(:hover, :focus-visible, :global([data-selected])) :is(.sl-title, .sl-handle),
	:global(ul.sl-list:not(:has(:hover, :focus-visible, [data-selected])) > li:first-child) .sl :is(.sl-title, .sl-handle) {
		color: #fff;
	}
	.sl:is(:hover, :focus-visible, :global([data-selected])) :is(.sl-icon, .sl-arrow),
	:global(ul.sl-list:not(:has(:hover, :focus-visible, [data-selected])) > li:first-child) .sl :is(.sl-icon, .sl-arrow) {
		color: var(--color-highlight);
	}
	.sl-line {
		transition-delay: 75ms;
	}
	.sl:not(:is(:hover, :focus-visible, :global([data-selected]))) .sl-line {
		transition-delay: 0ms;
	}
</style>
