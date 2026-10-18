<script lang="ts">
	import GameCard from '$lib/components/molecules/GameCard.svelte';
	import ProjectCard from '$lib/components/molecules/ProjectCard.svelte';
	import SectionShell from '$lib/components/templates/SectionShell.svelte';
	import { projects } from '$lib/data/projects';

	const collaborative = projects.filter((p) => p.kind === 'collaborative');
	const personal = projects.filter((p) => p.kind === 'personal');
	const grid = 'm-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-2 xl:grid-cols-3 lg:gap-9';
</script>

<SectionShell
	title="Proyectos"
	path="/proyectos/"
	description="Veltro, Descending to my Heaven, Tarium, Notiz, Likka-Pet, WakeSync y ClearRead: apps, backends y un videojuego, en equipo y en solitario."
	intro="Backends, apps de Android, reloj y escritorio, una web y un videojuego. Unos los hice en equipo y otros en solitario; cada uno tiene su repositorio."
>
	<h2 class="mb-6 font-display text-3xl tracking-wide uppercase">En equipo</h2>
	<ul class="{grid} mb-14">
		{#each collaborative as project}
			<li class="min-w-0"><ProjectCard {project} /></li>
		{/each}
		<li class="min-w-0"><GameCard /></li>
	</ul>

	<h2 class="mb-6 font-display text-3xl tracking-wide uppercase">En solitario</h2>
	<ul class={grid}>
		{#each personal as project}
			<li class="min-w-0"><ProjectCard {project} /></li>
		{/each}
	</ul>
</SectionShell>
