<script lang="ts">
	import SocialLink from '$lib/components/molecules/SocialLink.svelte';
	import SectionShell from '$lib/components/templates/SectionShell.svelte';
	import { socials } from '$lib/data/socials';
</script>

<SectionShell
	title="Contacto"
	path="/contacto/"
	description="Escríbeme por correo o LinkedIn, o revisa mi código en GitHub."
	intro="Escríbeme por correo o LinkedIn, o revisa mi código en GitHub."
>
	<ul class="m-0 flex max-w-md list-none flex-col gap-6 p-0 pr-2">
		{#each socials as social, i}
			<li style="margin-left: calc({i * 40}px * var(--stagger, 0))" class="[--stagger:0] md:[--stagger:1]">
				<SocialLink {social} tone={i === 0 ? 'dark' : 'light'} />
			</li>
		{/each}
	</ul>
</SectionShell>
