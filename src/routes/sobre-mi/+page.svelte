<script lang="ts">
	import { base } from '$app/paths';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import PhotoFrame from '$lib/components/molecules/PhotoFrame.svelte';
	import SectionShell from '$lib/components/templates/SectionShell.svelte';
	import { profile } from '$lib/data/profile';
</script>

<SectionShell title="Sobre mí">
	<!-- Habilidades: tarjetas compactas arriba a la derecha, junto al título -->
	{#snippet aside()}
		<h2 class="mb-3 font-display text-2xl tracking-wider text-primary uppercase">Habilidades</h2>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
			{#each profile.skills as group}
				<section class="flex flex-col gap-2 bg-surface p-3.5 shadow-[4px_4px_0_var(--color-secondary)]">
					<h3 class="text-[11px] font-semibold tracking-[0.14em] text-secondary uppercase">{group.group}</h3>
					<ul class="m-0 flex list-none flex-wrap gap-1.5 p-0">
						{#each group.items as item}
							<li><Tag size="sm">{item}</Tag></li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{/snippet}

	<!-- Columna de lectura a la izquierda; la derecha queda libre para la silueta -->
	<div class="flex min-w-0 flex-col gap-7 lg:max-w-[44%]">
		<div class="flex flex-wrap items-start gap-7">
			<PhotoFrame src={profile.photo ? base + profile.photo : null} alt="Retrato de {profile.name}" class="h-52 w-44 shrink-0" />
			<div class="flex min-w-0 flex-1 basis-60 flex-col gap-1.5">
				<span class="font-display text-[clamp(1.75rem,1.2rem+2vw,2.25rem)] leading-tight tracking-wide text-primary uppercase"
					>{profile.name}</span
				>
				<span class="text-base font-medium">{profile.role}</span>
				<span class="text-[15px] text-muted">{profile.studies}</span>
			</div>
		</div>

		<div class="flex max-w-xl flex-col gap-4 bg-surface px-5 py-4 shadow-[6px_6px_0_var(--color-secondary)]">
			{#each profile.bio as paragraph}
				<p class="m-0 text-base leading-relaxed sm:text-lg">{paragraph}</p>
			{/each}
		</div>

		<div class="flex flex-col gap-3">
			<h2 class="font-display text-[1.75rem] tracking-wider text-primary uppercase">Formación</h2>
			{#each profile.education as e}
				<div class="flex flex-col gap-1 bg-surface px-5 py-4 shadow-[6px_6px_0_var(--color-secondary)]">
					<span class="text-[17px] font-semibold">{e.title}</span>
					<span class="text-[15px] text-muted">{e.place} · {e.period}</span>
				</div>
			{/each}
		</div>
	</div>
</SectionShell>
