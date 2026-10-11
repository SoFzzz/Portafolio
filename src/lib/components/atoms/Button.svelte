<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		variant = 'primary',
		external = false,
		children
	}: {
		href: string;
		variant?: 'primary' | 'secondary';
		external?: boolean;
		children: Snippet;
	} = $props();
</script>

<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
	class="inline-flex min-h-12 items-center gap-2.5 px-6 text-[15px] font-semibold tracking-[0.08em] uppercase transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0
		{variant === 'primary'
		? 'bg-primary text-white shadow-[5px_5px_0_var(--color-accent)] hover:bg-secondary'
		: 'border-[3px] border-primary text-primary hover:bg-primary hover:text-white'}"
>
	{@render children()}
	{#if external}<span class="sr-only">(se abre en una pestaña nueva)</span>{/if}
</a>
