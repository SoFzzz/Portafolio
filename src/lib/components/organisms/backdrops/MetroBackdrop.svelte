<script lang="ts">
	import { base } from '$app/paths';

	// Interior de un vagón a pantalla completa, solo con siluetas planas del rojo de la marca,
	// en tonos pálidos como la silueta original: pared, ventanas (con ciudad, mar y pilares que pasan),
	// respaldo, asiento y, delante, la silueta sentada.
	const layer = (file: string, tile: number, dur: number) =>
		`--tile: ${tile}px; --dur: ${dur}s; background: url(${base}/scene/${file}) repeat-x left bottom / ${tile}px 100%`;

	const girl = `url(${base}/characters/banca.webp)`;
	const girlMask = `-webkit-mask: ${girl} center bottom / contain no-repeat; mask: ${girl} center bottom / contain no-repeat;`;

	// Tonos planos: el mismo rojo mezclado con el fondo, de más pálido (atrás) a más fuerte (adelante)
	const tone = (pct: number) => `color-mix(in oklab, var(--color-primary) ${pct}%, var(--color-background))`;
</script>

<!-- Pantallas medianas: solo la silueta, sin el vagón -->
<div class="pf-enter absolute right-[2%] -bottom-[2vh] hidden h-[44vh] w-[56vw] md:block xl:hidden">
	<div class="pf-breathe size-full origin-bottom" style="background: {tone(34)}; {girlMask}"></div>
</div>

<!-- Pantallas grandes: el vagón completo -->
<div class="pf-enter absolute inset-0 hidden xl:block">
	<!-- por las ventanas: ciudad que pasa, mar que brilla y pilares de puente -->
	<div class="absolute inset-x-0 top-0 h-[52vh] overflow-hidden">
		<div class="pf-scroll absolute inset-x-0 bottom-[30%] h-[34%]" style={layer('skyline-far.svg', 600, 55)}></div>
		<div class="pf-scroll absolute inset-x-0 bottom-[30%] h-[44%]" style={layer('skyline-near.svg', 800, 24)}></div>

		<div class="absolute inset-x-0 bottom-0 h-[30%]" style="background: {tone(11)}">
			<div
				class="pf-scroll absolute inset-0"
				style="--tile: 90px; --dur: 2.4s; background: repeating-linear-gradient(90deg, rgba(255,255,255,0.7) 0 26px, transparent 26px 90px); background-size: 90px 100%; -webkit-mask: repeating-linear-gradient(0deg, #000 0 2px, transparent 2px 11px); mask: repeating-linear-gradient(0deg, #000 0 2px, transparent 2px 11px)"
			></div>
		</div>

		<div class="pf-scroll absolute inset-0" style={layer('poles.svg', 760, 2.2)}></div>

	</div>

	<!-- pared: cabecera, dos pilares y repisa -->
	<div class="absolute inset-x-0 top-0 h-[4vh]" style="background: {tone(16)}"></div>
	<div class="absolute top-0 left-[57vw] h-[52vh] w-[5vw]" style="background: {tone(16)}"></div>
	<div class="absolute top-0 left-[90vw] h-[52vh] w-[3.5vw]" style="background: {tone(16)}"></div>
	<div class="absolute inset-x-0 top-[50vh] h-[6vh]" style="background: {tone(16)}"></div>

	<!-- respaldo -->
	<div class="absolute inset-x-0 top-[56vh] bottom-0" style="background: {tone(17)}"></div>

	<!-- asiento: a la altura de la cadera de la silueta -->
	<div
		class="absolute inset-x-0 bottom-0 h-[max(8vh,calc(5.5vw-2vh))]"
		style="background: {tone(44)}; box-shadow: inset 0 0.9vh 0 {tone(54)}"
	></div>

	<!-- la silueta, sentada. Baja un poco de la pantalla para que su borde inferior no se vea -->
	<div
		class="pf-lean absolute -right-[3vw] -bottom-[10vh] aspect-[1400/860] w-[64vw] max-w-[calc(90vh*1.628)] origin-bottom"
	>
		<!-- los muebles se miden en % de la silueta, así se mueven y escalan con ella -->
		<div class="pf-rattle size-full">
			<!-- apoyabrazos del asiento, junto al poste, donde descansa el gato -->
			<div
				class="absolute top-[75%] left-[69%] h-[10%] w-[19%] rounded-[1.4vw]"
				style="background: {tone(42)}; box-shadow: inset 0 0.7vh 0 {tone(54)}"
			></div>
			<div class="absolute inset-0" style="background: {tone(68)}; {girlMask}"></div>
		</div>
	</div>
</div>
