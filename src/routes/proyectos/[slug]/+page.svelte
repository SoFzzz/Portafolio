<script lang="ts">
	import { base } from '$app/paths';
	import Button from '$lib/components/atoms/Button.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import SectionShell from '$lib/components/templates/SectionShell.svelte';

	let { data } = $props();
	const project = $derived(data.project);
	const facts = $derived([
		['Plataforma', project.platform],
		['Mi rol', project.role]
	]);
</script>

<SectionShell
	title={project.title}
	intro={project.summary}
	backHref="/proyectos/"
	path="/proyectos/{project.slug}/"
	description={project.summary}
>
	<div class="flex flex-col gap-10 lg:flex-row lg:gap-12">
		<ul class="m-0 grid min-w-0 list-none gap-4 p-0 sm:grid-cols-2 lg:flex-[1.3]">
			{#each project.shots as shot, i}
				<li class="min-w-0 self-start {shot.width > shot.height * 1.4 ? 'sm:col-span-2' : ''}">
					<img
						src={base + shot.src}
						alt={shot.alt}
						width={shot.width}
						height={shot.height}
						loading={i === 0 ? undefined : 'lazy'}
						class="h-auto w-full bg-surface p-2 shadow-[6px_6px_0_var(--color-secondary)]"
					/>
				</li>
			{/each}
		</ul>

		<div class="flex min-w-0 flex-col gap-6 lg:flex-1">
			{#if project.logo}
				<img
					src={base + project.logo.src}
					alt={project.logo.alt}
					width={project.logo.width}
					height={project.logo.height}
					class="size-16 object-contain"
				/>
			{/if}

			<dl class="m-0 grid grid-cols-[6.5rem_minmax(0,1fr)] bg-surface shadow-[6px_6px_0_var(--color-secondary)] md:grid-cols-[7.5rem_minmax(0,1fr)] md:shadow-[8px_8px_0_var(--color-secondary)]">
				{#each facts as [k, v]}
					<dt class="border-b border-text/15 px-4 py-3.5 text-xs font-semibold tracking-[0.12em] text-secondary uppercase">{k}</dt>
					<dd class="m-0 border-b border-text/15 px-4 py-3.5 text-[15px]">{v}</dd>
				{/each}
				<dt class="px-4 py-3.5 text-xs font-semibold tracking-[0.12em] text-secondary uppercase">Tecnologías</dt>
				<dd class="m-0 px-4 py-3.5">
					<ul class="m-0 flex list-none flex-wrap gap-2 p-0">
						{#each project.stack as item}
							<li><Tag>{item}</Tag></li>
						{/each}
					</ul>
				</dd>
			</dl>

			<div>
				<Button href={project.repo} external>Ver repositorio</Button>
			</div>
		</div>
	</div>
</SectionShell>
