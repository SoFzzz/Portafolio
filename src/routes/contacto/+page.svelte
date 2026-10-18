<script lang="ts">
	import { base } from '$app/paths';
	import Button from '$lib/components/atoms/Button.svelte';
	import DownloadIcon from '$lib/components/atoms/DownloadIcon.svelte';
	import SocialLink from '$lib/components/molecules/SocialLink.svelte';
	import SectionShell from '$lib/components/templates/SectionShell.svelte';
	import { profile } from '$lib/data/profile';
	import { socials } from '$lib/data/socials';
</script>

<SectionShell
	title="Contacto"
	path="/contacto/"
	description="Escríbeme por correo o LinkedIn, o revisa mi código en GitHub."
	intro="Escríbeme por correo o LinkedIn, o revisa mi código en GitHub."
>
	<ul class="m-0 flex max-w-md list-none md:max-w-xl flex-col gap-6 p-0 pr-2">
		{#each socials as social, i}
			<li style="margin-left: calc({i * 40}px * var(--stagger, 0))" class="[--stagger:0] md:[--stagger:1]">
				<SocialLink {social} tone={i === 0 ? 'dark' : 'light'} />
			</li>
		{/each}
	</ul>
	<div class="mt-8">
		<Button href={base + profile.cv.href} download variant="secondary"><DownloadIcon />{profile.cv.label}</Button>
	</div>
</SectionShell>
