<script lang="ts">
	let {
		src = null,
		alt = '',
		class: klass = ''
	}: { src?: string | null; alt?: string; class?: string } = $props();

	const shape = 'polygon(14% 0, 100% 0, 100% 86%, 86% 100%, 0 100%, 0 14%)';
</script>

<div class="relative {klass}">
	<!-- sombra dura detrás del marco (naranja, para que se lea sobre el panel oscuro) -->
	<div
		aria-hidden="true"
		class="absolute inset-0 translate-x-3 translate-y-3 bg-accent md:translate-x-5 md:translate-y-5"
		style="clip-path: {shape}"
	></div>

	<div
		class="absolute inset-0 overflow-hidden"
		style="clip-path: {shape}; background: linear-gradient(165deg, var(--color-secondary) 0%, color-mix(in oklab, var(--color-primary) 55%, var(--color-secondary)) 55%, var(--color-primary) 100%)"
		role={src ? undefined : 'img'}
		aria-label={src ? undefined : 'Espacio para la foto de perfil'}
	>
		{#if src}
			<!-- duotono: foto en grises mezclada sobre el rojo -->
			<img
				{src}
				{alt}
				width="440"
				height="520"
				class="size-full object-cover mix-blend-screen grayscale contrast-110"
			/>
		{:else}
			<span
				class="absolute bottom-4 left-4 font-display text-sm tracking-widest text-background uppercase md:text-xl"
				>[Tu foto · recorte + duotono]</span
			>
		{/if}
		<!-- trama halftone -->
		<div
			aria-hidden="true"
			class="absolute inset-0"
			style="background-image: radial-gradient(circle, rgba(242,149,68,0.55) 1.6px, transparent 2.2px); background-size: 11px 11px"
		></div>
	</div>

	<!-- franja de acento -->
	<div
		aria-hidden="true"
		class="absolute top-[18%] -right-3 h-[38%] w-3.5 -skew-y-[8deg] bg-highlight"
	></div>
</div>
