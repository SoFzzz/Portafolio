<script lang="ts">
	import GameCard from '$lib/components/molecules/GameCard.svelte';
	import ProjectCard from '$lib/components/molecules/ProjectCard.svelte';
	import SectionShell from '$lib/components/templates/SectionShell.svelte';
	import { projects } from '$lib/data/projects';
</script>

<SectionShell
	title="Proyectos"
	intro="Tres apps completas, de Android a un reloj y a escritorio, y un videojuego. Cada una tiene su propio repositorio."
>
	<ul class="m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-2 xl:grid-cols-4 lg:gap-9">
		{#each projects as project}
			<li class="min-w-0"><ProjectCard {project} /></li>
		{/each}
		<li class="min-w-0"><GameCard /></li>
	</ul>
</SectionShell>
