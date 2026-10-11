<script lang="ts">
	let {
		href,
		label,
		active,
		offset = 0,
		onfocus,
		onmouseenter,
		el = $bindable()
	}: {
		href: string;
		label: string;
		active: boolean;
		/** Desplazamiento horizontal escalonado en escritorio (px). */
		offset?: number;
		onfocus?: () => void;
		onmouseenter?: () => void;
		el?: HTMLAnchorElement;
	} = $props();
</script>

<a
	bind:this={el}
	{href}
	{onfocus}
	{onmouseenter}
	aria-current={active ? 'true' : undefined}
	class="group relative inline-flex min-h-[3.25rem] items-center px-6 outline-none md:px-9"
	style="transform: skewX(var(--skew)); margin-left: calc({offset}px * var(--stagger, 0))"
>
	<!-- bloque rojo que se estira al enfocar -->
	<span
		aria-hidden="true"
		class="absolute inset-0 origin-left bg-primary shadow-[5px_5px_0_var(--color-secondary)] transition-transform duration-200 ease-snap md:shadow-[8px_8px_0_var(--color-secondary)]
			{active ? 'scale-x-100' : 'scale-x-0'}"
	></span>

	<span
		class="relative pt-[0.2em] pb-1.5 font-display text-[clamp(2.25rem,1.3rem+4vw,5.75rem)] leading-none tracking-wide whitespace-nowrap uppercase transition-[color,transform] duration-200 ease-out-expo
			{active ? 'translate-x-2 text-white' : 'text-primary'}">{label}</span
	>

	<!-- subrayado de acento -->
	<span
		aria-hidden="true"
		class="absolute bottom-1.5 left-6 right-6 h-1 origin-left bg-accent transition-transform duration-300 ease-out-expo md:bottom-2 md:left-9 md:right-9 md:h-1.5
			{active ? 'scale-x-100 delay-75' : 'scale-x-0'}"
	></span>
</a>
