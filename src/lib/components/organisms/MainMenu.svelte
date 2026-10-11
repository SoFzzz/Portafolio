<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { animate, stagger } from 'animejs';
	import { onMount } from 'svelte';
	import { menuItems as navItems } from '$lib/data/nav';
	import { motionOn } from '$lib/motion/prefs.svelte';
	import MenuOption from '../molecules/MenuOption.svelte';

	let active = $state(0);
	let links: HTMLAnchorElement[] = $state([]);
	let list: HTMLUListElement;

	function move(delta: number) {
		active = (active + delta + navItems.length) % navItems.length;
		links[active]?.focus();
	}

	function onKey(e: KeyboardEvent) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		switch (e.key) {
			case 'ArrowDown':
			case 's':
			case 'S':
				e.preventDefault();
				move(1);
				break;
			case 'ArrowUp':
			case 'w':
			case 'W':
				e.preventDefault();
				move(-1);
				break;
			case 'Enter':
				// Si el foco ya está en un enlace, el navegador lo activa solo.
				if (!(document.activeElement instanceof HTMLAnchorElement)) {
					e.preventDefault();
					goto(base + navItems[active].href);
				}
				break;
		}
	}

	onMount(() => {
		if (!motionOn()) return;
		// Entrada escalonada de las opciones
		animate(list.children, {
			translateX: [-90, 0],
			opacity: [0, 1],
			duration: 520,
			delay: stagger(80, { start: 150 }),
			ease: 'outExpo'
		});
	});
</script>

<svelte:window onkeydown={onKey} />

<nav aria-label="Menú principal">
	<ul bind:this={list} class="m-0 flex list-none flex-col gap-2 p-0 [--stagger:0] lg:gap-2.5 lg:[--stagger:1]">
		{#each navItems as item, i}
			<li class="self-start">
				<MenuOption
					bind:el={links[i]}
					href={base + item.href}
					label={item.label}
					active={active === i}
					offset={i * 36}
					onfocus={() => (active = i)}
					onmouseenter={() => (active = i)}
				/>
			</li>
		{/each}
	</ul>
</nav>
