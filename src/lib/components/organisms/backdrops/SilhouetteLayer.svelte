<script lang="ts">
	import { base } from '$app/paths';
	import type { Silhouette } from '$lib/data/scene';

	let { sil }: { sil: Silhouette } = $props();

	const url = $derived(`url(${base}${sil.src})`);

	const place = {
		right: 'right-[2%] bottom-0 h-[84vh] w-[34vw]',
		'right-tall': 'right-[1%] bottom-0 h-[96vh] w-[42vw]',
		'bottom-wide': 'right-[2%] bottom-0 h-[58vh] w-[60vw]',
		'top-right': 'right-0 top-0 h-[36vh] w-[52vw]',
		run: 'left-0 bottom-0 h-[20vh] w-[42vw]'
	} as const;
	const anchor = {
		right: 'center bottom',
		'right-tall': 'center bottom',
		'bottom-wide': 'center bottom',
		'top-right': 'center top',
		run: 'center bottom'
	} as const;
	const origin = { sway: 'origin-top', breathe: 'origin-bottom', float: 'origin-bottom', run: 'origin-bottom', none: '' } as const;

	// En pantallas chicas solo se ve si la silueta define smOpacity.
	const visibility = $derived(
		sil.smOpacity !== undefined ? '' : sil.from === 'lg' ? 'hidden lg:block' : 'hidden md:block'
	);
	const vars = $derived(
		`--o: ${sil.opacity}; --o-sm: ${sil.smOpacity ?? sil.opacity}; --c: var(--color-${sil.tone}); --c-sm: var(--color-${sil.smTone ?? sil.tone});`
	);
	const mask = $derived(
		`-webkit-mask: ${url} ${anchor[sil.pos]} / contain no-repeat; mask: ${url} ${anchor[sil.pos]} / contain no-repeat;${sil.flip ? ' transform: scaleX(-1);' : ''}`
	);
</script>

{#key sil.src}
	<!-- el contenedor entra con un fundido (después de que se abre la cortina); dentro va la animación en bucle -->
	<div class="pf-enter absolute {visibility} {place[sil.pos]}">
		{#if sil.anim === 'run'}
			<div class="pf-run absolute inset-y-0 left-0 w-full">
				<div class="pf-bob sil-tone size-full" style="{vars} {mask}"></div>
			</div>
		{:else}
			<div class="{sil.anim === 'none' ? '' : 'pf-' + sil.anim} size-full {origin[sil.anim]}">
				<div class="sil-tone size-full" style="{vars} {mask}"></div>
			</div>
		{/if}
	</div>
{/key}
