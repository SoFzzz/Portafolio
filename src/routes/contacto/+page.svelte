<script lang="ts">
	import { base } from '$app/paths';
	import SocialLink from '$lib/components/molecules/SocialLink.svelte';
	import SectionShell from '$lib/components/templates/SectionShell.svelte';
	import { profile } from '$lib/data/profile';
	import { socials, type Social } from '$lib/data/socials';

	const cv: Social = { id: 'cv', label: 'CV', handle: 'Descargar en PDF', url: base + profile.cv.href };
</script>

<SectionShell
	title="Contacto"
	path="/contacto/"
	description="Escríbeme por correo o LinkedIn, o revisa mi código en GitHub."
	intro="Escríbeme por correo o LinkedIn, o revisa mi código en GitHub."
>
	<ul class="sl-list m-0 flex max-w-md list-none md:max-w-xl flex-col gap-6 p-0 pr-2">
		{#each socials as social, i}
			<li style="margin-left: calc({i * 40}px * var(--stagger, 0))" class="[--stagger:0] md:[--stagger:1]">
				<SocialLink {social} />
			</li>
		{/each}
		<li style="margin-left: calc({socials.length * 40}px * var(--stagger, 0))" class="[--stagger:0] md:[--stagger:1]">
			<SocialLink social={cv} download />
		</li>
	</ul>
</SectionShell>
