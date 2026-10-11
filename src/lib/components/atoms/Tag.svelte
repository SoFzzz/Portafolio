<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		kind = 'tech',
		size = 'md',
		children
	}: { kind?: 'tech' | 'status'; size?: 'sm' | 'md'; children: Snippet } = $props();
</script>

{#if kind === 'status'}
	<span
		class="inline-flex items-center gap-2 bg-accent px-3.5 py-1.5 text-[13px] font-semibold tracking-widest text-text uppercase [clip-path:polygon(0_0,100%_0,calc(100%-8px)_100%,0_100%)]"
	>
		<span aria-hidden="true" class="size-2 rounded-full bg-text"></span>
		{@render children()}
	</span>
{:else}
	<span
		class="bg-chip font-semibold text-secondary {size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-[13px]'}"
	>
		{@render children()}
	</span>
{/if}
